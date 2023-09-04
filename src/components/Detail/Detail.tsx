import './Detail.scss';
import InfoItem from '../InfoItem/InfoItem'
import Error from '../Error/Error'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPlantDetails } from "../../apiCalls"

type PlantDetailsType = {
    id: number,
    image: string,
    plant_name: string,
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
    // eslint-disable-next-line
    const [apiError, setApiError] = useState<string>('')

    useEffect(() => {
        getPlantDetails(id)
            .then(data => setPlantDetails(data.data.attributes))
            .catch((err) => {
                handleApiError(err)
            })
    // eslint-disable-next-line
    }, [])

    const handleApiError = (error: string) => {
        setApiError(error)
    }

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
            {apiError ? (
                <Error />
            ) : (
                plantDetails ?
                <div className='detail-page'>
                    <div className="top-of-page">
                        <img className="plant-img" src={plantDetails.image} alt={`A ${plantDetails["plant_name"]}`} />
                        <div className='at-a-glance'>
                            <div className="header-container">
                                <div className="names">
                                    <h1 className="common">{plantDetails["plant_name"].toUpperCase()}</h1>
                                    <h2 className="scientific">{plantDetails["scientific_name"].join(", ")}</h2>
                                </div>
                                <NavLink className='home-button' id='details-home-button' to='/'>Go back to garden</NavLink>
                            </div>
                            <div className="quick-glance-details">
                                <div className="detail">
                                    <p className="sun "><span className="material-symbols-rounded detail-icon">sunny</span>{plantDetails.sunlight.map(condition => captalizeWord(condition)).join(", ")}</p>
                                    <p className="cycle"><span className="material-symbols-rounded detail-icon">calendar_month</span>{plantDetails.cycle}</p>
                                </div>
                                <div className="detail">
                                    <p className="water"><span className="material-symbols-rounded detail-icon">water_drop</span>{plantDetails.watering}</p>
                                    <p className="location"><span className="material-symbols-rounded detail-icon">location_on</span>Zone {determineHardinessString(plantDetails.hardiness)}</p>
                                </div>
                                <div className="detail">
                                    <p className="type"><span className="material-symbols-rounded detail-icon">
                                        psychiatry
                                    </span>{captalizeWord(plantDetails.type)}</p>
                                    <p className="color"><span className="material-symbols-rounded detail-icon">
                                        format_paint
                                    </span>{plantDetails["leaf_color"].map(color => captalizeWord(color)).join(", ")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="descriptions-and-more-info">
                        <div className='descriptions'>
                            {plantDetails.section.map((plant, i) => {
                                return (
                                    <div className='description' key={i}>
                                        <h2 className='header'>{plant.type.charAt(0).toUpperCase() + plant.type.slice(1) + " Description"}</h2>
                                        <p className="description">{plantDetails.section[1].description}</p>
                                    </div>
                                )
                            })}
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
                </div> : <p className='details-loading'>loading...</p>
            )}
        </>
    )
}

export default Detail;