import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';

const BASE_URL = 'http://localhost:3000';

const ManageProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [user, setUser] = useState([]);

    useEffect(() => {
        // fetchUser();
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No token found. Please login again');
            }
            const response = await axios.get(`${BASE_URL}/api/properties`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setProperties(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch properties');
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;

        try {
            const response = await axios.delete(`${BASE_URL}/api/admin/properties/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setProperties(properties.filter(property => property.id !== id));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete property');
        }
    };

    return (
        <div className='w-full'>
            <Navbar />
            <div className='px-20 flex flex-col gap-5'>
                <div className='flex flex-col gap-5'>
                    <h1 className='text-3xl font-bold'>Manage Properties</h1>
                    <Link to="/admin/properties/create" className='w-50 text-center bg-blue-900 text-white py-2 px-4 hover:bg-blue-800 transition'><button>Add New Property</button></Link>
                </div>

                {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}
                
                {loading ? (
                    <div className='loading loading-spinner loading-lg' />
                ) : (
                    <div className='grid grid-cols-3 gap-13'>
                        {properties.map(property => (
                            <div key={property.id} className='flex flex-col gap-5'>
                                <div>
                                    <img className='w-full h-[300px] object-cover object-center' src={property.images} alt="" />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex items-center justify-between'>
                                            <h1 className='text-[20px] font-bold'>{property.title}</h1>
                                            <h1 className='text-[20px] text-green-600 font-bold'>${property.price.toLocaleString()}</h1>
                                        </div>
                                        <div>
                                            <div className='flex items-center justify-between'>
                                                <h1 className='font-semibold'>Category: {property.property_type}</h1>
                                                <h1 className='font-semibold'>ID: {property.id}</h1>
                                            </div>
                                            <div className='flex gap-1 items-center'>
                                                <img className='w-5 h-5 ' src="/pin.png" alt="" />
                                                <h1 className='text-gray-500'>{property.province}, {property.city}</h1>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex gap-5'>
                                        <Link to={`/admin/properties/edit/${property.id}`} className='text-white bg-blue-900 py-2 px-7 hover:bg-blue-800 transition'>
                                            <button>Edit</button>
                                        </Link>
                                        <button onClick={() => handleDelete(property.id)} className='text-white bg-blue-900 py-2 px-7 hover:bg-blue-800 transition'>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ManageProperties;