import React from 'react'
import {assets} from '../assets/assets'
import { Link } from 'react-router-dom';
import Contact from './Contact';

const Navbar = () => {
    return (
        <div className='w-full'>
            <div className='w-full mx-auto flex justify-between items-center py-4 px-20 md:px-20 lg-px-32'>
                <img src="/logo-blue-full.svg" alt="" className='w-20 py-2 px-2 transition duration-250 ease-in-out hover:scale-110'/>
                <ul className='hidden md:flex gap-8 text-[16px] text-black'>
                    <Link to="/" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Home</Link>
                    <Link to="../properties"  className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Properties</Link>                    
                    <a href="#project" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Project</a>
                    <a href="#customerRating" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Review</a>
                </ul>
                <Link to="/Contact" className='bg-blue-900 py-1 px-4 rounded-[5px]  text-white cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Contact</Link>
            </div>
        </div>
    )
}
export default Navbar;