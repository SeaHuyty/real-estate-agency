import { all } from 'axios';
import React, { useState } from 'react'

function Slider ({ images, imageIndex, setImageIndex, thumbnail }) {
    const allImages = [thumbnail, ...images];
    const changeImage = (direction) => {
        if (direction === 'left') {
            if (imageIndex === 0) {
                setImageIndex(allImages.length-1)
            } else {
                setImageIndex(imageIndex-1)
            }
        } else {
            if (imageIndex === allImages.length-1) {
                setImageIndex(0)
            } else {
                setImageIndex(imageIndex+1)
            }
        }
    }
    return (
        <div className='h-[350px] flex gap-2'>
            {imageIndex !== null && (<div className='absolute h-full w-full top-0 left-0 bg-black/80 flex items-center justify-center'>
                <div className='arrow flex-1 flex items-center justify-center'>
                    <img className='w-[20px] cursor-pointer' src="/arrow.png" alt="" onClick={() => changeImage('left')}/>
                </div>
                <div className='imgContainer flex justify-center flex-10'>
                    <img className='z-100 ' src={allImages[imageIndex]} alt="" />
                </div>
                <div className='arrow flex-1 flex items-center justify-center'>
                    <img className='w-[20px] rotate-180 cursor-pointer' src="/arrow.png" alt="" onClick={() => changeImage('right')}/>
                </div>
                <div onClick={() => setImageIndex(null)} className='absolute top-0 right-0 text-white text-[36px] font-bold p-[50px] cursor-pointer'>X</div>
            </div>)}
            <div className='flex-3'>
                <img onClick={()=> setImageIndex(0)} className='w-full h-full object-cover  cursor-pointer' src={allImages[0]} alt="" />
            </div>
            <div className='flex-1 flex flex-col gap-2 justify-between overflow-hidden'>
                <img className='h-[110px] object-cover flex cursor-pointer' src={allImages[1]} onClick={()=> setImageIndex(1)} alt="" />
                <img className='h-[110px] object-cover flex cursor-pointer' src={allImages[2]} onClick={()=> setImageIndex(2)} alt="" />
                <div className='h-[110px] bg-cover bg-center' style={{backgroundImage: `url(${allImages[3]})`}} onClick={()=> setImageIndex(3)}>
                    <div className=' flex justify-center items-center text-center cursor-pointer bg-black/50 w-full h-full '>
                        <h1 className='text-white text-[3rem]'>+{allImages.length-4}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Slider;