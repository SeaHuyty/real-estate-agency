import React from 'react'
import { assets } from '../assets/assets';
import { motion } from "framer-motion";
const contact = () => {
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
    return (
        <motion.div className='relative w-full flex justify-center items-center min-h-screen bg-gray-100' id='contact' initial={{ opacity: 0, y: 150 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <img className='w-full h-full min-h-screen object-cover absolute top-0 left-0 z-0 brightness-70' src={assets.header_img} alt='' />
            <div className='z-10 w-full flex justify-center items-center'>
                <form onSubmit={onSubmit} className='bg-white p-6 rounded shadow-md w-full max-w-md'>
                    <h2 className='text-2xl font-bold mb-4'>Contact Us</h2>
                    <input type='text' name='name' placeholder='Your Name' className='border p-2 mb-4 w-full' required />
                    <input type='email' name='email' placeholder='Your Email' className='border p-2 mb-4 w-full' required />
                    <textarea name='message' placeholder='Your Message' className='border p-2 mb-4 w-full h-32' required></textarea>
                    <button type='submit' className='bg-blue-900 text-white py-2 px-4 rounded'>Send</button>
                    {result && <p className='mt-4'>{result}</p>}
                </form>
            </div>
        </motion.div>
    )
}

export default contact