// Companion planting: which common garden plants help or hinder each other
// when grown side by side. A hand-written table of the classic pairings;
// plants not in it simply get no hints. Matching is by whole word in the
// plant's common name, so "cherry tomato" is a tomato and "peppermint" is not
// a pepper.

export type Relation = 'good' | 'bad'

type Entry = {
  id: string
  label: string
  keywords: string[]
  good: string[]   // ids of entries this one likes next to it
  bad: string[]    // ids of entries to keep away from
}

const ENTRIES: Entry[] = [
  { id: 'tomato', label: 'tomatoes', keywords: ['tomato'], good: ['basil', 'carrot', 'allium', 'chive', 'marigold', 'nasturtium', 'parsley', 'asparagus', 'lettuce', 'borage'], bad: ['brassica', 'corn', 'fennel', 'potato', 'dill'] },
  { id: 'basil', label: 'basil', keywords: ['basil'], good: ['tomato', 'pepper', 'oregano', 'asparagus', 'marigold'], bad: ['rue', 'sage'] },
  { id: 'carrot', label: 'carrots', keywords: ['carrot'], good: ['tomato', 'allium', 'chive', 'lettuce', 'pea', 'bean', 'rosemary', 'sage', 'radish'], bad: ['dill', 'parsnip'] },
  { id: 'allium', label: 'onions and garlic', keywords: ['onion', 'garlic', 'leek', 'shallot', 'scallion'], good: ['carrot', 'beet', 'tomato', 'lettuce', 'brassica', 'strawberry', 'chamomile'], bad: ['bean', 'pea', 'asparagus'] },
  { id: 'chive', label: 'chives', keywords: ['chive', 'chives'], good: ['carrot', 'tomato', 'lettuce', 'brassica', 'strawberry'], bad: ['bean', 'pea'] },
  { id: 'bean', label: 'beans', keywords: ['bean', 'beans'], good: ['corn', 'squash', 'cucumber', 'carrot', 'brassica', 'potato', 'strawberry', 'radish', 'marigold', 'rosemary', 'pea'], bad: ['allium', 'chive', 'pepper', 'sunflower', 'fennel'] },
  { id: 'pea', label: 'peas', keywords: ['pea', 'peas'], good: ['carrot', 'radish', 'turnip', 'cucumber', 'corn', 'bean', 'spinach', 'lettuce', 'mint'], bad: ['allium', 'chive'] },
  { id: 'corn', label: 'corn', keywords: ['corn', 'maize'], good: ['bean', 'squash', 'cucumber', 'pea', 'melon', 'potato', 'sunflower', 'dill'], bad: ['tomato', 'celery'] },
  { id: 'squash', label: 'squash and pumpkins', keywords: ['squash', 'pumpkin', 'zucchini', 'courgette', 'gourd'], good: ['corn', 'bean', 'nasturtium', 'marigold', 'radish', 'borage', 'oregano'], bad: ['potato'] },
  { id: 'cucumber', label: 'cucumbers', keywords: ['cucumber'], good: ['bean', 'pea', 'corn', 'radish', 'sunflower', 'dill', 'nasturtium', 'lettuce'], bad: ['potato', 'sage'] },
  { id: 'lettuce', label: 'lettuce', keywords: ['lettuce'], good: ['carrot', 'radish', 'strawberry', 'cucumber', 'allium', 'chive', 'beet'], bad: [] },
  { id: 'pepper', label: 'peppers', keywords: ['pepper', 'peppers', 'capsicum', 'chili', 'chilli', 'jalapeno'], good: ['basil', 'tomato', 'allium', 'carrot', 'oregano', 'marjoram', 'parsley'], bad: ['bean', 'fennel', 'brassica'] },
  { id: 'potato', label: 'potatoes', keywords: ['potato', 'potatoes'], good: ['bean', 'corn', 'brassica', 'horseradish', 'marigold', 'pea'], bad: ['tomato', 'cucumber', 'squash', 'sunflower'] },
  { id: 'brassica', label: 'the cabbage family', keywords: ['cabbage', 'broccoli', 'cauliflower', 'kale', 'brussels', 'kohlrabi', 'collard', 'collards'], good: ['allium', 'chive', 'beet', 'celery', 'dill', 'chamomile', 'potato', 'rosemary', 'sage', 'thyme', 'nasturtium', 'spinach', 'mint'], bad: ['tomato', 'strawberry', 'pepper'] },
  { id: 'beet', label: 'beets', keywords: ['beet', 'beets', 'beetroot'], good: ['allium', 'brassica', 'lettuce', 'bean'], bad: ['mustard'] },
  { id: 'radish', label: 'radishes', keywords: ['radish', 'radishes'], good: ['cucumber', 'lettuce', 'pea', 'carrot', 'bean', 'squash', 'nasturtium', 'spinach'], bad: ['hyssop'] },
  { id: 'spinach', label: 'spinach', keywords: ['spinach'], good: ['strawberry', 'pea', 'bean', 'brassica', 'radish', 'lettuce'], bad: [] },
  { id: 'strawberry', label: 'strawberries', keywords: ['strawberry', 'strawberries'], good: ['bean', 'lettuce', 'spinach', 'allium', 'borage', 'thyme'], bad: ['brassica'] },
  { id: 'melon', label: 'melons', keywords: ['melon', 'watermelon', 'cantaloupe'], good: ['corn', 'radish', 'nasturtium', 'sunflower'], bad: ['potato'] },
  { id: 'asparagus', label: 'asparagus', keywords: ['asparagus'], good: ['tomato', 'basil', 'parsley', 'dill', 'marigold'], bad: ['allium', 'potato'] },
  { id: 'celery', label: 'celery', keywords: ['celery'], good: ['tomato', 'brassica', 'bean', 'allium'], bad: ['corn'] },
  { id: 'eggplant', label: 'eggplant', keywords: ['eggplant', 'aubergine'], good: ['bean', 'pepper', 'spinach', 'thyme', 'marigold'], bad: ['fennel'] },
  { id: 'fennel', label: 'fennel', keywords: ['fennel'], good: [], bad: ['tomato', 'bean', 'pepper', 'eggplant', 'cucumber', 'brassica', 'coriander'] },
  { id: 'dill', label: 'dill', keywords: ['dill'], good: ['brassica', 'cucumber', 'corn', 'lettuce', 'allium'], bad: ['carrot', 'tomato'] },
  { id: 'mint', label: 'mint', keywords: ['mint', 'spearmint'], good: ['brassica', 'tomato', 'pea'], bad: [] },
  { id: 'rosemary', label: 'rosemary', keywords: ['rosemary'], good: ['bean', 'brassica', 'carrot', 'sage'], bad: [] },
  { id: 'sage', label: 'sage', keywords: ['sage'], good: ['rosemary', 'brassica', 'carrot', 'strawberry'], bad: ['cucumber', 'basil'] },
  { id: 'thyme', label: 'thyme', keywords: ['thyme'], good: ['brassica', 'strawberry', 'eggplant', 'tomato'], bad: [] },
  { id: 'parsley', label: 'parsley', keywords: ['parsley'], good: ['tomato', 'asparagus', 'carrot', 'pepper', 'corn'], bad: [] },
  { id: 'oregano', label: 'oregano', keywords: ['oregano', 'marjoram'], good: ['pepper', 'basil', 'squash', 'brassica'], bad: [] },
  { id: 'marigold', label: 'marigolds', keywords: ['marigold', 'marigolds', 'tagetes'], good: ['tomato', 'pepper', 'potato', 'cucumber', 'squash', 'bean', 'brassica', 'basil', 'asparagus'], bad: [] },
  { id: 'nasturtium', label: 'nasturtiums', keywords: ['nasturtium', 'nasturtiums'], good: ['squash', 'cucumber', 'tomato', 'brassica', 'radish', 'bean', 'melon'], bad: [] },
  { id: 'sunflower', label: 'sunflowers', keywords: ['sunflower', 'sunflowers'], good: ['cucumber', 'corn', 'melon'], bad: ['potato', 'bean'] },
  { id: 'borage', label: 'borage', keywords: ['borage'], good: ['tomato', 'squash', 'strawberry', 'brassica'], bad: [] },
  { id: 'chamomile', label: 'chamomile', keywords: ['chamomile', 'camomile'], good: ['brassica', 'allium'], bad: [] },
  { id: 'coriander', label: 'coriander', keywords: ['coriander', 'cilantro'], good: ['spinach', 'tomato'], bad: ['fennel'] },
  { id: 'turnip', label: 'turnips', keywords: ['turnip', 'turnips'], good: ['pea'], bad: ['potato'] },
  { id: 'parsnip', label: 'parsnips', keywords: ['parsnip', 'parsnips'], good: ['bean', 'pea', 'radish'], bad: ['carrot'] },
  { id: 'mustard', label: 'mustard', keywords: ['mustard'], good: [], bad: ['beet'] },
  { id: 'hyssop', label: 'hyssop', keywords: ['hyssop'], good: ['brassica'], bad: ['radish'] },
  { id: 'rue', label: 'rue', keywords: ['rue'], good: [], bad: ['basil'] },
  { id: 'horseradish', label: 'horseradish', keywords: ['horseradish'], good: ['potato'], bad: [] },
]

