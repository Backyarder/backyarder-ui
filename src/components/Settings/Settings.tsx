import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import './Settings.scss'
import { mockUser } from './mockUser'

const Settings = () => {
  const [zipCode, setZipCode] = useState(mockUser.data.zip_code)
  const [newZipCode, setNewZipCode] = useState<string>('')
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [hardinessZone, setHardinessZone] = useState<string>('')

  // this is a mock api call that will need to be updated
  const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 3000));
  const notify = () => {
    toast.promise(resolveAfter3Sec, {
      success: {
        render: 'Zip code updated!',
        position: 'bottom-center'
      },
      pending: {
        render: 'Updating zip code...',
        position: 'bottom-center'
      },
      error: {
        render: 'Something went wrong...',
        position: 'bottom-center'
      }
    });
  }

  useEffect(() => {
    if (zipCode) {
      setNewZipCode(zipCode)
      setIsDisabled(true)
    } else setIsDisabled(false)
  }, [zipCode])

  useEffect(() => {
    if (newZipCode.length === 5) {
      fetch(`https://phzmapi.org/${newZipCode}.json`)
        .then(res => res.json())
        .then(data => setHardinessZone(data.zone))
        .catch(err => console.log(err))
        //handle when zip code does not exist
    } else setHardinessZone('-')
  }, [newZipCode])

  const handleClick = () => {
    setIsDisabled(false)
    setNewZipCode('')
    setTimeout(() => {
      document.getElementById('zip-input')?.focus()
    }, 0)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewZipCode(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newZipCode.length === 5) {
      setIsDisabled(true)
      setZipCode(newZipCode)
      notify()
      // display a success toast
    } else if (e.key === 'Enter' && newZipCode.length !== 5) {
      // make a better UX for this
      alert('Please enter a valid zip code')
    }

    if (!/[0-9]/.test(e.key) && e.key !== 'Delete' && e.key !== 'Backspace') {
      e.preventDefault();
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
          <p id='hardiness-zone'>Hardiness zone: {hardinessZone}</p>
        </div>
      </div>
    </section>
  )
}

export default Settings
