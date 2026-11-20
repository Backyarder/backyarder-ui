import { useState, useEffect, ChangeEvent } from "react"
import { nanoid } from 'nanoid'
import Card from "../Card/Card"
import CategoryPicker, { Category } from "./CategoryPicker"
import './Sidebar.scss'
import { getPlantList, searchPlants, getStats } from "../../apiCalls"
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

const NURSERY_DOWN = 'It looks like our nursery is not operating correctly, please try again later'

const Sidebar = ({ showUnavailable }: SideBarProps) => {
    // Everything /plants returns: the 30 Perenual stock plants plus every
    // built-in collection. Searches never replace it.
    const [plantList, setPlantList] = useState<PlantData[]>([])
    // Nursery search results (all categories), or null when not searching.
    const [searchResults, setSearchResults] = useState<PlantData[] | null>(null)
    const [searchableCount, setSearchableCount] = useState<number | null>(null)
    const [decorList, setDecorList] = useState<DecorData[]>([])
    // eslint-disable-next-line
    const [apiError, setApiError] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState<string>('');   // Nursery search box
    const [filterTerm, setFilterTerm] = useState<string>('');   // filter box on the other categories
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
        // How many plants the Nursery search covers, for the placeholder.
        getStats()
            .then(stats => setSearchableCount(stats?.plant_data?.plants_searchable ?? null))
            .catch(() => setSearchableCount(null))
    }, [])

    const handleApiError = (error: unknown) => {
        setApiError(error instanceof Error ? error.message : String(error))
        setLoadingPlants(false)
    }

    // The built-in categories and DECOR are local lists: filter them as you type.
    const matchesFilter = (name: string | undefined) => !filterTerm.trim() || (name ?? '').toLowerCase().includes(filterTerm.trim().toLowerCase())

    // Counts per category for the picker. Nursery has no count: it is a
    // search over thousands of plants, not a fixed list.
    const countIn = (id: string) => (plantList ?? []).filter(plant => (plant.attributes.collection ?? 'plants') === id).length
    const categories: Category[] = [
        { id: 'plants', label: 'Nursery', icon: 'potted_plant' },
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
        cards = <p className="loading">{NURSERY_DOWN}</p>
    }
    else if (plantList.length && ['plants', 'kitchen', 'flowers', 'trees', 'succulents', 'indoor'].includes(activeTab)) {
        // Nursery: search results from every category, or the stock plants
        // when not searching. Other categories: their full list, filtered.
        const inTab = activeTab === 'plants'
            ? (searchResults ?? plantList.filter(plant => !plant.attributes.collection))
            : plantList.filter(plant => plant.attributes.collection === activeTab).filter(plant => matchesFilter(plant.attributes.name))
        const shown = zoneOnly && zoneFilterApplies ? inTab.filter(plant => !outsideZone(plant)) : inTab
        hiddenByZone = inTab.length - shown.length
        cards = shown.map((plant: PlantData) => {
            const plantImage = plant.attributes.image
                ? plant.attributes.image
                : `/images/plant-fallback.png`
            plant.attributes.image = plantImage
            return <Card plant={plant.attributes} showUnavailable={showUnavailable} showCategory={activeTab === 'plants' && searchResults !== null} key={plant.attributes.plant_id} />
        })
        if (shown.length === 0) {
            cards = <p className="loading">Hmmm... there are no plants in our nursery matching your search.</p>
        }
    } else if (decorList.length && activeTab === 'decor') {
        cards = decorList.filter(item => matchesFilter(item.attributes.name)).map((item: DecorData) => {
            return <Card plant={item.attributes} showUnavailable={showUnavailable} key={nanoid()} />
        })
    } else {
        cards = <p className="loading">Hmmm... there are no plants in our nursery matching your search.</p>
    }

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (activeTab === 'plants') {
            setSearchTerm(event.target.value);
            if (event.target.value.trim() === '') setSearchResults(null) // cleared: back to the stock list
        } else {
            setFilterTerm(event.target.value);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            searchForPlants();
        }
    };

    // Searches every plant (built-ins, the Perenual catalogue) and shows the
    // results on Nursery; the other categories keep their full lists.
    const searchForPlants = () => {
        setApiError('')
        if (!searchTerm.trim()) {
            setSearchResults(null)
            return
        }
        setLoadingPlants(true)
        searchPlants(searchTerm.trim().toLowerCase())
            .then(data => {
                // A response without a plant list means the search itself failed.
                if (!Array.isArray(data?.data)) throw new Error(NURSERY_DOWN)
                setSearchResults(data.data)
            })
            .then(() => setLoadingPlants(false))
            .catch(() => {
                handleApiError(new Error(NURSERY_DOWN))
            })
    }

    const searchPlaceholder = activeTab === 'plants'
        ? (searchableCount ? `Search all ${(Math.floor(searchableCount / 100) * 100).toLocaleString()}+ plants... ` : 'Search all plants... ')
        : `Filter ${categories.find(c => c.id === activeTab)?.label.toLowerCase() ?? activeTab}... `

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
                    placeholder={searchPlaceholder}
                    value={activeTab === 'plants' ? searchTerm : filterTerm}
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