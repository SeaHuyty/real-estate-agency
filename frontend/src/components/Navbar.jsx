import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className='w-full'>
            <div className='w-full mx-auto flex justify-between items-center py-4 px-20 md:px-20 lg-px-32'>
                <Link to="/" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>
                    <img src="/logo-blue-full.svg" alt="" className='w-20 py-2 px-2 transition duration-250 ease-in-out hover:scale-110'/>
                </Link>
                <ul className='flex gap-15 text-[16px] text-black'>
                    <Link to="/"  className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Home</Link>                    
                    <Link to="../properties"  className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Properties</Link>                    
                    <Link to="/Contact" className='text-black cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Contact</Link>
                    <Link to="/About"  className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>About Us</Link>                    
                </ul>
            </div>
        </div>
    )
}
export default Navbar;