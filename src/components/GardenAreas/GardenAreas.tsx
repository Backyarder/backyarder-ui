import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { GardenArea } from '../../apiCalls'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import './GardenAreas.scss'

type Props = {
  areas: GardenArea[]
  activeId: number | null
  onSelect: (id: number) => void
  onAdd: () => Promise<GardenArea | void>
  onRename: (id: number, name: string) => Promise<void>
  onSetIndoor: (id: number, indoor: boolean) => void
  onDelete: (id: number) => Promise<void>
}

const MAX_NAME = 40

// A row of named garden plots above the grid. The open one can be renamed
// (click its name or the pencil), switched between outdoor and indoor, or
// deleted; "Add plot" makes a new one and starts naming it. Adding and
// deleting show a spinner until the server answers.
const GardenAreas = ({ areas, activeId, onSelect, onAdd, onRename, onSetIndoor, onDelete }: Props) => {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [confirmDelete, setConfirmDelete] = useState<GardenArea | null>(null)
  const [adding, setAdding] = useState<boolean>(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const active = areas.find(a => a.id === activeId) ?? null

  useEffect(() => {
    if (editingId !== null) inputRef.current?.select()
  }, [editingId])

  const startRename = (area: GardenArea) => {
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

  const add = () => {
    if (adding) return
    setError('')
    setAdding(true)
    onAdd()
      .then(area => { if (area) startRename(area) })
      .catch((err: Error) => setError(err.message))
      .finally(() => setAdding(false))
  }

  const remove = (area: GardenArea) => {
    setConfirmDelete(null)
    setError('')
    setDeletingId(area.id)
    onDelete(area.id)
      .catch((err: Error) => setError(err.message))
      .finally(() => setDeletingId(null))
  }

  return (
    <div id='garden-areas' role='navigation' aria-label='Garden plots'>
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
                  className={`area-tab ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  title={isActive ? 'Click to rename' : `Open ${area.name}`}
                  onClick={() => (isActive ? startRename(area) : onSelect(area.id))}
                >
                  <span className='material-symbols-rounded area-icon'>{icon}</span>
                  <span className='area-name'>{area.name}</span>
                  {!isActive && area.needs_water_count > 0 && (
                    <span className='area-due' title={`${area.needs_water_count} due for water`}>
                      <span className='material-symbols-rounded'>water_drop</span>{area.needs_water_count}
                    </span>
                  )}
                  {isActive && <span className='material-symbols-rounded area-edit'>edit</span>}
                </button>
              )}
            </li>
          )
        })}
        <li>
          <button type='button' className={`area-add ${adding ? 'busy' : ''}`} onClick={add} disabled={adding} aria-busy={adding}>
            {adding
              ? <><span className='material-symbols-rounded area-spinner' aria-hidden='true'>progress_activity</span>Adding plot…</>
              : <><span className='material-symbols-rounded'>add</span>Add plot</>}
          </button>
        </li>
      </ul>

      {active && (
        <div className='area-settings'>
          <div className='area-kind' role='radiogroup' aria-label={`${active.name} is`}>
            <button type='button' role='radio' aria-checked={!active.indoor} className={!active.indoor ? 'on' : ''}
              title='Outdoors: rain counts as watering, frost warnings apply' onClick={() => active.indoor && onSetIndoor(active.id, false)}>
              <span className='material-symbols-rounded'>wb_sunny</span>Outdoor
            </button>
            <button type='button' role='radio' aria-checked={active.indoor} className={active.indoor ? 'on' : ''}
              title='Indoors: no rain credit and no frost warnings' onClick={() => !active.indoor && onSetIndoor(active.id, true)}>
              <span className='material-symbols-rounded'>home</span>Indoor
            </button>
          </div>
          {areas.length > 1 && (
            <button type='button' className='area-delete' disabled={deletingId !== null} title={`Delete ${active.name}`} aria-label={`Delete ${active.name}`} onClick={() => setConfirmDelete(active)}>
              <span className='material-symbols-rounded'>delete</span>
            </button>
          )}
        </div>
      )}

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
