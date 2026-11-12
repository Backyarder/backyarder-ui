import { FormEvent, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import '../Login/Login.scss'

// Landing page for the emailed reset link: /reset?token=...
const ResetPassword = () => {
  const { resetPassword } = useAuth()
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [password, setPassword] = useState<string>('')
  const [confirm, setConfirm] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [done, setDone] = useState<boolean>(false)

  if (done) return <Navigate to='/' replace />

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Those passwords do not match.')
      return
    }
    setError('')
    setSubmitting(true)
    resetPassword(token, password)
      .then(() => setDone(true))
      .catch((err: Error) => setError(err.message))
      .finally(() => setSubmitting(false))
  }

  return (
    <section id='login'>
      <form className='login-form' onSubmit={handleSubmit}>
        <h1>Choose a new password</h1>
        {!token && <p className='login-error' role='alert'>This link is missing its token. <Link to='/login'>Request a new one</Link>.</p>}
        <label>
          New password
          <input id='reset-password' type='password' autoComplete='new-password' required minLength={8} value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <label>
          Confirm password
          <input id='reset-confirm' type='password' autoComplete='new-password' required minLength={8} value={confirm} onChange={e => setConfirm(e.target.value)} />
        </label>
        {error && <p className='login-error' role='alert'>{error}</p>}
        <button id='reset-submit' className='login-button' type='submit' disabled={submitting || !token}>
          {submitting ? 'One moment...' : 'SAVE PASSWORD'}
        </button>
        <Link className='switch-mode' to='/login'>Back to log in</Link>
      </form>
    </section>
  )
}

export default ResetPassword
