import { useMemo, useState } from 'react';
import Cell from '../Cell/Cell';
import Modal from '../Modal/Modal';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { cellIDs } from './cellIDs';
import { WateringType } from '../../apiCalls';
import { Relation, relation, neighbourIds } from '../../companions';
import './Grid.scss';

// One garden cell as the server describes it. The grid is the source of
// truth for every Cell; cells never keep a copy of this.
export type CellKeys = {
  location_id: string;
  image: string | undefined;
  name: string | undefined;
  content_type: string | undefined;
  plant_id: number | undefined;
  watering: keyof WateringType | undefined | null;
  status: string | number | null | undefined;
  updated_at: string | undefined;
  planted_at?: string | null;
  last_watered_at?: string | null;
  next_water_at?: string | null;
  needs_water?: boolean;
}

export type CellChanges = Partial<CellKeys>;
export type Notice = 'cleared' | 'unavailable';
export type ClearScope = 'all' | 'placed';

interface GridProps {
  garden: CellKeys[];
  updateCell: (locationId: string, changes: CellChanges) => void;
  resync: () => void;
  openCellId: string | null;
  setOpenCellId: (id: string | null) => void;
  showUnavailable: () => void;
  notice: Notice | null;
  clearNotice: () => void;
  confirmClear: ClearScope | null;
  onConfirmClear: () => void;
  onCancelClear: () => void;
}

const emptyCell = (location_id: string): CellKeys => ({
  location_id, image: undefined, name: undefined, content_type: undefined, plant_id: undefined,
  watering: undefined, status: 'empty', updated_at: undefined
});

// A cell being hovered with a dragged plant: where, and what plant.
export type DragHover = { id: string; plantName: string | null | undefined } | null;

const Grid = ({ garden, updateCell, resync, openCellId, setOpenCellId, showUnavailable, notice, clearNotice, confirmClear, onConfirmClear, onCancelClear }: GridProps) => {
  const byLocation = useMemo(() => new Map(garden.map(cell => [cell.location_id, cell])), [garden]);
  const [dragHover, setDragHover] = useState<DragHover>(null);

  // Companion planting hints: tint the neighbours of the cell in focus (its
  // popup is open, or a plant is being dragged over it) green or red.
  const companionHighlights = useMemo(() => {
    const focusId = dragHover?.id ?? openCellId;
    const plantName = dragHover ? dragHover.plantName : byLocation.get(openCellId ?? '')?.name;
    const map = new Map<string, Relation>();
    if (!focusId || !plantName) return map;
    neighbourIds(focusId).forEach(id => {
      const rel = relation(plantName, byLocation.get(id)?.name);
      if (rel) map.set(id, rel);
    });
    return map;
  }, [dragHover, openCellId, byLocation]);

  return (
    <section id='grid' className={openCellId ? 'disable-hover' : ''}>
      {cellIDs.map(({ id }) => (
        <Cell
          key={id}
          id={id}
          cell={byLocation.get(id) ?? emptyCell(id)}
          isOpen={openCellId === id}
          onOpen={() => setOpenCellId(id)}
          onClose={() => setOpenCellId(null)}
          updateCell={updateCell}
          resync={resync}
          showUnavailable={showUnavailable}
          companion={companionHighlights.get(id) ?? null}
          onDragHover={setDragHover}
        />
      ))}
      {confirmClear && <ConfirmModal fullClear={confirmClear === 'all'} onConfirm={onConfirmClear} onCancel={onCancelClear} />}
      {notice && <Modal alert={notice === 'cleared'} toggleModal={clearNotice} />}
    </section>
  );
}

export default Grid;
