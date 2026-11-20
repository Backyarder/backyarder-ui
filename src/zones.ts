// USDA hardiness zone fit: does a plant survive the winters where you garden?

export type ZoneFit = 'fits' | 'too-cold' | 'too-warm' | 'unknown' | 'indoor'

type Hardiness = { min?: string | null; max?: string | null } | null | undefined

// "8a" -> 8, "10b" -> 10; null when missing or unreadable.
export const zoneNumber = (zone: string | null | undefined): number | null => {
  const n = parseInt(zone ?? '', 10)
  return Number.isFinite(n) ? n : null
}

export const zoneFit = (hardiness: Hardiness, userZone: string | null | undefined, collection?: string | null): ZoneFit => {
  if (collection === 'indoor') return 'indoor'
  const zone = zoneNumber(userZone)
  const min = zoneNumber(hardiness?.min)
  const max = zoneNumber(hardiness?.max)
  if (zone === null || min === null || max === null) return 'unknown'
  if (zone < min) return 'too-cold'   // your winters are colder than it can take
  if (zone > max) return 'too-warm'   // it needs colder winters than you get
  return 'fits'
}

// Short explanation for tooltips and the details page.
export const zoneFitText = (fit: ZoneFit, userZone: string | null | undefined): string => {
  switch (fit) {
    case 'fits': return `Grows in your zone (${userZone})`
    case 'too-cold': return `Not winter hardy in zone ${userZone}`
    case 'too-warm': return `Needs colder winters than zone ${userZone}`
    case 'indoor': return 'Houseplant'
    default: return 'Hardiness zone'
  }
}
