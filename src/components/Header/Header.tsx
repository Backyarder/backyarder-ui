import { Link } from 'react-router-dom'
import './Header.scss'

const Header = () => {
    return (
        <header>
            <Link to='/'>
                <img src={`${process.env.PUBLIC_URL}/images/logo.png`}/>
            </Link>
        </header>
    )
}

export default Header