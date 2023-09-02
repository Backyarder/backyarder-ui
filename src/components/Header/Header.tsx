import { Link } from 'react-router-dom'
import './Header.scss'

const Header = () => {
    return (
        <header>
            <Link to='/'>
                <img className="header-logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} alt='backyarder logo'/>
            </Link>
        </header>
    )
}

export default Header