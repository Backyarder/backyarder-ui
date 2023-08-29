// import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Nav.scss';

type NavProps = {
  isGardenView: boolean;
  setIsGardenView: Function;
}

const Nav = ({ isGardenView, setIsGardenView }: NavProps) => {
  const [popUp, setPopUp] = useState<boolean>(false);

  const toggleView = () : void => {
    setIsGardenView(!isGardenView);
  }

  const handlePopUp = () : void => {
    setPopUp(true);
  }

  const handleDelete = () : void => {
    // Delete logic goes here.
    setPopUp(false);
    alert('Garden cleared.');
  }

  const handleCancel = () : void => {
    setPopUp(false);
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
        LIST OF GARDEN PLANTS
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
        GARDEN VIEW
      </button>
      {isGardenView &&
        <>
          <div className='key'>
            <p className='key-text' >KEY:</p>
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
            <p>DOUBLE CLICK TO DELETE A PLANT</p>
          </div>
          <button className='clear-button' onClick={handlePopUp} >CLEAR GARDEN</button>
          {popUp &&
            <div className='pop-up'>
              <p>Are you sure you want to clear your garden?</p>
              <div className='pop-up-button-container'>
                <button className='pop-up-button' onClick={handleDelete} >YES</button>
                <button className='pop-up-button' onClick={handleCancel} >NO</button>
              </div>
            </div>
          }
        </>
      }
    </nav>
  );
}

export default Nav;