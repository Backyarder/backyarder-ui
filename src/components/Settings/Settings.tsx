import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../auth/AuthContext'
import './Settings.scss'

const Settings = () => {
  const { user, updateMe } = useAuth()
  const zipCode = user?.zip_code ?? ''
  const [newZipCode, setNewZipCode] = useState<string>(zipCode)
  const [isDisabled, setIsDisabled] = useState<boolean>(!!zipCode)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setNewZipCode(zipCode)
    setIsDisabled(!!zipCode)
  }, [zipCode])

  const save = (value: string) => {
    setError('')
    setIsDisabled(true)
    toast.promise(updateMe({ zip_code: value }), {
      pending: { render: value ? 'Updating zip code...' : 'Clearing zip code...', position: 'bottom-center' },
      success: { render: value ? 'Zip code updated!' : 'Zip code cleared.', position: 'bottom-center' },
      error: { render: ({ data }) => (data as Error)?.message || 'Something went wrong...', position: 'bottom-center' }
    }).catch((err: Error) => {
      setError(err.message)
      setIsDisabled(false)
    })
  }

  const handleClick = () => {
    setIsDisabled(false)
    setNewZipCode('')
    setTimeout(() => {
      document.getElementById('zip-input')?.focus()
    }, 0)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewZipCode(e.target.value.replace(/\D/g, ''))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    if (newZipCode.length === 5 || newZipCode.length === 0) {
      save(newZipCode)
    } else {
      setError('Please enter a 5 digit zip code')
    }
  }

  return (
    <section id='settings'>
      <h1>User Settings</h1>
      <p id='settings-email'>Signed in as {user?.email}</p>
      <div id='zip-code'>
        <h3>Zip code</h3>
        <div>
          <div id='zip-input-box'>
            <input id='zip-input' inputMode='numeric' maxLength={5} pattern="[0-9]*" placeholder='5 digits, Enter to save' value={newZipCode} disabled={isDisabled} onChange={handleChange} onKeyDown={handleKeyPress}/>
            <span className="material-symbols-rounded" title='Edit zip code' onClick={handleClick}>edit_square</span>
          </div>
          <p id='hardiness-zone'>Hardiness zone: {user?.hardiness_zone ?? '-'}</p>
          {error && <p id='zip-error' role='alert'>{error}</p>}
        </div>
      </div>
    </section>
  )
}

export default Settings
