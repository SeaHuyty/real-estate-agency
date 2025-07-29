import React from 'react'
import Sidebar from './adminSidebar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const registerAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [id, setId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/api/admins/register`,
                {username, password, id},
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            const data = res.data;
            if (!data.success) {
                throw new Error(data.message || 'Registration Failed');
            } 
            localStorage.setItem('accessToken', data.accessToken);
            navigate('/admin');
        } catch (err) {
            console.log("Registration error:", err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='h-screen flex'>
            {/* <Sidebar /> */}
            <div className='w-full overflow-y-auto scrollbar-hide flex justify-center items-center'>
            <div className='bg-white py-8 px-30 w-full'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Admin Register</h2>
                
                {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}
                
                <form onSubmit={handleRegister}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2'>Username</label>
                        <input
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-full p-2 border rounded'
                            required
                        />
                    </div>
                    
                    <div className='mb-6'>
                        <label className='block text-gray-700 mb-2'>Password</label>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-2 border rounded'
                            required
                        />
                    </div>
                    
                    <div className='mb-6'>
                        <label className='block text-gray-700 mb-2'>Employee ID</label>
                        <input
                            type='number'
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className='w-full p-2 border rounded'
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition disabled:opacity-50'
                    >
                        {loading ? 'Logging in...' : 'Register'}
                    </button>
                    <div className='mt-4 text-center'>
                        <a href="/login" className='text-sm text-blue-600 hover:underline'>Sign Up here</a>
                    </div>
                </form>
            </div>
            </div>
        </div>
    )
}

export default registerAdmin