const BY_ID = new Map(ENTRIES.map(e => [e.id, e]))
const KEYWORD_PATTERNS = ENTRIES.map(e => ({ entry: e, pattern: new RegExp(`\\b(${e.keywords.join('|')})\\b`, 'i') }))

// The table entry for a plant's common name, or null if we know nothing about it.
export const companionEntry = (name: string | null | undefined): Entry | null => {
  if (!name) return null
  const hit = KEYWORD_PATTERNS.find(({ pattern }) => pattern.test(name))
  return hit ? hit.entry : null
}

// Whether two plants help ('good') or hinder ('bad') each other, or null when
// nothing is known. A "bad" from either side wins over a "good".
export const relation = (nameA: string | null | undefined, nameB: string | null | undefined): Relation | null => {
  const a = companionEntry(nameA)
  const b = companionEntry(nameB)
  if (!a || !b || a.id === b.id) return null
  if (a.bad.includes(b.id) || b.bad.includes(a.id)) return 'bad'
  if (a.good.includes(b.id) || b.good.includes(a.id)) return 'good'
  return null
}

export type CompanionHint = { label: string; likes: string[]; avoid: string[] }

// Readable lists for a plant: what it likes next to it and what to keep away.
export const companionsFor = (name: string | null | undefined): CompanionHint | null => {
  const entry = companionEntry(name)
  if (!entry) return null
  const labels = (ids: string[]) => ids.map(id => BY_ID.get(id)?.label).filter((l): l is string => !!l)
  return { label: entry.label, likes: labels(entry.good), avoid: labels(entry.bad) }
}

// The eight cells around a grid position such as "B3" (rows A-J, columns 1-10).
export const neighbourIds = (id: string): string[] => {
  const row = id.charCodeAt(0) - 'A'.charCodeAt(0)
  const col = parseInt(id.slice(1), 10) - 1
  const ids: string[] = []
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if ((r === row && c === col) || r < 0 || r > 9 || c < 0 || c > 9) continue
      ids.push(String.fromCharCode('A'.charCodeAt(0) + r) + (c + 1))
    }
  }
  return ids
}
