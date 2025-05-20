import React, { useEffect } from 'react'
import { useState } from 'react'
import { assets, projectsData, testimonialsData } from '../../assets/assets'
import { motion } from "motion/react"

const container = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardShow, setCardShow] = useState(1);
    const [result, setResult] = React.useState("");
    // slider image
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

    // contact form
    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending....");
        const formData = new FormData(event.target);

        formData.append("access_key", "ff6a1def-c682-4f25-ae1d-105a608a0924");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult("Form Submitted Successfully");
            event.target.reset();
        } else {
            console.log("Error", data);
            setResult(data.message);
        }
    };
    return (
        <div>
            {/* about us */}
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
            {/* house image */}
            <motion.div className=' relative py-4 px-20' id='project' initial={{ opacity: 0, x: 200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
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
            {/* Meet our CEO */}
            <motion.div className='w-full h-screen px-20 py-6' id='customerRating' initial={{ opacity: 0, x: -200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h1 className='text-2xl sm:text-4xl mb-2 text-center'>Meet our<span className='font bold underline underline-offset-4 font-light decoration-1 under'> CEO</span></h1>
                <p className='text-center text-gray-500 mb-12 mx-auto max-w-80'>CEO of Outdee real estate</p>
                <div className='flex flex-wrap justify-center items-center gap-10'>
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className='max-w-[340px] border shadow-lg rounded px-8 py-12 text-center flex flex-col items-center transition duration-250 ease-in-out hover:scale-105'>
                            <img src={testimonial.image} alt={testimonial.alt} className='w-20 h-20 rounded-full mx-auto mb-4 transition duration-250 ease-in-out hover:scale-115'/>
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
            {/* Contact us */}
            <motion.div className='relative w-full flex justify-center items-center min-h-screen' id='contact' initial={{ opacity: 0, y: 150 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <img className='px-20 w-full h-full min-h-screen object-cover absolute top-0 left-0 z-0 brightness-70' src={assets.header_img} alt='' />
                <div className='z-10 w-full flex justify-center items-center'>
                    <form onSubmit={onSubmit} className='bg-white p-6 rounded shadow-md w-full max-w-md'>
                        <h2 className='text-2xl font-bold mb-4'>Contact Us</h2>
                        <input type='text' name='name' placeholder='Your Name' className='border p-2 mb-4 w-full' required />
                        <input type='email' name='email' placeholder='Your Email' className='border p-2 mb-4 w-full' required />
                        <textarea name='message' placeholder='Your Message' className='border p-2 mb-4 w-full h-32' required></textarea>
                        <button type='submit' className='bg-blue-900 text-white py-2 px-4 rounded'>Send</button>
                        {result && <p className='mt-4'>{result}</p>}
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default container;