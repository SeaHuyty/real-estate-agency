import React from 'react'
import { assets, testimonialsData } from '../assets/assets'
import { motion } from "framer-motion"

const customerRating = () => {
    return (
        <motion.div className='w-full h-screen px-20 py-6' id='customerRating' initial={{ opacity: 0, x: -200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h1 className='text-2xl sm:text-4xl font-bold mb-2 text-center'>Customer<span className='underline underline-offset-4 font-light decoration-1 under'> Reviews</span></h1>
            <p className='text-center text-gray-500 mb-12 mx-auto max-w-80'>Real stories from those who found home with us</p>
            <div className='flex flex-wrap justify-center items-center gap-10'>
                {testimonialsData.map((testimonial, index) => (
                    <div key={index} className='max-w-[340px] border shadow-lg rounded px-8 py-12 text-center flex flex-col items-center'>
                        <img src={testimonial.image} alt={testimonial.alt} className='w-20 h-20 rounded-full mx-auto mb-4'/>
                        <h2 className='text-xl font-semibold text-gray-800'>{testimonial.name}</h2>
                        <h2>{testimonial.title}</h2>
                        <div className='flex justify-center items-center gap-1 text-red-500 mt-2'>
                            {Array.from({ length: testimonial.rating}, (item, index) => (
                                <img key={index} src={assets.star_icon} />
                            ))}
                        </div>
                        <p className='text-gray-500 text-sm mt-2'>{testimonial.text}</p>
                    </div>
                ))};
            </div>
        </motion.div>
    )
}

export default customerRating