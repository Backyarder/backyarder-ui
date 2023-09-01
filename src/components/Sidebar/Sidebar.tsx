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

    //when the user adds a search term the state will be updated
    // when the user clicks the search button a onClick function will be fired off
        //onClick will display a loading message in the sidebar, run a fetch call to get the search cards
            //if response is good a cards will be updated and displayed - need to figure this one out a little more
            // if the response is bad then the user will get a message saying that there are no plants mathcing their search OR there was an error on the server side and to try agian later
            

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
