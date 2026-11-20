import { CellKeys } from '../Grid/Grid'

const CHOICES = [1, 2, 3, 4, 5, 7, 10, 14, 21, 28]

const every = (days: number) => days === 1 ? 'every day' : `every ${days} days`

// "Water every 28 days · Established and drought tolerant, rain resets this"
export const scheduleText = (cell: CellKeys): { headline: string; detail: string | null } => {
  const days = cell.watering_days
  if (days === null || days === undefined) {
    return { headline: 'No watering reminders', detail: cell.watering_reason ?? null }
  }
  const reason = cell.watering_reason ?? ''
  const rain = cell.watering_rain_resets ? 'rain resets this' : ''
  const detail = [reason, rain].filter(Boolean).join(', ')
  return { headline: `Water ${every(days)}`, detail: detail || null }
}

type Props = {
  cell: CellKeys
  onChange: (days: number | null) => void
}

// The selected plant's watering plan in plain words, and a way to override it.
// Renders nothing against a backend that doesn't send plans yet.
const WateringSchedule = ({ cell, onChange }: Props) => {
  if (cell.watering_days === undefined) return null

  const { headline, detail } = scheduleText(cell)
  const override = cell.watering_override_days ?? null
  const value = override === null ? 'auto' : String(override)
  const auto = cell.watering_auto_days
  const choices = override && !CHOICES.includes(override) ? [...CHOICES, override].sort((a, b) => a - b) : CHOICES

  return (
    <div className='watering-schedule'>
      <p className='watering-plan'>
        <span className='material-symbols-rounded'>water_drop</span>
        <span>
          <strong>{headline}</strong>
          {detail && <span className='watering-reason'> · {detail}</span>}
        </span>
      </p>
      <label className='watering-override'>
        Reminders
        <select
          value={value}
          onClick={e => e.stopPropagation()}
          onChange={e => onChange(e.target.value === 'auto' ? null : Number(e.target.value))}
        >
          <option value='auto'>Auto ({auto === null || auto === undefined ? 'none' : every(auto)})</option>
          {choices.map(d => <option key={d} value={String(d)}>{every(d).replace(/^e/, 'E')}</option>)}
          <option value='0'>Never</option>
        </select>
      </label>
    </div>
  )
}

export default WateringSchedule
