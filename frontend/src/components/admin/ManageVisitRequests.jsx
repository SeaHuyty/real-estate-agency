import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSync, FaSearch, FaFilter, FaSort, FaCalendarAlt, FaBuilding, FaUser, FaCheckCircle, FaClock, FaUserTie } from 'react-icons/fa';

const BASE_URL = 'http://localhost:3000';

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Check if date is valid
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

const ManageVisitRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'preferred_date', direction: 'desc' });
    const token = localStorage.getItem('accessToken');

    // Fetch data
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!token) throw new Error('No token found. Please login again');
            
            const [requestsRes, employeesRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/requests`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BASE_URL}/api/admins/employees`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (requestsRes.data.success) {
                setRequests(requestsRes.data.data);
                setFilteredRequests(requestsRes.data.data);
            }
            if (employeesRes.data.success) setEmployees(employeesRes.data.data);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
            toast.error(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Update request
    const handleUpdate = async (id, status, assignedAgencyId, notes) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/requests/${id}`, 
                { status, assignedAgencyId, notes },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setRequests(requests.map(req => req.id === id ? response.data.data : req));
                toast.success('Request updated successfully');
                fetchData(); // Refresh data to ensure consistency
            }
        } catch (err) {
            toast.error('Error updating request: ' + (err.response?.data?.message || err.message));
        }
    };

    // Apply filters and sorting
    useEffect(() => {
        let result = [...requests];
        
        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(req => 
                req.property_title.toLowerCase().includes(term) || 
                req.user_name.toLowerCase().includes(term) ||
                (req.notes && req.notes.toLowerCase().includes(term))
            );
        }
        
        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(req => req.status === statusFilter);
        }
        
        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const valueA = a[sortConfig.key];
                const valueB = b[sortConfig.key];
                
                if (valueA < valueB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        
        setFilteredRequests(result);
    }, [requests, searchTerm, statusFilter, sortConfig]);

    // Get status badge style
    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'assigned':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch(status) {
            case 'pending':
                return <FaClock className="mr-1" />;
            case 'assigned':
                return <FaUserTie className="mr-1" />;
            case 'completed':
                return <FaCheckCircle className="mr-1" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Visit Requests Management</h1>
                            <p className="mt-2 text-blue-100">Manage and track property visit requests</p>
                        </div>
                        <button 
                            onClick={fetchData}
                            disabled={loading}
                            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition duration-200"
                        >
                            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6 flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <FaClock size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500">Pending Requests</p>
                            <p className="text-2xl font-bold">
                                {requests.filter(r => r.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow p-6 flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                            <FaUserTie size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500">Assigned Requests</p>
                            <p className="text-2xl font-bold">
                                {requests.filter(r => r.status === 'assigned').length}
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow p-6 flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <FaCheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500">Completed Requests</p>
                            <p className="text-2xl font-bold">
                                {requests.filter(r => r.status === 'completed').length}
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Controls */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search requests..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center">
                                <FaFilter className="text-gray-500 mr-2" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center">
                                <FaSort className="text-gray-500 mr-2" />
                                <select
                                    value={`${sortConfig.key}-${sortConfig.direction}`}
                                    onChange={(e) => {
                                        const [key, direction] = e.target.value.split('-');
                                        setSortConfig({ key, direction });
                                    }}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="preferred_date-desc">Date: Newest First</option>
                                    <option value="preferred_date-asc">Date: Oldest First</option>
                                    <option value="property_title-asc">Property: A-Z</option>
                                    <option value="property_title-desc">Property: Z-A</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Content */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <p>Error: {error}</p>
                        <button 
                            onClick={fetchData}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                )}
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                        <p className="text-gray-600">Loading visit requests...</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                            <FaSearch className="text-gray-500 text-3xl" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No requests found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {searchTerm || statusFilter !== 'all' 
                                ? "Try adjusting your search or filter to find what you're looking for."
                                : "There are currently no visit requests to display."}
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                }}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredRequests.map(request => (
                            <div key={request.id} className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                            <FaBuilding className="text-indigo-600 mr-2" />
                                            {request.property_title}
                                        </h3>
                                        <div className="mt-1 flex items-center text-gray-600">
                                            <FaUser className="mr-2" />
                                            <span>{request.user_name}</span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(request.status)} flex items-center`}>
                                        {getStatusIcon(request.status)}
                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="mb-4">
                                        <div className="flex items-center text-gray-600 mb-1">
                                            <FaCalendarAlt className="mr-2" />
                                            <span className="font-medium">Preferred Date:</span>
                                        </div>
                                        <div className="ml-6 text-gray-800">
                                            {formatDate(request.preferred_date)}
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Assign to Agency:
                                        </label>
                                        <select
                                            value={request.assigned_agency_id || ''}
                                            onChange={(e) => handleUpdate(request.id, request.status, e.target.value, request.notes)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Agency</option>
                                            {employees.map(emp => (
                                                <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status:
                                        </label>
                                        <select
                                            value={request.status}
                                            onChange={(e) => handleUpdate(request.id, e.target.value, request.assigned_agency_id, request.notes)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="assigned">Assigned</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes:
                                        </label>
                                        <textarea 
                                            defaultValue={request.notes}
                                            onBlur={(e) => handleUpdate(request.id, request.status, request.assigned_agency_id, e.target.value)}
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Add any notes about this request..."
                                        />
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleUpdate(request.id, request.status, request.assigned_agency_id, request.notes)}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div className="bg-gray-800 text-white py-6 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p>© {new Date().getFullYear()} Property Management System. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default ManageVisitRequests;