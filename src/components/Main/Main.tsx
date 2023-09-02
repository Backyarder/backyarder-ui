import Sidebar from '../Sidebar/Sidebar';
import Grid, { CellKeys } from '../Grid/Grid';
import Nav from '../Nav/Nav';
import List from '../List/List';
import { useEffect, useState } from 'react';
import { cellIDs } from '../Grid/cellIDs';
import './Main.scss';

export type GardenKeys = CellKeys[];

const Main = () => {
  const [garden, setGarden] = useState<GardenKeys | undefined>([]);
  const [isGardenView, setIsGardenView] = useState<boolean>(true);
  const [bullDoze, setBullDoze] = useState<boolean>(false);
  const [filterGarden, setFilterGarden] = useState<boolean>(false);

  // NOTE: will be updated with BE data next!
  useEffect(() => {
    setGarden(cellIDs);
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