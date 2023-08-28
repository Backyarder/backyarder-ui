// import Button from '../Button/Button';
// import { NavLink } from 'react-router-dom';
import './Nav.scss';

type NavProps = {
  isGardenView: boolean;
  setIsGardenView: Function;
}

const Nav = ({ isGardenView, setIsGardenView }: NavProps) => {
  const toggleView = () : void => {
    setIsGardenView(!isGardenView);
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
      {isGardenView && <button className='clear-button' >CLEAR GARDEN</button>}
    </nav>
  );
}

export default Nav;