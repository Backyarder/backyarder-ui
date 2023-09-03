import { CellContents } from "./components/Cell/Cell"

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

const searchPlants = (searchterm: string) => {
  return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/search/${searchterm}`, {
    cache: 'force-cache'
  })
    .then(res => handleError(res))
}

const getPlantDetails = (id: string | undefined) => {
  return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants/${id}`, {
    cache: 'force-cache'
  })
    .then(res => handleError(res))
}

const patchCellContents = ({plant}: CellContents, id: string) => {
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

const deleteContents = (path: string, setter: Function) => {
  return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/${path}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Unable to clear garden');
      }
      console.log(res);
      setter(true);
      alert('Garden cleared.');
    })
    .catch(err => {
      handleError(err)
    })
}

export { getPlantList, searchPlants, getPlantDetails, patchCellContents, deleteContents }
