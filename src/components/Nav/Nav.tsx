// import Button from '../Button/Button';
// import { NavLink } from 'react-router-dom';
import './Nav.scss';

type NavProps = {
  isGardenView: boolean;
  setIsGardenView: Function;
}

const Nav = ({ isGardenView, setIsGardenView }: NavProps) => {
  const toggleView = () => {
    setIsGardenView(!isGardenView);
  }

  return (
    <nav>
      <button onClick={toggleView} >LIST OF GARDEN PLANTS</button>
      <button onClick={toggleView} >GARDEN VIEW</button>
      <button>CLEAR GARDEN</button>
    </nav>
  );
}

export default Nav;