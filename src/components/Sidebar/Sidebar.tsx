import Card from "../Card/Card"
import './Sidebar.scss'
import { plantsMockData } from "./plantsMockData"
import { useState, ChangeEvent } from 'react'

const Sidebar = () => {
    const cards = plantsMockData.map(plant => <Card plant={plant} key={plant.id} />)

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <section id='plants'>
            <h2>PLANTS</h2>
            <div className="search">
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Search... "
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button className="submit-search"><span className="material-symbols-rounded">
                    search
                </span></button>
            </div>
            {cards}
        </section>
    )
}

export default Sidebar
