import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaSync, 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaCalendarAlt, 
  FaUser, 
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaChartBar
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';

const BASE_URL = 'http://localhost:3000';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const StatusIndicator = ({ status, count, active, onClick }) => {
  const statusConfig = {
    all: { color: 'gray', icon: null },
    pending: { color: 'yellow', icon: null },
    assigned: { color: 'blue', icon: null },
    completed: { color: 'green', icon: null }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
        active 
          ? `bg-${statusConfig[status].color}-50 border-${statusConfig[status].color}-500 shadow-inner`
          : 'bg-white border-gray-200 hover:bg-gray-50'
      } border-2 min-w-[80px]`}
    >
      <span className={`text-2xl font-bold text-${statusConfig[status].color}-600`}>{count}</span>
      <span className={`text-xs font-medium text-${statusConfig[status].color}-800 mt-1 capitalize`}>
        {status}
      </span>
    </motion.button>
  );
};

const RequestCard = ({ request, onClick }) => {
  const statusColors = {
    pending: 'yellow',
    assigned: 'blue',
    completed: 'green',
    cancelled: 'red'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate text-sm">{request.property_title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">REQ-{request.id}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColors[request.status]}-100 text-${statusColors[request.status]}-800`}>
            {request.status}
          </span>
        </div>
        
        <div className="flex items-center mt-3">
          <div className="bg-blue-50 p-2 rounded-lg mr-3">
            <FaUser className="text-blue-500 text-sm" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{request.user_name}</p>
            <p className="text-xs text-gray-500 truncate">{request.user_email}</p>
          </div>
        </div>
        
        <div className="flex items-center mt-3 text-xs text-gray-600">
          <FaCalendarAlt className="mr-2 text-blue-500 flex-shrink-0" />
          <span className="truncate">{formatDate(request.preferred_date)}</span>
        </div>
        
        {request.notes && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Client Note</p>
            <p className="text-xs text-gray-700 line-clamp-2">{request.notes}</p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-4 py-2.5 flex justify-end border-t border-gray-100">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center group-hover:text-blue-700 transition-colors"
        >
          <FaEye className="mr-1.5" /> View Details
        </button>
      </div>
    </motion.div>
  );
};

