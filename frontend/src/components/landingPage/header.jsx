import React from 'react'
import { motion } from "motion/react"
import { assets } from '../../assets/assets'

const Header = () => {
    return (
        <div className='py-4 px-20 flex flex-col items-center justify-center gap-5' id='Header'>
            <motion.div 
                // Animations
                initial={{ opacity: 0, y: 150 }}
                transition={{ duration: 1 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                
                className='relative w-full flex justify-between items-center mt-25'>
                {/* main text */}
                <div className='text-left text-black font-bold text-[4.5rem]'>
                    <h1>FIND YOUR</h1>
                    <h1 className='-mt-7'>PERFECT HOME</h1>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='w-150 text-left text-gray-500'>We offer over 10000 apartments for every request. You are guaranteed to be able to find an apartments that suit you.</p>  
                    {/* search bar */}
                    <div className=''>
                        <label for="province" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                        <form class="w-full flex gap-5">
                            <select id="province" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected>Choose any city</option>
                                <option value="PP">Phnom Penh</option>
                                <option value="SR">Siem Reap</option>
                                <option value="SHN">Sihanouk</option>
                                <option value="KP">Kompot</option>
                                <option value="BTB">Battambang</option>
                            </select>
                            <button className='w-30 rounded-md px-4 py-2 bg-blue-900 text-white transition duration-250 ease-in-out hover:bg-blue-600'>Submit</button>
                        </form>
                        {/* <svg class="w-4 h-4 absolute right-3 top-25 mt-3 text-center text-black-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg> */}
                    </div>
                </div>
            </motion.div>
            {/* main pic */}
            <motion.div className='w-full' initial={{ opacity: 0, y: 100 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <img src={assets.house} alt="" className='h-96 w-full object-cover'/>
            </motion.div>
        </div>
    )
}

export default Header  ; 