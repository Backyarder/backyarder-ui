import { FormEvent, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import './Login.scss'

type Mode = 'login' | 'signup'

const Login = () => {
  const { user, loading, login, signup } = useAuth()
  const location = useLocation()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [zipCode, setZipCode] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  if (loading) return null
  if (user) return <Navigate to={(location.state as { from?: string } | null)?.from || '/'} replace />

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const action = mode === 'login'
      ? login(email, password)
      : signup(email, password, zipCode || undefined)
    action
      .catch((err: Error) => setError(err.message))
      .finally(() => setSubmitting(false))
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError('')
  }

  return (
    <section id='login'>
      <form className='login-form' onSubmit={handleSubmit}>
        <h1>{mode === 'login' ? 'Welcome back' : 'Start your garden'}</h1>
        <label>
          Email
          <input id='login-email' type='email' autoComplete='email' required value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input id='login-password' type='password' autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={mode === 'signup' ? 8 : undefined} value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        {mode === 'signup' && (
          <label>
            Zip code <span className='optional'>(optional, for your hardiness zone)</span>
            <input id='login-zip' inputMode='numeric' pattern='[0-9]{5}' maxLength={5} value={zipCode} onChange={e => setZipCode(e.target.value.replace(/\D/g, ''))} />
          </label>
        )}
        {error && <p className='login-error' role='alert'>{error}</p>}
        <button id='login-submit' className='login-button' type='submit' disabled={submitting}>
          {submitting ? 'One moment...' : mode === 'login' ? 'LOG IN' : 'SIGN UP'}
        </button>
        <button type='button' className='switch-mode' onClick={switchMode}>
          {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}
        </button>
      </form>
    </section>
  )
}

export default Login
