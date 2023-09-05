import { useState, useEffect, ChangeEvent } from "react"
import Card from "../Card/Card"
import './Sidebar.scss'
import { getPlantList, searchPlants } from "../../apiCalls"

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
  plant_name: string
  plant_id: number
  sunlight: string[]
  type: string
}

const Sidebar = () => {
  const [plantList, setPlantList] = useState<PlantData[]>([])
  // eslint-disable-next-line
  const [apiError, setApiError] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loadingPlants, setLoadingPlants] = useState<boolean>(true)

  useEffect(() => {
    getPlantList()
      .then(data => setPlantList(data.data))
      .then(() => setLoadingPlants(false))
      .catch((err) => {
        handleApiError(err)
      })
  }, [])

  const handleApiError = (error: string) => {
    setApiError(error)
  }

  let cards;

  if (!plantList) {
    cards = <p className="loading">It looks like our nursery is not operating correctly, please try again later</p>
  }
  else if (plantList.length) {
    cards = plantList.map((plant: PlantData) => {
      const plantImage = plant.attributes.image
        ? plant.attributes.image
        : `${process.env.PUBLIC_URL}/images/plant-fallback.png`
      plant.attributes.image = plantImage
      return <Card plant={plant.attributes} key={plant.attributes.plant_id} />
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
      <h2>PLANTS</h2>
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