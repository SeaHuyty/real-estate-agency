import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"

const container = () => {
    return (
        <motion.div className='w-full h-screen bg-white' id='about' initial={{ opacity: 0, y: 200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className='mt-20'>
                <div className='px-20 py-20 grid grid-cols-2 gap-10'>
                    <img className='w-100' src={assets.brand_img} alt="" />
                    <div>
                        <h1 className='text-[2.5rem] font-semibold text-center'>Discover your future house</h1>
                        <div className='grid grid-cols-2 gap-10 mt-15'>
                            <div>
                                <h1 className='text-[30px] py-15 underline underline-offset-4 text-center'>About Us</h1> 
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio quaerat modi voluptas non sequi repudiandae? Accusantium minima harum vitae aspernatur maiores doloremque, corrupti earum, eveniet fugiat quasi doloribus et possimus?</p>
                            </div>
                            <div>
                                <h1 className='text-[30px] py-15 underline underline-offset-4 text-center'>About Us</h1> 
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio quaerat modi voluptas non sequi repudiandae? Accusantium minima harum vitae aspernatur maiores doloremque, corrupti earum, eveniet fugiat quasi doloribus et possimus?</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>    
    )
}

export default container
