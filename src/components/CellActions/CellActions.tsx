import { NavLink } from 'react-router-dom'
import { plantImageSrc, onImageError } from '../../imageFallback'
import { CompanionHint } from '../../companions'
import './CellActions.scss'

interface CellProps {
    locationId: string
    image: string | undefined
    name: string | undefined
    contentType: string | undefined
    plantId: number | undefined
    isPlanted: boolean
    needsWater?: boolean
    companions?: CompanionHint | null
    onPlant: () => void
    onWater: () => void
    onRemove: () => void
    onClose: () => void
}

// The panel for the selected cell, shown beside the grid (never over it, so
// the companion rings around the cell stay visible). Every button closes it.
const CellActions = ({ locationId, image, name, contentType, plantId, isPlanted, needsWater, companions, onPlant, onWater, onRemove, onClose }: CellProps) => {

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        const target = e.target as Element
        if (target.classList.contains('plant-button')) {
            onPlant()
        } else if (target.classList.contains('water-button') || target.classList.contains('icon')) {
            onWater()
        } else if (target.classList.contains('remove-button')) {
            onRemove()
        }
        onClose()
    }

    return (
        <div className='cell-info' data-cell={locationId}>
            <img className='card-image' src={plantImageSrc(image)} onError={onImageError} alt={`${name}`} />
            <p className='plant-name'>
                {name?.toUpperCase()}
                <span className='cell-location'>{locationId}{isPlanted ? (needsWater ? ' · needs water' : ' · planted') : ' · not planted yet'}</span>
            </p>
            {companions && (companions.likes.length > 0 || companions.avoid.length > 0) && (
                <p className='companion-hint'>
                    {companions.likes.length > 0 && <span className='likes'>Likes {companions.likes.slice(0, 4).join(', ')}</span>}
                    {companions.likes.length > 0 && companions.avoid.length > 0 && ' · '}
                    {companions.avoid.length > 0 && <span className='avoid'>Avoid {companions.avoid.slice(0, 3).join(', ')}</span>}
                </p>
            )}
            <div className='cell-actions'>
                {isPlanted
                    ? contentType === "Plant" && <button className='cell-button water-button' onClick={handleClick}>
                        Water!
                        <span className="material-symbols-rounded icon">
                            water_drop
                        </span>
                    </button>
                    : <button className='cell-button plant-button' onClick={handleClick}>
                        { contentType === "Plant" ? "Plant!" : "Construct!" }
                        <span className="material-symbols-rounded icon plant-button">
                        { contentType === "Plant" ? "psychiatry" : "construction" }
                        </span>
                    </button>
                }
                {contentType === "Plant" &&
                    <NavLink to={`/plants/${plantId}`} className='cell-button' onClick={handleClick}>
                        <span onClick={handleClick} className="material-symbols-rounded">menu_book</span>
                        <span className='cell-action-tooltip-text'>Plant details</span>
                    </NavLink>
                }
                <button className='cell-button remove-button' onClick={handleClick}>
                    <span onClick={handleClick} className="material-symbols-rounded remove-button">delete</span>
                    <span className='cell-action-tooltip-text'>Remove from garden</span>
                </button>
                <button className='close-modal cell-button' onClick={handleClick}>
                    <span className="material-symbols-rounded">close</span>
                    <span className='cell-action-tooltip-text'>Close</span>
                </button>
            </div>
        </div>
    )
}

export default CellActions
