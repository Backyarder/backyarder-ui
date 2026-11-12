import { useMemo } from 'react';
import Cell from '../Cell/Cell';
import Modal from '../Modal/Modal';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { cellIDs } from './cellIDs';
import { WateringType } from '../../apiCalls';
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

const Grid = ({ garden, updateCell, resync, openCellId, setOpenCellId, showUnavailable, notice, clearNotice, confirmClear, onConfirmClear, onCancelClear }: GridProps) => {
  const byLocation = useMemo(() => new Map(garden.map(cell => [cell.location_id, cell])), [garden]);

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
        />
      ))}
      {confirmClear && <ConfirmModal fullClear={confirmClear === 'all'} onConfirm={onConfirmClear} onCancel={onCancelClear} />}
      {notice && <Modal alert={notice === 'cleared'} toggleModal={clearNotice} />}
    </section>
  );
}

export default Grid;
