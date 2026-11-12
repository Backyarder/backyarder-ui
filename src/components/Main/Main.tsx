import Sidebar from '../Sidebar/Sidebar';
import Grid, { CellKeys } from '../Grid/Grid';
import Nav from '../Nav/Nav';
import List from '../List/List';
import { useEffect, useState } from 'react';
import { getGarden, getWishlist, addToWishlist, removeFromWishlist, getAlerts, Alerts } from '../../apiCalls';
import AlertBanner from '../AlertBanner/AlertBanner';
import './Main.scss';

export type GardenKeys = CellKeys[];

type GetGardenKeys = {
  id: number
  type: string
  attributes: CellKeys[]
}

export type lastUpdateType = {
  [key: string]: {
    updatedAt: string;
    status: string;
  };
}

export type WishlistType = number; // plant_id

const Main = () => {
  const [alert, setAlert] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [garden, setGarden] = useState<GardenKeys | undefined>([]);
  const [waterGarden, setWaterGarden] = useState<boolean>(false);
  const [isGardenView, setIsGardenView] = useState<boolean>(true);
  const [closeModals, setCloseModals] = useState<boolean>(false);
  const [bullDoze, setBullDoze] = useState<boolean>(false);
  const [filterGarden, setFilterGarden] = useState<boolean>(false);
  const [popUp, setPopUp] = useState<boolean>(false);
  const [fullClear, setFullClear] = useState<boolean>(false);
  // eslint-disable-next-line
  const [partialClear, setPartialClear] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  // eslint-disable-next-line
  const [apiError, setApiError] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<lastUpdateType>({});
  const [wishlist, setWishlist] = useState<WishlistType[]>([]);
  const [alerts, setAlerts] = useState<Alerts | undefined>();

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
    getWishlist()
      .then(setWishlist)
      .catch(() => setWishlist([]))
    // Weather for the banner; the banner itself is optional, so failures are silent.
    getAlerts()
      .then(setAlerts)
      .catch(() => undefined)
  }, []);

  // Optimistic toggle; the server copy is restored if the call fails.
  const toggleWishlist = (plantId: number | undefined): void => {
    if (plantId === undefined) return;
    const wasListed = wishlist.includes(plantId);
    setWishlist(prev => wasListed ? prev.filter(id => id !== plantId) : [...prev, plantId]);
    (wasListed ? removeFromWishlist(plantId) : addToWishlist(plantId))
      .catch(() => setWishlist(prev => wasListed ? [...prev, plantId] : prev.filter(id => id !== plantId)));
  }

  useEffect(() => {
    for (let letter = 'A'.charCodeAt(0); letter <= 'J'.charCodeAt(0); letter++) {
      for (let number = 1; number <= 10; number++) {
        const key = String.fromCharCode(letter) + number;
        (lastUpdate as lastUpdateType)[key] = {
          updatedAt: '10/10/2000 10:10',
          status: 'empty'
        };
      }
    }
    // eslint-disable-next-line
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
        <>
        {isDesktop && isGardenView && <AlertBanner garden={garden} alerts={alerts} />}
        <main>
          {isDesktop ?
            <>
              <Sidebar modal={modal} setModal={setModal} />
              {
                isGardenView
                ? <Grid popUp={popUp} closeModals={closeModals} setCloseModals={setCloseModals} fullClear={fullClear} reset={reset} alert={alert} setAlert={setAlert} modal={modal} setModal={setModal} garden={garden} setGarden={setGarden} waterGarden={waterGarden} bullDoze={bullDoze} setBullDoze={setBullDoze} filterGarden={filterGarden} setFilterGarden={setFilterGarden} lastUpdate={lastUpdate} setLastUpdate={setLastUpdate} />
                : <List garden={garden} wishlist={wishlist} toggleWishlist={toggleWishlist} />
              }
              <Nav reset={reset} waterGarden={waterGarden} setWaterGarden={setWaterGarden} setCloseModals={setCloseModals} handleFullClear={handleFullClear} handlePartialClear={handlePartialClear} isGardenView={isGardenView} setIsGardenView={setIsGardenView} />
            </>
            : <div className="mobile-message">
                Please switch to a larger device to use this app.
              </div>
          }
        </main>
        </>
      )}
    </>
  );
}

export default Main;