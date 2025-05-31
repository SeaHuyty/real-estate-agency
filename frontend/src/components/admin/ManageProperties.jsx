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
                                <div key={property.id} className='flex flex-col gap-3'>
                                    <div>
                                        {property.property_thumbnail ? (
                                            <img src={property.property_thumbnail} alt="property.title" className='w-full h-[300px] object-cover object-center' />
                                        ) : (
                                            <div className='w-full h-48 bg-gray-200 rounded flex items-center justify-center' >
                                                <span>No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col justify-between gap-[10px]">
                                        <div className="flex justify-between">
                                            <h2 className="text-[20px] font-semibold">{property.title}</h2>
                                            <p className='text-[20px] font-semibold text-green-600'>$ {Number(property.price).toLocaleString()}</p>
                                        </div>
                                        <p className='text-[14px] flex items-center gap-[10px] text-gray-500'>
                                            <img className='w-[20px] h-[20px]' src="/pin.png" alt="" />
                                            <span>{property.address}, {property.city}</span>
                                        </p>
                                        <div className="flex justify-between align-center">
                                            <div className="flex items-center bg-white w-full">
                                                <span>ID: {property.id}</span>
                                            </div>
                                            <div className='flex gap-3 mt-2 w-full h-10 justify-end'>
                                                <div>
                                                    <img 
                                                        to={`/admin/properties/edit/${property.id}`}
                                                        className='flex-1 text-center cursor-pointer w-5 h-5'
                                                        src='/edit.png' alt='edit'
                                                    />
                                                </div>
                                                <div>
                                                    <img 
                                                        onClick={() => handleDelete(property.id)}
                                                        className='flex-1 text-center cursor-pointer w-5 h-5'
                                                        src='/delete.png' alt='delete'
                                                    />
                                                </div>
                                            </div>
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
                                    <img
                                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className='px-4 py-2 duration-300 easy-in-out hover:bg-blue-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                                        src="/left_arrow.svg" alt='Previous'
                                    />
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 duration-300 easy-in-out hover:bg-blue-900 hover:text-white ${currentPage === page ? 'bg-blue-900 text-white' : ''}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <img
                                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className='px-4 py-2 duration-300 easy-in-out hover:bg-blue-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rotate-180'
                                        src="/left_arrow.svg" alt='Next'
                                    />
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