import { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import CellActions from '../CellActions/CellActions';
import { CellKeys, GridProps } from '../Grid/Grid';
import { GardenKeys } from '../Main/Main';
import { patchCellContents, patchDisabledOrRemoved } from '../../apiCalls';
import { StatusType } from '../../apiCalls';
import './Cell.scss'

interface GridCell extends GridProps {
  id: string;
  toggleModal: () => void;
}

export interface CellContents {
  plant: CellKeys;
}

// CODE NEEDS TO BE HEAVILY DRY'ed UP

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
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  useEffect(() => {
    if(cellContents && needsUpdate) {
      patchCellContents(cellContents, id, needsUpdate)
      .catch((err) => {
          handleApiError(err)
      })
    }
    // eslint-disable-next-line
  }, [needsUpdate])

  useEffect(() => {
    if(needsUpdate) {
      patchDisabledOrRemoved(id, needsUpdate)
      .catch((err) => {
          handleApiError(err)
      })
    }
    // eslint-disable-next-line
  }, [isDisabled, cellContents === undefined])

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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (shouldRender) {
      handleGarden(id, cellContents?.plant.image, cellContents?.plant.name, cellContents?.plant.plant_id, isDisabled ? 'disabled' : 'empty')
      setShouldRender(false);
    }
  }, [isDisabled]);

  useEffect(() => {
    if (shouldRender) {
      handleGarden(id, cellContents?.plant.image, cellContents?.plant.name, cellContents?.plant.plant_id, isPopulated ? 'placed' : 'empty')
    }
    setShouldRender(false);
  }, [isPopulated]);

  useEffect(() => {
    if (shouldRender && isPlanted) {
      handleGarden(id, cellContents?.plant.image, cellContents?.plant.name, cellContents?.plant.plant_id, 'locked')
    } else if (shouldRender && !isPlanted) {
      handleGarden(id, undefined, undefined, undefined, 'empty')
    }
    setShouldRender(false);
  }, [isPlanted]);

  useEffect(() => {
    if (bullDoze) {
      setClassName('cell');
      emptyCell();
      setBullDoze(false);
      handleGarden(id, undefined, undefined, undefined, 'empty')
    }
    // eslint-disable-next-line
  }, [bullDoze])

  useEffect(() => {
    if (filterGarden && !isPlanted) {
      unPlantItems();
      setFilterGarden(false);
      handleGarden(id, undefined, undefined, undefined, 'empty')
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
        setTimeout(() => {
          setShouldRender(true)
          setNeedsUpdate('placed')
          setIsPopulated(true)
        }, 0)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  })

  const handleGarden = (id: string, image: string | undefined, name: string | undefined, plant_id: number | undefined, status: string) => {
    setGarden((prevState: GardenKeys) => {
      let index = prevState?.findIndex((item) => item.location_id === id);
      let newState = [...prevState];
      newState[index] = {
        ...newState[index],
        image: image,
        name: name,
        'plant_id': plant_id,
        status: status
      };
      return newState;
    });
  }

  const handlePlanted = () => {
    setIsPlanted(true)
    setShouldRender(true);
  }

  const handleRemove = () => {
    setIsPopulated(false)
    setIsPlanted(false)
    setCellContents(undefined)
    handleNeedsUpdating('empty')
    setShouldRender(true)
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
      !isDisabled ? setNeedsUpdate('disabled') : setNeedsUpdate('empty')
      setShouldRender(true)
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