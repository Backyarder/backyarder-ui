import { useDrag, DragPreviewImage } from 'react-dnd'
import { PlantAttributes } from '../Sidebar/Sidebar'
import { NavLink } from 'react-router-dom'
import { ICON_MAP, IconType, SunlightType } from './plantIconMap'
import './Card.scss'

export interface CardProps {
  plant: PlantAttributes
};

interface AdditionalCardProps {
  modal: boolean;
  setModal: Function;
}

type CombinedCardProps = CardProps & AdditionalCardProps;

const Card = ({ plant, modal, setModal }: CombinedCardProps) => {
  const [{ isDragging }, dragRef, preview] = useDrag({
    type: 'plant',
    item: { plant },
    end: (item, monitor) => {
      if (!monitor.didDrop() && monitor.getTargetIds().length) {
        setModal(!modal);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const draggedCardStyle = isDragging ? { opacity: '.4' } : {}

  let hardiness;

  if(plant.hardiness){
    hardiness = plant.hardiness.min === plant.hardiness.max
    ? `${plant.hardiness.min}`
    : `${plant.hardiness.min}-${plant.hardiness.max}`
  }

  const plantImage = plant.image
    ? plant.image
    : `${process.env.PUBLIC_URL}/images/plant-fallback.png`

  const type: string = plant.type

  let sunlight

  if (plant.sunlight){
    sunlight = plant.sunlight[0]
  }

  const flowerCategory = ICON_MAP.type[type as IconType]

  const sunlightCategory = ICON_MAP.sunlight[sunlight as SunlightType]

  return (
    <>
      {!isDragging && (
        <DragPreviewImage connect={preview} src={`${process.env.PUBLIC_URL}/images/${plant.content_type === 'Plant' ? 'plant' : 'umbrella'}.png`} />
      )}
      <NavLink to={`/plants/${plant.plant_id}`} className='card' style={draggedCardStyle} ref={dragRef}>
        <img className='card-image' src={plantImage} alt={`${plant.name}`} />
        <p className='plant-name'>{plant?.name?.toUpperCase()}</p>
        <div className='card-icons-container'>
          <div className='card-icons'>
            <div className="material-symbols-rounded card-icon">
              {flowerCategory}
              <span className="left-icon-text tooltip-text">{`${plant.type}`}</span>
            </div>
            <div className="material-symbols-rounded card-icon">
              {sunlightCategory}
              <span className="left-icon-text tooltip-text">{plant.sunlight && `${plant.sunlight[0]}`}</span>
            </div>
          </div>
          <div className='card-icons'>
            {plant.hardiness && <div className="material-symbols-rounded card-icon">
              location_on
              <span className="hardiness-text tooltip-text">hardiness zone</span>
            </div>}
            <span>{hardiness}</span>
          </div>
        </div>
      </NavLink>
    </>
  )
}

export default Card
