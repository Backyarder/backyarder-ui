import { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import CellActions from '../CellActions/CellActions';
import { CellKeys, GridProps } from '../Grid/Grid';
import { GardenKeys } from '../Main/Main';
import { patchCellContents } from '../../apiCalls';
import { StatusType } from '../../apiCalls';
import './Cell.scss'

interface GridCell extends GridProps {
  id: string;
  toggleModal: () => void;
}

export interface CellContents {
  plant: CellKeys;
}

const Cell = ({ id, garden, setGarden, bullDoze, setBullDoze, filterGarden, setFilterGarden, toggleModal }: GridCell) => {
  const [cell, setCell] = useState<CellKeys | undefined>();
  const [className, setClassName] = useState<string>('cell');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isPopulated, setIsPopulated] = useState<boolean>(false);
  const [cellContents, setCellContents] = useState<CellContents | undefined>();
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isPlanted, setIsPlanted] = useState<boolean>(false);
  // eslint-disable-next-line
  const [apiError, setApiError] = useState<string>('')
  const [needsUpdate, setNeedsUpdate] = useState<(keyof StatusType)>()

  useEffect(() => {
    if(cellContents && needsUpdate) {
      patchCellContents(cellContents, id, needsUpdate)
      .catch((err) => {
          handleApiError(err)
      })
    }
    // eslint-disable-next-line
  }, [needsUpdate])

  const handleApiError = (error: string) => {
    setApiError(error)
  }

  useEffect(() => {
    if (garden) {
      const foundCell = garden.find(cell => cell.location_id === id)
      if (foundCell && foundCell.status === 'placed') {
        setCellContents({ plant: foundCell })
        setIsPopulated(true);
      }
      if (foundCell && foundCell.status === 'disabled') {
        setIsDisabled(true);
        !isDisabled ? setClassName('cell disabled') : setClassName('cell');
      }
      if (foundCell && foundCell.status === 'locked') {
        setCellContents({ plant: foundCell })
        setIsPopulated(true);
        setIsPlanted(true);
      }
      setCell(foundCell);
    }
  }, []);

  // NOTE: make sure to refactor this to only update the single cell data instead of updating the entire garden state
  // useEffect(() => {
  //   setGarden((prevState: GardenKeys) => {
  //     let index = prevState?.findIndex((item) => item.id === cell?.id);
  //     let newState = [...prevState];
  //     newState[index] = {
  //       ...newState[index],
  //       status: Number(isDisabled)
  //     };
  //     return newState;
  //   });
  //   // eslint-disable-next-line
  // }, [isDisabled]);

  // NOTE: make sure to refactor this to only update the single cell data instead of updating the entire garden state
  // useEffect(() => {
  //   setGarden((prevState: GardenKeys) => {
  //     let index = prevState?.findIndex((item) => item.id === cell?.id);
  //     let newState = [...prevState];
  //     newState[index] = {
  //       ...newState[index],
  //       image: cellContents?.plant.image,
  //       name: cellContents?.plant.name,
  //       'plant_id': cellContents?.plant.plant_id
  //     };
  //     return newState;
  //   });
  //   // eslint-disable-next-line
  // }, [isPlanted]);

  // NOTE: likely all we need to do for this one is trigger a re-render on the useEffect we run on page load. Check it out when you're hooking this functionality into the BE.
  useEffect(() => {
    if (bullDoze) {
      setClassName('cell');
      emptyCell();
      setBullDoze(false);
      setGarden((prevState: GardenKeys) => {
        let index = prevState?.findIndex((item) => item.location_id === cell?.location_id);
        let newState = [...prevState];
        newState[index] = {
          ...newState[index],
          image: undefined,
          name: undefined,
          'plant_id': undefined,
          status: 'empty'
        };
        return newState;
      });
    }
    // eslint-disable-next-line
  }, [bullDoze])

  // NOTE: likely all we need to do for this one is trigger a re-render on the useEffect we run on page load. Check it out when you're hooking this functionality into the BE.
  useEffect(() => {
    if (filterGarden && !isPlanted) {
      unPlantItems();
      setFilterGarden(false);
      setGarden((prevState: GardenKeys) => {
        let index = prevState?.findIndex((item) => item.location_id === cell?.location_id);
        let newState = [...prevState];
        newState[index] = {
          ...newState[index],
          image: undefined,
          name: undefined,
          'plant_id': undefined
        };
        return newState;
      });
    }
    // eslint-disable-next-line
  }, [filterGarden])

  const [{ isOver }, dropRef] = useDrop({
    accept: 'plant',
    drop: (plant: CellContents) => {
      if (isDisabled) {
        toggleModal()
      } else {
        setCellContents(plant)
        setNeedsUpdate('placed')
        setIsPopulated(true)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  })

  const handlePlanted = () => {
    setIsPlanted(true)
  }

  const handleRemove = () => {
    setIsPlanted(false)
    setCellContents(undefined)
  }

  const handleCloseModal = () => {
    setIsClicked(false)
  }

  const handleNeedsUpdating = (status: keyof StatusType) => {
    setNeedsUpdate(status)
  }

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as Element
    if (!cellContents) {
      setIsDisabled(!isDisabled)
      !isDisabled ? setClassName('cell disabled') : setClassName('cell');
    } else {
      setIsClicked(true)
      target.classList.add('disable-scale')
      const parent = target.parentNode as Element
      parent.classList.add('disable-hover')
    }
  }

  const emptyCell = (): void => {
    setIsDisabled(false);
    setCellContents(undefined);
    setIsPopulated(false);
    setIsPlanted(false);
  }

  const unPlantItems = (): void => {
    if (isPopulated && !isPlanted) {
      setCellContents(undefined);
      setIsPopulated(false);
    }
  }

  const hoverStyle = isOver && !isDisabled && {
    transform: 'scale(1.3)',
    backgroundColor: '#9EC924'
  }

  const divStyle = !isDisabled && {
    backgroundImage: `url(${cellContents?.plant.image})`,
    backgroundPosition: 'center',
    backgroundSize: '100%',
    border: isPlanted ? 'solid #9EC924 3px' : 'solid #f4f4f4 3px'
  };

  return (
    <>
      {isPopulated ? (
        <div id={id} className={className} style={{ ...divStyle, ...hoverStyle }} onClick={handleClick} ref={dropRef}>
          {isClicked && <div className='cell-modal'>
            {cellContents && <CellActions 
                                image={cellContents.plant.image}
                                name={cellContents.plant.name}
                                plantId={cellContents.plant.plant_id}
                                handlePlanted={handlePlanted}
                                handleRemove={handleRemove}
                                handleCloseModal={handleCloseModal}
                                handleNeedsUpdating={handleNeedsUpdating}
                              />}
          </div>}
        </div>
      ) : (
        <div id={id} className={className} style={{ ...divStyle, ...hoverStyle }} onClick={handleClick} ref={dropRef}></div>
      )}
    </>
  );
}

export default Cell;