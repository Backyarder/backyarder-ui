import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GardenKeys } from '../Main/Main';
import { CellKeys } from '../Grid/Grid';
import './List.scss';

interface ListProps {
  garden: GardenKeys | undefined;
}

const List = ({ garden }: ListProps) => {
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
    // reset();
  }

  const uniquePlants = (garden || []).reduce((array: GardenKeys, plant: CellKeys) => {
    if (!array.some(item => item.plant_id === plant.plant_id) && plant.plant_name) {
      array.push(plant);
    }
    return array.filter(item => item.status === 'locked');
  }, []);

  const plantElements: JSX.Element[] | undefined = uniquePlants?.map(plant => {
    return (
      <div key={plant['plant_id']} className='plant-element' >
        <div className='plant-info-container' >
          <img src={plant.image} className='plant-image' alt={plant.plant_name} />
          <p>{plant.plant_name?.toUpperCase()} x{findQuantity(garden, plant.plant_id)}</p>
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
          className='list-button'
          style={{
            backgroundColor: isWishlistView ? '#beab95' : '#f4f4f4',
            cursor: !isWishlistView ? 'auto' : 'pointer'
          }}
          // disabled={!isWishlistView}
          onClick={toggleView}
        >
          <span className="material-symbols-rounded nav-icon">outdoor_garden</span>MY GARDEN
        </button>
        <button
          className='list-button'
          style={{
            backgroundColor: !isWishlistView ? '#beab95' : '#f4f4f4',
            cursor: isWishlistView ? 'auto' : 'pointer'
          }}
          // disabled={isWishlistView}
          onClick={toggleView}
        >
          <span className="material-symbols-rounded nav-icon">checklist</span>WISHLIST
        </button>
      </div>
      <div className='plant-element-container'>
        {plantElements}
      </div>
      {!plantElements.length && <h1 className='empty-list-text'>Your garden is empty!</h1>}
    </section>
  );
}

export default List;