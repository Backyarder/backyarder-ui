import { CardProps } from "../Card/Card"
import './CellActions.scss'

interface CellProps extends CardProps {
    handleCloseModal: () => void;
    handlePlanted: () => void
}

const CellActions = ({plant, handleCloseModal, handlePlanted}: CellProps) => {

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        const target = e.target as Element
        if(target.classList.contains('plant-button')) {
            handlePlanted()
        }
        const cell = target.closest('disable-scale')
        cell?.classList.remove('disable-scale')
        const grid = target.closest('#grid')
        grid?.classList.remove('disable-hover')
        handleCloseModal()
    }

    return (
        <div className='cell-info'>
            <img className='card-image' src={plant.image} alt={`${plant.name}`}/>
            <p className='plant-name'>{plant.name.toUpperCase()}</p>
            <div className='cell-actions'>
                <button className='cell-button plant-button' onClick={handleClick}>Plant!</button>
                <button className='cell-button remove-button'>Remove</button>
                <img className='close-modal' src={`${process.env.PUBLIC_URL}/images/close-modal.png`} onClick={handleClick} alt='close modal'/>
            </div>
        </div>
    )
}

export default CellActions