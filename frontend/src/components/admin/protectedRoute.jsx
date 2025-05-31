// ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const BASE_URL = 'http://localhost:3000';

const ProtectedRouted = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect (() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/admins/check-auth`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    setIsAuthenticated(true); // Admin is authenticated
                } else {
                    setIsAuthenticated(false); // Admin is not authenticated
                }
            } catch (err) {
                console.error("Authentication check failed", err);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <p>Loading...</p>;
    }
    return isAuthenticated ? children : <Navigate to="/login" />
};

export default ProtectedRouted