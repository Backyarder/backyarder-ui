import Cell from '../Cell/Cell'
import './Grid.scss'
import { cellsMockData } from './cellsMockData'

const Grid = () => {
    const cells = cellsMockData.map(cell => <Cell id={cell.id} key={cell.id}/>)

    return (
        <section id='grid'>
            {cells}
        </section>
    )
}

export default Grid
