// if i FIRMLY plant a cell, its contents should update in the garden state.
// if i remove unplanted items, my garden should still have disabled cells and planted items.

import { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import CellActions from '../CellActions/CellActions';
import { CardProps } from '../Card/Card';
import { CellKeys, GridProps } from '../Grid/Grid';
import { GardenKeys } from '../Main/Main';
import './Cell.scss'

interface GridCell extends GridProps {
  id: string;
  toggleModal: () => void;
}

const Cell = ({ id, garden, setGarden, bullDoze, setBullDoze, filterGarden, setFilterGarden, toggleModal }: GridCell) => {
  const [cell, setCell] = useState<CellKeys | undefined>();
  const [className, setClassName] = useState<string>('cell');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isPopulated, setIsPopulated] = useState<boolean>(false);
  const [cellContents, setCellContents] = useState<CardProps | undefined>();
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isPlanted, setIsPlanted] = useState<boolean>(false);

  useEffect(() => {
    setCell(garden?.find(cell => cell.id === id))
    if (cell?.status === 1) {
      setIsDisabled(true);
      !isDisabled ? setClassName('cell disabled') : setClassName('cell');
    }
  }, []);

  useEffect(() => {
    setGarden((prevState: GardenKeys) => {
      let index = prevState?.findIndex((item) => item.id === cell?.id);
      let newState = [...prevState];
      newState[index] = {
        ...newState[index],
        status: Number(isDisabled)
      };
      return newState;
    });
  }, [isDisabled]);

  useEffect(() => {
    if (bullDoze) {
      setClassName('cell');
      emptyCell();
      setBullDoze(false);
      setGarden((prevState: GardenKeys) => {
        let index = prevState?.findIndex((item) => item.id === cell?.id);
        let newState = [...prevState];
        newState[index] = {
          ...newState[index],
          image: null,
          name: null,
          'plant_id': null,
          status: 0
        };
        return newState;
      });
    }
    // eslint-disable-next-line
  }, [bullDoze])

  useEffect(() => {
    if (filterGarden && !isPlanted) {
      unPlantItems();
      setFilterGarden(false);
      setGarden((prevState: GardenKeys) => {
        let index = prevState?.findIndex((item) => item.id === cell?.id);
        let newState = [...prevState];
        newState[index] = {
          ...newState[index],
          image: null,
          name: null,
          'plant_id': null
        };
        return newState;
      });
    }
    // eslint-disable-next-line
  }, [filterGarden])

  const [{ isOver }, dropRef] = useDrop({
    accept: 'plant',
    drop: (plant: CardProps) => {
      if (isDisabled) {
        toggleModal()
      } else {
        setCellContents(plant)
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
            {cellContents && <CellActions plant={cellContents?.plant} handlePlanted={handlePlanted} handleRemove={handleRemove} handleCloseModal={handleCloseModal} />}
          </div>}
        </div>
      ) : (
        <div id={id} className={className} style={{ ...divStyle, ...hoverStyle }} onClick={handleClick} ref={dropRef}></div>
      )}
    </>
  );
}

export default Cell;
