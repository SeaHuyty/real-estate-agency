import { useState, useEffect } from 'react';
import Slider from './slider'
import { singlePostData, userData } from '../../assets/dummyData'
import Map from './map'

const SinglePage = () => {
    const [imageIndex, setImageIndex] = useState(null);

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
                                        <img className='w-[20px] h-[20px]' src="./pin.png" alt="" />
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
                                    <h1 className='font-semibold'>General</h1>
                                    <div className='flex flex-col gap-4 mt-3'>
                                        <div className='utility flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="./utility.png" alt="" />
                                            <div>
                                                <h1>Utilities</h1>
                                                <p className='text-gray-500 text-[14px]'>Renter is responsible</p>
                                            </div>
                                        </div>
                                        <div className='pet flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="./pet.png" alt="" />
                                            <div>
                                                <h1>Pet policy</h1>
                                                <p className='text-gray-500 text-[14px]'>Pet Allowed</p>
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="./fee.png" alt="" />
                                            <div>
                                                <h1>Property fees</h1>
                                                <p className='text-gray-500 text-[14px]'>Unknown information</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='Details'>
                                    <h1 className='font-semibold'>Details</h1>
                                    <div className='flex justify-between gap-4 mt-3'>
                                        <div className='utility flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="./size.png" alt="" />
                                            <div>
                                                {/* <h1>Size</h1> */}
                                                <p className='text-gray-500 text-[14px]'>{singlePostData.size}sqm</p>
                                            </div>
                                        </div>
                                        <div className='pet flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="./bed.png" alt="" />
                                            <div>
                                                {/* <h1>Beds</h1> */}
                                                <p className='text-gray-500 text-[14px]'>{singlePostData.bedRooms} bed</p>
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="./bath.png" alt="" />
                                            <div>
                                                {/* <h1>Bathrooms</h1> */}
                                                <p className='text-gray-500 text-[14px]'>{singlePostData.bathroom} bathroom</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='nearby places'>
                                    <h1 className='font-semibold'>Nearby places</h1>
                                    <div className='flex justify-between gap-4 mt-3'>
                                        <div className='utility flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="./school.png" alt="" />
                                            <div>
                                                <h1>School</h1>
                                                <p className='text-gray-500 text-[14px]'>{singlePostData.school}</p>
                                            </div>
                                        </div>
                                        <div className='pet flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="./bus.png" alt="" />
                                            <div>
                                                <h1>Bus stop</h1>
                                                <p className='text-gray-500 text-[14px]'>{singlePostData.bus}</p>
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="./restaurant.png" alt="" />
                                            <div>
                                                <h1>Restaurant</h1>
                                                <p className='text-gray-500 text-[14px]'>{singlePostData.restaurant}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full h-full p-5 flex flex-col flex-2 gap-2 bg-gray-200'>
                    <div className='w-full h-full flex flex-col gap-2'>
                        <h1 className='font-semibold'>Location</h1>
                        <Map />
                    </div>
                    
                    {/* end */}
                </div>
            </div>
        </div>
    )
}

export default SinglePage;