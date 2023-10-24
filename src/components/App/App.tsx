import './App.scss';
import Header from '../Header/Header'
import Login from '../Login/Login'
import Main from '../Main/Main'
import Detail from '../Detail/Detail'
import Error from '../Error/Error'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div className='app'>
      <Header />
      <Routes>
        <Route path='/' element={<Main />}></ Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/plants/:id' element={<Detail />}></ Route>
        <Route path='*' element={<Error />}></ Route>
      </Routes>
    </div>
  );
}

export default App;

