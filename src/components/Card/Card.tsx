import { useDrag, DragPreviewImage } from 'react-dnd'
import { PlantAttributes } from '../Sidebar/Sidebar'
import { NavLink } from 'react-router-dom'
import { ICON_MAP, IconType, SunlightType } from './plantIconMap'
import './Card.scss'

export interface CardProps {
    plant: PlantAttributes
};

const Card = ({ plant }: CardProps) => {
    const [{ isDragging }, dragRef, preview] = useDrag({
        type: 'plant',
        item: { plant },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    const draggedCardStyle = isDragging ? { opacity: '.4' } : {}

    const hardiness = plant.hardiness.min === plant.hardiness.max
                        ? `${plant.hardiness.min}`
                        : `${plant.hardiness.min}-${plant.hardiness.max}`

    const plantImage = plant.image
                        ? plant.image
                        : `${process.env.PUBLIC_URL}/images/plant-fallback.png`

    const plantData: { type: string; sunlight: string } = {
        type: plant.type,
        sunlight: plant.sunlight[0],
    }

    const flowerCategory = ICON_MAP.type[plantData.type as IconType]
    const sunlightCategory = ICON_MAP.sunlight[plantData.sunlight as SunlightType]

    return (
        <>
            {!isDragging && (
                <DragPreviewImage connect={preview} src={`${process.env.PUBLIC_URL}/images/plant.png`} />
            )}
            <NavLink to={`/plants/${plant.plant_id}`} className='card' style={draggedCardStyle} ref={dragRef}>
                <img className='card-image' src={plantImage} alt={`${plant.plant_name}`} />
                <p className='plant-name'>{plant.plant_name.toUpperCase()}</p>
                <div className='card-icons-container'>
                    <div className='card-icons'>
                        <div className="material-symbols-rounded card-icon">
                            {flowerCategory}
                            <span className="left-icon-text tooltip-text">{`${plant.type}`}</span>
                        </div>
                        <div className="material-symbols-rounded card-icon">
                            {sunlightCategory}
                            <span className="left-icon-text tooltip-text">{`${plant.sunlight[0]}`}</span>
                        </div>
                    </div>
                    <div className='card-icons'>
                        <div className="material-symbols-rounded card-icon">
                            location_on
                            <span className="hardiness-text tooltip-text">hardiness zone</span>
                        </div>
                        <span>{hardiness}</span>
                    </div>
                </div>
            </NavLink>
        </>
    )
}

export default Card
