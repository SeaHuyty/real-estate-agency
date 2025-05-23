import React from 'react';
import { useState, useEffect } from 'react';
import Slider from './slider'
import { singlePostData, userData } from '../../assets/dummyData'
import Map from './map'
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';

const SinglePage = () => {
    const [imageIndex, setImageIndex] = useState(null);
    const [result, setResult] = React.useState("");
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
    return (
        <div className='w-full h-full'>
            <Navbar />
            <div className='px-20 py-17 w-full h-full flex gap-5'>
                <div className='flex-3'>
                    <div className='flex flex-col gap-5'>
                        <Slider 
                            images={singlePostData.images} 
                            imageIndex={imageIndex} 
                            setImageIndex={setImageIndex} />
                        <div className='info'>
                            <div className='flex justify-between gap-5'>
                                <div className='flex flex-col gap-3 w-full'>
                                    <h1 className='font-semibold'>{singlePostData.title}</h1>
                                    <div className='flex gap-2 items-center text-[14px] text-gray-500'>
                                        <img className='w-[20px] h-[20px]' src="/pin.png" alt="" />
                                        <span>{singlePostData.address}</span>
                                    </div>
                                    <div className='w-max rounded-[5px] p-2 bg-gray-200'>$ {singlePostData.price}</div>
                                </div>
                                {/* <div className='w-65 flex flex-col justify-center items-center bg-gray-200 rounded-[5px]'>
                                    <img className='w-16 h-16 object-cover rounded-full' src={userData.img} alt="" />
                                    <span>{userData.name}</span>
                                </div> */}
                            </div>
                            <div className='mt-[20px] text-[14px] text-gray-500 leading-[20px]'>
                                {singlePostData.description}
                            </div>

                            <div className='details mt-3 flex flex-col gap-5'>
                                <div className='General'>
                                    <h1 className='font-semibold'>Community Area</h1>
                                    <div className='w-full flex justify-between gap-4 mt-3'>
                                        <div className='utility flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/utility.png" alt="" />
                                            <div>
                                                <h1 className='w-[50px]'>Swimming Pool</h1>
                                                {/* <p className='text-gray-500 text-[14px]'>Renter is responsible</p> */}
                                            </div>
                                        </div>
                                        <div className='pet flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/pet.png" alt="" />
                                            <div>
                                                <h1>Parking lot</h1>
                                                {/* <p className='text-gray-500 text-[14px]'>Pet Allowed</p> */}
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/fee.png" alt="" />
                                            <div>
                                                <h1>Garden</h1>
                                                {/* <p className='text-gray-500 text-[14px]'>Unknown information</p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='Details'>
                                    <h1 className='font-semibold'>Details</h1>
                                    <div className='flex justify-between gap-4 mt-3'>
                                        <div className='utility flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/size.png" alt="" />
                                            <div>
                                                <h1>{singlePostData.size}sqm</h1>
                                                {/* <p className='text-gray-500 text-[14px]'>{singlePostData.size}sqm</p> */}
                                            </div>
                                        </div>
                                        <div className='pet flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/bed.png" alt="" />
                                            <div>
                                                <h1>Beds</h1>
                                                {/* <p className='text-gray-500 text-[14px]'>{singlePostData.bedRooms} bed</p> */}
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/bath.png" alt="" />
                                            <div>
                                                <h1>Bathrooms</h1>
                                                {/* <p className='text-gray-500 text-[14px]'>{singlePostData.bathroom} bathroom</p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='nearby places'>
                                    <h1 className='font-semibold'>Security</h1>
                                    <div className='flex justify-between gap-4 mt-3'>
                                        <div className='utility flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/school.png" alt="" />
                                            <div>
                                                <h1>Fire Security</h1>
                                                {/* <p className='text-gray-500 text-[14px]'>{singlePostData.school}</p> */}
                                            </div>
                                        </div>
                                        <div className='pet flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/bus.png" alt="" />
                                            <div>
                                                <h1>Security</h1>
                                                {/* <p className='text-gray-500 text-[14px]'>{singlePostData.bus}</p> */}
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/restaurant.png" alt="" />
                                            <div>
                                                <h1>Non Flooding</h1>
                                                {/* <p className='text-gray-500 text-[14px]'>{singlePostData.restaurant}</p> */}
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
}

export default SinglePage;