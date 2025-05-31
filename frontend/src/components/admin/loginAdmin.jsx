import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const LoginAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await axios.post(`${BASE_URL}/api/admins/login`, 
                { username, password },
                {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password}),
                }
            );
            const data = res.data;
            if (!data.success) {
                throw new Error(data.message || 'Login Failed');
            }
            localStorage.setItem('accessToken', data.accessToken);
            navigate('/admin')
        } catch (err) {
            console.log("Login error:", err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Admin Login</h2>
                
                {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}
                
                <form onSubmit={handleLogin}>
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
                    
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition disabled:opacity-50'
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginAdmin;