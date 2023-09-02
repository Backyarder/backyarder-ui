import { useState } from 'react';
import Cell from '../Cell/Cell';
import Modal from '../Modal/Modal';
import { GardenKeys } from '../Main/Main';
import './Grid.scss';
// import { cellIDs } from './cellIDs';

export interface GridProps {
  garden: GardenKeys | undefined;
  setGarden: Function;
  bullDoze: boolean;
  setBullDoze: Function;
  filterGarden: boolean;
  setFilterGarden: Function;
}

export type CellKeys = {
  id: string;
  image: string | undefined;
  name: string | undefined;
  'plant_id': number | undefined;
  status: number | null;
}

const Grid = ({ garden, setGarden, bullDoze, setBullDoze, filterGarden, setFilterGarden }: GridProps) => {
  const [modal, setModal] = useState<boolean>(false);

  const toggleModal = (): void => {
    setModal(!modal);
  }

  const cells = garden?.map(cell => {
    return (
      <Cell
        key={cell.id}
        id={cell.id}
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
      {modal && <Modal toggleModal={toggleModal} />}
    </section>
  );
}

export default Grid;
