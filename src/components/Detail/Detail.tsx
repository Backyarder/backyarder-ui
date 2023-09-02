import './Detail.scss';
import InfoItem from '../InfoItem/InfoItem'
// import plantDetails from './mockData'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPlantDetails } from "../../apiCalls"

type PlantDetailsType = {
    id: number,
    image: string,
    common_name: string,
    scientific_name: string[],
    type: string,
    leaf_color: string[],
    cycle: string,
    watering: string,
    sunlight: string[],
    hardiness: {
        min: string,
        max: string
            },
    section: {
        id: number,
        type: string,
        description: string
    }[],
    pruning_month: string[],
    attracts: string[],
    flowering_season: string[],
    edible_fruit: boolean,
    maintenance: string,
    poisonous_to_pets: boolean,
    drought_tolerant: boolean,
    invasive: boolean,
    indoor: boolean
}

const Detail = () => {

    const { id } = useParams()

    const [plantDetails, setPlantDetails] = useState<PlantDetailsType | undefined>()

    useEffect(() => {
        getPlantDetails(id)
            .then(data => setPlantDetails(data.data.attributes))
            .catch((err) => {
                // handleApiError(err)
            })
    }, [])
    //implement fetch call here to get all the data and assign that data to plant details in a useEffect using the params passed by the rouute 
    // need to somehow define the types of all of the data being put into the JSX

    const captalizeWord = (string: string): string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const determineHardinessString = (hardiness: { min: string, max: string }): string => {
        if (hardiness.min === hardiness.max) {
            return hardiness.min
        } else {
            return `${hardiness.min} through ${hardiness.max}`
        }
    }

    return (
        <>
            {plantDetails ?
                <div className='detail-page'>
                    <div className="top-of-page">
                        <img className="plant-img" src={plantDetails.image} alt={`A ${plantDetails["common_name"]}`} />
                        <div className='at-a-glance'>
                            <div className="header-container">
                                <div className="names">
                                    <h1 className="common">{plantDetails["common_name"]}</h1>
                                    <h2 className="scientific">{plantDetails["scientific_name"].join(", ")}</h2>
                                </div>
                                <div className="type-and-color">
                                    <p className="type">{captalizeWord(plantDetails.type)}</p>
                                    <p className="color">{plantDetails["leaf_color"].map(color => captalizeWord(color)).join(", ")}</p>
                                </div>
                            </div>
                            <div className="quick-glance-details">
                                <div>
                                    <p className="sun"><span className="material-symbols-rounded">sunny</span>{plantDetails.sunlight.map(condition => captalizeWord(condition)).join(", ")}</p>
                                    <p className="cycle"><span className="material-symbols-rounded">calendar_month</span>{plantDetails.cycle}</p>
                                </div>
                                <div>
                                    <p className="water"><span className="material-symbols-rounded">water_drop</span>{plantDetails.watering}</p>
                                    <p className="location"><span className="material-symbols-rounded">location_on</span>Zone {determineHardinessString(plantDetails.hardiness)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="descriptions-and-more-info">
                        <div className='descriptions'>
                            <h2 className="header">Light Description</h2>
                            <p className="description">{plantDetails.section[0].description}</p>
                            <h2 className="header">Watering Description</h2>
                            <p className="description">{plantDetails.section[1].description}</p>
                        </div>
                        <div className='more-info-section'>
                            <h2 className="header">More Information</h2>
                            <InfoItem data={plantDetails["attracts"]} name="Attracts Wildlife" />
                            <InfoItem data={plantDetails["flowering_season"]} name="Flowering" />
                            <InfoItem data={plantDetails["pruning_month"]} name="Needs to be Pruned" />
                            <InfoItem data={plantDetails["drought_tolerant"]} name="Drought Tolerant" />
                            <InfoItem data={!plantDetails["poisonous_to_pets"]} name="Pet Safe" />
                            <InfoItem data={plantDetails["indoor"]} name="Grown Indoors" />
                            <InfoItem data={plantDetails["edible_fruit"]} name="Edible" />
                            <InfoItem data={plantDetails["maintenance"] === "Low" ? true : false} name="Low Maintenance" />
                            <InfoItem data={plantDetails["invasive"] ? false : true} name="Non-Invasive Species" />
                        </div>
                    </div>
                </div> : <p>loading...</p>}
        </>
    )
}

export default Detail;