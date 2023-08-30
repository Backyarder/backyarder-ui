import { useState } from 'react';
import Cell from '../Cell/Cell';
import Modal from '../Modal/Modal';
import './Grid.scss';
import { cellsMockData } from './cellsMockData';

const Grid = () => {
  const [modal, setModal] = useState<boolean>(false);

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const cells = cellsMockData.map(cell => <Cell id={cell.id} key={cell.id} openModal={openModal} />);

  return (
    <section id='grid'>
      {cells}
      {modal && <Modal closeModal={closeModal} />}
    </section>
  );
}

export default Grid;
