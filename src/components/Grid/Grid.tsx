import { useState } from 'react';
import Cell from '../Cell/Cell';
import Modal from '../Modal/Modal';
import './Grid.scss';
import { cellsMockData } from './cellsMockData';

const Grid = () => {
  const [modal, setModal] = useState<boolean>(false);

  const toggleModal = (): void => {
    setModal(!modal);
  }

  const cells = cellsMockData.map(cell => <Cell id={cell.id} key={cell.id} toggleModal={toggleModal} />);

  return (
    <section id='grid'>
      {cells}
      {modal && <Modal toggleModal={toggleModal} />}
    </section>
  );
}

export default Grid;
