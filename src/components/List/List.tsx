import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GardenKeys, WishlistType } from '../Main/Main';
import { CellKeys } from '../Grid/Grid';
import { plantImageSrc, onImageError } from '../../imageFallback';
import './List.scss';

interface ListProps {
  garden: GardenKeys | undefined;
  wishlist: WishlistType[];
  toggleWishlist: (plantId: number | undefined) => void;
}

const List = ({ garden, wishlist, toggleWishlist }: ListProps) => {
  const [isWishlistView, setIsWishlistView] = useState<boolean>(false);

  const findQuantity = (array: GardenKeys | undefined, id: number | undefined): number | undefined => {
    if (array) {
      let count = 0;
      for (const element of array) {
        if (element.plant_id === id && element.status === 'locked') {
          count++;
        }
      }
      return count;
    }
  }

  const toggleView = (): void => {
    setIsWishlistView(!isWishlistView);
  }

  const uniquePlants = (garden || []).reduce((array: GardenKeys, plant: CellKeys) => {
    if (!array.some(item => item.plant_id === plant.plant_id) && plant.name) {
      array.push(plant);
    }
    return array.filter(item => item.status === 'locked' && item.content_type === 'Plant');
  }, []);

  const uniquePlacedItems = garden?.reduce((array: GardenKeys, plant: CellKeys) => {
    if (!array.some(item => item.plant_id === plant.plant_id) && plant.name) {
      array.push(plant);
    }
    return array.filter(item => item.status === 'placed' && item.content_type === 'Plant');
  }, []);

  const countNeedingWater = (id: number | undefined): number =>
    (garden || []).filter(cell => cell.plant_id === id && cell.status === 'locked' && cell.needs_water).length

  const plantElements: JSX.Element[] | undefined = uniquePlants?.map(plant => {
    const due = countNeedingWater(plant.plant_id)
    return (
      <div key={plant['plant_id']} className='plant-element' >
        <div className='plant-info-container' >
          <img src={plantImageSrc(plant.image)} onError={onImageError} className='plant-image' alt={plant.name} />
          <p className='plant-list-name' >
            {plant.name?.toUpperCase()} x{findQuantity(garden, plant.plant_id)}
            {due > 0 && <span className='needs-water-badge' title='Due for water'><span className='material-symbols-rounded'>water_drop</span>{due > 1 ? `${due} need water` : 'needs water'}</span>}
          </p>
        </div>
        <NavLink to={`/plants/${plant['plant_id']}`} >
          <button className='detail-button' >VIEW PLANT DETAILS</button>
        </NavLink>
      </div>
    );
  });

  const placedElements: JSX.Element[] | undefined = uniquePlacedItems?.map(plant => {
    return (
      <div key={plant['plant_id']} className='placed-element' >
        <div className='plant-info-container' >
          <img className='wishlist-checkbox' src={`${process.env.PUBLIC_URL}/images/checked_${plant.plant_id !== undefined && wishlist.includes(plant.plant_id)}.png`} onClick={() => toggleWishlist(plant.plant_id)} alt={`wishlist checkbox ${plant.plant_id}`} />
          <img src={plantImageSrc(plant.image)} onError={onImageError} className='placed-image' alt={plant.name} />
          <p className='plant-list-name' >{plant.name?.toUpperCase()}</p>
        </div>
        <NavLink to={`/plants/${plant['plant_id']}`} >
          <button className='detail-button' >VIEW PLANT DETAILS</button>
        </NavLink>
      </div>
    );
  });

  return (
    <section className='list-container'>
      <div className='list-button-container'>
        <button
          className='list-button garden-button'
          style={{
            backgroundColor: isWishlistView ? '#beab95' : '#f4f4f4',
            cursor: !isWishlistView ? 'auto' : 'pointer'
          }}
          disabled={!isWishlistView}
          onClick={toggleView}
        >
          <span className="material-symbols-rounded nav-icon">outdoor_garden</span>MY GARDEN
        </button>
        <button
          className='list-button wishlist-button'
          style={{
            backgroundColor: !isWishlistView ? '#beab95' : '#f4f4f4',
            cursor: isWishlistView ? 'auto' : 'pointer'
          }}
          disabled={isWishlistView}
          onClick={toggleView}
        >
          <span className="material-symbols-rounded nav-icon">checklist</span>WISHLIST
        </button>
      </div>
      {!isWishlistView && <div className='garden-view-container'>
        {!plantElements.length && <h1 className='empty-list-text'>Your garden is empty!</h1>}
        <div className='plant-element-container'>
          {plantElements}
        </div>
      </div>}
      {isWishlistView && <div className='wishlist-view-container'>
        {!placedElements?.length && <h1 className='empty-list-text'>Your wishlist is empty!</h1>}
        <div className='plant-element-container'>
          {placedElements}
        </div>
      </div>}
    </section>
  );
}

export default List;