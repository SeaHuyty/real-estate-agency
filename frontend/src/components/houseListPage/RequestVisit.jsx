import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const RequestVisit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showForm, setForm] = useState(false);
    
    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/user/auth/google-login`, {
                token: credentialResponse.credential,
            });
            
            if (res.data.token) {
                localStorage.setItem('userToken', res.data.token);
                setForm(false);
                toast.success('Login successful');
            } else {
                console.error('Login failed: No token received:', res.data.error);
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            setForm(true);
        }
    }, []);

    return (
        <>
            <h1>Request a Visit for Property {id}</h1>
            {showForm && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="mb-4">Please login to continue</p>
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default RequestVisit;
