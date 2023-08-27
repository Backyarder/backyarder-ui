import './Detail.css';
import InfoItem from '../InfoItem/InfoItem'

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
            <div className='Descriptions'>
                <h2>Light Description</h2>
                <p>desciption goes here</p>
                <h2>Watering Description</h2>
                <p>desciption goes here</p>
            </div>
            <div className='more-info'>
                <h2>More Information</h2>
                <InfoItem />
                <InfoItem />
                <InfoItem />
                <InfoItem />
                <InfoItem />
                <InfoItem />
                <InfoItem />
                <InfoItem />
                <InfoItem />
            </div>
        </div>
    )
}

export default Detail