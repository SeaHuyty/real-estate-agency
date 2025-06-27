import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaBuilding, 
  FaArrowLeft, 
  FaSave, 
  FaImage,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHome,
  FaClock,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaChartArea
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:3000';

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  
  return (
    <motion.span 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </motion.span>
  );
};

const FeatureCard = ({ icon, label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.3 }}
    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-4 text-center border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex justify-center mb-2">
      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
        {icon}
      </div>
    </div>
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    <p className="font-bold text-gray-800">{value}</p>
  </motion.div>
);

const VisitRequestDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        status: '',
        assigned_agency_id: '',
        notes: ''
    });
    const [imageLoading, setImageLoading] = useState(true);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!token) throw new Error('No token found. Please login again');
                
                const [requestRes, employeesRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/requests/${id}`, { 
                        headers: { Authorization: `Bearer ${token}` } 
                    }),
                    axios.get(`${BASE_URL}/api/admins/employees`, { 
                        headers: { Authorization: `Bearer ${token}` } 
                    })
                ]);

                if (requestRes.data.success) {
                    setRequest(requestRes.data.data);
                    setFormData({
                        status: requestRes.data.data.status,
                        assigned_agency_id: requestRes.data.data.assigned_agency_id || '',
                        notes: requestRes.data.data.notes || ''
                    });
                }
                
                if (employeesRes.data.success) {
                    setEmployees(employeesRes.data.data);
                }

            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
                toast.error(err.response?.data?.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${BASE_URL}/api/requests/${id}`, 
                {
                    status: formData.status,
                    assignedAgencyId: formData.assigned_agency_id || null,
                    notes: formData.notes
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setRequest(response.data.data);
                toast.success('Request updated successfully');
                
                // Animate status change
                const statusElement = document.querySelector('.status-badge');
                if (statusElement) {
                    statusElement.classList.add('animate-pulse');
                    setTimeout(() => {
                        statusElement.classList.remove('animate-pulse');
                    }, 1000);
                }
            }
        } catch (err) {
            toast.error('Error updating request: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"
                    ></motion.div>
                    <p className="text-gray-600 mt-4 text-lg">Loading request details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <Navbar />
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-2xl mx-auto text-center p-8 bg-white rounded-2xl shadow-lg">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </motion.div>
                        <motion.h3 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-gray-800 mb-2"
                        >
                            Error loading request
                        </motion.h3>
                        <p className="text-gray-600 mb-6">{error || 'Request not found'}</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/admin/requests')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg font-medium"
                        >
                            Back to Requests
                        </motion.button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Property features data (in a real app, this would come from API)
    const propertyFeatures = [
        { icon: <FaBed className="text-xl" />, label: "Bedrooms", value: "3" },
        { icon: <FaBath className="text-xl" />, label: "Bathrooms", value: "2" },
        { icon: <FaChartArea className="text-xl" />, label: "Area", value: "1,200 sqft" },
        { icon: <FaHome className="text-xl" />, label: "Type", value: "Apartment" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Navbar />
            
            <div className="container mx-auto px-20 py-8">
                <motion.button 
                    whileHover={{ x: -5 }}
                    onClick={() => navigate('/admin/requests')}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200 font-medium"
                >
                    <FaArrowLeft className="mr-2" /> Back to Requests
                </motion.button>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
                >
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-2xl font-bold text-white mb-2"
                                >
                                    Visit Request Details
                                </motion.h1>
                                <div className="flex items-center">
                                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full flex items-center">
                                        <span className="text-white mr-2">Request ID:</span>
                                        <span className="font-semibold text-white">#{id}</span>
                                    </div>
                                    <div className="ml-4">
                                        <StatusBadge status={request.status} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <p className="text-blue-100 flex items-center">
                                    <FaCalendarAlt className="mr-2" />
                                    <span className="font-medium">Created:</span> 
                                    <span className="ml-1">{formatDate(request.created_at)}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 h-full">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Link to={`/properties/${request.property_id}`}>
                                {/* Left Column - Property Info */}
                                <div className="lg:col-span-1">
                                    <div className="bg-gray-50 rounded-xl p-5 shadow-sm h-full">
                                        <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 flex items-center">
                                            <FaBuilding className="mr-2 text-blue-500" /> Property Details
                                        </h2>
                                        
                                        <div className="flex flex-col h-full">
                                            <div className="mb-5">
                                                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                                                    {request.property_thumbnail ? (
                                                        <motion.div 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            <img 
                                                                src={request.property_thumbnail} 
                                                                alt={request.property_title}
                                                                className="w-full h-48 object-cover"
                                                                onLoad={() => setImageLoading(false)}
                                                            />
                                                            {imageLoading && (
                                                                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                                                            )}
                                                        </motion.div>
                                                    ) : request.property_images?.length > 0 ? (
                                                        <motion.div 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            <img 
                                                                src={request.property_images[0]} 
                                                                alt={request.property_title}
                                                                className="w-full h-48 object-cover"
                                                                onLoad={() => setImageLoading(false)}
                                                            />
                                                            {imageLoading && (
                                                                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                                                            )}
                                                        </motion.div>
                                                    ) : (
                                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                            <FaImage className="text-gray-400 text-4xl" />
                                                        </div>
                                                    )}
                                                    <div className="p-4">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="text-xl font-bold text-gray-800">{request.property_title}</h3>
                                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                                ID: {request.property_id}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 mt-2 flex items-center">
                                                            <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                                            {request.property_address || 'Address not available'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            {/* Middle Column - User Info */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                                    <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 flex items-center">
                                        <FaUser className="mr-2 text-blue-500" /> Client Information
                                    </h2>
                                    <div className="flex items-start mb-5">
                                        <div className="flex-shrink-0 h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                            <FaUser className="text-blue-600 text-xl" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-lg">{request.user_name}</p>
                                            <div className="mt-2 space-y-2">
                                                <p className="flex items-center text-gray-600">
                                                    <FaEnvelope className="mr-2 text-blue-500" />
                                                    <span>{request.user_email}</span>
                                                </p>
                                                <p className="flex items-center text-gray-600">
                                                    <FaPhone className="mr-2 text-blue-500" />
                                                    <span>{request.user_phone || 'Not provided'}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-md font-medium text-gray-700 mb-2">Client Message</h3>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-gray-700">{request.notes || 'No message provided'}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 rounded-xl p-5 shadow-sm mt-6">
                                    <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 flex items-center">
                                        <FaClock className="mr-2 text-blue-500" /> Visit Timing
                                    </h2>
                                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Preferred Date</p>
                                            <p className="text-lg font-bold text-gray-800">{formatDate(request.preferred_date)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Preferred Time</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {new Date(request.preferred_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            
                            
                            {/* Right Column - Update Form */}
                            <div className="lg:col-span-1">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm h-full">
                                    <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-blue-200 flex items-center">
                                        <FaSave className="mr-2 text-blue-500" /> Manage Request
                                    </h2>
                                    
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Update Status
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <motion.button 
                                                    type="button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setFormData({...formData, status: 'pending'})}
                                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                                                        formData.status === 'pending' 
                                                            ? 'bg-yellow-500 text-white shadow-md' 
                                                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                    }`}
                                                >
                                                    Pending
                                                </motion.button>
                                                <motion.button 
                                                    type="button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setFormData({...formData, status: 'assigned'})}
                                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                                                        formData.status === 'assigned' 
                                                            ? 'bg-blue-500 text-white shadow-md' 
                                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                    }`}
                                                >
                                                    Assigned
                                                </motion.button>
                                                <motion.button 
                                                    type="button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setFormData({...formData, status: 'completed'})}
                                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                                                        formData.status === 'completed' 
                                                            ? 'bg-green-500 text-white shadow-md' 
                                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    }`}
                                                >
                                                    Completed
                                                </motion.button>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Assign to Agent
                                            </label>
                                            <select
                                                name="assigned_agency_id"
                                                value={formData.assigned_agency_id}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                            >
                                                <option value="">Select Agent</option>
                                                {employees.map(emp => (
                                                    <option key={emp.id} value={emp.id}>
                                                        {emp.first_name} {emp.last_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">Assign this request to a team member</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Internal Notes
                                            </label>
                                            <textarea 
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                                placeholder="Add any notes about this request..."
                                            />
                                        </div>
                                        
                                        <motion.button 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:opacity-90 transition-opacity duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                                        >
                                            <FaSave className="mr-2" /> Update Request
                                        </motion.button>
                                        
                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                            <h3 className="font-medium text-gray-700 mb-2">Request History</h3>
                                            <ul className="space-y-2">
                                                <li className="flex items-start">
                                                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                                                        <FaUser className="text-blue-600 text-xs" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">Request submitted</p>
                                                        <p className="text-xs text-gray-500">{formatDateTime(request.created_at)}</p>
                                                    </div>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="bg-yellow-100 rounded-full p-1 mr-3 mt-1">
                                                        <FaClock className="text-yellow-600 text-xs" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">Status updated to Pending</p>
                                                        <p className="text-xs text-gray-500">{formatDateTime(request.created_at)}</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            <Footer />
        </div>
    );
};

export default VisitRequestDetail;