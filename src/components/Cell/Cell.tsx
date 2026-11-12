import { useEffect, useState } from 'react';
import { useDrop, useDrag, DragPreviewImage } from 'react-dnd';
import { CellKeys, CellChanges } from '../Grid/Grid';
import CellActions from '../CellActions/CellActions';
import { patchCellContents, patchDisabledOrRemoved, waterCell, PlacedPlant } from '../../apiCalls';
import { FALLBACK_IMAGE } from '../../imageFallback';
import './Cell.scss'

// A cell renders the record the grid hands it and asks the grid to change it.
// The only local state is presentation: a watering timer and a broken-image flag.
interface CellProps {
  id: string;
  cell: CellKeys;
  isOpen: boolean;                 // the actions popup is showing for this cell
  onOpen: () => void;
  onClose: () => void;
  updateCell: (locationId: string, changes: CellChanges) => void;
  resync: () => void;              // reload the garden after a failed request
  showUnavailable: () => void;     // "Sorry! Cell is unavailable for planting."
}

export type DragItem = { plant: PlacedPlant; fromCell?: string };

// setTimeout overflows past ~24.8 days; clamp and re-check on the next mount.
const MAX_TIMEOUT_MS = 2 ** 31 - 1

const EMPTIED: CellChanges = {
  image: undefined, name: undefined, content_type: undefined, plant_id: undefined, watering: undefined,
  status: 'empty', planted_at: null, last_watered_at: null, next_water_at: null, needs_water: false
}

// Care fields from a PATCH /cell response, when the server sent any.
const careFrom = (data: any): CellChanges => {
  const attrs = data?.data?.attributes;
  if (!attrs) return {};
  return { planted_at: attrs.planted_at, last_watered_at: attrs.last_watered_at, next_water_at: attrs.next_water_at, needs_water: attrs.needs_water };
}

