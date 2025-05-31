import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:3000';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the accessToken from localStorage
        localStorage.removeItem('accessToken');
        // Then redirect to the login page
        navigate('/login');
    };

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) throw new Error('No token found');

                const res = await axios.get(`${BASE_URL}/api/admins/check-auth`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data.user);
            } catch (err) {
                console.error('Failed to load current admin:', err);
            } finally {
                setLoading(false)
            }
        };
        fetchAdmin();
    }, [navigate]);

    return (
        <div className="w-full overflow-hidden">
        <Navbar />

        <div className="px-20 ">
            {/* 1) Show loading state while we wait for /me */}
            {loading ? (
                <p>Loading dashboard…</p>
            ) : (
                <>
                    {/* 2) When loaded, display “Welcome, <username>” */}
                    <h1 className="text-center text-3xl font-bold mb-4">
                        Welcome, {user?.username}!
                    </h1>
                    <div className="mt-20 flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        {/* 1. Place the Logout button here */}
                        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition">
                            Logout
                        </button>
                    </div>
                    {/* 3) The rest of your dashboard links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link to="/admin/properties/create" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                            <h2 className="text-xl font-semibold mb-2">
                            Create Property
                            </h2>
                            <p className="text-gray-600">Add new property listings</p>
                        </Link>

                        <Link to="/admin/properties/manage" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                            <h2 className="text-xl font-semibold mb-2">
                            Manage Properties
                            </h2>
                            <p className="text-gray-600">
                            View, edit or delete properties
                            </p>
                        </Link>
                    </div>
                </>
            )}
        </div>

        <Footer />
        </div>
    );
};

export default AdminDashboard;