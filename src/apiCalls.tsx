import { CellContents } from "./components/Cell/Cell"

const handleError = (res: Response) => {
    if(!res.ok) {
      throw new Error(`HTTP Error: ${res.status} -- Please try again later`)
    }
    return res.json()
  }

const getPlantList = () => {
    return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants`, {
      // cache: 'force-cache',
    })
      .then(res => handleError(res))
}

const getGarden = () => {
    return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden`)
      .then(res => handleError(res))
}

const searchPlants = (searchterm: string) => {
  return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/search/${searchterm}`, {
    // cache: 'force-cache'
  })
    .then(res => handleError(res))
}

const getPlantDetails = (id: string | undefined) => {
  return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants/${id}`, {
    cache: 'force-cache'
  })
    .then(res => handleError(res))
}

export type StatusType = {
  'empty': number
  'placed': number
  'disabled': number
  'locked': number
}

const STATUS_MAP: StatusType = {
  'empty': 0,
  'placed': 1,
  'disabled': 2,
  'locked': 3
}

export type WateringType = {
  'None': number | undefined
  'Minimum': number | undefined
  'Average': number | undefined
  'Frequent': number | undefined
}

const WATERING_MAP: WateringType = {
  'None': 0,
  'Minimum': 1,
  'Average': 2,
  'Frequent': 3
}

const patchCellContents = ({plant}: CellContents, id: string, status: keyof StatusType, watering: keyof WateringType) => {
  return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/cell`, {
            method: 'PATCH',
            body: JSON.stringify({
              plant_name: plant.plant_name,
              location_id: id,
              image: plant.image,
              status: STATUS_MAP[`${status}`],
              watering: WATERING_MAP[`${watering}`],
              plant_id: plant.plant_id
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => handleError(res))
}

const patchDisabledOrRemoved = (id: string, status: keyof StatusType) => {
  return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/cell`, {
            method: 'PATCH',
            body: JSON.stringify({
              plant_name: null,
              location_id: id,
              image: null,
              status: STATUS_MAP[`${status}`],
              plant_id: null
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => handleError(res))
}

const deleteContents = (path: string, setter: Function, alert: Function) => {
  return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/${path}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Unable to clear garden');
      }
      setter(true);
      alert(true);
    })
    .catch(err => {
      handleError(err)
    })
}

export { getPlantList, getGarden, searchPlants, getPlantDetails, patchCellContents, patchDisabledOrRemoved, deleteContents }
