import { useState, useEffect, ChangeEvent } from "react"
import Card from "../Card/Card"
import './Sidebar.scss'
import { getPlantList } from "../../apiCalls"

interface PlantData {
    id: number
    type: string
    attributes: PlantAttributes
}

export interface PlantAttributes {
    hardiness: {
        min: string
        max: string
    }
    image: string
    name: string
    plant_id: number
    sunlight: string[]
    type: string
}

const Sidebar = () => {
    const [plantList, setPlantList] = useState<PlantData[]>([])
    // eslint-disable-next-line
    const [apiError, setApiError] = useState<string>('')

    useEffect(() => {
        getPlantList()
            .then(data => setPlantList(data.data))
            .catch((err) => {
                handleApiError(err)
            })
    }, [])

    const handleApiError = (error: string) => {
        setApiError(error)
    }

    let cards;
    if (plantList.length) {
        cards = plantList.map((plant: PlantData) => <Card plant={plant.attributes} key={plant.attributes.plant_id} />)
    }


    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <section id='plants'>
            <h2>PLANTS</h2>
            <div className="search">
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Search... "
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button className="submit-search"><span className="material-symbols-rounded">
                    search
                </span></button>
            </div>
            {plantList.length && cards}
        </section>
    )
}

export default Sidebar
