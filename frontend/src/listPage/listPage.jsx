import { listData } from "./lib/dummydata";
import React from 'react'
import './listPage.scss'
import Filter from './filter/Filter'
import Card from './card/Card'
import Map from '../components/singlePage/map'
import Navbar from '../components/landingPage/navbar'
import Footer from '../components/landingPage/footer'


function ListPage() {

    const data = listData

    return (
            
        <div className='w-full overflow-hidden '>
        <div className="listPage">
            <div className="listContainer">
                <div className='wrapper'>
                    <Filter />
                    {data.map(item => (
                        <Card key={item.id} item={ item } />
                    ))}
                </div>
            </div>
            <div className="mapContainer">
                <Map items={data}></Map>
            </div>
        </div>
        <Footer />
        </div>
    )
}

export default ListPage