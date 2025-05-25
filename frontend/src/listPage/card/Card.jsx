import { Link } from 'react-router-dom'
import './card.scss'
import pin from '../../../src/assets/pin.png'
import bed from '../../../src/assets/bed.png'
import bath from '../../../src/assets/bath.png'
import save from '../../../src/assets/save.png'
import chat from '../../../src/assets/chat.png'
import React from 'react'

function Card({item}) {
    return (
        <div className="card">
            <Link to={`/real-estate-agency/${item.id}`} className='imageContainer'>
                <img src={item.img} alt="" />
            </Link>
            <div className="textContainer">
                <h2 className="title">
                    <Link to={`/real-estate-agency/${item.id}`}>{item.title }</Link>
                </h2>
                <p className='address'>
                    <img src={pin} alt="" />
                    <span>{item.address}</span>
                </p>
                <p className='price'>$ {item.price}</p>
                <div className='bottom'>
                    <div className="features">
                        <div className="feature">
                            <img src={bed} alt="" />
                            <span>{item.bedroom } bedroom</span>
                        </div>
                        <div className="feature">
                            <img src={bath} alt="" />
                            <span>{item.bathroom }bathroom</span>
                        </div>
                    </div>
                    <div className="icons">
                        <div className="icon">
                            <img src={save} alt="" />
                        </div>
                        <div className="icon">
                            <img src={chat} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card