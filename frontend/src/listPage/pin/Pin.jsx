import { Marker, Popup } from 'react-leaflet'

import './pin.scss'
import { Link } from 'react-router-dom'

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});



function Pin({ item }) {
    
  const position = [item.latitude, item.longitude]


  return (
      



    <Marker position={position}>
      <Popup>
            <div className="popupContainer">
               <img src={item.img} alt="" />
               <div className="textContainer">
                   <Link to={`/react-estate-ui/${item.id}`}>{item.title}</Link>
                   <span >{item.bedroom} bedroom</span>
                   <b>$ { item.price}</b>
               </div>
            </div>
      </Popup>
    </Marker>
    )
   
}

export default Pin