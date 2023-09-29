import { NavLink } from 'react-router-dom'
import './CellActions.scss'

interface CellProps {
    image: string | undefined
    name: string | undefined
    plantId: number | undefined
    handleCloseModal: () => void
    isPlanted: boolean
    handlePlanted: () => void
    handleWatered: () => void
    handleRemove: () => void
    handleNeedsUpdating: Function
}

const CellActions = ({ image, name, plantId, handleCloseModal, isPlanted, handlePlanted, handleWatered, handleRemove, handleNeedsUpdating }: CellProps) => {

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        const target = e.target as Element
        if (target.classList.contains('plant-button')) {
            handlePlanted()
            handleNeedsUpdating('locked')
        } else if (target.classList.contains('water-button') || target.classList.contains('icon')) {
            handleWatered()
        } else if (target.classList.contains('remove-button')) {
            handleRemove()
        }
        const cell = target.closest('.disable-scale')
        cell?.classList.remove('disable-scale')
        const grid = target.closest('#grid')
        grid?.classList.remove('disable-hover')
        handleCloseModal()
    }

    return (
        <div className='cell-info'>
            <img className='card-image' src={image} alt={`${name}`} />
            <p className='plant-name'>{name?.toUpperCase()}</p>
            <div className='cell-actions'>
                {isPlanted
                    ? <button className='cell-button water-button' onClick={handleClick}>
                        Water!
                        <span className="material-symbols-rounded icon">
                            water_drop
                        </span>
                    </button>
                    : <button className='cell-button plant-button' onClick={handleClick}>
                        Plant!
                        <span className="material-symbols-rounded icon plant-button">
                            psychiatry
                        </span>
                    </button>
                }
                <NavLink to={`/plants/${plantId}`} className='cell-button' onClick={handleClick}><span onClick={handleClick} className="material-symbols-rounded">
                    menu_book
                </span></NavLink>
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
