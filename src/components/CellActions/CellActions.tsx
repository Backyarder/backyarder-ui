import { NavLink } from 'react-router-dom'
import './CellActions.scss'

interface CellProps {
    image: string | undefined
    name: string | undefined
    plantId: number | undefined
    handleCloseModal: () => void
    handlePlanted: () => void
    handleRemove: () => void
    handleNeedsUpdating: Function
}

const CellActions = ({ image, name, plantId, handleCloseModal, handlePlanted, handleRemove, handleNeedsUpdating }: CellProps) => {

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        const target = e.target as Element
        if (target.classList.contains('plant-button')) {
            handlePlanted()
            handleNeedsUpdating('locked')
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
            <img className='card-image' src={image} alt={`${name}`} />
            <p className='plant-name'>{name?.toUpperCase()}</p>
            <div className='cell-actions'>
                <button className='cell-button plant-button' onClick={handleClick}>Plant!<span onClick={handleClick} className="material-symbols-rounded plant-icon plant-button">
                    psychiatry
                </span></button>
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
