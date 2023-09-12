import { useState } from 'react';
import { deleteContents } from '../../apiCalls';
import './Nav.scss';

type NavProps = {
  setPopUp: Function;
  setFullClear: Function;
  setPartialClear: Function;
  reset: Function;
  handleFullClear: () => void;
  handlePartialClear: () => void;
  setAlert: Function;
  isGardenView: boolean;
  setIsGardenView: Function;
  setBullDoze: Function;
  setFilterGarden: Function;
}

const Nav = ({ setPopUp, setFullClear, setPartialClear, reset, handleFullClear, handlePartialClear, setAlert, isGardenView, setIsGardenView, setBullDoze, setFilterGarden }: NavProps) => {
  // const [popUp, setPopUp] = useState<boolean>(false);
  // const [fullClear, setFullClear] = useState<boolean>(false);
  // const [partialClear, setPartialClear] = useState<boolean>(false);

  const toggleView = (): void => {
    setIsGardenView(!isGardenView);
    reset();
  }

  const handleWaterAll = (): void => {
    console.log('watered yo')
  }

  return (
    <nav>
      <button
        className='nav-button'
        style={{
          backgroundColor: !isGardenView ? '#beab95' : '#f4f4f4',
          cursor: !isGardenView ? 'auto' : 'pointer'
        }}
        disabled={!isGardenView}
        onClick={toggleView}
      >
        <span className="material-symbols-rounded nav-icon">list_alt</span>LIST OF GARDEN PLANTS
      </button>
      <button
        className='nav-button'
        style={{
          backgroundColor: isGardenView ? '#beab95' : '#f4f4f4',
          cursor: isGardenView ? 'auto' : 'pointer'
        }}
        disabled={isGardenView}
        onClick={toggleView}
      >
        <span className="material-symbols-rounded nav-icon">outdoor_garden</span>GARDEN VIEW
      </button>
      {isGardenView &&
        <>
          <div className='key'>
            <div className='key-symbol-container' >
              <div className='empty-symbol' ></div>
              <p>EMPTY</p>
            </div>
            <div className='key-symbol-container' >
              <div className='ready-symbol' ></div>
              <p>READY TO BE PLANTED</p>
            </div>
            <div className='key-symbol-container' >
              <div className='planted-symbol' ></div>
              <p>PLANTED</p>
            </div>
            <div className='key-symbol-container' >
              <div className='unavailable-symbol' ></div>
              <p>UNAVAILABLE</p>
            </div>
          </div>
          <div id='wateringCan'>
            <img src={`${process.env.PUBLIC_URL}/images/watering-can.png`} className='ripple' onClick={handleWaterAll} alt='watering can, click to water all planted items'/>
          </div>
          <button className='clear-button' onClick={handleFullClear} ><span className="material-symbols-rounded nav-icon">
            bomb
          </span>CLEAR GARDEN</button>
          <button className='clear-button' onClick={handlePartialClear} ><span className="material-symbols-rounded nav-icon">
            agriculture
          </span>REMOVE UNPLANTED ITEMS</button>
          {/* {popUp &&
            <div className='pop-up'>
              {fullClear && <p className='confirm-message'>Are you sure you wish to clear your garden? This action cannot be undone.</p>}
              {partialClear && <p className='confirm-message'>Are you sure you wish to remove your unplanted items? This action cannot be undone.</p>}
              <div className='pop-up-button-container'>
                <button className='pop-up-button' onClick={handleDelete} >YES</button>
                <button className='pop-up-button' onClick={reset} >NO</button>
              </div>
            </div>
          } */}
        </>
      }
    </nav>
  );
}

export default Nav;