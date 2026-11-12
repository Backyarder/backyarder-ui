import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alerts } from '../../apiCalls'
import { GardenKeys } from '../Main/Main'
import './AlertBanner.scss'

type Props = {
  garden: GardenKeys | undefined   // the live grid: plants due for water come from here
  alerts: Alerts | undefined       // weather (rain, frost) from GET /alerts
}

const weekday = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'long' })
}

const dismissKey = (date: string | undefined) => `backyarder:alerts-dismissed:${date ?? 'none'}`

// What needs attention today, shown above the garden. Dismissable until the
// next day (per browser).
const AlertBanner = ({ garden, alerts }: Props) => {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try { return sessionStorage.getItem(dismissKey(alerts?.date)) === '1' } catch { return false }
  })

  const due = (garden ?? []).filter(cell => cell.needs_water && cell.name)
  const frost = alerts?.frost ?? null
  const rain = alerts?.rain_covers_watering && due.length > 0
  const needsZip = alerts !== undefined && !alerts.weather_available && !alerts.zip_code

  if (dismissed || (due.length === 0 && !frost && !needsZip)) return null

  const dismiss = () => {
    setDismissed(true)
    try { sessionStorage.setItem(dismissKey(alerts?.date), '1') } catch {}
  }

  const dueNames = due.map(cell => `${cell.name} (${cell.location_id})`).join(', ')

  return (
    <aside id='alert-banner' role='status'>
      <ul>
        {due.length > 0 && (
          <li className='alert-water'>
            <span className='material-symbols-rounded'>water_drop</span>
            <span>
              <strong>{due.length === 1 ? '1 plant needs water' : `${due.length} plants need water`}:</strong> {dueNames}.
              {rain && ` It rained ${alerts?.recent_rain_in} in over the last two days, so you can probably skip it.`}
            </span>
          </li>
        )}
        {frost && (
          <li className='alert-frost'>
            <span className='material-symbols-rounded'>ac_unit</span>
            <span><strong>Frost warning:</strong> a low of {frost.low_f}°F is forecast for {weekday(frost.date)}. Cover or bring in tender plants.</span>
          </li>
        )}
        {needsZip && (
          <li className='alert-hint'>
            <span className='material-symbols-rounded'>location_on</span>
            <span><Link to='/settings'>Add your zip code</Link> to get rain and frost alerts for your garden.</span>
          </li>
        )}
      </ul>
      <button className='alert-dismiss' title='Hide until tomorrow' aria-label='Hide alerts until tomorrow' onClick={dismiss}>
        <span className='material-symbols-rounded'>close</span>
      </button>
    </aside>
  )
}

export default AlertBanner
