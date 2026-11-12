import './App.scss'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from '../Header/Header'
import Main from '../Main/Main'
import Detail from '../Detail/Detail'
import Settings from '../Settings/Settings'
import Login from '../Login/Login'
import Error from '../Error/Error'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../auth/AuthContext'
import RequireAuth from '../../auth/RequireAuth'

const App = () => {
  return (
    <AuthProvider>
      <div className='app'>
        <Header />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<RequireAuth><Main /></RequireAuth>} />
          <Route path='/plants/:id' element={<RequireAuth><Detail /></RequireAuth>} />
          <Route path='/settings' element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path='*' element={<Error />} />
        </Routes>
        <ToastContainer />
      </div>
    </AuthProvider>
  );
}

export default App;
