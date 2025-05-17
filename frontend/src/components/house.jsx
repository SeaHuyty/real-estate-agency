import React, { useEffect } from 'react'
import { assets, projectsData } from '../assets/assets'
import { useState } from 'react'
import { motion } from "framer-motion"

const house = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardShow, setCardShow] = useState(1);

    useEffect(() => {
        const updateCardShow = () => {
            if (window.innerWidth >= 1024) {
                setCardShow(projectsData.length);
            } else {
                setCardShow(1);
            };
        }
        updateCardShow();
        window.addEventListener('resize', updateCardShow);
        return () => {
            window.removeEventListener('resize', updateCardShow);
        };
    },[]);
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projectsData.length)
    }
    const prevSlide = () => {
        // return project data - 1 and reduce the current index by 1 if it is not 0
        // if it is 0 then set the current index to the last project data
        setCurrentIndex((prevIndex) => prevIndex === 0 ? projectsData.length - 1 : prevIndex - 1)
    }

    return (
        <motion.div className='py-4 px-20' id='project' initial={{ opacity: 0, x: 200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className='flex justify-between items-center'>
                <h1 className=' text-[30px]'>Popular Apartments</h1>
                <div className='flex justify-end items-center mb-8'>
                    <button onClick={prevSlide} className='p-3 bg-gray-200 rounded mr-2 cursor-pointer' aria-label='previous project'>
                        <img src={assets.left_arrow} alt="previous" />
                    </button>
                    <button onClick={nextSlide} className='p-3 bg-gray-200 rounded mr-2  cursor-pointer' aria-label='next project'>
                        <img src={assets.right_arrow} alt="next" />
                    </button>
                </div>
            </div>
            <div className='overflow-hidden'>
                {/* slider */}
                <div className='flex gap-8 transition-transform duration-500 ease-in-out' 
                style={{transform: `translateX(-${(currentIndex * 100) / cardShow}%)`}}>
                    {projectsData.map((project, index) => (
                        <div 
                            key={index}  className='relative flex-shrink-0 w-full sm:w-1/4'>
                            <img src={project.image} alt={project.title} className='w-full h-auto mb-14'/>
                            <div className='absolute left-0 right-0 bottom-5 flex justify-center items-center'>
                                <div className='inline-block bg-white w-3/4 px-4 py-2 shadow-md'>
                                    <h2 className='text-xl font-semibold text-gray-800'>
                                        {project.title}
                                    </h2>
                                    <p className='text-gray-500 text-sm'>
                                        {project.price} <span>|</span>{project.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default house