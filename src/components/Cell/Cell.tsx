import { useState } from 'react';
import { useDrop } from 'react-dnd';
import './Cell.scss'

type GridCell = {
    id: string;
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

const Cell = ({id}: GridCell) => {
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [cellContents, setCellContents] = useState<CardProps>()
    const [{ isOver }, dropRef] = useDrop({
        accept: 'plant',
        drop: (plant: CardProps) => isDisabled ? console.log('fail') : setCellContents(plant),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    })

    const handleClick = (e: React.MouseEvent) => {
        setIsDisabled(!isDisabled)
        const target = e.target as Element
        !isDisabled ? target.classList.add('disabled') : target.classList.remove('disabled')
    }

    const divStyle = {
        backgroundImage: `url(${cellContents?.plant.image})`,
        backgroundPosition: 'center',
        backgroundSize: '100%'
    };

    return (
        <div id={id} className='cell' style={divStyle} onClick={handleClick} ref={dropRef}></div>
    )
}

export default Cell
