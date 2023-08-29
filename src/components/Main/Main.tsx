import './Main.scss';
import Sidebar from '../Sidebar/Sidebar';
import Grid from '../Grid/Grid';
import Nav from '../Nav/Nav';
import List from '../List/List';
import { useState } from 'react';
// import { patchGarden } from '../../apiCalls';
// import { Link } from 'react-router-dom';

// type GardenKeys = {
//   id: string,
//   'plant_name': string,
//   status: number,
//   'plant_id': number,
//   image: string
// }[];

const Main = () => {
  // const [garden, setGarden] = useState<GardenKeys>([]);
  const [isGardenView, setIsGardenView] = useState<boolean>(true);
  // const [error, setError] = useState<string>('');

  // useEffect(() => {
  //   if (garden) {
  //     patchGarden(garden)
  //     .then(res => {
  //       if (!res.ok) {
  //         throw Error('There has been an error.')
  //       }
  //       return res.json()
  //     })
  //     .then(data => {
  //       setGarden([])
  //       setError('')
  //     })
  //     .catch(err => setError(err));
  //   }
  // }, [garden]);

  // const clearGarden = (garden: GardenKeys) : void => {
  //   setGarden(garden);
  // };

  return (
    <main>
      <Sidebar />
      {isGardenView ? <Grid /> : <List />}
      <Nav isGardenView={isGardenView} setIsGardenView={setIsGardenView} />
      {/* <Link to='/plants'>See Plant Details Page</Link> */}
    </main>
  );
}

export default Main;