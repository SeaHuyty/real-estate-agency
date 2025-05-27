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
            <div className='w-full h-screen flex justify-center items-center' id='contact'>
                <div className='bg-cover bg-center w-[500px] h-[500px]' style={{backgroundImage: `url(${assets.villa_s})`}}></div>
                <form onSubmit={onSubmit} className='p-6 bg-white shadow-md flex flex-col w-full h-full'>
                    <h2 className='text-2xl font-bold mb-4'>Contact Us</h2>
                    <input type='text' name='name' placeholder='Your Name' className='p-2 mb-4 w-full bg-gray-2 bg-gray-200' required />
                    <input type='email' name='email' placeholder='Your Email' className='bg-gray-200 p-2 mb-4 w-full' required />
                    <textarea name='message' placeholder='Your Message' className='bg-gray-200 p-2 mb-4 w-full h-32' required></textarea>
                    <button type='submit' className='bg-blue-900 text-white py-2 px-4 rounded'>Send</button>
                    {result && <p className='mt-4'>{result}</p>}
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default Contact;