import './filter.scss'
import img from '../../assets/search.png'
import React from 'react'

function Filter() {
    return (
        <div className="filter">
            <h1>Search results for <b>Phnom Penh</b></h1>
            <div className="top">
                {/* <div className="item">
                    <label htmlFor="city">Location</label>
                    <input type="text" id="city" name="city" placeholder='City Location'/>
                </div> */}
            </div>
            <div className="bottom">
                <div className="item">
                    <label htmlFor="type">Phnom Penh</label>
                    <select name="type" id="type">
                        <option value="buy">Phnom Penh</option>
                        <option value="buy">Siem Reap</option>
                        <option value="rent">Kompot</option>
                    </select>
                </div>
                <div className="item">
                    <label htmlFor="property">Property</label>
                    <select name="property" id="property">
                        <option value="">any</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="land">Land</option>
                    </select>
                </div>
                <div className="item">
                    <label htmlFor="minPrice">Min Price</label>
                    <input type="number" id="minPrice" name="minPrice" placeholder='any'/>
                </div>
                <div className="item">
                    <label htmlFor="maxPrice">Max Price</label>
                    <input type="text" id="maxPrice" name="maxPrice" placeholder='any'/>
                </div>
                <div className="item">
                    <label htmlFor="bedroom">Bedroom</label>
                    <input type="text" id="bedroom" name="bedroom" placeholder='any'/>
                </div>
                {/* <button>
                    <img src={img} alt="search" />
                </button> */}
            </div>
        </div>
    )
}

export default Filter