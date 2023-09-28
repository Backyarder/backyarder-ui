import './Nav.scss';

type NavProps = {
  reset: Function;
  waterGarden: boolean;
  setWaterGarden: Function;
  handleFullClear: () => void;
  handlePartialClear: () => void;
  isGardenView: boolean;
  setIsGardenView: Function;
}

const Nav = ({ reset, waterGarden, setWaterGarden, handleFullClear, handlePartialClear, isGardenView, setIsGardenView }: NavProps) => {

  const toggleView = (): void => {
    setIsGardenView(!isGardenView);
    reset();
  }

  const handleWaterAll = (): void => {
    setWaterGarden(!waterGarden)
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
        </>
      }
    </nav>
  );
}

export default Nav;