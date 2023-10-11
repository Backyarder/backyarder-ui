import { useEffect } from 'react';
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
  bullDoze: boolean;
  setBullDoze: Function;
  filterGarden: boolean;
  setFilterGarden: Function;
  lastUpdate: lastUpdateType;
  setLastUpdate: Function;
}

interface AdditionalProps {
  popUp: boolean;
  setPopUp: Function;
  fullClear: boolean;
  setFullClear: Function;
  setPartialClear: Function;
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
  plant_name: string | undefined;
  plant_id: number | undefined;
  watering: keyof WateringType
  status: string | number | null | undefined;
  updated_at: string | undefined;
}

const Grid = ({ popUp, setPopUp, fullClear, setFullClear, setPartialClear, reset, alert, setAlert, modal, setModal, garden, setGarden, waterGarden, bullDoze, setBullDoze, filterGarden, setFilterGarden, lastUpdate, setLastUpdate }: CombinedProps) => {

  useEffect(() => {
    if (alert) {
      setModal(true);
    }
    // eslint-disable-next-line
  }, [alert])

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
        waterGarden={waterGarden}
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
      {popUp && <ConfirmModal fullClear={fullClear} reset={reset} setBullDoze={setBullDoze} setFilterGarden={setFilterGarden} setAlert={setAlert} />}
      {modal && <Modal alert={alert} bullDoze={bullDoze} filterGarden={filterGarden} toggleModal={toggleModal} />}
    </section>
  );
}

export default Grid;
