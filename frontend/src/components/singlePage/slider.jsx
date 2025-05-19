import React, { useState } from 'react'

function Slider ({ images, imageIndex, setImageIndex }) {
    const changeImage = (direction) => {
        if (direction === 'left') {
            if (imageIndex === 0) {
                setImageIndex(images.length-1)
            } else {
                setImageIndex(imageIndex-1)
            }
        } else {
            if (imageIndex === images.length-1) {
                setImageIndex(0)
            } else {
                setImageIndex(imageIndex+1)
            }
        }
    }
    return (
        <div className='h-[350px] flex gap-5 z-1001'>
            {imageIndex !== null && (<div className='absolute h-full w-full top-0 left-0 bg-black flex items-center justify-center'>
                <div className='arrow flex-1 flex items-center justify-center'>
                    <img className='w-[20px] cursor-pointer' src="./arrow.png" alt="" onClick={() => changeImage('left')}/>
                </div>
                <div className='imgContainer flex-10'>
                    <img className='z-100' src={images[imageIndex]} alt="" />
                </div>
                <div className='arrow flex-1 flex items-center justify-center'>
                    <img className='w-[20px] rotate-180 cursor-pointer' src="./arrow.png" alt="" onClick={() => changeImage('right')}/>
                </div>
                <div onClick={() => setImageIndex(null)} className='absolute top-0 right-0 text-white text-[36px] font-bold p-[50px] cursor-pointer'>X</div>
            </div>)}
            <div className='flex-3'>
                <img onClick={()=> setImageIndex(0)} className='w-full h-full object-cover rounded-[10px] cursor-pointer' src={images[0]} alt="" />
            </div>
            <div className='flex-1 flex flex-col justify-between gap-2'>
                {images.slice(1).map((image, index) => (
                    <img className='h-[100px] rounded-[10px] object-cover' key={index} src={image}  onClick={()=> setImageIndex(index+1)} lt="" />
                ))}
            </div>
        </div>
    )
}

export default Slider;