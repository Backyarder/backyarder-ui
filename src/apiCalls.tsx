import { CellContents } from "./components/Cell/Cell"

// Base URL for the Backyarder API. Set REACT_APP_API_URL (e.g. in .env.development)
// to point at a local backend; falls back to the deployed Heroku instance.
const BASE_URL = process.env.REACT_APP_API_URL ?? 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1'

const handleError = (res: Response) => {
    if(!res.ok) {
      throw new Error(`HTTP Error: ${res.status} -- Please try again later`)
    }
    return res.json()
  }

const getPlantList = () => {
    return fetch(`${BASE_URL}/plants`, {
      // cache: 'force-cache',
    })
      .then(res => handleError(res))
}

const getGarden = () => {
    return fetch(`${BASE_URL}/garden`)
      .then(res => handleError(res))
}

const searchPlants = (searchterm: string) => {
  return fetch(`${BASE_URL}/search/${searchterm}`, {
    // cache: 'force-cache'
  })
    .then(res => handleError(res))
}

const getPlantDetails = (id: string | undefined) => {
  return fetch(`${BASE_URL}/plants/${id}`, {
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
  return fetch(`${BASE_URL}/cell`, {
            method: 'PATCH',
            body: JSON.stringify({
              name: plant.name,
              content_type: plant.content_type,
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
          // .then(data => setter(data.data.attributes["updated_at"]))
}

const patchDisabledOrRemoved = (id: string, status: keyof StatusType) => {
  return fetch(`${BASE_URL}/cell`, {
            method: 'PATCH',
            body: JSON.stringify({
              name: null,
              content_type: null,
              location_id: id,
              image: null,
              status: STATUS_MAP[`${status}`],
              watering: 'None',
              plant_id: null
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => handleError(res))
}

const deleteContents = (path: string, setter: Function, alert: Function) => {
  return fetch(`${BASE_URL}/${path}`, {
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
