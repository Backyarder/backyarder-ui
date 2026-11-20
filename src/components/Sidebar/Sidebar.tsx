import { useState, useEffect, ChangeEvent } from "react"
import { nanoid } from 'nanoid'
import Card from "../Card/Card"
import CategoryPicker, { Category } from "./CategoryPicker"
import './Sidebar.scss'
import { getPlantList, searchPlants } from "../../apiCalls"
import decorData from '../../decor_data.json'
import { useAuth } from "../../auth/AuthContext"
import { zoneFit } from "../../zones"

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
    name: string
    plant_id?: number
    sunlight?: string[]
    type: string
    content_type: string
    collection?: string | null   // "kitchen" for the built-in kitchen garden set
}

export interface DecorAttributes {
    image: string
    name: string
    type: string
}

interface SideBarProps {
    showUnavailable: () => void;
}

const Sidebar = ({ showUnavailable }: SideBarProps) => {
    const [plantList, setPlantList] = useState<PlantData[]>([])
    const [decorList, setDecorList] = useState<DecorData[]>([])
    // eslint-disable-next-line
    const [apiError, setApiError] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loadingPlants, setLoadingPlants] = useState<boolean>(true)
    const [activeTab, setActiveTab] = useState<string>('plants')
    const { user } = useAuth()
    const userZone = user?.hardiness_zone ?? null
    // Hide plants that can't survive the user's winters; off by default, remembered per browser.
    const [zoneOnly, setZoneOnly] = useState<boolean>(() => {
        try { return localStorage.getItem('backyarder:zone-filter') === '1' } catch { return false }
    })
    const toggleZoneOnly = () => {
        setZoneOnly(prev => {
            try { localStorage.setItem('backyarder:zone-filter', prev ? '0' : '1') } catch {}
            return !prev
        })
    }
    const zoneFilterApplies = !!userZone && ['plants', 'kitchen', 'flowers', 'trees', 'succulents'].includes(activeTab)
    const outsideZone = (plant: PlantData) => {
        const fit = zoneFit(plant.attributes.hardiness, userZone, plant.attributes.collection)
        return fit === 'too-cold' || fit === 'too-warm'
    }

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

    const handleApiError = (error: unknown) => {
        setApiError(error instanceof Error ? error.message : String(error))
        setLoadingPlants(false)
    }

    // KITCHEN and DECOR are short local lists: filter them as you type.
    const matchesFilter = (name: string | undefined) => !searchTerm.trim() || (name ?? '').toLowerCase().includes(searchTerm.trim().toLowerCase())

    // Counts per category for the picker (PLANTS = nursery and search results).
    const countIn = (id: string) => (plantList ?? []).filter(plant => (plant.attributes.collection ?? 'plants') === id).length
    const categories: Category[] = [
        { id: 'plants', label: 'Nursery', icon: 'potted_plant', count: countIn('plants') },
        { id: 'kitchen', label: 'Kitchen garden', icon: 'nutrition', count: countIn('kitchen') },
        { id: 'flowers', label: 'Flowers', icon: 'local_florist', count: countIn('flowers') },
        { id: 'trees', label: 'Trees & shrubs', icon: 'park', count: countIn('trees') },
        { id: 'succulents', label: 'Succulents & cacti', icon: 'psychiatry', count: countIn('succulents') },
        { id: 'indoor', label: 'Houseplants', icon: 'chair', count: countIn('indoor') },
        { id: 'decor', label: 'Decor', icon: 'deck', count: (decorList ?? []).length },
    ]

    let cards;
    let hiddenByZone = 0;


    if (apiError) {
        cards = <p className="loading">{apiError}</p>
    }
    else if (!plantList || !decorList) {
        cards = <p className="loading">It looks like our nursery is not operating correctly, please try again later</p>
    }
    else if (plantList.length && ['plants', 'kitchen', 'flowers', 'trees', 'succulents', 'indoor'].includes(activeTab)) {
        // Perenual plants and search results on PLANTS; each built-in
        // collection on its own tab (filtered as you type).
        const inTab = plantList
            .filter(plant => (plant.attributes.collection ?? 'plants') === activeTab)
            .filter(plant => activeTab === 'plants' || matchesFilter(plant.attributes.name))
        const shown = zoneOnly && zoneFilterApplies ? inTab.filter(plant => !outsideZone(plant)) : inTab
        hiddenByZone = inTab.length - shown.length
        cards = shown.map((plant: PlantData) => {
            const plantImage = plant.attributes.image
                ? plant.attributes.image
                : `/images/plant-fallback.png`
            plant.attributes.image = plantImage
            return <Card plant={plant.attributes} showUnavailable={showUnavailable} key={plant.attributes.plant_id} />
        })
    } else if (decorList.length && activeTab === 'decor') {
        cards = decorList.filter(item => matchesFilter(item.attributes.name)).map((item: DecorData) => {
            return <Card plant={item.attributes} showUnavailable={showUnavailable} key={nanoid()} />
        })
    } else {
        cards = <p className="loading">Hmmm... there are no plants in our nursery matching your search.</p>
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
        setApiError('')
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
                <img className="loading-img" src={`/images/plant.png`} alt='small plant' />
                <p>This may take a few moments.</p>
            </div>
        )
    }

    return (
        <section id='plants'>
            <CategoryPicker categories={categories} active={activeTab} onChange={setActiveTab} />
            <div className="search">
                <input
                    className="search-bar"
                    type="text"
                    placeholder={activeTab === 'plants' ? 'Search the nursery... ' : `Filter ${activeTab}... `}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={activeTab === 'plants' ? handleKeyPress : undefined}
                />
                {activeTab === 'plants' && <button className="submit-search" onClick={searchForPlants}><span className="material-symbols-rounded">
                    search
                </span></button>}
            </div>
            {zoneFilterApplies && (
                <label className="zone-toggle">
                    <input type="checkbox" checked={zoneOnly} onChange={toggleZoneOnly} />
                    <span>Only plants for zone {userZone}</span>
                    {zoneOnly && hiddenByZone > 0 && <span className="zone-hidden">{hiddenByZone} hidden</span>}
                </label>
            )}
            <div className="search-results" >
                {loadingPlants ? loading() : cards}
            </div>
        </section >
    )
}

export default Sidebar