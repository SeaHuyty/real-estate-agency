import React, { useEffect } from 'react'
import { useState } from 'react'
import { assets, ceoData, projectsData, testimonialsData, province } from '../../assets/assets'
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
            <motion.div className='w-full bg-white mt-25 py-4 px-20' id='about' initial={{ opacity: 0, y: 200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h1 className='text-[2.5rem] font-semibold text-center'>Discover Your Future House</h1>
                <p className='mt-5 text-center text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto cupiditate natus assumenda saepe sint quas error, architecto molestias commodi maiores perferendis</p>
                <div className=' mt-20 flex justify-center flex-wrap gap-10'>
                    <div className='flex flex-col gap-10'>
                        <div className='grid grid-cols-2 gap-10'>
                            <div>
                                <h1 className='font-semibold text-[3rem]'>10+</h1>
                                <p className='text-gray-500'>Year of Excellence</p>
                            </div>
                            <div>
                                <h1 className='font-semibold text-[3rem]'>15+</h1>
                                <p className='text-gray-500'>Projects Completed</p>
                            </div>
                            <div>
                                <h1 className='font-semibold text-[3rem]'>8+</h1>
                                <p className='text-gray-500'>Ongoing Projects</p>
                            </div>
                            <div>
                                <h1 className='font-semibold text-[3rem]'>10K+</h1>
                                <p className='text-gray-500'>User</p>
                            </div>
                        </div>
                        <img className='w-100' src={assets.project_img8} alt="" />
                    </div>
                        <img className='w-100' src={assets.project_img7} alt="" />
                    {/* <div className=''>
                    </div> */}
                        <img className='w-100' src={assets.project_img9} alt="" />
                    {/* <div className='w-100 h-100'>
                    </div> */}
                </div>
            </motion.div>    
            {/* house image */}
            <motion.div className='w-full h-full mt-25 py-4 px-20' id='project' initial={{ opacity: 0, x: 200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className='flex justify-between items-center'>
                    <h1 className=' text-[30px] font-semibold'>Popular Apartments</h1>
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
                    <div className='overflow-x-scroll no-scrollbar flex gap-8 transition-transform duration-500 ease-in-out' 
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
            {/* province display */}
            <motion.div className='w-full h-full mt-25 py-4 px-20' id='province'
            initial={{ opacity: 0, x: -200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h1 className='text-[30px] font-semibold text-center'>Explore Our Provinces</h1>
                <div className='mt-10 grid grid-cols-3 grid-rows-2 w-full h-[90vh] object-cover gap-2'>
                    <div className='col-span-2 row-span-2 relative group overflow-hidden'>
                        <img className='w-full h-full object-cover' src={assets.siemreap} alt="" />
                        <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                            <h2 className='text-xl font-bold'>{province[0].name}</h2>
                            <p className='text-xs mt-2'>{province[0].text}</p>
                        </div>
                    </div>
                    <div className='col-span-1 relative group overflow-hidden'>
                        <img className='w-full h-full object-cover'  src={assets.sihanouk} alt="" />
                        <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                            <h2 className='text-xl font-bold'>{province[1].name}</h2>
                            <p className='text-xs mt-2'>{province[1].text}</p>
                        </div>
                    </div>
                    <div className='col-span-1 row-span-2 relative group overflow-hidden'>
                        <img className='w-full h-full object-cover'  src={assets.battambong} alt="" />
                        <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                            <h2 className='text-xl font-bold'>{province[4].name}</h2>
                            <p className='text-xs mt-2'>{province[4].text}</p>
                        </div>
                    </div>
                    <div className='col-span-1 relative group overflow-hidden'>
                        <img className='w-full h-[300px] object-cover'   src={assets.kampot} alt="" />
                        <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                            <h2 className='text-xl font-bold'>{province[2].name}</h2>
                            <p className='text-xs mt-2'>{province[2].text}</p>
                        </div>
                    </div>
                    <div className='col-span-1 relative group overflow-hidden'>
                        <img className='w-full h-full object-cover '  src={assets.phnompenh} alt="" />
                        <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                            <h2 className='text-xl font-bold'>{province[3].name}</h2>
                            <p className='text-xs mt-2'>{province[3].text}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* Meet our ceo*/}
            <motion.div className='w-full h-full px-20 py-6' id='customerRating'
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
                                <h2 className='text-xl font-bold'>{ceoData[0].name}</h2>
                                <p className='text-sm'>{ceoData[0].title}</p>
                                <p className='text-xs mt-2'>{ceoData[0].text}</p>
                            </div>
                        </div>
                        <div className='flex gap-10'>
                            {/* G-Devith */}
                            <div className='relative group w-80 h-80 overflow-hidden'>
                                <img className='w-[350px] h-[350px] object-cover' src={assets.img2} alt="" />
                                <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                                    <h2 className='text-xl font-bold'>{ceoData[1].name}</h2>
                                    <p className='text-sm'>{ceoData[1].title}</p>
                                    <p className='text-xs mt-2'>{ceoData[1].text}</p>
                                </div>
                            </div>

                            {/* Long Chhunhour */}
                            <div className='relative group w-80 h-80 overflow-hidden'>
                                <img className='w-[350px] h-[350px] object-cover' src={assets.img3} alt="" />
                                <div className='absolute inset-0 bg-black/50 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center'>
                                    <h2 className='text-xl font-bold'>{ceoData[2].name}</h2>
                                    <p className='text-sm'>{ceoData[2].title}</p>
                                    <p className='text-xs mt-2'>{ceoData[2].text}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* Meet our customer*/}
            <motion.div className='w-full px-20 py-6 mt-30' id='CEO'
            initial={{ opacity: 0, x: -200 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h1 className='text-2xl sm:text-4xl mb-2 text-center'>Customers<span className='font bold underline underline-offset-4 font-light decoration-1 under'> Review</span></h1>
                <div className='flex flex-wrap justify-center items-center gap-10 mt-15'>
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className='w-[340px] border shadow-lg rounded px-8 py-12 text-center flex flex-col justify-center items-center transition duration-250 ease-in-out hover:scale-105'>
                            <img src={testimonial.image} alt={testimonial.alt} className='w-20 h-20 rounded-full mx-auto mb-4 transition duration-250 ease-in-out hover:scale-115'/>
                            <h2 className='text-xl font-semibold text-gray-800'>{testimonial.name}</h2>
                            {/* <h2>{testimonial.title}</h2> */}
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
            <motion.div className='mt-40 px-20 relative w-full flex justify-center items-center' id='contact'
            initial={{ opacity: 0, y: 150 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className='z-10 w-full flex justify-around p-15' style={{backgroundImage: `url(${assets.header_img})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                    <div className='w-full max-w-md text-white'>
                        <h1 className='font-semibold text-[40px]'>Let's get in touch</h1>
                        <p>We're open for discussion and future work</p>
                        <div className='mt-10 flex flex-col gap-10'>
                            <div className='flex items-center gap-5'>
                                <img className='rotate-90' src="/envelope.png" alt="" />
                                <p>longchhunhour@gmail.com</p>
                            </div>
                            <div className='flex items-center gap-5'>
                                <img className='rotate-90' src="/phone.png" alt="" />
                                <p>+855 88 5510 486</p>
                            </div>
                            <div className='flex items-center gap-5'>
                                <img className='rotate-90' src="/location-alt.png" alt="" />
                                <p>Cambodia Academy Of Digital Technology</p>
                            </div>
                            <div className='flex items-center gap-5'>
                                <img className='rotate-90' src="/location-alt.png" alt="" />
                                <p>Cambodia Academy Of Digital Technology</p>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={onSubmit} className='bg-white p-6 rounded shadow-md w-full max-w-md'>
                        <h2 className='text-2xl font-bold mb-4'>Contact Us</h2>
                        <input type='text' name='name' placeholder='Your Name' className='p-2 mb-4 w-full bg-gray-2 bg-gray-200' required />
                        <input type='email' name='email' placeholder='Your Email' className='bg-gray-200 p-2 mb-4 w-full' required />
                        <textarea name='message' placeholder='Your Message' className='bg-gray-200 p-2 mb-4 w-full h-32' required></textarea>
                        <button type='submit' className='bg-blue-900 text-white py-2 px-4 rounded'>Send</button>
                        {result && <p className='mt-4'>{result}</p>}
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default container;