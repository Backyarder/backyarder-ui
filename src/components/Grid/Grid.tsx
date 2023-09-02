import { useState } from 'react';
import Cell from '../Cell/Cell';
import Modal from '../Modal/Modal';
import './Grid.scss';
import { cellsMockData } from './cellsMockData';

export interface GridProps {
  bullDoze: boolean;
  setBullDoze: Function;
  filterGarden: boolean;
  setFilterGarden: Function;
}

const Grid = ({ bullDoze, setBullDoze, filterGarden, setFilterGarden }: GridProps) => {
  const [modal, setModal] = useState<boolean>(false);

  const handleClick = () => {
    console.log('watered')
  }

  const toggleModal = (): void => {
    setModal(!modal);
  }

  const cells = cellsMockData.map(cell => <Cell id={cell.id} key={cell.id} toggleModal={toggleModal} bullDoze={bullDoze} setBullDoze={setBullDoze} filterGarden={filterGarden} setFilterGarden={setFilterGarden} />);

  return (
    <div id='middleContainer' onClick={handleClick}>
      <button id='waterAllBtn'>
        <span id='waterAllIcon' className="material-symbols-rounded">
            water_drop
        </span>
        WATER ENTIRE GARDEN!
      </button>
      <section id='grid'>
        {cells}
        {modal && <Modal toggleModal={toggleModal} />}
      </section>
    </div>
  );
}

export default Grid;
