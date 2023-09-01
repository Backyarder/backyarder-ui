const handleError = (res: Response) => {
    if(!res.ok) {
      throw new Error(`HTTP Error: ${res.status} -- Please try again later`)
    }
    return res.json()
  }

const getPlantList = () => {
    return fetch(`https://backyarder-be-47454958a7d2.herokuapp.com/index`, {
        cache: 'force-cache',
    })
        .then(res => handleError(res))
}

export { getPlantList }
