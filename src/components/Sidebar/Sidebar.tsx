import { useState, useEffect } from "react"
import Card from "../Card/Card"
import './Sidebar.scss'
// import { plantsMockData } from "./plantsMockData"
import { getPlantList } from "../../apiCalls"

interface PlantData {
    id: number
    type: string
    attributes: PlantAttributes
}

interface PlantAttributes {
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


    return (
        <section id='plants'>
            <h2>PLANTS</h2>
            <p>SEARCH</p>
            {plantList.length && cards}
        </section>
    )
}

export default Sidebar
