import './Detail.css';
// import { Sunny } from '@material-ui/icons'

const Detail = () => {
    return (
        <div className='detail-page'>
            <img></img>
            <div className='at-a-glance'>
                <h1>Common Name</h1>
                <h2>Scientific Name</h2>
                <p>type</p>
                <p>color</p>
                <p><span className="material-symbols-rounded">sunny</span>sun requirement</p>
                <p><span className="material-symbols-rounded">calendar_month</span>perennial or annual</p>
                <p><span className="material-symbols-rounded">water_drop</span>watering frequency</p>
                <p><span className="material-symbols-rounded">location_on</span>hardiness zones</p>
            </div>
        </div>
    )
}

export default Detail