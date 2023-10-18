import { useEffect, useState } from 'react';
import Cell from '../Cell/Cell';
import Modal from '../Modal/Modal';
import { GardenKeys, lastUpdateType } from '../Main/Main';
import { cellIDs } from './cellIDs';
import './Grid.scss';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { WateringType } from '../../apiCalls';

export interface GridProps {
  garden: GardenKeys | undefined;
  setGarden: Function;
  waterGarden: boolean;
  closeModals: boolean;
  bullDoze: boolean;
  setBullDoze: Function;
  filterGarden: boolean;
  setFilterGarden: Function;
  lastUpdate: lastUpdateType;
  setLastUpdate: Function;
}

interface AdditionalProps {
  setCloseModals: Function;
  popUp: boolean;
  fullClear: boolean;
  reset: () => void;
  alert: boolean;
  setAlert: Function;
  modal: boolean;
  setModal: Function;
}

type CombinedProps = GridProps & AdditionalProps;

export type CellKeys = {
  location_id: string;
  image: string | undefined;
  name: string | undefined;
  content_type: string | undefined;
  plant_id: number | undefined;
  watering: keyof WateringType
  status: string | number | null | undefined;
  updated_at: string | undefined;
}

const Grid = ({ popUp, closeModals, setCloseModals, fullClear, reset, alert, setAlert, modal, setModal, garden, setGarden, waterGarden, bullDoze, setBullDoze, filterGarden, setFilterGarden, lastUpdate, setLastUpdate }: CombinedProps) => {
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0});
  const [drop, setDrop] = useState<{ x: number; y: number }>({ x: 0, y: 0});

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setDrop({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (alert) {
      setModal(true);
    }
    // eslint-disable-next-line
  }, [alert])

  useEffect(() => {
    if (closeModals) {
      let grid = document.querySelector('#grid');
      let cells = document.querySelectorAll('.cell');

      grid?.classList.remove('disable-hover');
      cells.forEach(cell => {
        cell.classList.remove('disable-scale');
      });
    }
  }, [closeModals])

  const toggleModal = (): void => {
    setAlert(false);
    setModal(!modal);
    if (bullDoze || filterGarden) {
      setBullDoze(false);
      setFilterGarden(false);
    }
  }

  const cells = garden?.map((cell, i) => {
    return (
      <Cell
        key={cell.location_id}
        id={cellIDs[i].id}
        garden={garden}
        setGarden={setGarden}
        handleMouseDown={(e) => handleMouseDown(e)}
        handleMouseUp={(e) => handleMouseUp(e)}
        dragStart={dragStart}
        drop={drop}
        waterGarden={waterGarden}
        closeModals={closeModals}
        bullDoze={bullDoze}
        setBullDoze={setBullDoze}
        filterGarden={filterGarden}
        setFilterGarden={setFilterGarden}
        toggleModal={toggleModal}
        lastUpdate={lastUpdate}
        setLastUpdate={setLastUpdate}
      />
    );
  });

  return (
    <section id='grid'>
      {cells}
      {popUp && <ConfirmModal setCloseModals={setCloseModals} fullClear={fullClear} reset={reset} setBullDoze={setBullDoze} setFilterGarden={setFilterGarden} setAlert={setAlert} />}
      {modal && <Modal alert={alert} toggleModal={toggleModal} />}
    </section>
  );
}

export default Grid;
