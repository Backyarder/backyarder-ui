import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Wraps a route that needs a signed-in user. While the first /auth/me call
// is in flight nothing is rendered, so the garden does not flash before a
// redirect to /login.
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p className='auth-loading'>Opening the garden gate...</p>
  if (!user) return <Navigate to='/login' replace state={{ from: location.pathname }} />
  return children
}

export default RequireAuth
