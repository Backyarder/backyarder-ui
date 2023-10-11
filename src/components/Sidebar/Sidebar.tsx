import { useState, useEffect, ChangeEvent } from "react"
import { nanoid } from 'nanoid'
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
        attributes: PlantAttributes;
}

export interface PlantAttributes {
    hardiness?: {
        min: string
        max: string
    }
    image: string
    plant_name: string
    plant_id?: number
    sunlight?: string[]
    type: string
}

export interface DecorAttributes {
    image: string
    plant_name: string
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

    const handleApiError = (error: string) => {
        setApiError(error)
    }

    let cards;


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
        cards = decorList.map((item: DecorData) => {
            return <Card plant={item.attributes} modal={modal} setModal={setModal} key={nanoid()} />
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