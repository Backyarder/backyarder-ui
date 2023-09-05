import './Modal.scss';

type ModalProps = {
  alert: boolean;
  bullDoze: boolean;
  filterGarden: boolean;
  toggleModal: () => void;
}

const Modal = ({ alert, bullDoze, filterGarden, toggleModal }: ModalProps) => {
  return (
    <div className='modal-overlay' >
      <div className='modal' >
        {!alert && <p>Sorry! Cell is unavailable for planting.</p>}
        {alert && <p>Garden cleared.</p>}
        <span className="material-symbols-rounded modal-icon">potted_plant</span>
        <button className='modal-button' onClick={toggleModal} >Close</button>
      </div>
    </div>
  );
}

export default Modal;