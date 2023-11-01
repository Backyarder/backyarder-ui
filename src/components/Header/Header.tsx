import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.scss'

const Header = () => {
    const [className, setClassName] = useState<string>('user-modal-hidden')

    const toggleFocus = (): void => {
        className === 'user-modal-hidden'
        ? setClassName('user-modal-focus')
        : setClassName('user-modal-hidden')
    }

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        if (className === 'user-modal-focus' && target.id !== 'userIcon') {
            setClassName('user-modal-hidden')
        }
    })

    return (
        <header>
            <div className='relative-container'>
                <Link to='/' id='home'>
                    <img className="header-logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} alt='backyarder logo'/>
                </Link>
                <span id='userIcon' className="material-symbols-rounded" onClick={toggleFocus}>account_circle</span>
                <div className={`user-modal ${className}`}>
                    <Link to='/settings'>
                        <p>SETTINGS</p>
                    </Link>
                    <Link to='/'>
                        <p>LOGOUT</p>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header