const Cell = ({ id, cell, isOpen, onOpen, onClose, updateCell, resync, showUnavailable }: CellProps) => {
  const isDisabled = cell.status === 'disabled';
  const isPlanted = cell.status === 'locked';
  const isPopulated = !!cell.name && (cell.status === 'placed' || cell.status === 'locked');
  const isPlant = cell.content_type === 'Plant';
  const onWateringSchedule = isPlanted && isPlant && !!cell.watering && cell.watering !== 'None';

  // Flip the alert on when next_water_at passes while the page is open.
  const [dueByTimer, setDueByTimer] = useState<boolean>(false);
  useEffect(() => {
    setDueByTimer(false);
    if (!isPlanted || !cell.next_water_at) return;
    const delay = new Date(cell.next_water_at).getTime() - Date.now();
    if (delay <= 0) {
      setDueByTimer(true);
      return;
    }
    const timer = setTimeout(() => setDueByTimer(true), Math.min(delay, MAX_TIMEOUT_MS));
    return () => clearTimeout(timer);
  }, [cell.next_water_at, isPlanted]);
  const needsWatering = isPlanted && (!!cell.needs_water || dueByTimer);

  // background-image has no onerror, so probe the URL and fall back to the
  // line drawing when it is dead (expired CDN link, missing snapshot).
  const [imageBroken, setImageBroken] = useState<boolean>(false);
  useEffect(() => {
    setImageBroken(false);
    if (!cell.image) return;
    const probe = new Image();
    probe.onerror = () => setImageBroken(true);
    probe.src = cell.image;
    return () => { probe.onerror = null; };
  }, [cell.image]);

  // --- actions: change the grid first, then tell the server -----------------

  const apply = (changes: CellChanges) => updateCell(id, changes);

  const place = (plant: PlacedPlant) => {
    const placed: CellChanges = {
      image: plant.image ?? undefined, name: plant.name ?? undefined, content_type: plant.content_type ?? undefined,
      plant_id: plant.plant_id ?? undefined, watering: plant.watering ?? undefined,
      status: 'placed', planted_at: null, last_watered_at: null, next_water_at: null, needs_water: false
    };
    apply(placed);
    patchCellContents(placed, id, 'placed', placed.watering).then(data => apply(careFrom(data))).catch(resync);
  }

  const plant = () => {
    apply({ status: 'locked', needs_water: false });
    patchCellContents(cell, id, 'locked', cell.watering).then(data => apply(careFrom(data))).catch(resync);
  }

  const water = () => {
    if (!onWateringSchedule) return;
    setDueByTimer(false);
    apply({ needs_water: false });
    waterCell(id).then(data => apply(careFrom(data))).catch(resync);
  }

  const remove = () => {
    apply(EMPTIED);
    patchDisabledOrRemoved(id, 'empty').catch(resync);
  }

  const toggleDisabled = () => {
    const next = isDisabled ? 'empty' : 'disabled';
    apply({ ...EMPTIED, status: next });
    patchDisabledOrRemoved(id, next).catch(resync);
  }

  // --- drag and drop ----------------------------------------------------------

  const [{ isOver }, dropRef] = useDrop<DragItem, { location_id: string }, { isOver: boolean }>(() => ({
    accept: 'plant',
    canDrop: () => !isDisabled && !isPlanted,
    drop: (item) => {
      if (item.fromCell !== id) place(item.plant);
      return { location_id: id };
    },
    collect: (monitor) => ({ isOver: monitor.isOver() })
  }), [id, isDisabled, isPlanted, cell]);

  const [{ isDragging }, dragRef, preview] = useDrag<DragItem, { location_id: string }, { isDragging: boolean }>(() => ({
    type: 'plant',
    canDrag: () => isPopulated && !isPlanted,
    item: { plant: cell, fromCell: id },
    end: (_item, monitor) => {
      const result = monitor.getDropResult();
      if (!monitor.didDrop() && monitor.getTargetIds().length) {
        showUnavailable();
      } else if (monitor.didDrop() && result && result.location_id !== id) {
        remove(); // moved to another cell
      }
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  }), [id, cell, isPopulated, isPlanted]);

  const handleClick = () => {
    if (isPopulated) {
      onOpen();
    } else {
      toggleDisabled();
    }
  }

  // --- presentation ---------------------------------------------------------

  const hoverStyle = isOver && !isDisabled && {
    transform: 'scale(1.3)',
    backgroundColor: '#9EC924'
  }

  const borderStyle = isPlant
    ? !needsWatering && isPlanted ? 'solid #9EC924 3px' : 'solid #f4f4f4 3px'
    : isPlanted ? 'solid #786961 3px' : 'solid #f4f4f4 3px'

  const divStyle = !isDisabled && {
    backgroundImage: isPopulated ? `url(${imageBroken || !cell.image ? FALLBACK_IMAGE : cell.image})` : undefined,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    border: borderStyle
  };

  const className = [
    'cell',
    isDisabled ? 'disabled' : '',
    needsWatering ? 'watering-alert' : '',
    isOpen ? 'disable-scale' : ''
  ].filter(Boolean).join(' ');

  // One <div> for every state so the DOM node survives a cell filling or
  // emptying (drag-and-drop, and anything holding a reference to it).
  return (
    <>
      {isPopulated && !isDragging && (
        <DragPreviewImage connect={preview} src={`${process.env.PUBLIC_URL}/images/${isPlant ? 'plant' : 'umbrella'}.png`} />
      )}
      <div
        id={id}
        data-tooltip={isPopulated ? `${cell.name}` : undefined}
        className={className}
        style={{ ...divStyle, ...hoverStyle }}
        onClick={handleClick}
        ref={(node) => {
          dropRef(node)
          dragRef(node)
        }}
      >
        {isPopulated && <span className={`cell-tooltip-text ${isOpen ? 'hidden' : ''}`}>{`${cell.name}`}</span>}
        {isPopulated && isOpen && <div className='cell-modal'>
          <CellActions
            image={cell.image}
            name={cell.name}
            contentType={cell.content_type}
            plantId={cell.plant_id}
            isPlanted={isPlanted}
            onPlant={plant}
            onWater={water}
            onRemove={remove}
            onClose={onClose}
          />
        </div>}
      </div>
    </>
  );
}

export default Cell;
