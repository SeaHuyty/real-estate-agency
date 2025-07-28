import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const ClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log('Google Client ID loaded:', ClientId ? 'Yes' : 'No');
console.log('Environment variables:', import.meta.env);

if (!ClientId) {
  console.error('VITE_GOOGLE_CLIENT_ID is not defined in environment variables');
  console.error('Make sure you have a .env file in the frontend directory with VITE_GOOGLE_CLIENT_ID');
}

createRoot(document.getElementById('root')).render(
  // I commented out <StrictMode> temporarily during development to prevent useEffect from running twice and avoid duplicate API calls.
  // <StrictMode>
    <GoogleOAuthProvider clientId={ClientId}>
      <App />
    </GoogleOAuthProvider>
  // </StrictMode>,
)
