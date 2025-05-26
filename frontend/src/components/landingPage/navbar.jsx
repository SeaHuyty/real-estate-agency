import React from 'react'
import {assets} from '../../assets/assets'

const Navbar = () => {
    return (
        <div className='w-full absolute top-0 left-0 z-10'>
            <div className='w-full absolute top-0 left-0 mx-auto flex justify-between items-center py-4 px-20 md:px-20 lg-px-32 backdrop-blur-sm'>
                <img src={assets.logo_dark} alt="" className='bg-black rounded-sm w-20 py-2 px-2 transition duration-250 ease-in-out hover:scale-110'/>
                <ul className='hidden md:flex gap-8 text-[16px] text-black'>
                    <a href="#Header" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Home</a>
                    <a href="#about" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>About</a>
                    <a href="#customerRating" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Review</a>
                    <a href="#project" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Project</a>
                </ul>
                <a href="#contact" className='bg-black py-1 px-4 rounded-[5px]  text-white cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Contact</a>
            </div>
        </div>
    )
}
export default Navbar;