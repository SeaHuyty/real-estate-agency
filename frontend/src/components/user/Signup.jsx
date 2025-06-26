import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const Signup = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const user = await axios.post(`${BASE_URL}/api/user/auth/google-login`, { token: credentialResponse.credential });
            
            if (user.data.token) {
                localStorage.setItem('userToken', user.data.token);
                navigate('/user');
            } else {
                console.error('Login failed: No token received:', user.data.error);
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    return (
        <>
            <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
                console.log('Login Failed');
            }}
            />;
        </>
    );
}

export default Signup;