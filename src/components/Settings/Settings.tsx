import { useState, useEffect } from 'react'
import './Settings.scss'
import { mockUser } from './mockUser'

const Settings = () => {
  const [zipCode, setZipCode] = useState(mockUser.data.zip_code)
  const [newZipCode, setNewZipCode] = useState<string>('')
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  useEffect(() => {
    if (zipCode) {
      setNewZipCode(zipCode)
      setIsDisabled(true)
    } else setIsDisabled(false)
  }, [zipCode])

  const handleClick = () => {
    setIsDisabled(false)
    setNewZipCode('')
    setTimeout(() => {
      document.getElementById('zip-input')?.focus()
    }, 0)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newZipCode.length === 5) {
      setIsDisabled(true)
      setZipCode(newZipCode)
      // display a success toast
    } else if (e.key === 'Enter' && newZipCode.length !== 5) {
      // make a better UX for this
      alert('Please enter a valid zip code')
    }

    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    } else {
      setNewZipCode(newZipCode + e.key)
    }
  }

  return (
    <section id='settings'>
      <h1>User Settings</h1>
      <div id='zip-code'>
        <h3>Zip code</h3>
        <div>
          <div id='zip-input-box'>
            <input id='zip-input' maxLength={5} pattern="[0-9]*" value={newZipCode} disabled={isDisabled} onChange={handleChange} onKeyDown={handleKeyPress}/>
            <span className="material-symbols-rounded" onClick={handleClick}>edit_square</span>
          </div>
          <p id='hardiness-zone'>Hardiness zone: 7a</p>
        </div>
      </div>
    </section>
  )
}

export default Settings
