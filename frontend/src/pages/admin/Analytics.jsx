import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../../components/admin/adminSidebar';
// import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('monthly');
    const [propertyStats, setPropertyStats] = useState(null);
    const [userStats, setUserStats] = useState(null);

    // Mock data - replace with real API calls
    useEffect(() => {
        const fetchData = async () => {
            // Simulate API loading
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock property data
            setPropertyStats({
                totalProperties: 24,
                activeListings: 18,
                pendingApproval: 3,
                propertiesByType: [
                    { name: 'Apartment', value: 10 },
                    { name: 'Villa', value: 6 },
                    { name: 'House', value: 5 },
                    { name: 'Penthouse', value: 3 }
                ],
                priceDistribution: [
                    { range: '$0-100k', count: 5 },
                    { range: '$100-300k', count: 8 },
                    { range: '$300-500k', count: 6 },
                    { range: '$500k+', count: 5 }
                ],
                viewsData: [
                    { name: 'Jan', views: 4000 },
                    { name: 'Feb', views: 3000 },
                    { name: 'Mar', views: 5000 },
                    { name: 'Apr', views: 2780 },
                    { name: 'May', views: 1890 },
                    { name: 'Jun', views: 2390 }
                ]
            });

            // Mock user data
            setUserStats({
                totalUsers: 142,
                newUsers: 12,
                userActivity: [
                    { name: 'Jan', active: 4000, registered: 2400 },
                    { name: 'Feb', active: 3000, registered: 1398 },
                    { name: 'Mar', active: 2000, registered: 9800 },
                    { name: 'Apr', active: 2780, registered: 3908 },
                    { name: 'May', active: 1890, registered: 4800 },
                    { name: 'Jun', active: 2390, registered: 3800 }
                ]
            });

            setLoading(false);
        };

        fetchData();
    }, [timeRange]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className='flex h-screen bg-gray-50'>
        <Sidebar />
        <div className="w-full overflow-y-auto scrollbar-hide">
            <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Track your property performance and user engagement
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </div>

                    {/* Property Stats */}
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Properties</p>
                                        <p className="mt-1 text-3xl font-semibold text-gray-900">{propertyStats.totalProperties}</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Active Listings</p>
                                        <p className="mt-1 text-3xl font-semibold text-gray-900">{propertyStats.activeListings}</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                                        <p className="mt-1 text-3xl font-semibold text-gray-900">{propertyStats.pendingApproval}</p>
                                    </div>
                                    <div className="bg-yellow-100 p-3 rounded-full">
                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Properties by Type</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={propertyStats.propertiesByType}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {propertyStats.propertiesByType.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Price Distribution</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={propertyStats.priceDistribution}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="range" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="count" fill="#8884d8" name="Number of Properties" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Stats */}
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sale Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total sales</p>
                                        <p className="mt-1 text-3xl font-semibold text-gray-900">{userStats.totalUsers}</p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Sales ({timeRange})</p>
                                        <p className="mt-1 text-3xl font-semibold text-gray-900">{userStats.newUsers}</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Avg. sale per ({timeRange})</p>
                                        <p className="mt-1 text-3xl font-semibold text-gray-900">4.2 min</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Property Sales Over Time</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={propertyStats.viewsData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="views" fill="#82ca9d" name="Total sales" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            {/* <Footer /> */}
        </div>
        </div>
    );
};

export default Analytics;