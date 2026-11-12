// Base URL for the Backyarder API. In development and production this is the
// same-origin path /api/v1: the Vite dev server proxies it to localhost:9292
// (vite.config.ts) and Vercel rewrites it to Render (vercel.json), so the
// session cookie is always first-party. Falls back to a local backend.
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:9292/api/v1'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// The backend answers errors with { error: "<human readable message>" }
// (401 not logged in, 422 validation, 502/503 plant database); surface that.
const handleError = async (res: Response) => {
    if(!res.ok) {
      let message = `HTTP Error: ${res.status} -- Please try again later`
      try {
        const body = await res.json()
        if (body && typeof body.error === 'string') message = body.error
      } catch {}
      if (res.status === 401) window.dispatchEvent(new Event('backyarder:unauthorized'))
      throw new ApiError(res.status, message)
    }
    // DELETE routes answer with an empty body; treat that as null, not a JSON error.
    return res.text().then(text => text ? JSON.parse(text) : null)
  }

const request = (path: string, init: RequestInit = {}) => {
  return fetch(`${BASE_URL}${path}`, { credentials: 'include', ...init }).then(handleError)
}

const jsonRequest = (path: string, method: string, body?: object) => {
  return request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  })
}

// --- accounts ---------------------------------------------------------------

export type User = {
  id: string
  email: string
  zip_code: string | null
  hardiness_zone: string | null
}

const toUser = (payload: any): User => ({ id: payload.data.id, ...payload.data.attributes })

const getMe = (): Promise<User> => request('/auth/me').then(toUser)
const signup = (email: string, password: string, zip_code?: string): Promise<User> =>
  jsonRequest('/auth/signup', 'POST', { email, password, zip_code }).then(toUser)
const login = (email: string, password: string): Promise<User> =>
  jsonRequest('/auth/login', 'POST', { email, password }).then(toUser)
const logout = (): Promise<null> => request('/auth/logout', { method: 'DELETE' })
const updateMe = (changes: { zip_code?: string }): Promise<User> =>
  jsonRequest('/auth/me', 'PATCH', changes).then(toUser)

const forgotPassword = (email: string) => jsonRequest('/auth/forgot', 'POST', { email })
const resetPassword = (token: string, password: string): Promise<User> =>
  jsonRequest('/auth/reset', 'POST', { token, password }).then(toUser)

// --- alerts -----------------------------------------------------------------

export type Alerts = {
  date: string
  needs_water: { location_id: string; name: string | null; plant_id: number | null; watering: string | null; next_water_at: string | null }[]
  recent_rain_in: number
  rain_covers_watering: boolean
  frost: { date: string; low_f: number } | null
  weather_available: boolean
  zip_code: string | null
}

const getAlerts = (): Promise<Alerts> => request('/alerts')

// --- wishlist ---------------------------------------------------------------

const getWishlist = (): Promise<number[]> =>
  request('/wishlist').then(data => data.data.map((item: any) => item.attributes.plant_id as number))
const addToWishlist = (plant_id: number) => jsonRequest('/wishlist', 'POST', { plant_id })
const removeFromWishlist = (plant_id: number) => request(`/wishlist/${plant_id}`, { method: 'DELETE' })

// --- plants -----------------------------------------------------------------

const getPlantList = () => request('/plants')

const getGarden = () => request('/garden')

const searchPlants = (searchterm: string) => request(`/search/${searchterm}`)

const getPlantDetails = (id: string | undefined) => request(`/plants/${id}`, { cache: 'force-cache' })

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

// What a cell needs to know about the thing placed in it. A sidebar card, a
// search result and a garden cell all satisfy this.
export type PlacedPlant = {
  name?: string | null
  content_type?: string | null
  image?: string | null
  plant_id?: number | null
  watering?: keyof WateringType | null
}

const patchCellContents = (plant: PlacedPlant, id: string, status: keyof StatusType, watering?: keyof WateringType | null) => {
  return jsonRequest('/cell', 'PATCH', {
    name: plant.name,
    content_type: plant.content_type,
    location_id: id,
    image: plant.image,
    status: STATUS_MAP[status],
    // Unknown watering is left out so the backend can look it up.
    watering: watering ? WATERING_MAP[watering] : undefined,
    plant_id: plant.plant_id
  })
}

const patchDisabledOrRemoved = (id: string, status: keyof StatusType) => {
  return jsonRequest('/cell', 'PATCH', {
    name: null,
    content_type: null,
    location_id: id,
    image: null,
    status: STATUS_MAP[`${status}`],
    watering: 'None',
    plant_id: null
  })
}

// Records a watering; the response carries the new next_water_at.
const waterCell = (id: string) => jsonRequest('/cell', 'PATCH', { action: 'water', location_id: id })

// 'all' empties every cell; 'garden' empties only placed (unplanted) ones.
const deleteContents = (path: 'all' | 'garden'): Promise<null> => request(`/${path}`, { method: 'DELETE' })

export { getPlantList, getGarden, searchPlants, getPlantDetails, patchCellContents, patchDisabledOrRemoved, waterCell, deleteContents,
  getMe, signup, login, logout, updateMe, forgotPassword, resetPassword, getAlerts, getWishlist, addToWishlist, removeFromWishlist }
