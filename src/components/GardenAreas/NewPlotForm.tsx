import { FormEvent, useEffect, useRef, useState } from 'react'
import { NewPlot } from '../../apiCalls'

const MAX_SIDE = 15

// Common bed shapes; rows run top to bottom (A, B, C...), columns across.
const PRESETS: { rows: number; cols: number; label: string }[] = [
  { rows: 2, cols: 6, label: 'Window box or balcony rail' },
  { rows: 3, cols: 3, label: 'Small bed' },
  { rows: 4, cols: 4, label: 'Square-foot bed' },
  { rows: 4, cols: 8, label: 'Raised bed' },
  { rows: 6, cols: 6, label: 'Medium bed' },
  { rows: 8, cols: 8, label: 'Large bed' },
  { rows: 10, cols: 10, label: 'Standard plot' },
  { rows: 12, cols: 12, label: 'Big yard' },
  { rows: 15, cols: 15, label: 'Largest' },
]
const DEFAULT_PRESET = '10x10'
const key = (rows: number, cols: number) => `${rows}x${cols}`

type Props = {
  onCreate: (plot: NewPlot) => Promise<unknown>
  onCancel: () => void
  style?: React.CSSProperties
}

const clampSide = (value: string) => Math.min(MAX_SIDE, Math.max(1, Math.round(Number(value) || 1)))

// The form behind "Add plot": name, size and whether it's indoors.
const NewPlotForm = ({ onCreate, onCancel, style }: Props) => {
  const [name, setName] = useState<string>('')
  const [preset, setPreset] = useState<string>(DEFAULT_PRESET)
  // Custom sizes are typed freely; the numbers used are clamped to 1-15.
  const [rowsText, setRowsText] = useState<string>('10')
  const [colsText, setColsText] = useState<string>('10')
  const rows = clampSide(rowsText)
  const cols = clampSide(colsText)
  const [indoor, setIndoor] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const nameRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => { nameRef.current?.focus() }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !saving) onCancel() }
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!formRef.current?.contains(target) && !target.closest('.area-add') && !saving) onCancel()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [onCancel, saving])

  const choosePreset = (value: string) => {
    setPreset(value)
    if (value === 'custom') return
    const [r, c] = value.split('x')
    setRowsText(r)
    setColsText(c)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setError('')
    onCreate({ name: name.trim() || 'New plot', indoor, rows, cols })
      .catch((err: Error) => { setError(err.message); setSaving(false) })
  }

  return (
    <form className='plot-form' ref={formRef} onSubmit={submit} style={style} aria-label='New plot'>
      <h3>New plot</h3>

      <label className='plot-field'>
        <span>Name</span>
        <input ref={nameRef} value={name} maxLength={40} placeholder='e.g. Raised bed, Back porch' onChange={e => setName(e.target.value)} />
      </label>

      <label className='plot-field'>
        <span>Size</span>
        <select className='plot-size' value={preset} onChange={e => choosePreset(e.target.value)}>
          {PRESETS.map(p => (
            <option key={key(p.rows, p.cols)} value={key(p.rows, p.cols)}>{p.rows} × {p.cols} · {p.label}</option>
          ))}
          <option value='custom'>Custom size…</option>
        </select>
      </label>

      {preset === 'custom' && (
        <div className='plot-custom'>
          <label>
            <input type='number' min={1} max={MAX_SIDE} value={rowsText} aria-label='Rows'
              onChange={e => setRowsText(e.target.value)} onBlur={() => setRowsText(String(rows))} />
            <span>rows</span>
          </label>
          <span className='plot-times'>×</span>
          <label>
            <input type='number' min={1} max={MAX_SIDE} value={colsText} aria-label='Columns'
              onChange={e => setColsText(e.target.value)} onBlur={() => setColsText(String(cols))} />
            <span>across</span>
          </label>
        </div>
      )}

      <div className='plot-preview' aria-hidden='true'>
        <div className='plot-preview-grid' style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, aspectRatio: `${cols} / ${rows}` }}>
          {Array.from({ length: rows * cols }, (_, i) => <span key={i} />)}
        </div>
        <span className='plot-preview-caption'>{rows} {rows === 1 ? 'row' : 'rows'} × {cols} across · {rows * cols} {rows * cols === 1 ? 'space' : 'spaces'}</span>
      </div>

      <div className='plot-field'>
        <span>Where is it?</span>
        <div className='plot-where' role='radiogroup' aria-label='Where is this plot?'>
          <button type='button' role='radio' aria-checked={!indoor} className={!indoor ? 'on' : ''} onClick={() => setIndoor(false)}>
            <span className='material-symbols-rounded'>wb_sunny</span>Outdoors
          </button>
          <button type='button' role='radio' aria-checked={indoor} className={indoor ? 'on' : ''} onClick={() => setIndoor(true)}>
            <span className='material-symbols-rounded'>home</span>Indoors
          </button>
        </div>
        <small className='plot-hint'>{indoor ? 'No rain credit or frost warnings.' : 'Rain counts as watering. Frost warnings apply.'}</small>
      </div>

      {error && <p className='plot-error' role='alert'>{error}</p>}

      <div className='plot-actions'>
        <button type='button' className='plot-cancel' onClick={onCancel} disabled={saving}>Cancel</button>
        <button type='submit' className='plot-create' disabled={saving} aria-busy={saving}>
          {saving
            ? <><span className='material-symbols-rounded area-spinner' aria-hidden='true'>progress_activity</span>Creating…</>
            : 'Create plot'}
        </button>
      </div>
    </form>
  )
}

export default NewPlotForm
