import Sidebar from '../Sidebar/Sidebar';
import Grid, { CellKeys, CellChanges, ClearScope, Notice } from '../Grid/Grid';
import Nav from '../Nav/Nav';
import List from '../List/List';
import AlertBanner from '../AlertBanner/AlertBanner';
import SelectedCellPanel from '../CellActions/SelectedCellPanel';
import { useCallback, useEffect, useState } from 'react';
import { getGarden, getWishlist, addToWishlist, removeFromWishlist, getAlerts, Alerts, deleteContents, waterCell } from '../../apiCalls';
import './Main.scss';

export type GardenKeys = CellKeys[];

type GetGardenKeys = {
  id: number
  type: string
  attributes: CellKeys
}

export type WishlistType = number; // plant_id

// Everything a cell forgets when it is emptied.
const EMPTIED: CellChanges = {
  image: undefined, name: undefined, content_type: undefined, plant_id: undefined, watering: undefined,
  status: 'empty', planted_at: null, last_watered_at: null, next_water_at: null, needs_water: false
};

// Main owns the garden. Cells, the list and the banner all read from this one
// array; cells change it through updateCell and the server is told alongside.
const Main = () => {
  const [garden, setGarden] = useState<GardenKeys>([]);
  const [apiError, setApiError] = useState<Error | null>(null);
  const [isGardenView, setIsGardenView] = useState<boolean>(true);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const [openCellId, setOpenCellId] = useState<string | null>(null);   // which cell's actions popup is open
  const [notice, setNotice] = useState<Notice | null>(null);           // "Items cleared." / "Cell is unavailable"
  const [confirmClear, setConfirmClear] = useState<ClearScope | null>(null);
  const [wishlist, setWishlist] = useState<WishlistType[]>([]);
  const [alerts, setAlerts] = useState<Alerts | undefined>();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 1048 && window.innerHeight > 600);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const loadGarden = useCallback(() => {
    return getGarden()
      .then(data => setGarden(data.data.map((cell: GetGardenKeys) => cell.attributes)))
      .catch((err: Error) => setApiError(err));
  }, []);

  useEffect(() => {
    loadGarden();
    getWishlist()
      .then(setWishlist)
      .catch(() => setWishlist([]));
    // Weather for the banner; the banner itself is optional, so failures are silent.
    getAlerts()
      .then(setAlerts)
      .catch(() => undefined);
  }, [loadGarden]);

  const updateCell = useCallback((locationId: string, changes: CellChanges) => {
    setGarden(prev => prev.map(cell => cell.location_id === locationId ? { ...cell, ...changes } : cell));
  }, []);

  // Optimistic toggle; the server copy is restored if the call fails.
  const toggleWishlist = (plantId: number | undefined): void => {
    if (plantId === undefined) return;
    const wasListed = wishlist.includes(plantId);
    setWishlist(prev => wasListed ? prev.filter(id => id !== plantId) : [...prev, plantId]);
    (wasListed ? removeFromWishlist(plantId) : addToWishlist(plantId))
      .catch(() => setWishlist(prev => wasListed ? [...prev, plantId] : prev.filter(id => id !== plantId)));
  }

  // WATER GARDEN: every planted plant on a schedule.
  const waterGarden = () => {
    garden
      .filter(cell => cell.status === 'locked' && cell.content_type === 'Plant' && cell.watering && cell.watering !== 'None')
      .forEach(cell => {
        updateCell(cell.location_id, { needs_water: false });
        waterCell(cell.location_id)
          .then(data => {
            const attrs = data?.data?.attributes;
            if (attrs) updateCell(cell.location_id, { planted_at: attrs.planted_at, last_watered_at: attrs.last_watered_at, next_water_at: attrs.next_water_at, needs_water: attrs.needs_water });
          })
          .catch(loadGarden);
      });
  }

  const askToClear = (scope: ClearScope) => {
    setOpenCellId(null);
    setConfirmClear(scope);
  }

  // The server empties the same cells (DELETE /all or /garden), so mirror it
  // locally instead of refetching.
  const confirmClearGarden = () => {
    const scope = confirmClear;
    setConfirmClear(null);
    if (!scope) return;
    deleteContents(scope === 'all' ? 'all' : 'garden')
      .then(() => {
        setGarden(prev => prev.map(cell => (scope === 'all' || cell.status === 'placed') ? { ...cell, ...EMPTIED } : cell));
        setNotice('cleared');
      })
      .catch(loadGarden);
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
              <Sidebar showUnavailable={() => setNotice('unavailable')} />
              {
                isGardenView
                ? <Grid
                    garden={garden}
                    updateCell={updateCell}
                    resync={loadGarden}
                    openCellId={openCellId}
                    setOpenCellId={setOpenCellId}
                    showUnavailable={() => setNotice('unavailable')}
                    notice={notice}
                    clearNotice={() => setNotice(null)}
                    confirmClear={confirmClear}
                    onConfirmClear={confirmClearGarden}
                    onCancelClear={() => setConfirmClear(null)}
                  />
                : <List garden={garden} wishlist={wishlist} toggleWishlist={toggleWishlist} />
              }
              <Nav
                panel={isGardenView && openCellId && garden.find(c => c.location_id === openCellId)?.name
                  ? <SelectedCellPanel cell={garden.find(c => c.location_id === openCellId)!} updateCell={updateCell} resync={loadGarden} onClose={() => setOpenCellId(null)} />
                  : null}
                reset={() => setConfirmClear(null)}
                onWaterGarden={waterGarden}
                handleFullClear={() => askToClear('all')}
                handlePartialClear={() => askToClear('placed')}
                isGardenView={isGardenView}
                setIsGardenView={setIsGardenView}
              />
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
