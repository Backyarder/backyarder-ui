import { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import './Cell.scss'

type GridCell = {
  id: string;
  bullDoze: boolean;
  setBullDoze: Function;
  toggleModal: () => void;
}

type CardProps = {
  plant: {
    id: number
    name: string
    image: string
    type: string
    sunlight: string[]
    hardiness: string
  }
}

const Cell = ({id, bullDoze, setBullDoze, toggleModal}: GridCell) => {
  const [className, setClassName] = useState<string>('cell');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isPopulated, setIsPopulated] = useState<boolean>(false);
  const [cellContents, setCellContents] = useState<CardProps | undefined>();

  useEffect(() => {
    if (bullDoze) {
      setClassName('cell');
      emptyCell();
      setBullDoze(false);
    }
  }, [bullDoze])

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

  const handleClick = () => {
    if (!cellContents) {
      setIsDisabled(!isDisabled);
      !isDisabled ? setClassName('cell disabled') : setClassName('cell');
    }
  }

  const emptyCell = () : void => {
    setIsDisabled(false);
    setCellContents(undefined);
    setIsPopulated(false);
  }

  const hoverStyle = isOver && !isDisabled && {
      transform: 'scale(1.3)',
      backgroundColor: 'LawnGreen'
  }

  const divStyle = {
      backgroundImage: `url(${cellContents?.plant.image})`,
      backgroundPosition: 'center',
      backgroundSize: '100%'
  };

  return (
    <>
      {isPopulated ? (
        <div id={id} className={className} style={{...divStyle, ...hoverStyle}} onClick={handleClick} ref={dropRef}></div>
      ) : (
        <div id={id} className={className} style={{...hoverStyle}} onClick={handleClick} ref={dropRef}></div>
      )};
    </>
  );
}

export default Cell;
