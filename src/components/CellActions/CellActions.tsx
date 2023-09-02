import { CardProps } from "../Card/Card"
import './CellActions.scss'

interface CellProps extends CardProps {
    handleCloseModal: () => void
    isPlanted: boolean
    handlePlanted: () => void
    handleRemove: () => void
}

const CellActions = ({ plant, handleCloseModal, isPlanted, handlePlanted, handleRemove }: CellProps) => {

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        const target = e.target as Element
        if (target.classList.contains('plant-button')) {
            handlePlanted()
        } else if (target.classList.contains('remove-button')) {
            handleRemove()
        }
        const cell = target.closest('disable-scale')
        cell?.classList.remove('disable-scale')
        const grid = target.closest('#grid')
        grid?.classList.remove('disable-hover')
        handleCloseModal()
    }

    return (
        <div className='cell-info'>
            <img className='card-image' src={plant.image} alt={`${plant.name}`} />
            <p className='plant-name'>{plant.name.toUpperCase()}</p>
            <div className='cell-actions'>
            {isPlanted
                ? <button className='cell-button plant-button' onClick={handleClick}>
                    Water!
                    <span onClick={handleClick} className="material-symbols-rounded plant-icon plant-button">
                        water_drop
                    </span>
                    </button>
                : <button className='cell-button water-button' onClick={handleClick}>
                    Plant!
                        <span onClick={handleClick} className="material-symbols-rounded plant-icon plant-button">
                            psychiatry
                        </span>
                    </button>
            }
            <button className='cell-button' onClick={handleClick}><span onClick={handleClick} className="material-symbols-rounded">
                menu_book
            </span></button>
            <button className='cell-button remove-button' onClick={handleClick}><span onClick={handleClick} className="material-symbols-rounded remove-button">
                delete
            </span></button>
            <button className='close-modal cell-button' onClick={handleClick}><span className="material-symbols-rounded">
                close
            </span></button>
            </div>
        </div>
    )
}

export default CellActions
