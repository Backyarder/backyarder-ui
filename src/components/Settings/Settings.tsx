import './Settings.scss'

const Settings = () => {
  return (
    <section id='settings'>
      <h1>User Settings</h1>
      <div id='zip-code'>
        <h3>Zip code</h3>
        <div>
          <input></input>
          <p id='hardiness-zone'>Hardiness zone: 7a</p>
        </div>
      </div>
    </section>
  )
}

export default Settings
