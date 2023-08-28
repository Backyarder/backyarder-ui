import './Card.scss'

type CardProps = {
    plant: {
        id: number
        name: string
        image: string
    }
}

const Card = ({plant}: CardProps) => {

    return (
        <div className='card'>
            <img src={plant.image} alt={`${plant.name}`} />
            <p className='plant-name'>{plant.name.toUpperCase()}</p>
            <div className='plant-icons'>
                <div></div>
                <img alt={`hardiness zones for ${plant.name}`}/>
            </div>
        </div>
    )
}

export default Card
