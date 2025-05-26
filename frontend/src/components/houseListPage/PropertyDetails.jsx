import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = 'http://localhost:3000';
import React from 'react';
import Slider from '../singlePage/slider'
import Map from '../singlePage/map'
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [imageIndex, setImageIndex] = useState(null);
    const [result, setResult] = React.useState("");

    // Lock scroll when popup is active
    useEffect(() => {
        if (imageIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Clean up on unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [imageIndex]);

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

    // Fetch property details
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/properties/${id}`);
                setProperty(res.data.data);
            } catch (error) {
                console.error('Failed to fetch property', error);
            }
        };

        fetchProperty();
    }, [id]);

    if (!property) return <p>Property not found</p>

    return (
        <div className='w-full h-full'>
            <Navbar />
            <div className='px-20 w-full h-full flex gap-5'>
                <div className='flex-3'>
                    <div className='flex flex-col gap-5'>
                        <Slider
                            thumbnail={property.property_thumbnail}
                            images={property.images} 
                            imageIndex={imageIndex} 
                            setImageIndex={setImageIndex} />
                        <div className='info'>
                            <div className='flex justify-between gap-5'>
                                <div className='flex flex-col gap-3 w-full'>
                                    <h1 className='font-semibold text-[27px]'>{property.title}</h1>
                                    <div className='flex gap-2 items-center text-[14px] text-gray-500'>
                                        <img className='w-[20px] h-[20px]' src="/pin.png" alt="" />
                                        <span>{property.address}, {property.city}</span>
                                    </div>
                                    <div className='w-max rounded-[5px] font-semibold text-[20px] text-green-600'>$ {Number(property.price).toLocaleString()}</div>
                                </div>
                            </div>
                            <div className='mt-[15px] text-[14px] text-gray-500 leading-[20px]'>
                                {property.description}
                            </div>

                            <div className='details mt-3 flex flex-col gap-7 mt-10'>
                                <div className='Details '>
                                    <h1 className='font-semibold'>Details</h1>
                                    <div className='grid grid-cols-3 gap-7 mt-3 '>
                                        <div className='utility flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/size.png" alt="" />
                                            <div>
                                                <h1>{property.size} m²</h1>
                                            </div>
                                        </div>
                                        <div className='pet flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/bed.png" alt="" />
                                            <div>
                                                <h1>{property.bedrooms} Beds</h1>
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/bath.png" alt="" />
                                            <div>
                                                <h1>{property.bathrooms} Bathrooms</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='General'>
                                    <h1 className='font-semibold'>Amenities</h1>
                                    <div className='grid grid-cols-3 gap-7 mt-3'>
                                        <div className='w-full flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/utility.png" alt="" />
                                            <div>
                                                <h1 className='w-[50px]'>Swimming Pool</h1>
                                            </div>
                                        </div>
                                        <div className='flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/pet.png" alt="" />
                                            <div>
                                                <h1>Parking lot</h1>
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/fee.png" alt="" />
                                            <div>
                                                <h1>Garden</h1>
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/fee.png" alt="" />
                                            <div>
                                                <h1>Gym</h1>
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/fee.png" alt="" />
                                            <div>
                                                <h1>Balcony</h1>
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/fee.png" alt="" />
                                            <div>
                                                <h1>Elevator</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='security'>
                                    <h1 className='font-semibold'>Security</h1>
                                    <div className='grid grid-cols-3 gap-7 mt-3'>
                                        <div className='utility flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/school.png" alt="" />
                                            <div>
                                                <h1>Fire Security</h1>
                                            </div>
                                        </div>
                                        <div className='pet flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/bus.png" alt="" />
                                            <div>
                                                <h1>Security</h1>
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/restaurant.png" alt="" />
                                            <div>
                                                <h1>Non Flooding</h1>
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>

                                <div className='community'>
                                    <h1 className='font-semibold'>Community Area</h1>
                                    <div className='grid grid-cols-3 gap-7 mt-3'>
                                        <div className='utility flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/utility.png" alt="" />
                                            <div>
                                                <h1 className='w-[50px]'>Commercial Area</h1>
                                            </div>
                                        </div>
                                        <div className='pet flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/pet.png" alt="" />
                                            <div>
                                                <h1>Playground</h1>
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/fee.png" alt="" />
                                            <div>
                                                <h1>Common Area</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-2'>
                    <div className='flex flex-col gap-2'>
                        <h1 className='font-semibold text-[20px]'>Location</h1>
                        <Map />
                    </div>
                    {/* contact form */}
                    <div className='mt-12 w-full flex justify-center items-center'>
                        <form onSubmit={onSubmit} className='bg-white rounded w-full'>
                            <h2 className='text-2xl font-bold mb-4'>Contact Us</h2>
                            <input type='text' name='name' placeholder='Your Name' className='border p-2 mb-4 w-full' required />
                            <input type='email' name='email' placeholder='Your Email' className='border p-2 mb-4 w-full' required />
                            <textarea name='message' placeholder='Your Message' className='border p-2 mb-4 w-full h-32' required></textarea>
                            <button type='submit' className='bg-blue-900 text-white py-2 px-4 rounded'>Send</button>
                            {result && <p className='mt-4'>{result}</p>}
                        </form>
                    </div>
                    {/* end */}
                </div>
            </div>
            <Footer />
        </div>
    )
};

export default PropertyDetails;