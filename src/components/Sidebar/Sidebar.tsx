import { useState, useEffect, ChangeEvent } from "react"
import Card from "../Card/Card"
import './Sidebar.scss'
import { getPlantList, searchPlants } from "../../apiCalls"
import decorData from '../../decor_data.json'

interface PlantData {
    id: number
    type: string
    attributes: PlantAttributes
}

interface DecorData {
        id: null;
        type: string;
        attributes: DecorAttributes;
}

export interface PlantAttributes {
    hardiness: {
        min: string
        max: string
    }
    image: string
    plant_name: string
    plant_id: number
    sunlight: string[]
    type: string
}

export interface DecorAttributes {
    image: string
    name: string
    type: string
}

interface SideBarProps {
    modal: boolean;
    setModal: Function;
}

const Sidebar = ({ modal, setModal }: SideBarProps) => {
    const [plantList, setPlantList] = useState<PlantData[]>([])
    const [decorList, setDecorList] = useState<DecorData[]>([])
    // eslint-disable-next-line
    const [apiError, setApiError] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loadingPlants, setLoadingPlants] = useState<boolean>(true)
    const [activeTab, setActiveTab] = useState<string>('plants')

    // console.log(plantList)

    const getDecorList = () => {
        //this is a placeholder for what will become the api call for the decor list
        setDecorList(decorData.data)
    }

    useEffect(() => {
        getPlantList()
            .then(data => setPlantList(data.data))
            .then(() => setLoadingPlants(false))
            .catch((err) => {
                handleApiError(err)
            })
        getDecorList()
    }, [])

    //create conditional to check what that is
    //if plants do getPlantList
    //if decor do getDecorList (for now only displaying text 'decor list')

    //when a tab is clicked we use an onclick to invoke a function
    //function updates state to the value of the tab (plants or decor)
    //when this activeTab state is updated it triggers the useEffect hook in order to get the data that is needed (getPlantList OR getDecorList -- need to write the api call for getting a decor list -- this will start with mock data (can still use the loadinglants message when waiting on decor))

    const handleApiError = (error: string) => {
        setApiError(error)
    }

    let cards;

    //below adding in a condtional to check if plants or decor is the active tab
    //check if !plantList || !decorList - then display 500 error message
    //check if plantList.length && activeTab === 'plants' - this displays all plants
    //check if decorList.length && activeTab === 'decor' - this displays all decor
    //else just display that there is nothing in the nursery mathcing the search 

    if (!plantList || !decorList) {
        cards = <p className="loading">It looks like our nursery is not operating correctly, please try again later</p>
    }
    else if (plantList.length && activeTab === 'plants') {
        cards = plantList.map((plant: PlantData) => {
            const plantImage = plant.attributes.image
                ? plant.attributes.image
                : `${process.env.PUBLIC_URL}/images/plant-fallback.png`
            plant.attributes.image = plantImage
            return <Card plant={plant.attributes} modal={modal} setModal={setModal} key={plant.attributes.plant_id} />
        })
    } else if (decorList.length && activeTab === 'decor') {
        // cards = decorList.map((item: DecorData) => {
        //     return <Card plant={item.attributes} modal={modal} setModal={setModal} key={item.attributes.name} />
        // })
        cards = decorList.map((item) => {
            return <p>{item.attributes.name}</p>
        })
    } else {
        cards = <p className="loading">Hmmm... there are nothing in our nursery matching your search.</p>
    }

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            searchForPlants();
        }
    };

    const searchForPlants = () => {
        setLoadingPlants(true)
        if (searchTerm.length) {
            searchPlants(searchTerm.toLowerCase())
                .then(data => setPlantList(data.data))
                .then(() => setLoadingPlants(false))
                .catch((err) => {
                    handleApiError(err)
                })
        } else {
            getPlantList()
                .then(data => setPlantList(data.data))
                .then(() => setLoadingPlants(false))
                .catch((err) => {
                    handleApiError(err)
                })
        }
    }

    const loading = (): JSX.Element => {
        return (
            <div className="loading">
                <p>Gathering plants from our nursery...</p>
                <img className="loading-img" src={`${process.env.PUBLIC_URL}/images/plant.png`} alt='small plant' />
                <p>This may take a few moments.</p>
            </div>
        )
    }

    return (
        <section id='plants'>
            <div className="sidebar-nav">
                <div className="plants-tab" onClick={() => { setActiveTab('plants') }}>PLANTS</div>
                <div className="decor-tab" onClick={() => { setActiveTab('decor') }}>DECOR</div>
            </div>
            <div className="search">
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Search... "
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyPress}
                />
                <button className="submit-search" onClick={searchForPlants}><span className="material-symbols-rounded">
                    search
                </span></button>
            </div>
            <div className="search-results" >
                {loadingPlants ? loading() : cards}
            </div>
        </section>
    )
}

export default Sidebar