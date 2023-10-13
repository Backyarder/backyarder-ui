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
        <span className="material-symbols-rounded nav-icon">grid_view</span>GARDEN VIEW
      </button>
      {isGardenView &&
        <>
          <div className='key'>
            <div className='key-symbol-container' >
              <div className='key-symbol empty-symbol' ></div>
              <p className="key-text">EMPTY</p>
            </div>
            <div className='key-symbol-container' >
              <div className='key-symbol ready-symbol' ></div>
              <p className="key-text">READY FOR PLANTING OR CONSTRUCTION</p>
            </div>
            <div className='key-symbol-container' >
              <div className='key-symbol planted-symbol' ></div>
              <p className="key-text">PLANTED</p>
            </div>
            <div className='key-symbol-container' >
              <div className='key-symbol needs-water-symbol' ></div>
              <p className="key-text">NEEDS WATER</p>
            </div>
            <div className='key-symbol-container' >
              <div className=' key-symbol constructed-symbol' ></div>
              <p className="key-text">CONSTRUCTED</p>
            </div>
            <div className='key-symbol-container' >
              <div className='key-symbol unavailable-symbol' ></div>
              <p className="key-text">UNAVAILABLE</p>
            </div>
            {/* <p className="key-text">DRAG AND DROP PLANTS AND ITEMS INTO THE GARDEN GRID TO CREATE YOUR GARDEN</p> */}
          </div>
          <button className='water-all-button' onClick={handleWaterAll} >
            <span className="material-symbols-rounded nav-icon">water_drop</span>
            <span>WATER GARDEN</span>
            <div className='liquid'></div>
          </button>
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