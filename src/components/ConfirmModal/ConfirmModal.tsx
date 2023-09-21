import { deleteContents } from '../../apiCalls';
import './ConfirmModal.scss';

interface ConfirmProps {
  setPopUp: Function;
  fullClear: boolean;
  setFullClear: Function;
  setPartialClear: Function;
  reset: () => void;
  setBullDoze: Function;
  setFilterGarden: Function;
  setAlert: Function;
}

const ConfirmModal = ({ setPopUp, fullClear, setFullClear, setPartialClear, reset, setBullDoze, setFilterGarden, setAlert }: ConfirmProps) => {

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
          <button className='pop-up-button' onClick={handleDelete} >YES</button>
          <button className='pop-up-button' onClick={reset} >NO</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;