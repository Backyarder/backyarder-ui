import Card from "../Card/Card"
import './Sidebar.scss'
import { plantsMockData } from "./plantsMockData"

const Sidebar = () => {
    const cards = plantsMockData.map(plant => <Card plant={plant} key={plant.id} />)

    return (
        <section id='plants'>
            <h2>PLANTS</h2>
            <p>SEARCH</p>
            {cards}
        </section>
    )
}

export default Sidebar