const ManageVisitRequests = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'preferred_date', direction: 'desc' });
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const token = localStorage.getItem('accessToken');

    // Calculate status counts
    const statusCounts = requests.reduce((acc, request) => {
      acc.all = (acc.all || 0) + 1;
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {});

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!token) throw new Error('No token found. Please login again');
            
            const response = await axios.get(`${BASE_URL}/api/requests`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            if (response.data.success) {
                setRequests(response.data.data);
                setFilteredRequests(response.data.data);
            }

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

    // Apply filters and sorting
    useEffect(() => {
        let result = [...requests];
        
        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(req => 
                (req.property_title?.toLowerCase().includes(term) || 
                req.user_name?.toLowerCase().includes(term) ||
                (req.notes && req.notes.toLowerCase().includes(term))
            ));
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

    const handleRowClick = (id) => {
        navigate(`/admin/requests/${id}`);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setSortConfig({ key: 'preferred_date', direction: 'desc' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Visit Requests</h1>
                            <p className="mt-1 text-gray-600">Manage property visit requests</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <motion.button 
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={fetchData}
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <FaSync className={`mr-2 text-sm ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Status Overview */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-700 flex items-center">
                            <FaChartBar className="mr-2 text-blue-500" />
                            REQUEST STATUS
                        </h2>
                        <span className="text-xs text-gray-500">
                            Showing {filteredRequests.length} of {requests.length} requests
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <StatusIndicator 
                            status="all"
                            count={statusCounts.all || 0}
                            active={statusFilter === 'all'}
                            onClick={() => setStatusFilter('all')}
                        />
                        <StatusIndicator 
                            status="pending"
                            count={statusCounts.pending || 0}
                            active={statusFilter === 'pending'}
                            onClick={() => setStatusFilter('pending')}
                        />
                        <StatusIndicator 
                            status="assigned"
                            count={statusCounts.assigned || 0}
                            active={statusFilter === 'assigned'}
                            onClick={() => setStatusFilter('assigned')}
                        />
                        <StatusIndicator 
                            status="completed"
                            count={statusCounts.completed || 0}
                            active={statusFilter === 'completed'}
                            onClick={() => setStatusFilter('completed')}
                        />
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400 text-sm" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search requests..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <FaTimes className="text-gray-400 hover:text-gray-600 text-sm" />
                                </button>
                            )}
                        </div>
                        
                        {/* Secondary Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                                >
                                    <FaFilter className="mr-2" />
                                    Filters
                                    {showFilters ? (
                                        <FaChevronUp className="ml-2" />
                                    ) : (
                                        <FaChevronDown className="ml-2" />
                                    )}
                                </motion.button>
                                
                                {(searchTerm || statusFilter !== 'all') && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={clearFilters}
                                        className="flex items-center px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                                    >
                                        Clear filters
                                        <FaTimes className="ml-1.5" />
                                    </motion.button>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-3 py-1 text-xs rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                    >
                                        Grid
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`px-3 py-1 text-xs rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                    >
                                        Table
                                    </button>
                                </div>
                                
                                <div className="flex items-center text-xs">
                                    <FaSort className="text-gray-500 mr-2" />
                                    <select
                                        value={`${sortConfig.key}-${sortConfig.direction}`}
                                        onChange={(e) => {
                                            const [key, direction] = e.target.value.split('-');
                                            setSortConfig({ key, direction });
                                        }}
                                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="preferred_date-desc">Newest First</option>
                                        <option value="preferred_date-asc">Oldest First</option>
                                        <option value="property_title-asc">Property A-Z</option>
                                        <option value="property_title-desc">Property Z-A</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        {/* Expanded Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-3 mt-3 border-t border-gray-200">
                                        <h3 className="text-xs font-medium text-gray-700 mb-2">STATUS FILTERS</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['all', 'pending', 'assigned', 'completed'].map(status => (
                                                <motion.button
                                                    key={status}
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setStatusFilter(status)}
                                                    className={`px-3 py-1 text-xs rounded-full capitalize ${
                                                        statusFilter === status
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {status === 'all' ? 'All Statuses' : status}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                
                {/* Content */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                    >
                        <p className="font-medium">Error loading data</p>
                        <p className="mt-1">{error}</p>
                        <button 
                            onClick={fetchData}
                            className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"
                        ></motion.div>
                        <p className="text-gray-600 text-sm">Loading visit requests...</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                        <div className="inline-flex p-3 bg-gray-100 rounded-full mb-3">
                            <FaSearch className="text-gray-500" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">No requests found</h3>
                        <p className="text-gray-500 text-xs max-w-md mx-auto mb-4">
                            {searchTerm || statusFilter !== 'all' 
                                ? "Try adjusting your search or filter criteria"
                                : "There are currently no visit requests"}
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={clearFilters}
                                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs shadow-sm"
                            >
                                Clear All Filters
                            </motion.button>
                        )}
                    </motion.div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {filteredRequests.map(request => (
                                <RequestCard 
                                    key={request.id}
                                    request={request}
                                    onClick={() => handleRowClick(request.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Property
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Client
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date/Time
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRequests.map(request => (
                                        <motion.tr 
                                            key={request.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleRowClick(request.id)}
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{request.property_title}</div>
                                                <div className="text-xs text-gray-500">REQ-{request.id}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{request.user_name}</div>
                                                <div className="text-xs text-gray-500">{request.user_email}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(request.preferred_date)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRowClick(request.id);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center justify-end w-full"
                                                >
                                                    <FaEye className="mr-1.5" /> View
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            
            <Footer />  
        </div>
    );
};

export default ManageVisitRequests;