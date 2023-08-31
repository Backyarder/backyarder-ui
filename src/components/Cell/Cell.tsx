import { useState } from 'react';
import { useDrop } from 'react-dnd';
import CellActions from '../CellActions/CellActions';
import { CardProps } from '../Card/Card';
import './Cell.scss'

type GridCell = {
    id: string;
    toggleModal: () => void;
}

const Cell = ({id, toggleModal}: GridCell) => {
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [cellContents, setCellContents] = useState<CardProps>()
    const [isClicked, setIsClicked] = useState<boolean>(false)
    const [{ isOver }, dropRef] = useDrop({
        accept: 'plant',
        drop: (plant: CardProps) => isDisabled ? toggleModal() : setCellContents(plant),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    })

    const handleCloseModal = () => {
        setIsClicked(false)
    }

    const handleClick = (e: React.MouseEvent) => {
        const target = e.target as Element
        if(!cellContents) {
            setIsDisabled(!isDisabled)
            !isDisabled ? target.classList.add('disabled') : target.classList.remove('disabled')
        } else {
            setIsClicked(true)
            target.classList.add('disable-scale')
            const parent = target.parentNode as Element
            parent.classList.add('disable-hover')
        }
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
        <div id={id} className='cell' style={{...divStyle, ...hoverStyle}} onClick={handleClick} ref={dropRef}>
            {isClicked && <div className='cell-modal'>
                {cellContents && <CellActions plant={cellContents?.plant} handleCloseModal={handleCloseModal}/>}
            </div>}
        </div>
    )
}

export default Cell
