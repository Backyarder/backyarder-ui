import Card from "../Card/Card"
import './Sidebar.scss'
import { plantsMockData } from "./plantsMockData"
import { useState, ChangeEvent } from 'react'

const Sidebar = () => {
    const cards = plantsMockData.map(plant => <Card plant={plant} key={plant.id} />)

    const [searchTerm, setSearchTerm] = useState('');

    //when the user adds a search term the state will be updated
    // when the user clicks the search button a onClick function will be fired off
        //onClick will display a loading message in the sidebar, run a fetch call to get the search cards
            //if response is good a cards will be updated and displayed - need to figure this one out a little more
            // if the response is bad then the user will get a message saying that there are no plants mathcing their search OR there was an error on the server side and to try agian later
            

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
