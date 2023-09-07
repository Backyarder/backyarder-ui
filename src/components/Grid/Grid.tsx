import { useEffect, useState } from 'react';
import Cell from '../Cell/Cell';
import Modal from '../Modal/Modal';
import { GardenKeys } from '../Main/Main';
import { cellIDs } from './cellIDs';
import './Grid.scss';

export interface GridProps {
  garden: GardenKeys | undefined;
  setGarden: Function;
  bullDoze: boolean;
  setBullDoze: Function;
  filterGarden: boolean;
  setFilterGarden: Function;
}

interface AdditionalProps {
  alert: boolean;
  setAlert: Function;
}

type CombinedProps = GridProps & AdditionalProps;

export type CellKeys = {
  location_id: string;
  image: string | undefined;
  plant_name: string | undefined;
  plant_id: number | undefined;
  status: string | number | null | undefined;
}

const Grid = ({ alert, setAlert, garden, setGarden, bullDoze, setBullDoze, filterGarden, setFilterGarden }: CombinedProps) => {
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    if (alert) {
      setModal(true);
    }
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
        bullDoze={bullDoze}
        setBullDoze={setBullDoze}
        filterGarden={filterGarden}
        setFilterGarden={setFilterGarden}
        toggleModal={toggleModal}
      />
    );
  });

  return (
    <section id='grid'>
      {cells}
      {modal && <Modal alert={alert} bullDoze={bullDoze} filterGarden={filterGarden} toggleModal={toggleModal} />}
    </section>
  );
}

export default Grid;
