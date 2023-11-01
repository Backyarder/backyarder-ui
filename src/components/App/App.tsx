import './App.scss'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from '../Header/Header'
import Main from '../Main/Main'
import Detail from '../Detail/Detail'
import Settings from '../Settings/Settings'
import Error from '../Error/Error'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div className='app'>
      <Header />
      <Routes>
        <Route path='/' element={<Main />} ></ Route >
        <Route path='/plants/:id' element={<Detail />} ></ Route >
        <Route path='/settings' element={<Settings />}/>
        <Route path='*' element={<Error />} ></ Route >
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;

