import { NavLink } from 'react-router-dom';
import './List.scss';
import { GardenKeys } from '../Main/Main';
import { CellKeys } from '../Grid/Grid';

interface ListProps {
  garden: GardenKeys | undefined;
}

const List = ({ garden }: ListProps) => {

  // NOTE: likely will be resolved with the new BE endpoints, but please leave it until you're able to check when you connect to it!
  const findQuantity = (array: GardenKeys | undefined, id: number | undefined): number | undefined => {
    if (array) {
      let count = 0;
      for (const element of array) {
        if (element['plant_id'] === id) {
          count++;
        }
      }
      return count;
    }
  }

  // NOTE: likely will be resolved with the new BE endpoints, but please leave it until you're able to check when you connect to it!
  const uniquePlants = (garden || []).reduce((array: GardenKeys, plant: CellKeys) => {
    if (!array.some(item => item.plant_id === plant.plant_id) && plant.name) {
      array.push(plant);
    }
    return array.filter(item => item.status === 'locked');
  }, []);

  // NOTE: likely need to be updated with BE data once connected
  const plantElements: JSX.Element[] | undefined = uniquePlants?.map(plant => {
    return (
      <div key={plant['plant_id']} className='plant-element' >
        <div className='plant-info-container' >
          <img src={plant.image} className='plant-image' alt={plant.name} />
          <p>{plant.name?.toUpperCase()} x{findQuantity(garden, plant.plant_id)}</p>
        </div>
        <NavLink to={`/plants/${plant['plant_id']}`} >
          <button className='detail-button' >VIEW PLANT DETAILS</button>
        </NavLink>
      </div>
    );
  });

  return (
    <section className='list-container'>
      {plantElements}
    </section>
  );
}

export default List;