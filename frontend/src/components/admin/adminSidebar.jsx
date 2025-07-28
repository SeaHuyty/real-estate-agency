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
    House,
} from 'lucide-react';

const BASE_URL = 'http://localhost:3000';

const Sidebar = () => {
    const token = localStorage.getItem('accessToken');
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
                if (!token) throw new Error('No token');

                const decoded = jwtDecode(token);
                if (!decoded?.id) throw new Error('Invalid token');

                const [adminRes, employeeRes, propertiesRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/admins/check-auth`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${BASE_URL}/api/admins/employeeProfile`, {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { id: decoded.id },
                    }),
                    axios.get(`${BASE_URL}/api/properties`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
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
                        <Link to="/admin" class="flex items-center p-2 text-gray-900 rounded-lg hover:text-white hover:bg-blue-800 transition-colors px-4 py-3">
                            <svg fill='white' class="shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 495.398 495.398" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> 
                                <path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391 v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158 c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747 c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z"></path> <path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401 c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79 c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z"></path> </g> </g> </g> </g>
                            </svg>
                            <span class=" flex-1 text-white ms-3 whitespace-nowrap">Home</span>
                        </Link>
                        <Link to="/admin/employee" class="flex items-center p-2 text-gray-900 rounded-lg hover:text-white hover:bg-blue-800 transition-colors px-4 py-3">
                            <svg class="shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                            </svg>
                            <span class=" flex-1 text-white ms-3 whitespace-nowrap">Employees</span>
                        </Link>
                        <Link to="/admin/createEmployee" class="flex items-center p-2 text-gray-900 rounded-lg hover:text-white hover:bg-blue-800 transition-colors px-4 py-3">
                            {/* <svg class="shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"/>
                            </svg> */}
                            <svg class="shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> 
                                <path d="M369.818,195.01c-24.471,42.493-65.783,75.375-113.802,75.375c-48.025,0-89.369-32.882-113.835-75.357 c-49,23.252-83.014,73.06-83.014,130.945v128.986c0,27.407,22.216,49.619,49.584,49.619h294.49c27.469,0,49.59-22.212,49.59-49.619 V325.973C452.832,268.079,418.881,218.265,369.818,195.01z M341.438,317.276L250.02,436.739c-3.356,4.357-8.341,7.176-13.812,7.779 c-0.717,0.082-1.469,0.123-2.218,0.123c-4.69,0-9.284-1.646-12.899-4.692l-54.476-45.53c-8.536-7.144-9.675-19.851-2.508-28.394 c7.103-8.521,19.84-9.668,28.375-2.526l38.314,32.036l78.65-102.751c6.776-8.829,19.417-10.507,28.244-3.747 C346.522,295.797,348.219,308.447,341.438,317.276z"></path> <path d="M256.017,237.022c57.504,0,104.091-67.962,104.091-125.457c0-57.521-46.587-104.144-104.091-104.144 c-57.537,0-104.129,46.623-104.129,104.144C151.888,169.061,198.479,237.022,256.017,237.022z"></path> </g> </g>
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
