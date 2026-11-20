import { useEffect, useRef, useState } from 'react'
import './CategoryPicker.scss'

export type Category = { id: string; label: string; icon: string; count?: number }

type Props = {
  categories: Category[]
  active: string
  onChange: (id: string) => void
}

// One full-width button showing the current category; opens a list of all of
// them. Replaces a row of tabs that no longer fit the sidebar.
const CategoryPicker = ({ categories, active, onChange }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = categories.find(c => c.id === active) ?? categories[0]

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (id: string) => {
    onChange(id)
    setOpen(false)
  }

  return (
    <div className="category-picker-wrap" ref={ref}>
      <button
        type="button"
        className={`category-picker ${open ? 'open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className="material-symbols-rounded category-icon">{current.icon}</span>
        <span className="category-label">{current.label}</span>
        {current.count !== undefined && <span className="category-count">{current.count}</span>}
        <span className="material-symbols-rounded category-chevron">expand_more</span>
      </button>
      {open && (
        <ul className="category-menu" role="listbox" aria-label="Plant categories">
          {categories.map(c => (
            <li key={c.id} role="option" aria-selected={c.id === active}>
              <button type="button" className={`category-option ${c.id}-tab ${c.id === active ? 'active' : ''}`} onClick={() => choose(c.id)}>
                <span className="material-symbols-rounded category-icon">{c.icon}</span>
                <span className="category-label">{c.label}</span>
                {c.count !== undefined && <span className="category-count">{c.count}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CategoryPicker
