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

    const dashboardCards = [
        {
            title: "Create Property",
            description: "Add new luxury listings",
            link: "/admin/properties/create",
            icon: (
                <div className="p-3 bg-blue-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
            ),
            bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
            borderColor: "border-blue-200"
        },
        {
            title: "Manage Properties",
            description: "Edit existing listings",
            link: "/admin/properties/manage",
            icon: (
                <div className="p-3 bg-green-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                </div>
            ),
            bgColor: "bg-gradient-to-br from-green-50 to-green-100",
            borderColor: "border-green-200"
        },
        {
            title: "View Analytics",
            description: "Performance metrics",
            link: "/admin/analytics",
            icon: (
                <div className="p-3 bg-purple-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
            ),
            bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
            borderColor: "border-purple-200"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Welcome back, <span className="text-blue-600">{user?.username}</span>
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Here's what's happening with your properties today
                                </p>
                            </div>
                            <button 
                                onClick={handleLogout} 
                                className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign out
                            </button>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-lg bg-blue-50 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Properties</p>
                                        <p className="text-2xl font-semibold text-gray-900">24</p>
                                    </div>
                                </div>
                            </div>
                            {/* Add more stat cards here */}
                        </div>

                        {/* Dashboard Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dashboardCards.map((card, index) => (
                                <Link 
                                    key={index}
                                    to={card.link}
                                    className={`${card.bgColor} p-6 rounded-xl shadow-sm border ${card.borderColor} hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
                                >
                                    <div className="flex items-start space-x-4">
                                        {card.icon}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                                            <p className="mt-1 text-sm text-gray-600">{card.description}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 shadow-sm">
                                            Go to section →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Recent Activity Section */}
                        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                            <div className="space-y-4">
                                {/* Sample activity items */}
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">New property added</p>
                                        <p className="text-sm text-gray-500">Luxury Villa in Phnom Penh</p>
                                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                                {/* Add more activity items */}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            
            <Footer />
        </div>
    );
};

export default AdminDashboard;