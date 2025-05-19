import React from 'react'

const filter = () => {
    return (
        <div>
            <h1>Search result for <b>Phnom Penh</b></h1>
            <div>
                <div>
                    <div>
                        <label htmlFor="city">Location</label>
                        <input className='w-full border-1 border-solid border-gray-400 px-4 py-2' type="text" id='city' name='city' placeholder='City Location' />
                    </div>
                </div>
                <div className='=max-w-md mx-auto flex justify-between'>
                    <div>
                        <label htmlFor="city">Location</label>
                        <input className='w-full border-1 border-solid border-gray-400 px-4 py-2' type="text" id='city' name='city' placeholder='City Location' />
                    </div>
                    <div>
                        <label htmlFor="city">Location</label>
                        <input className='w-full border-1 border-solid border-gray-400 px-4 py-2' type="text" id='city' name='city' placeholder='City Location' />
                    </div>
                    <div>
                        <label htmlFor="city">Location</label>
                        <input className='w-full border-1 border-solid border-gray-400 px-4 py-2' type="text" id='city' name='city' placeholder='City Location' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default filter;