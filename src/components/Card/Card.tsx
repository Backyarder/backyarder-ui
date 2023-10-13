import { useDrag, DragPreviewImage } from 'react-dnd'
import { PlantAttributes } from '../Sidebar/Sidebar'
import { NavLink } from 'react-router-dom'
import { ICON_MAP, IconType, SunlightType } from './plantIconMap'
import './Card.scss'
import { useState, useEffect } from 'react'

export interface CardProps {
  item: PlantAttributes
};

interface AdditionalCardProps {
  activeTab: string;
  modal: boolean;
  setModal: Function;
}

type CombinedCardProps = CardProps & AdditionalCardProps;

const Card = ({ item, activeTab, modal, setModal }: CombinedCardProps) => {
  const [plant, setPlant] = useState<PlantAttributes>()

  useEffect(() => {
    if (activeTab === 'plants') {
      setPlant(() => ({ ...item, content_type: 'Plant' }))
    } else if (activeTab === 'decor') {
      setPlant(() => ({ ...item, content_type: 'Decor' }))
    }
  }, [])

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

  if(item.hardiness){
    hardiness = item.hardiness.min === item.hardiness.max
    ? `${item.hardiness.min}`
    : `${item.hardiness.min}-${item.hardiness.max}`
  }

  const plantImage = item.image
    ? item.image
    : `${process.env.PUBLIC_URL}/images/plant-fallback.png`

  const type: string = item.type

  let sunlight

  if (item.sunlight){
    sunlight = item.sunlight[0]
  }

  const flowerCategory = ICON_MAP.type[type as IconType]

  const sunlightCategory = ICON_MAP.sunlight[sunlight as SunlightType]

  return (
    <>
      {!isDragging && (
        <DragPreviewImage connect={preview} src={`${process.env.PUBLIC_URL}/images/plant.png`} />
      )}
      <NavLink to={`/plants/${item.plant_id}`} className='card' style={draggedCardStyle} ref={dragRef}>
        <img className='card-image' src={plantImage} alt={`${item.name}`} />
        <p className='plant-name'>{item?.name?.toUpperCase()}</p>
        <div className='card-icons-container'>
          <div className='card-icons'>
            <div className="material-symbols-rounded card-icon">
              {flowerCategory}
              <span className="left-icon-text tooltip-text">{`${item.type}`}</span>
            </div>
            <div className="material-symbols-rounded card-icon">
              {sunlightCategory}
              <span className="left-icon-text tooltip-text">{item.sunlight && `${item.sunlight[0]}`}</span>
            </div>
          </div>
          <div className='card-icons'>
            {item.hardiness && <div className="material-symbols-rounded card-icon">
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
