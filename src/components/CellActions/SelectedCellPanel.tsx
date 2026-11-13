import { CellKeys, CellChanges } from '../Grid/Grid'
import { useCellActions, cellFacts } from '../Cell/Cell'
import { companionsFor } from '../../companions'
import CellActions from './CellActions'

type Props = {
  cell: CellKeys
  updateCell: (locationId: string, changes: CellChanges) => void
  resync: () => void
  onClose: () => void
}

// Wires the selected cell's record to the actions panel beside the grid.
const SelectedCellPanel = ({ cell, updateCell, resync, onClose }: Props) => {
  const { plant, water, remove } = useCellActions(cell.location_id, cell, updateCell, resync)
  const { isPlanted } = cellFacts(cell)
  return (
    <CellActions
      locationId={cell.location_id}
      image={cell.image}
      name={cell.name}
      contentType={cell.content_type}
      plantId={cell.plant_id}
      isPlanted={isPlanted}
      needsWater={!!cell.needs_water}
      companions={companionsFor(cell.name)}
      onPlant={plant}
      onWater={water}
      onRemove={remove}
      onClose={onClose}
    />
  )
}

export default SelectedCellPanel
