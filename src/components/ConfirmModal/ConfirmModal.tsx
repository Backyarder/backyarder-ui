import { deleteContents } from '../../apiCalls';
import './ConfirmModal.scss';

interface ConfirmProps {
  setCloseModals: Function;
  fullClear: boolean;
  reset: () => void;
  setBullDoze: Function;
  setFilterGarden: Function;
  setAlert: Function;
}

const ConfirmModal = ({ setCloseModals, fullClear, reset, setBullDoze, setFilterGarden, setAlert }: ConfirmProps) => {

  const handleDelete = (): void => {
    if (fullClear) {
      deleteContents('all', setBullDoze, setAlert);
    } else {
      deleteContents('garden', setFilterGarden, setAlert);
    }
    reset();
  }

  return (
    <div className='confirm-modal-overlay' >
      <div className='confirm-modal' >
        {fullClear && <p className='confirm-message'>Are you sure you wish to clear your garden? This action cannot be undone.</p>}
        {!fullClear && <p className='confirm-message'>Are you sure you wish to remove your unplanted items? This action cannot be undone.</p>}
        <div className='pop-up-button-container'>
          <button className='pop-up-button' onClick={() => {
            setCloseModals(false);
            handleDelete();
          }} >YES</button>
          <button className='pop-up-button' onClick={() => {
            setCloseModals(false);
            reset();
          }} >NO</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;