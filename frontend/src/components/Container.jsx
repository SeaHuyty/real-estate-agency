import { useState, useEffect } from 'react'
import { assets, ceoData, testimonialsData, province } from '../assets/assets'
import { motion } from "motion/react"
import React from 'react';
import { Link } from 'react-router-dom';

const container = () => {
    const [topProperties, setTopProperties] = useState([]);

    // Fetch Top Properties
    useEffect(() => {
        fetch('http://localhost:3000/api/properties/top')
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                setTopProperties(response.data);
            }
        })
        .catch(err => console.error('Error fetching top properties:', err));
    }, []); // 👈 This empty array is critical!
    return (
        <div className='py-4 px-20'>
            {/* about us */}
            <motion.div className='w-full h-full bg-white mt-25' id='about' initial={{ opacity: 0, y: 200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className='flex flex-2'>
                    <div>
                        <div>
                            <div className='flex flex-col gap-2'>
                                <h1 className='text-[2.5rem] font-bold'>Discover Your Future House</h1>
                                <p className='text-[20px] text-gray-500 font-bold'>Your Trusted Partner In Real Estate Success</p>
                            <p className='text-gray-500 w-[100%] mt-5'>Our real estate platform is trusted by thousands for its transparency, reliability, and personalized service. Whether you're buying, selling, or renting, we connect you with verified listings and expert agents who understand your needs. With a commitment to integrity and customer satisfaction, we've become a trusted choice for individuals and families looking for their next home.</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <h1 className='font-semibold text-[2rem] lg:text-[3rem]'>1</h1>
                                <p className='text-gray-500'>Year of Excellence</p>
                            </div>
                            <div>
                                <h1 className='font-semibold text-[2rem] lg:text-[3rem]'>90+</h1>
                                <p className='text-gray-500'>Properties Listed</p>
                            </div>
                            <div>
                                <h1 className='font-semibold text-[2rem] lg:text-[3rem]'>15+</h1>
                                <p className='text-gray-500'>Properties Sold</p>
                            </div>
                            <div>
                                <h1 className='font-semibold text-[2rem] lg:text-[3rem]'>5</h1>
                                <p className='text-gray-500'>Cooperated Architect Companies</p>
                            </div>
                        </div>
                    </div>
                    {/* Right Images */}
                    <div className='flex gap-5 min-w-[300px] overflow-hidden'>
                        <img className='w-full object-cover' src={assets.aboutUsImg} alt="" />
                    </div>
                </div>

            </motion.div>    
            {/* house image */}
            <motion.div className='w-full h-full mt-25' id='project' initial={{ opacity: 0, x: 200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div>
                    <h1 className=' text-[40px] font-semibold'>Featured Properties: Your Next Great Find</h1>
                    <p className='text-gray-500 w-[100%]'>Explore the top-rated properties exclusively offered by our agency — your next great find awaits!</p>
                </div>
                <div className='mt-10'>
                    {/* slider */}
                    <div className='overflow-x-scroll no-scrollbar flex gap-8'>
                        {topProperties.map((project, index) => (
                            <Link to={`/properties/${project.id}`}
                                key={index}  className='relative flex-shrink-0 w-full sm:w-1/4'>
                                <img src={project.property_thumbnail} alt={project.title} className='w-500 h-50 mb-14 transition duration-250 ease-in-out hover:scale-105'/>
                                <div className='absolute left-0 right-0 bottom-5 flex justify-center items-center'>
                                    <div className='inline-block bg-white w-3/4 px-4 py-2 shadow-md transition duration-250 ease-in-out hover:scale-105'>
                                        <h2 className='text-xl font-semibold text-gray-800'>
                                            {project.title}
                                        </h2>
                                        <p className='text-gray-500 text-sm'>
                                            ${Number(project.price).toLocaleString()} <span>| </span>{project.city}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </motion.div>
            {/* province display */}
            <motion.div className='w-full h-full mt-25' id='province'
            initial={{ opacity: 0, x: -200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h1 className='text-[40px] font-bold text-start'>Discover Prime Locations Across Cambodia</h1>
                <p className='text-gray-500 w-[100%]'>Explore our carefully selected properties in Cambodia’s top provinces — Phnom Penh, Siem Reap, Sihanoukville, Kampot, and Kep — each offering unique lifestyles, scenic views, and vibrant communities.</p>
                <div className='mt-10 grid grid-cols-3 grid-rows-2 w-full h-[90vh] object-cover gap-2'>
                    <Link to="/properties?province=siemreap" className='col-span-2 row-span-2 relative group overflow-hidden cursor-pointer'>
                        <div className='z-10 absolute top-[85%] left-5 bg-white px-4 py-2 text-black flex flex-col justify-center items-center'>
                            <h2 className='text-[17px]'>{province[0].name}</h2>
                        </div>
                        <img className='w-full h-full object-cover' src={assets.siemreap} alt="" />
                        <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                            <h2 className='text-xl font-semibold'>{province[0].name}</h2>
                            <p className='text-xs mt-2'>{province[0].text}</p>
                        </div>
                    </Link>
                    <Link to="/properties?province=sihanouk" className='col-span-1 relative group overflow-hidden cursor-pointer'>
                        <div className='z-10 absolute top-[70%] left-5 bg-white px-4 py-2 text-black flex flex-col justify-center items-center'>
                            <h2 className='text-[17px]'>{province[1].name}</h2>
                        </div>
                        <img className='w-full h-full object-cover' src={assets.sihanouk} alt="" />
                        <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                            <h2 className='text-xl font-semibold'>{province[1].name}</h2>
                            <p className='text-xs mt-2'>{province[1].text}</p>
                        </div>
                    </Link>
                    <Link to="/properties?province=kep" className='col-span-1 row-span-2 relative group overflow-hidden cursor-pointer'>
                        <div className='z-10 absolute top-[90%] left-5 bg-white px-4 py-2 text-black flex flex-col justify-center items-center'>
                            <h2 className='text-[17px]'>{province[4].name}</h2>
                        </div>
                        <img className='w-full h-full object-cover'  src={assets.kep} alt="" />
                        <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                            <h2 className='text-xl font-semibold'>{province[4].name}</h2>
                            <p className='text-xs mt-2'>{province[4].text}</p>
                        </div>
                    </Link>
                    <Link to="/properties?province=kampot" className='col-span-1 relative group overflow-hidden cursor-pointer'>
                        <div className='z-10 absolute top-[83%] left-5 bg-white px-4 py-2 text-black flex flex-col justify-center items-center'>
                            <h2 className='text-[17px]'>{province[2].name}</h2>
                        </div>
                        <img className='w-full h-[300px] object-cover'   src={assets.kampot} alt="" />
                        <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                            <h2 className='text-xl font-semibold'>{province[2].name}</h2>
                            <p className='text-xs mt-2'>{province[2].text}</p>
                        </div>
                    </Link>
                    <Link to="/properties?province=phnompenh" className='col-span-1 relative group overflow-hidden cursor-pointer'>
                        <div className='z-10 absolute top-[83%] left-5 bg-white px-4 py-2 text-black flex flex-col justify-center items-center'>
                            <h2 className='text-[17px]'>{province[3].name}</h2>
                        </div>
                        <img className='w-full h-full object-cover'  src={assets.phnompenh} alt="" />
                        <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                            <h2 className='text-xl font-semibold'>{province[3].name}</h2>
                            <p className='text-xs mt-2'>{province[3].text}</p>
                        </div>
                    </Link>
                </div>
            </motion.div>
            <motion.div className='w-full mt-30' id='customerRating'
            initial={{ opacity: 0, x: -200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h1 className='text-2xl sm:text-4xl font-bold'>Customers Testimonials: Trust <br></br>and Success</h1>
                <p className='text-gray-500 w-[100%] mt-5'>Hear from our satisfied clients who found their perfect homes with us. Their stories reflect our commitment to trust, quality service, and successful property experiences.</p>
                <div className='w-full flex justify-center items-center gap-10 mt-15'>
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className='flex flex-col gap-5 bg-gray-100 p-10'>
                            <div className='flex gap-5 items-center'>
                                <img src={testimonial.image} alt={testimonial.alt} className='w-20 h-20 rounded-full'/>
                                <div className='flex flex-col'>
                                    <h2 className='text-xl font-semibold'>{testimonial.name}</h2>
                                    <div className='flex justify-center items-center gap-1'>
                                        {Array.from({ length: testimonial.rating}, (item, index) => (
                                            <img key={index} src={assets.star_icon} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className='text-gray-500 text-sm mt-2'>{testimonial.text}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
            {/* Meet our ceo*/}
            <motion.div className='w-full h-full px-20 py-6' id='ceo'
            initial={{ opacity: 0, y: 200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className='mt-20 gap-10'>
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className='text-2xl sm:text-4xl text-center font-semibold'>Meet Our CEO</h1>
                        <p className='text-center text-gray-500 px-30 mt-10'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis optio minima praesentium amet sequi quidem ducimus impedit! Minus animi rem praesentium ratione ad ea eveniet fugit, aut ullam. Magnam, eveniet!</p>
                    </div>
                    <div className='mt-10 flex justify-center items-center gap-10'>
                        {/* Vannda */}
                        <div className='relative group w-80 h-80 overflow-hidden'>
                            <img className='w-[350px] h-[350px] object-cover' src={assets.vannda} alt="" />
                            <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                                <h2 className='text-xl font-semibold cursor-pointer'>{ceoData[0].name}</h2>
                                <p className='text-sm'>{ceoData[0].title}</p>
                                <p className='text-xs mt-2'>{ceoData[0].text}</p>
                            </div>
                        </div>
                        <div className='flex gap-10'>
                            {/* G-Devith */}
                            <div className='relative group w-80 h-80 overflow-hidden'>
                                <img className='w-[350px] h-[350px] object-cover' src={assets.img2} alt="" />
                                <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                                    <h2 className='text-xl font-semibold cursor-pointer'>{ceoData[1].name}</h2>
                                    <p className='text-sm'>{ceoData[1].title}</p>
                                    <p className='text-xs mt-2'>{ceoData[1].text}</p>
                                </div>
                            </div>

                            {/* Long Chhunhour */}
                            <div className='relative group w-80 h-80 overflow-hidden'>
                                <img className='w-[350px] h-[350px] object-cover' src={assets.img3} alt="" />
                                <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                                    <h2 className='text-xl font-semibold cursor-pointer'>{ceoData[2].name}</h2>
                                    <p className='text-sm'>{ceoData[2].title}</p>
                                    <p className='text-xs mt-2'>{ceoData[2].text}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default container;