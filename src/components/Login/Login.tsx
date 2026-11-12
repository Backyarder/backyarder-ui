import { FormEvent, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { forgotPassword } from '../../apiCalls'
import './Login.scss'

type Mode = 'login' | 'signup' | 'forgot'

const Login = () => {
  const { user, loading, login, signup } = useAuth()
  const location = useLocation()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [zipCode, setZipCode] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [notice, setNotice] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  if (loading) return null
  if (user) return <Navigate to={(location.state as { from?: string } | null)?.from || '/'} replace />

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const action = mode === 'login'
      ? login(email, password)
      : mode === 'signup'
        ? signup(email, password, zipCode || undefined)
        : forgotPassword(email).then(() => {
            setNotice('If that address has an account, a reset link is on its way. It is good for one hour.')
            setMode('login')
          })
    action
      .catch((err: Error) => setError(err.message))
      .finally(() => setSubmitting(false))
  }

  const switchMode = (next?: Mode) => {
    setMode(next ?? (mode === 'login' ? 'signup' : 'login'))
    setError('')
    setNotice('')
  }

  const titles: Record<Mode, string> = { login: 'Welcome back', signup: 'Start your garden', forgot: 'Reset your password' }
  const buttons: Record<Mode, string> = { login: 'LOG IN', signup: 'SIGN UP', forgot: 'SEND RESET LINK' }

  return (
    <section id='login'>
      <form className='login-form' onSubmit={handleSubmit}>
        <h1>{titles[mode]}</h1>
        {mode === 'forgot' && <p className='login-hint'>Enter your email and we'll send you a link to choose a new password.</p>}
        <label>
          Email
          <input id='login-email' type='email' autoComplete='email' required value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        {mode !== 'forgot' && (
          <label>
            Password
            <input id='login-password' type='password' autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={mode === 'signup' ? 8 : undefined} value={password} onChange={e => setPassword(e.target.value)} />
          </label>
        )}
        {mode === 'signup' && (
          <label>
            Zip code <span className='optional'>(optional, for your hardiness zone)</span>
            <input id='login-zip' inputMode='numeric' pattern='[0-9]{5}' maxLength={5} value={zipCode} onChange={e => setZipCode(e.target.value.replace(/\D/g, ''))} />
          </label>
        )}
        {error && <p className='login-error' role='alert'>{error}</p>}
        {notice && <p className='login-notice' role='status'>{notice}</p>}
        <button id='login-submit' className='login-button' type='submit' disabled={submitting}>
          {submitting ? 'One moment...' : buttons[mode]}
        </button>
        {mode === 'login' && (
          <button type='button' id='forgot-password' className='switch-mode' onClick={() => switchMode('forgot')}>
            Forgot your password?
          </button>
        )}
        <button type='button' className='switch-mode' onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}
        </button>
      </form>
    </section>
  )
}

export default Login
