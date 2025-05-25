import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './map.scss'
import 'leaflet/dist/leaflet.css'
import Pin from './pin/Pin';
import React from 'react';

const position = [51.505, -0.09]

function Map({ items }) {
    

    return (

    <MapContainer center={[51.505, -1.8]} zoom={7} scrollWheelZoom={false} className='map'>
    <TileLayer
      attribution='&copy; <a href="https://maps.app.goo.gl/NvSXzsgWLTMM3HzA7">Phnom Penh</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    /> 
               
    {items.map(item => (
        <Pin item={item} key={item.id} />
    ))}
  </MapContainer>
    )
}

export default Map