import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
    LayoutDashboard,
    Menu,
    X,
    User,
    Bell,
    HelpCircle,
    ListTodo,
    ChevronDown,
} from 'lucide-react';

const BASE_URL = 'http://localhost:3000';

const Sidebar = () => {
    const [loading, setLoading] = useState(true);
    const [showTasks, setShowTasks] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [employee, setEmployees] = useState([]);
    const [property, setProperties] = useState([]);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) throw new Error('No token');

                const decoded = jwtDecode(token);
                if (!decoded?.id) throw new Error('Invalid token');

                const [adminRes, employeeRes, propertiesRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/admins/check-auth`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${BASE_URL}/api/admins/employeeProfile`, {
                        params: { id: decoded.id },
                    }),
                    axios.get(`${BASE_URL}/api/properties`),
                ]);

                setAdmin(adminRes.data.user);
                setEmployees(employeeRes.data.data);
                setProperties(propertiesRes.data.data);
            } catch (err) {
                console.error('Error loading dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return (
        <div className="flex">
            {/* Mobile toggle button */}
            <button
                className="md:hidden p-4 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <div
                className={`${
                isOpen ? 'block' : 'hidden'
                } md:block w-64 min-h-screen bg-blue-950 text-white p-4 flex flex-col fixed md:relative z-50`}
            >
                {/* Profile */}
                <div className="flex flex-col items-center mb-6">
                    <div className='px-4 py-2 bg-center bg-cover'>
                        <img src={employee.profile} className="w-15 h-15 rounded-full object-cover" />
                    </div>
                    {/* {admin.username ? (
                        <p className="text-sm text-gray-300">{admin.username}</p>
                    ) : null} */}
                    <button 
                        onClick={handleLogout} 
                        className="mt-4 flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 transition ease-in-out duration-200 hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                    </button>
                </div>

                {/* Icons row */}
                <div className="flex justify-center space-x-4 mb-6 text-gray-300">
                    <User className="hover:text-white" />
                    <Bell className="hover:text-white" />
                    <HelpCircle className="hover:text-white" />
                </div>

                {/* Navigation */}
                <nav className="flex flex-col space-y-2 text-sm font-medium​​ mt-2">
                    <div className="text-sm space-y-1 text-gray-300 border border-gray-500 rounded-lg p-2">
                        <Link to="/admin/employee" class="flex items-center p-2 text-gray-900 rounded-lg hover:text-white hover:bg-blue-800 transition-colors px-4 py-3">
                            <svg class="shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                            </svg>
                            <span class=" flex-1 text-white ms-3 whitespace-nowrap">Employees</span>
                        </Link>
                        <Link to="/admin/createEmployee" class="flex items-center p-2 text-gray-900 rounded-lg hover:text-white hover:bg-blue-800 transition-colors px-4 py-3">
                            <svg class="shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"/>
                            </svg>
                            <span class=" flex-1 text-white ms-3 whitespace-nowrap">Add Employee</span>
                        </Link>
                        <Link to="/admin/requests" class="flex items-center p-2 text-gray-900 rounded-lg hover:text-white hover:bg-blue-800 transition-colors px-4 py-3">
                            <svg class="shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span class=" flex-1 text-white ms-3 whitespace-nowrap">Request</span>
                        </Link>
                    </div>
                    {/* Collapsible Tasks */}
                    <button
                        onClick={() => setShowTasks(!showTasks)}
                        className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                        <span className="flex items-center gap-3">
                            <ListTodo size={18} />
                            <span>Properties</span>
                        </span>
                        <ChevronDown
                            size={16}
                            className={`transition-transform ${
                                showTasks ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                    {showTasks && (
                        <div className="text-sm space-y-1 text-gray-300 border border-gray-500 rounded-lg p-2">
                            <Link to="/properties" className="block hover:text-white hover:bg-blue-800 transition-colors px-4 py-3">
                                View Properties
                            </Link>
                            <Link to="/admin/properties/create" className="block hover:text-white hover:bg-blue-800 transition-colors px-4 py-3">
                                Create Property
                            </Link>
                            <Link to="/admin/properties/manage" className="block hover:text-white hover:bg-blue-800 transition-colors px-4 py-3">
                                Edit Property
                            </Link>
                        </div>
                    )}
                    <Link
                        to="/Contact"
                        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                        <LayoutDashboard size={18} />
                        <span>Contact</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
