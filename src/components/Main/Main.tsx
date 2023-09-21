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
  const [alert, setAlert] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [garden, setGarden] = useState<GardenKeys | undefined>([]);
  const [isGardenView, setIsGardenView] = useState<boolean>(true);
  const [bullDoze, setBullDoze] = useState<boolean>(false);
  const [filterGarden, setFilterGarden] = useState<boolean>(false);
  const [popUp, setPopUp] = useState<boolean>(false);
  const [fullClear, setFullClear] = useState<boolean>(false);
  // eslint-disable-next-line
  const [partialClear, setPartialClear] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true)
  // eslint-disable-next-line
  const [apiError, setApiError] = useState<string>('')

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 1048 && window.innerHeight > 600);
    };

    // Check screen size on page load
    checkScreenSize();

    // Attach event listener to update screen size on resize
    window.addEventListener('resize', checkScreenSize);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

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

  const reset = (): void => {
    setPopUp(false);
    setFullClear(false);
    setPartialClear(false);
  }

  const handleFullClear = (): void => {
    setPopUp(true);
    setFullClear(true);
    setPartialClear(false);
  }

  const handlePartialClear = (): void => {
    setPopUp(true);
    setPartialClear(true);
    setFullClear(false);
  }

  return (
    <>
      {apiError ? (
        <div className='server-error'>
          <h2>Oh no! The weather isn't cooperating!</h2>
          <span className="material-symbols-rounded">thunderstorm</span>
          <p>There was an error on our end, please try again later</p>
        </div>
      ) : (
        <main>
          {isDesktop ?
            <>
              <Sidebar modal={modal} setModal={setModal} />
              {isGardenView ? <Grid popUp={popUp} setPopUp={setPopUp} fullClear={fullClear} setFullClear={setFullClear} setPartialClear={setPartialClear} reset={reset} alert={alert} setAlert={setAlert} modal={modal} setModal={setModal} garden={garden} setGarden={setGarden} bullDoze={bullDoze} setBullDoze={setBullDoze} filterGarden={filterGarden} setFilterGarden={setFilterGarden} /> : <List garden={garden} />}
              <Nav reset={reset} handleFullClear={handleFullClear} handlePartialClear={handlePartialClear} isGardenView={isGardenView} setIsGardenView={setIsGardenView} />
            </>
            : <div className="mobile-message">
                Please switch to a larger device to use this app.
              </div>
          }
        </main>
      )}
    </>
  );
}

export default Main;