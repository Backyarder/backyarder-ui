import './ConfirmModal.scss';

interface ConfirmProps {
  fullClear: boolean;      // true: clear everything; false: remove unplanted items only
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ fullClear, onConfirm, onCancel }: ConfirmProps) => {
  return (
    <div className='confirm-modal-overlay' >
      <div className='confirm-modal' >
        {fullClear && <p className='confirm-message'>Are you sure you wish to clear your garden? This action cannot be undone.</p>}
        {!fullClear && <p className='confirm-message'>Are you sure you wish to remove your unplanted items? This action cannot be undone.</p>}
        <div className='pop-up-button-container'>
          <button className='pop-up-button' onClick={onConfirm} >YES</button>
          <button className='pop-up-button' onClick={onCancel} >NO</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
