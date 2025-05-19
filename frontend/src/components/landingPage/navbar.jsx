import React from 'react'
import {assets} from '../../assets/assets'

const Navbar = () => {
    return (
        <div className='w-full absolute top-0 left-0'>
            <div className='container mx-auto flex justify-between items-center py-4 px-20 md:px-20 lg-px-32'>
                <img src={assets.logo} alt="" className='w-20 bg-black rounded-[5px] py-2 px-2 transition duration-250 ease-in-out hover:scale-110'/>
                <ul className='hidden md:flex gap-8 text-[16px] text-black'>
                    <a href="#Header" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Home</a>
                    <a href="#about" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>About</a>
                    <a href="#project" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Project</a>
                    <a href="#contact" className='cursor-pointer transition duration-250 ease-in-out hover:scale-110'>Contact</a>
                </ul>
                <button className='hidden md:block text-white text-[16px] py-1 px-4 bg-black rounded-[5px] transition duration-250 ease-in-out hover:scale-110'>Sign up</button>
            </div>
        </div>

    )
}
export default Navbar;