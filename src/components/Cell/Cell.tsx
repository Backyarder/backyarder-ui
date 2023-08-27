import { useState } from 'react';
import './Cell.scss'

type GridCell = {
    id: string;
}

const Cell = ({id}: GridCell) => {
    const [isDisabled, setIsDisabled] = useState<boolean>(false)

    const handleClick = (e: React.MouseEvent) => {
        setIsDisabled(!isDisabled)
        const target = e.target as Element
        !isDisabled ? target.classList.add('disabled') : target.classList.remove('disabled')
    }

    return (
        <div id={id} className='cell' onClick={handleClick}>
            {id}
        </div>
    )
}

export default Cell
