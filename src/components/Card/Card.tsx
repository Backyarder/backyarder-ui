import './Card.scss'

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

const iconMap: { [key: string]: any } = {
    type: {
        'tree': 'park',
        'Ornamental grass': 'psychiatry',
        'Deciduous shrub': 'grass',
        'Broadleaf evergreen': 'park'
    },
    sunlight: {
        'full sun': 'sunny',
        'part shade': 'partly_cloudy_day'
    }
}

const Card = ({plant}: CardProps) => {

    return (
        <div className='card'>
            <img src={plant.image} alt={`${plant.name}`} />
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
                    <span>{plant.hardiness}</span>
                </div>
            </div>
        </div>
    )
}

export default Card
