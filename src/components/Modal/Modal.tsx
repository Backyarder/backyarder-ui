import './Modal.scss';

type ModalProps = {
  toggleModal: () => void;
}

const Modal = ({ toggleModal }: ModalProps) => {
  return (
    <div className='modal-overlay' >
      <div className='modal' >
        <p>Sorry! Cell is unavailable for planting.</p>
        <button className='modal-button' onClick={toggleModal} >Close</button>
      </div>
    </div>
  );
}

export default Modal;