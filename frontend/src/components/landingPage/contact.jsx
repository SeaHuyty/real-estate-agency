import React from 'react'
import { assets } from '../../assets/assets';
import Navbar from './navbar'
import Footer from './footer'
const Contact = () => {
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

        // 
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
            <Navbar />
            <div className='px-20 w-full h-150 flex justify-center items-center' id='contact'>
                <div className='bg-cover bg-center w-230 h-full' style={{backgroundImage: `url(${assets.villa_s})`}}>
                    <div className='flex flex-col justify-center p-5 gap-5  mt-80'>
                        <div className='text-white font-semibold flex items-center gap-3'>
                            <img src="/phone.png" alt="" className='rotate-250'/>
                            <h1>+855 123456789</h1>
                        </div>
                        <div className='text-white font-semibold flex items-center gap-3'>
                            <img src="/location-alt.png" alt="" className='rotate-90'/>
                            <h1>longchhunhour@gmail.com</h1>
                        </div>
                        <div className='text-white font-semibold flex items-center gap-3'>
                            <img src="/location-alt.png" alt="" className='rotate-90'/>
                            <h1>Cambodia Academy Of Digital Technology</h1>
                        </div>
                    </div>
                </div>
                <form onSubmit={onSubmit} className='px-15 py-7 bg-white shadow-sm flex flex-col w-full h-full'>
                    <h2 className='text-2xl font-bold mb-4'>Contact Us</h2>
                    {/* first last name */}
                    <div className='flex gap-5'>
                        <input type='text' name='name' placeholder='First Name' className='p-5 mb-4 w-full h-16 bg-gray-2 bg-gray-200' required />
                        <input type='text' name='name' placeholder='Last Name' className='p-5 mb-4 w-full h-16 bg-gray-2 bg-gray-200' required />
                    </div>
                    {/* email phone number */}
                    <div className='flex flex-col'>
                        <input type='email' name='email' placeholder='Your Email' className='bg-gray-200 p-5 mb-4 w-full h-16' required />
                        <input name='phone number' placeholder='Phone Number' className='bg-gray-200 p-5 mb-4 w-full h-16' required />
                    </div>
                    <textarea name='message' placeholder='Your Message' className='bg-gray-200 p-5 mb-4 w-full h-48' required></textarea>
                    {/* send button */}
                    <div className='w-full'>
                        <button type='submit' className='px-15 bg-blue-900 h-16 text-white text-[20px] transition duration-350 ease-in-out hover:scale-102'>Send</button>
                        {result && <p className='mt-4'>{result}</p>}
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default Contact;