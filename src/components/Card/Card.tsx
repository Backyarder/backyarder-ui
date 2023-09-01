import { useDrag, DragPreviewImage } from 'react-dnd'
import './Card.scss'

export interface CardProps {
    plant: {
        plant_id: number
        name: string
        image: string
        type: string
        sunlight: string[]
        hardiness: {
            min: string
            max: string
        }
    }
}

const iconMap: { [key: string]: any } = {
    type: {
        'flower': 'Deceased',
        'tree': 'park',
        'fruit': 'Nutrition',
        "Palm or Cycad": 'park',
        'Ornamental grass': 'psychiatry',
        'Vine': 'psychiatry',
        'Deciduous shrub': 'grass',
        "Rush or Sedge": 'grass',
        'Shrub': 'grass',
        "Fern": 'grass',
        "Epiphyte": 'grass',
        'Broadleaf evergreen': 'park',
        'Herb': 'temp_preferences_eco',
        'Vegetable': 'Restaurant'
    },
    sunlight: {
        'full sun': 'sunny',
        'part shade': 'partly_cloudy_day'
    }
}

const Card = ({plant}: CardProps) => {
    const [{ isDragging }, dragRef, preview] = useDrag({
        type: 'plant',
        item: { plant },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    const draggedCardStyle = isDragging ? {opacity: '.4'} : {}

    const hardiness = plant.hardiness.min === plant.hardiness.max
                        ? `${plant.hardiness.min}`
                        : `${plant.hardiness.min}-${plant.hardiness.max}`

    return (
        <>
            {!isDragging && (
                <DragPreviewImage connect={preview} src={`${process.env.PUBLIC_URL}/images/plant.png`} />
            )}
            <div className='card' style={draggedCardStyle} ref={dragRef}>
                <img className='card-image' src={plant.image} alt={`${plant.name}`}/>
                <p className='plant-name'>{plant.name.toUpperCase()}</p>
                <div className='card-icons-container'>
                    <div className='card-icons'>
                        <div className="material-symbols-rounded card-icon">
                            {iconMap.type[plant.type]}
                            <span className="left-icon-text tooltip-text">{`${plant.type}`}</span>
                        </div>
                        <div className="material-symbols-rounded card-icon">
                            {iconMap.sunlight[plant.sunlight[0]]}
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
            </div>
        </>
    )
}

export default Card
