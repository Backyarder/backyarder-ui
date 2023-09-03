import Sidebar from '../Sidebar/Sidebar';
import Grid, { CellKeys } from '../Grid/Grid';
import Nav from '../Nav/Nav';
import List from '../List/List';
import { useEffect, useState } from 'react';
import { getGarden } from '../../apiCalls';
import './Main.scss';

export type GardenKeys = CellKeys[];

type GetGardenKeys = {
  id: number
  type: string
  attributes: CellKeys[]
}

const Main = () => {
  const [garden, setGarden] = useState<GardenKeys | undefined>([]);
  const [isGardenView, setIsGardenView] = useState<boolean>(true);
  const [bullDoze, setBullDoze] = useState<boolean>(false);
  const [filterGarden, setFilterGarden] = useState<boolean>(false);
  // eslint-disable-next-line
  const [apiError, setApiError] = useState<string>('')

  // NOTE: will be updated with BE data next!
  useEffect(() => {
    getGarden()
      .then(data => {
        const cellData = data.data.map((cellData: GetGardenKeys) => cellData.attributes)
        setGarden(cellData)
      })
      .catch((err) => {
        handleApiError(err)
      })
  }, []);

  const handleApiError = (error: string) => {
    setApiError(error)
  }

  return (
    <main>
      <Sidebar />
      {isGardenView ? <Grid garden={garden} setGarden={setGarden} bullDoze={bullDoze} setBullDoze={setBullDoze} filterGarden={filterGarden} setFilterGarden={setFilterGarden} /> : <List garden={garden} />}
      <Nav isGardenView={isGardenView} setIsGardenView={setIsGardenView} setBullDoze={setBullDoze} setFilterGarden={setFilterGarden} />
    </main>
  );
}

export default Main;