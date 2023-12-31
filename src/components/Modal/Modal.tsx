import './Modal.scss';

type ModalProps = {
  alert: boolean;
  toggleModal: () => void;
}

const Modal = ({ alert, toggleModal }: ModalProps) => {
  return (
    <div className='modal-overlay' >
      <div className='modal' >
        {!alert && <p className='modal-text' >Sorry! Cell is unavailable for planting.</p>}
        {alert && <p className='modal-text' >Items cleared.</p>}
        <span className="material-symbols-rounded modal-icon">potted_plant</span>
        <button className='modal-button' onClick={toggleModal} >Close</button>
      </div>
    </div>
  );
}

export default Modal;