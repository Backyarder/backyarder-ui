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

export { getPlantList, searchPlants, getPlantDetails }
