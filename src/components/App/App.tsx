import './App.css';
import Header from '../Header/Header'
import Main from '../Main/Main'
import Detail from '../Detail/Detail'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Main />} ></ Route >
          <Route path='/plants/:id' element={<Detail />} ></ Route >
      </Routes>
    </>
  );
}

export default App;

