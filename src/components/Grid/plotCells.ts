// Cell ids for a plot: rows lettered from A, columns numbered from 1
// ("A1" ... "J10" for 10 x 10).
export const DEFAULT_SIZE = 10

export const plotCellIds = (rows: number, cols: number): string[] => {
  const ids: string[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) ids.push(String.fromCharCode(65 + r) + c)
  }
  return ids
}
