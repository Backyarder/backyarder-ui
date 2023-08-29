import './Main.scss';
import Sidebar from '../Sidebar/Sidebar';
import Grid from '../Grid/Grid';
import Nav from '../Nav/Nav';
import List from '../List/List';
import { useState } from 'react';
// import { Link } from 'react-router-dom';

const Main = () => {
  const [isGardenView, setIsGardenView] = useState<boolean>(true);

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