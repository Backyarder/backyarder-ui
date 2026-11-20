import Sidebar from '../Sidebar/Sidebar';
import Grid, { CellKeys, CellChanges, ClearScope, Notice } from '../Grid/Grid';
import Nav from '../Nav/Nav';
import List from '../List/List';
import AlertBanner from '../AlertBanner/AlertBanner';
import SelectedCellPanel from '../CellActions/SelectedCellPanel';
import GardenAreas from '../GardenAreas/GardenAreas';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getGarden, getWishlist, addToWishlist, removeFromWishlist, getAlerts, Alerts, deleteContents, waterCell,
  GardenArea, NewPlot, getGardenAreas, createGardenArea, updateGardenArea, deleteGardenArea, setActiveGardenId } from '../../apiCalls';
import './Main.scss';

export type GardenKeys = CellKeys[];

type GetGardenKeys = {
  id: number
  type: string
  attributes: CellKeys
}

export type WishlistType = number; // plant_id

const AREA_KEY = 'backyarder:garden-area';
const savedAreaId = (): number | null => {
  try { const v = localStorage.getItem(AREA_KEY); return v ? Number(v) : null } catch { return null }
};

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
  const [areas, setAreas] = useState<GardenArea[]>([]);
  const [activeAreaId, setActiveAreaId] = useState<number | null>(null);
  const gardenRequest = useRef<number>(0);   // ignore a slow response for an area we've left
  // First load: show the page once plots and the grid are in, plus the
  // weather (or a short wait for it), so things don't pop in one by one.
  const [firstLoadDone, setFirstLoadDone] = useState<boolean>(false);
  const [alertsSettled, setAlertsSettled] = useState<boolean>(false);
  const [waitedForWeather, setWaitedForWeather] = useState<boolean>(false);
  const [slowLoad, setSlowLoad] = useState<boolean>(false);

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
    const ticket = ++gardenRequest.current;
    return getGarden()
      .then(data => { if (ticket === gardenRequest.current) setGarden(data.data.map((cell: GetGardenKeys) => cell.attributes)) })
      .catch((err: Error) => setApiError(err));
  }, []);

  // Counts on the area tabs (plants due) come from the server.
  const refreshAreas = useCallback(() => getGardenAreas().then(setAreas).catch(() => undefined), []);

  const openArea = useCallback((id: number) => {
    setActiveGardenId(id);
    setActiveAreaId(id);
    setOpenCellId(null);
    setConfirmClear(null);
    try { localStorage.setItem(AREA_KEY, String(id)) } catch {}
    return loadGarden();
  }, [loadGarden]);

  useEffect(() => {
    // Areas first so the grid opens on the one you used last.
    getGardenAreas()
      .then(list => {
        setAreas(list);
        const saved = savedAreaId();
        const first = list.find(a => a.id === saved) ?? list[0];
        if (first) return openArea(first.id);
        return loadGarden();
      })
      .catch(() => loadGarden())
      .finally(() => setFirstLoadDone(true));
    getWishlist()
      .then(setWishlist)
      .catch(() => setWishlist([]));
    // Weather for the banner; the banner itself is optional, so failures are silent.
    getAlerts()
      .then(setAlerts)
      .catch(() => undefined)
      .finally(() => setAlertsSettled(true));
    const weatherCap = window.setTimeout(() => setWaitedForWeather(true), 1200);
    const slow = window.setTimeout(() => setSlowLoad(true), 700);
    return () => { window.clearTimeout(weatherCap); window.clearTimeout(slow) };
  }, [loadGarden, openArea]);

  const ready = firstLoadDone && (alertsSettled || waitedForWeather);

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
    window.setTimeout(refreshAreas, 1500);
  }

  // Resolves once the new plot exists and its grid has loaded.
  const addArea = (plot: NewPlot): Promise<GardenArea> =>
    createGardenArea(plot).then(area => {
      setAreas(prev => [...prev, area]);
      return openArea(area.id).then(() => area);
    });

  const renameArea = (id: number, name: string): Promise<void> =>
    updateGardenArea(id, { name }).then(setAreas);

  // The menu waits for the server before showing the new choice.
  const setAreaIndoor = (id: number, indoor: boolean): Promise<void> =>
    updateGardenArea(id, { indoor })
      .then(list => { setAreas(list); loadGarden(); getAlerts().then(setAlerts).catch(() => undefined) })
      .catch((err: Error) => { refreshAreas(); throw err; });

  // Resolves once the plot is gone (and the next one is loaded); rejects
  // with the server's message so the plot bar can show it.
  const removeArea = (id: number): Promise<void> =>
    deleteGardenArea(id)
      .then(list => {
        setAreas(list);
        getAlerts().then(setAlerts).catch(() => undefined);
        if (id === activeAreaId && list[0]) return openArea(list[0].id).then(() => undefined);
      })
      .catch((err: Error) => { refreshAreas(); throw err; });

  const activeArea = areas.find(a => a.id === activeAreaId) ?? null;

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
        {!ready && slowLoad && (
          <div className='garden-loading' role='status'>
            <span className='material-symbols-rounded garden-loading-spinner' aria-hidden='true'>progress_activity</span>
            Loading your garden…
          </div>
        )}
        <div className={`garden-page ${ready ? 'ready' : ''}`} aria-busy={!ready}>
        {isDesktop && isGardenView && (
          <div className='banner-slot'>
            {alerts !== undefined || alertsSettled
              ? <AlertBanner garden={garden} alerts={alerts} area={activeArea} otherAreas={areas.filter(a => a.id !== activeAreaId)} />
              : <div className='banner-placeholder' aria-hidden='true' />}
          </div>
        )}
        {isDesktop && areas.length > 0 && (
          <GardenAreas
            areas={areas}
            activeId={activeAreaId}
            onSelect={openArea}
            onAdd={addArea}
            onRename={renameArea}
            onSetIndoor={setAreaIndoor}
            onDelete={removeArea}
          />
        )}
        <main>
          {isDesktop ?
            <>
              <Sidebar showUnavailable={() => setNotice('unavailable')} />
              {
                isGardenView
                ? <div className='grid-slot'><Grid
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
                    rows={activeArea?.rows}
                    cols={activeArea?.cols}
                  /></div>
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
        </div>
        </>
      )}
    </>
  );
}

export default Main;
