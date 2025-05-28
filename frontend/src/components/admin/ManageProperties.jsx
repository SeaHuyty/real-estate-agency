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

    return (
        <div className='w-full overflow-hidden'>
            <Navbar />
            <div className='px-20 py-10'>
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-3xl font-bold'>Manage Properties</h1>
                    <Link 
                        to="/admin/properties/create" 
                        className='bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition'
                    >
                        Add New Property
                    </Link>
                </div>
                
                {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}
                
                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <div className='loading loading-spinner loading-lg' />
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-white border'>
                            <thead>
                                <tr>
                                    <th className='py-3 px-4 border-b text-left'>Title</th>
                                    <th className='py-3 px-4 border-b text-left'>Type</th>
                                    <th className='py-3 px-4 border-b text-left'>Location</th>
                                    <th className='py-3 px-4 border-b text-left'>Price</th>
                                    <th className='py-3 px-4 border-b text-left'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map(property => (
                                    <tr key={property.id} className='hover:bg-gray-50'>
                                        <td className='py-3 px-4 border-b'>{property.title}</td>
                                        <td className='py-3 px-4 border-b'>{property.property_type}</td>
                                        <td className='py-3 px-4 border-b'>{property.city}, {property.province}</td>
                                        <td className='py-3 px-4 border-b'>${property.price.toLocaleString()}</td>
                                        <td className='py-3 px-4 border-b'>
                                            <div className='flex gap-2'>
                                                <Link 
                                                    to={`/admin/properties/edit/${property.id}`}
                                                    className='text-blue-600 hover:text-blue-800'
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(property.id)}
                                                    className='text-red-600 hover:text-red-800'
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ManageProperties;