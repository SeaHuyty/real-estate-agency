import React from 'react'
import { motion } from "motion/react"
import { assets } from '../assets/assets'

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
                {/* search bar */}
                <div className='flex flex-col gap-3'>
                    <p className='w-100 text-left text-gray-500'>We offer over 10000 apartments for every request. You are guaranteed to be able to find an apartments that suit you.</p>  
                    <div>
                        <form class="max-w-md mx-auto w-120">   
                            <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                                <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-900 transition duration-250 ease-in-out hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                            </div>
                        </form>
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

export default Header   