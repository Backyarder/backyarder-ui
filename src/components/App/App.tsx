import './App.css';
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import Grid from '../Grid/Grid'
import Nav from '../Nav/Nav'
import Detail from '../Detail/Detail'
// import { Routes, Route } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <>
      <Header />
      <div>
        <Sidebar />
        <Grid />
        <Nav />
      </div>
      <Detail />
      {/* <Routes>
        <Route path='/' Component={App} />
        <Route path='/:plant-id' Component={Detail} />
      </Routes> */}
    </>
  );
}

export default App;

