import Sidebar from '../Sidebar/Sidebar';
import Grid, { CellKeys } from '../Grid/Grid';
import Nav from '../Nav/Nav';
import List from '../List/List';
import { useEffect, useState } from 'react';
import { cellsMockData } from '../Grid/cellsMockData';
import './Main.scss';

export type GardenKeys = CellKeys[];

const Main = () => {
  const [garden, setGarden] = useState<GardenKeys | undefined>([]);
  const [isGardenView, setIsGardenView] = useState<boolean>(true);
  const [bullDoze, setBullDoze] = useState<boolean>(false);
  const [filterGarden, setFilterGarden] = useState<boolean>(false);

  useEffect(() => {
    setGarden(cellsMockData);
  }, []);

  return (
    <main>
      <Sidebar />
      {isGardenView ? <Grid garden={garden} setGarden={setGarden} bullDoze={bullDoze} setBullDoze={setBullDoze} filterGarden={filterGarden} setFilterGarden={setFilterGarden} /> : <List garden={garden} />}
      <Nav isGardenView={isGardenView} setIsGardenView={setIsGardenView} setBullDoze={setBullDoze} setFilterGarden={setFilterGarden} />
    </main>
  );
}

export default Main;