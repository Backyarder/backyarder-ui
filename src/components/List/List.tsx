import { listMockData } from './listMockData';
import { NavLink } from 'react-router-dom';
import './List.scss';

type Plant = {
  'plant_name': string,
  'plant_id': number
};

const List = () => {
  const findQuantity = (array: Plant[], id: number): number => {
    let count = 0;
    for (const element of array) {
      if (element['plant_id'] === id) {
        count++;
      }
    }
    return count;
  }

  const uniquePlants = listMockData.reduce((array: Plant[], plant: Plant): Plant[] => {
    if (!array.some(item => item['plant_id'] === plant['plant_id'])) {
      array.push(plant);
    }
    return array;
  }, []);

  const plantElements: JSX.Element[] = uniquePlants.map(plant => {
    return (
      <div key={plant['plant_id']} className='plant-element' >
        <p>{plant['plant_name']} x{findQuantity(listMockData, plant['plant_id'])}</p>
        <NavLink to={`/plants/${plant['plant_id']}`} >
          <button>VIEW PLANT DETAILS</button>
        </NavLink>
      </div>
    );
  });

  return (
    <section>
      {plantElements}
    </section>
  );
}

export default List;