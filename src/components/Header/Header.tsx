import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../auth/AuthContext'
import './Header.scss'

const Header = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [open, setOpen] = useState<boolean>(false)
    const [loggingOut, setLoggingOut] = useState<boolean>(false)

    const toggleFocus = (): void => setOpen(current => !current)

    // Close the menu on any click outside the icon (one listener, removed on unmount).
    useEffect(() => {
        if (!open) return
        const close = (e: MouseEvent) => {
            if ((e.target as HTMLElement).id !== 'userIcon') setOpen(false)
        }
        document.addEventListener('click', close)
        return () => document.removeEventListener('click', close)
    }, [open])

    const handleLogout = () => {
        if (loggingOut) return
        setLoggingOut(true)
        toast.promise(logout(), {
            pending: 'Logging out...',
            success: 'Logged out. See you next time!',
            error: 'Logged out here, but the server could not be reached. It may still remember this session.'
        }, { position: 'bottom-center' })
            .catch(() => null)
            .finally(() => setLoggingOut(false))
        navigate('/login')
    }

    return (
        <header>
            <div className='relative-container'>
                <Link to='/' id='home'>
                    <img className="header-logo" src={`/images/logo.png`} alt='backyarder logo'/>
                </Link>
                {user && <>
                    <span id='userIcon' className="material-symbols-rounded" title={user.email} onClick={toggleFocus}>account_circle</span>
                    <div className={`user-modal ${open ? 'user-modal-focus' : 'user-modal-hidden'}`}>
                        <p className='user-email' title={user.email}>{user.email}</p>
                        <Link to='/settings'>
                            <p>SETTINGS</p>
                        </Link>
                        <p id='logout' className={loggingOut ? 'logging-out' : ''} aria-busy={loggingOut} onClick={handleLogout}>
                            {loggingOut ? 'LOGGING OUT' : 'LOGOUT'}
                        </p>
                    </div>
                </>}
            </div>
        </header>
    )
}

export default Header
