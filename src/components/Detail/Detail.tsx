import './Detail.css';
import InfoItem from '../InfoItem/InfoItem'
import plantDetails from './mockData'

const Detail = () => {
    //implement fetch call here to get all the data and assign that data to plant details in a useEffect using the params passed by the rouute 
    // need to somehow define the types of all of the data being put into the JSX

    const captalizeWord = (string: string): string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    const determineHardinessString = (hardiness: {min: string, max: string}):string => {
        if(hardiness.min === hardiness.max){
            return hardiness.min
        } else {
            return `${hardiness.min} through ${hardiness.max}`
        }
    }

    return (
        <div className='detail-page'>
            <img src={plantDetails.image}/>
            <div className='at-a-glance'>
                <h1>{plantDetails["common_name"]}</h1>
                <h2>{plantDetails["scientific_name"].join(", ")}</h2>
                <p>{captalizeWord(plantDetails.type)}</p>
                <p>{plantDetails["leaf_color"].map(color => captalizeWord(color)).join(", ")}</p>
                <p><span className="material-symbols-rounded">sunny</span>{plantDetails.sunlight.map(condition => captalizeWord(condition)).join(", ")}</p>
                <p><span className="material-symbols-rounded">calendar_month</span>{plantDetails.cycle}</p>
                <p><span className="material-symbols-rounded">water_drop</span>{plantDetails.watering}</p>
                <p><span className="material-symbols-rounded">location_on</span>{determineHardinessString(plantDetails.hardiness)}</p>
            </div>
            <div className='Descriptions'>
                <h2>Light Description</h2>
                <p>{plantDetails.section[0].description}</p>
                <h2>Watering Description</h2>
                <p>{plantDetails.section[1].description}</p>
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