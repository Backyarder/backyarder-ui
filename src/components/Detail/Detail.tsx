import './Detail.scss';
import InfoItem from '../InfoItem/InfoItem'
import Error from '../Error/Error'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPlantDetails } from "../../apiCalls"
import { companionsFor } from '../../companions'
import { useAuth } from '../../auth/AuthContext'
import { zoneFit, zoneFitText } from '../../zones'
import { plantImageSrc, onImageError } from '../../imageFallback'

type PlantDetailsType = {
    id: number,
    image: string,
    name: string,
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
    indoor: boolean,
    image_credit?: ImageCredit | null
}

// Attribution for a Wikimedia Commons photo (built-in plants).
type ImageCredit = {
    author: string,
    license: string,
    license_url: string,
    source_url: string
}

const Detail = () => {

    const { id } = useParams()
    const { user } = useAuth()

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

    const sectionMeta: Record<string, { title: string; icon: string }> = {
        watering: { title: 'Watering', icon: 'water_drop' },
        sunlight: { title: 'Sunlight', icon: 'sunny' },
        pruning: { title: 'Pruning & care', icon: 'content_cut' }
    }
    const isIcon = (src: string | undefined) => !!src && src.endsWith('.svg')

    return (
        <>
            {apiError ? (
                <Error />
            ) : (
                plantDetails ?
                <div className='detail-page'>
                    <section className="top-of-page">
                        <figure className='hero-figure'>
                            <div className={`hero-image ${isIcon(plantDetails.image) ? 'is-icon' : ''}`}>
                                <img className="plant-img" src={plantImageSrc(plantDetails.image)} onError={onImageError} alt={`A ${plantDetails["name"]}`} />
                            </div>
                            {plantDetails.image_credit && (
                                <figcaption className='image-credit'>
                                    Photo: <a href={plantDetails.image_credit.source_url} target='_blank' rel='noreferrer'>{plantDetails.image_credit.author}</a>
                                    {', '}<a href={plantDetails.image_credit.license_url} target='_blank' rel='noreferrer'>{plantDetails.image_credit.license}</a>
                                    {', Wikimedia Commons'}
                                </figcaption>
                            )}
                        </figure>
                        <div className='at-a-glance'>
                            <div className="header-container">
                                <div className="names">
                                    <h1 className="common">{plantDetails["name"].toUpperCase()}</h1>
                                    <h2 className="scientific">{plantDetails["scientific_name"].join(", ")}</h2>
                                </div>
                                {plantDetails.type && <span className='type-badge'>{captalizeWord(plantDetails.type)}</span>}
                            </div>
                            <div className="quick-glance-details">
                                <div className="detail">
                                    <p className="sun "><span className="material-symbols-rounded detail-icon">sunny</span>{plantDetails.sunlight.map(condition => captalizeWord(condition)).join(", ")}</p>
                                    <p className="cycle"><span className="material-symbols-rounded detail-icon">calendar_month</span>{plantDetails.cycle}</p>
                                </div>
                                <div className="detail">
                                    <p className="water"><span className="material-symbols-rounded detail-icon">water_drop</span>{plantDetails.watering}</p>
                                    <p className={`location zone-${zoneFit(plantDetails.hardiness, user?.hardiness_zone, (plantDetails as any).collection)}`} title={zoneFitText(zoneFit(plantDetails.hardiness, user?.hardiness_zone, (plantDetails as any).collection), user?.hardiness_zone)}><span className="material-symbols-rounded detail-icon">location_on</span>Zone {determineHardinessString(plantDetails.hardiness)}{user?.hardiness_zone && zoneFit(plantDetails.hardiness, user.hardiness_zone) !== 'unknown' && <span className='zone-note'>{zoneFitText(zoneFit(plantDetails.hardiness, user.hardiness_zone), user.hardiness_zone)}</span>}</p>
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
                    </section>
                    <section className="descriptions-and-more-info">
                        <div className='descriptions'>
                            {plantDetails.section.map((plant, i) => {
                                const meta = sectionMeta[plant.type] ?? { title: captalizeWord(plant.type), icon: 'eco' }
                                return (
                                    <div className={`description care-${plant.type}`} key={i}>
                                        <h2 className='header'><span className='material-symbols-rounded'>{meta.icon}</span>{meta.title}</h2>
                                        <p className="description">{plant.description}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <aside className='side-column'>
                            {(() => {
                                const companions = companionsFor(plantDetails.name)
                                if (!companions || (companions.likes.length === 0 && companions.avoid.length === 0)) return null
                                return (
                                    <div className='companions-section'>
                                        <h2 className="header"><span className='material-symbols-rounded'>handshake</span>Companion Planting</h2>
                                        {companions.likes.length > 0 && <div className='companions-likes'><strong>Grows well next to</strong><ul>{companions.likes.map(l => <li key={l}>{l}</li>)}</ul></div>}
                                        {companions.avoid.length > 0 && <div className='companions-avoid'><strong>Keep away from</strong><ul>{companions.avoid.map(l => <li key={l}>{l}</li>)}</ul></div>}
                                    </div>
                                )
                            })()}
                            <div className='more-info-section'>
                                <h2 className="header"><span className='material-symbols-rounded'>checklist</span>More Information</h2>
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
                        </aside>
                    </section>
                </div> : <p className='details-loading'>Gathering details...</p>
            )}
        </>
    )
}

export default Detail;
