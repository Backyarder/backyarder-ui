import './Error.scss';
import { NavLink } from 'react-router-dom'

const Error = () => {
  return (
    <div className='error'>
      <p>Ooops! There's no plants here!</p>
      <img className="error-img" src={`${process.env.PUBLIC_URL}/images/plant.png`} alt='small plant' />
      <NavLink className='home-button' to='/'>Go back to your garden</NavLink>
    </div>
  );
}

export default Error;