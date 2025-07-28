import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
const About = () => {
    return (
        <div>
            <Navbar />
            <div className='w-full h-screen flex justify-center items-center bg-gray-100'>
                <div className='max-w-3xl p-8 bg-white rounded-lg shadow-lg'>
                    <h1 className='text-3xl font-bold mb-4'>About Us</h1>
                    <p className='text-gray-700 mb-4'>
                        Welcome to our real estate agency! We are dedicated to helping you find your dream property. With years of experience in the industry, our team of professionals is here to guide you through every step of the buying or selling process.
                    </p>
                    <p className='text-gray-700'>
                        Whether you're looking for a cozy home, a luxurious estate, or an investment property, we have a wide range of listings to suit your needs. Our commitment to exceptional service and client satisfaction sets us apart in the real estate market.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default About