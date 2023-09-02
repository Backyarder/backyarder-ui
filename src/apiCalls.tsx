import { CardProps } from "./components/Card/Card"

const handleError = (res: Response) => {
    if(!res.ok) {
      throw new Error(`HTTP Error: ${res.status} -- Please try again later`)
    }
    return res.json()
  }

const getPlantList = () => {
    return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants`, {
        cache: 'force-cache',
    })
        .then(res => handleError(res))
}

const patchCellContents = ({plant}: CardProps, id: string) => {
  console.log(plant)
  return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/cell`, {
      method: 'PATCH',
      body: JSON.stringify({
        plant_name: plant.name,
        location_id: id,
        image: plant.image,
        status: 1,
        plant_id: plant.plant_id
      }),
      headers: {
        'Content-Type': 'application/json'
    }
  })
      .then(res => handleError(res))
}

export { getPlantList, patchCellContents }
