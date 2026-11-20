import { KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GardenArea, NewPlot } from '../../apiCalls'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import NewPlotForm from './NewPlotForm'
import './GardenAreas.scss'

type Props = {
  areas: GardenArea[]
  activeId: number | null
  onSelect: (id: number) => void
  onAdd: (plot: NewPlot) => Promise<GardenArea>
  onRename: (id: number, name: string) => Promise<void>
  onSetIndoor: (id: number, indoor: boolean) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

const MAX_NAME = 40

// A row of named garden plots above the grid. Click another plot to open it.
// Click the open plot to get its menu: rename, outdoor or indoor, delete.
// "Add plot" opens a form for the name, size and indoors/outdoors. Adding
// and deleting show a spinner until the server answers.
const GardenAreas = ({ areas, activeId, onSelect, onAdd, onRename, onSetIndoor, onDelete }: Props) => {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [confirmDelete, setConfirmDelete] = useState<GardenArea | null>(null)
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [formLeft, setFormLeft] = useState<number>(0)
  const addRef = useRef<HTMLButtonElement>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [savingKind, setSavingKind] = useState<boolean>(false)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [menuLeft, setMenuLeft] = useState<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const active = areas.find(a => a.id === activeId) ?? null

  useEffect(() => {
    if (editingId !== null) inputRef.current?.select()
  }, [editingId])

  // The menu hangs under the open plot's pill (outside the scrolling row,
  // so it isn't clipped).
  useLayoutEffect(() => {
    if (!menuOpen || !activeRef.current || !barRef.current) return
    const pill = activeRef.current.getBoundingClientRect()
    const bar = barRef.current.getBoundingClientRect()
    setMenuLeft(pill.left - bar.left)
  }, [menuOpen, activeId, areas])

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (!menuRef.current?.contains(target) && !activeRef.current?.contains(target)) setMenuOpen(false)
    }
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => { setMenuOpen(false) }, [activeId])

  const startRename = (area: GardenArea) => {
    setMenuOpen(false)
    setError('')
    setDraft(area.name)
    setEditingId(area.id)
  }

  const finishRename = () => {
    if (editingId === null) return
    const id = editingId
    const name = draft.trim()
    const current = areas.find(a => a.id === id)
    if (!name) { setError('Give this plot a name.'); return }
    setEditingId(null)
    if (current && name === current.name) return
    onRename(id, name).catch((err: Error) => {
      setError(err.message)
      setDraft(name)
      setEditingId(id)
    })
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') finishRename()
    if (e.key === 'Escape') { setEditingId(null); setError('') }
  }

  const toggleForm = () => {
    setMenuOpen(false)
    setError('')
    if (!formOpen && addRef.current && barRef.current) {
      const button = addRef.current.getBoundingClientRect()
      const bar = barRef.current.getBoundingClientRect()
      setFormLeft(Math.max(0, button.left - bar.left))
    }
    setFormOpen(open => !open)
  }

  // The form shows its own spinner and errors; it closes once the plot exists.
  const create = (plot: NewPlot) => onAdd(plot).then(() => setFormOpen(false))

  const remove = (area: GardenArea) => {
    setConfirmDelete(null)
    setError('')
    setDeletingId(area.id)
    onDelete(area.id)
      .catch((err: Error) => setError(err.message))
      .finally(() => setDeletingId(null))
  }

  const chooseKind = (indoor: boolean) => {
    if (!active || active.indoor === indoor || savingKind) return
    setSavingKind(true)
    setError('')
    onSetIndoor(active.id, indoor)
      .then(() => setMenuOpen(false))
      .catch((err: Error) => setError(err.message))
      .finally(() => setSavingKind(false))
  }

  return (
    <div id='garden-areas' ref={barRef} role='navigation' aria-label='Garden plots'>
      <ul className='area-tabs'>
        {areas.map(area => {
          const isActive = area.id === activeId
          const icon = area.indoor ? 'home' : 'yard'
          return (
            <li key={area.id}>
              {deletingId === area.id ? (
                <span className='area-tab deleting' aria-busy='true'>
                  <span className='material-symbols-rounded area-spinner' aria-hidden='true'>progress_activity</span>
                  <span className='area-name'>Deleting {area.name}…</span>
                </span>
              ) : isActive && editingId === area.id ? (
                <span className='area-tab active editing'>
                  <span className='material-symbols-rounded area-icon'>{icon}</span>
                  <input
                    ref={inputRef}
                    className='area-name-input'
                    aria-label='Plot name'
                    value={draft}
                    maxLength={MAX_NAME}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={onKey}
                    onBlur={finishRename}
                  />
                </span>
              ) : (
                <button
                  type='button'
                  ref={isActive ? activeRef : undefined}
                  className={`area-tab ${isActive ? 'active' : ''} ${isActive && menuOpen ? 'menu-open' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-haspopup={isActive ? 'menu' : undefined}
                  aria-expanded={isActive ? menuOpen : undefined}
                  title={isActive ? `${area.name} settings` : `Open ${area.name}`}
                  onClick={() => (isActive ? setMenuOpen(o => !o) : onSelect(area.id))}
                >
                  <span className='material-symbols-rounded area-icon'>{icon}</span>
                  <span className='area-name'>{area.name}</span>
                  {!isActive && area.needs_water_count > 0 && (
                    <span className='area-due' title={`${area.needs_water_count} due for water`}>
                      <span className='material-symbols-rounded'>water_drop</span>{area.needs_water_count}
                    </span>
                  )}
                  {isActive && <span className='material-symbols-rounded area-chevron'>expand_more</span>}
                </button>
              )}
            </li>
          )
        })}
        <li>
          <button type='button' ref={addRef} className={`area-add ${formOpen ? 'open' : ''}`} onClick={toggleForm} aria-expanded={formOpen}>
            <span className='material-symbols-rounded'>add</span>Add plot
          </button>
        </li>
      </ul>

      {menuOpen && active && (
        <div className='area-menu' ref={menuRef} role='menu' style={{ left: menuLeft }}>
          <button type='button' role='menuitem' className='area-menu-item' onClick={() => startRename(active)}>
            <span className='material-symbols-rounded'>edit</span>Rename
          </button>

          <p className='area-menu-label'>Where is this plot?</p>
          <div role='radiogroup' aria-label={`Where is ${active.name}?`}>
            {[
              { indoor: false, icon: 'wb_sunny', title: 'Outdoors', detail: 'Rain counts as watering. Frost warnings apply.' },
              { indoor: true, icon: 'home', title: 'Indoors', detail: 'No rain credit or frost warnings.' },
            ].map(kind => {
              const chosen = active.indoor === kind.indoor
              return (
                <button key={kind.title} type='button' role='radio' aria-checked={chosen}
                  className={`area-menu-item area-kind-option ${chosen ? 'chosen' : ''}`}
                  disabled={savingKind} onClick={() => chooseKind(kind.indoor)}>
                  <span className='material-symbols-rounded'>{kind.icon}</span>
                  <span className='area-kind-text'>
                    <strong>{kind.title}</strong>
                    <small>{kind.detail}</small>
                  </span>
                  <span className='material-symbols-rounded area-check' aria-hidden='true'>
                    {savingKind && !chosen ? '' : chosen ? 'check' : ''}
                  </span>
                </button>
              )
            })}
          </div>

          {areas.length > 1 && (
            <>
              <hr />
              <button type='button' role='menuitem' className='area-menu-item danger'
                disabled={deletingId !== null} onClick={() => { setMenuOpen(false); setConfirmDelete(active) }}>
                <span className='material-symbols-rounded'>delete</span>Delete plot
              </button>
            </>
          )}
        </div>
      )}

      {formOpen && <NewPlotForm onCreate={create} onCancel={() => setFormOpen(false)} style={{ left: formLeft }} />}

      {error && <p className='area-error' role='alert'>{error}</p>}

      {confirmDelete && (
        <ConfirmModal
          message={`Delete the plot "${confirmDelete.name}" and everything in it? This cannot be undone.`}
          onConfirm={() => remove(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}

export default GardenAreas
