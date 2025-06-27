import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const ClientId = "836600766864-7or20n94n2rcdtiopdlmdj0ut4rq3rm5.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={ClientId}>
      <App />
    </GoogleOAuthProvider>;
  </StrictMode>,
)
