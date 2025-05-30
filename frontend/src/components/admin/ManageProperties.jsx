import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';

const BASE_URL = 'http://localhost:3000';
const ITEMS_PER_PAGE = 6;

const ManageProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/properties`);
                if (response.data.success) {
                    setProperties(response.data.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch properties');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;

        try {
            const response = await axios.delete(`${BASE_URL}/api/admin/properties/${id}`, {
                headers: {
                    // Add auth token here in real app
                }
            });

            if (response.data.success) {
                setProperties(properties.filter(property => property.id !== id));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete property');
        }
    };

    // Filter properties based on search term
    const filteredProperties = properties.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.property_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.id.toString().includes(searchTerm)
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
    const currentProperties = filteredProperties.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className='w-full'>
            <Navbar />
            <div className='px-4 md:px-20 py-8 flex flex-col gap-5'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-5'>
                    <h1 className='text-3xl font-bold'>Manage Properties</h1>
                    <div className='flex flex-col md:flex-row gap-4 w-full md:w-auto'>
                        <input
                            type='text'
                            placeholder='Search properties...'
                            className='px-4 py-2 w-100 border focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                        />
                        <Link 
                            to="/admin/properties/create" 
                            className='bg-blue-900 text-white py-2 px-4 hover:bg-blue-800 transition text-center'
                        >
                            Add New Property
                        </Link>
                    </div>
                </div>

                {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-lg'>{error}</div>}
                
                {loading ? (
                    <div className='flex justify-center'>
                        <div className='loading loading-spinner loading-lg' />
                    </div>
                ) : (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {currentProperties.map(property => (
                                <div key={property.id} className='flex flex-col gap-4 overflow-hidden shadow-md hover:shadow-lg transition-shadow'>
                                    <div className='h-48 overflow-hidden'>
                                        <img 
                                            className='w-full h-full object-cover' 
                                            src={property.property_thumbnail || '/placeholder-property.jpg'} 
                                            alt={property.title} 
                                        />
                                    </div>
                                    <div className='p-4 flex flex-col gap-3'>
                                        <div className='flex justify-between items-start'>
                                            <h2 className='text-xl font-bold truncate'>{property.title}</h2>
                                            <span className='text-lg font-semibold text-blue-900'>
                                                ${Number(property.price).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-1 text-gray-600'>
                                            <img className='w-4 h-4' src="/pin.png" alt="Location" />
                                            <span>{property.address}, {property.city}</span>
                                        </div>
                                        <div className='flex justify-between text-sm'>
                                            <span className='font-medium'>Type: {property.property_type}</span>
                                            <span className='text-gray-500'>ID: {property.id}</span>
                                        </div>
                                        <div className='flex gap-3 mt-2'>
                                            <Link 
                                                to={`/admin/properties/edit/${property.id}`}
                                                className='flex-1 text-center bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition'
                                            >
                                                Edit
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(property.id)}
                                                className='flex-1 text-center bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {filteredProperties.length > 0 && (
                            <div className='flex flex-col md:flex-row items-center justify-between gap-4 mt-6'>
                                <div className='text-gray-600 transition'>
                                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)} of{' '}
                                    {filteredProperties.length} properties
                                </div>
                                <div className='flex gap-2 '>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className='px-4 py-2 border rounded duration-300 easy-in-out hover:bg-blue-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 border rounded duration-300 easy-in-out hover:bg-blue-900 hover:text-white ${currentPage === page ? 'bg-blue-900 text-white' : ''}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className='px-4 py-2 border rounded duration-300 easy-in-out hover:bg-blue-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ManageProperties;