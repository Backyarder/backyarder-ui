import './Modal.scss';

type ModalProps = {
  closeModal: () => void;
}

const Modal = ({ closeModal }: ModalProps) => {
  return (
    <div className='modal-overlay' >
      <div className='modal' >
        <p>Sorry! Cell is unavailable for planting.</p>
        <button className='modal-button' onClick={closeModal} >Close</button>
      </div>
    </div>
  );
}

export default Modal;