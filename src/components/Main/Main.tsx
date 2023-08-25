// import './Main.css';
import Sidebar from '../Sidebar/Sidebar'
import Grid from '../Grid/Grid'
import Nav from '../Nav/Nav'
import List from '../List/List'
import { Link } from 'react-router-dom'

const Main = () => {
  return (
    <>
      <Sidebar />
      <Grid />
      <List />
      <Nav />
      <Link to='/plants'>See Plant Details Page</Link>
    </>
  );
}

export default Main;