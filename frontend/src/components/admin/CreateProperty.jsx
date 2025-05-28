import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';

// const BASE_URL = 'http://localhost:3000';

const CreateProperty = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        property_type: '',
        address: '',
        city: '',
        province: '',
        price: '',
        size: '',
        bedrooms: '',
        bathrooms: '',
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...imageUrls]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${BASE_URL}/api/admin/properties`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth token here in real app
                }
            });

            if (response.data.success) {
                navigate('/admin/properties/manage');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full overflow-hidden'>
            <Navbar />
            <div className='px-20 py-10'>
                <h1 className='text-3xl font-bold mb-8'>Create New Property</h1>
                
                <form onSubmit={handleSubmit} className='max-w-3xl mx-auto'>
                    {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='form-group'>
                            <label className='block mb-2 font-medium'>Title</label>
                            <input
                                type='text'
                                name='title'
                                value={formData.title}
                                onChange={handleChange}
                                className='w-full p-2 border rounded'
                                required
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label className='block mb-2 font-medium'>Property Type</label>
                            <select
                                name='property_type'
                                value={formData.property_type}
                                onChange={handleChange}
                                className='w-full p-2 border rounded'
                                required
                            >
                                <option value=''>Select Type</option>
                                <option value='Apartment'>Apartment</option>
                                <option value='Villa'>Villa</option>
                                <option value='House'>House</option>
                                <option value='Penthouse'>Penthouse</option>
                            </select>
                        </div>
                        
                        <div className='form-group'>
                            <label className='block mb-2 font-medium'>Address</label>
                            <input
                                type='text'
                                name='address'
                                value={formData.address}
                                onChange={handleChange}
                                className='w-full p-2 border rounded'
                                required
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label className='block mb-2 font-medium'>City</label>
                            <input
                                type='text'
                                name='city'
                                value={formData.city}
                                onChange={handleChange}
                                className='w-full p-2 border rounded'
                                required
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label className='block mb-2 font-medium'>Province</label>
                            <select
                                name='province'
                                value={formData.province}
                                onChange={handleChange}
                                className='w-full p-2 border rounded'
                                required
                            >
                                <option value=''>Select Province</option>
                                <option value='phnompenh'>Phnom Penh</option>
                                <option value='siemreap'>Siem Reap</option>
                                <option value='sihanouk'>Sihanouk Ville</option>
                                <option value='kompot'>Kompot</option>
                                <option value='kep'>Kep</option>
                            </select>
                        </div>
                        
                        <div className='form-group'>
                            <label className='block mb-2 font-medium'>Price ($)</label>
                            <input
                                type='number'
                                name='price'
                                value={formData.price}
                                onChange={handleChange}
                                className='w-full p-2 border rounded'
                                required
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label className='block mb-2 font-medium'>Size (m²)</label>
                            <input
                                type='number'
                                name='size'
                                value={formData.size}
                                onChange={handleChange}
                                className='w-full p-2 border rounded'
                                required
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label className='block mb-2 font-medium'>Bedrooms</label>
                            <input
                                type='number'
                                name='bedrooms'
                                value={formData.bedrooms}
                                onChange={handleChange}
                                className='w-full p-2 border rounded'
                                required
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label className='block mb-2 font-medium'>Bathrooms</label>
                            <input
                                type='number'
                                name='bathrooms'
                                value={formData.bathrooms}
                                onChange={handleChange}
                                className='w-full p-2 border rounded'
                                required
                            />
                        </div>
                    </div>
                    
                    <div className='form-group mt-6'>
                        <label className='block mb-2 font-medium'>Description</label>
                        <textarea
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            className='w-full p-2 border rounded min-h-[150px]'
                            required
                        />
                    </div>
                    
                    <div className='form-group mt-6'>
                        <label className='block mb-2 font-medium'>Images</label>
                        <input
                            type='file'
                            multiple
                            onChange={handleImageUpload}
                            className='w-full p-2 border rounded'
                            accept='image/*'
                        />
                        <div className='flex flex-wrap gap-2 mt-3'>
                            {formData.images.map((img, index) => (
                                <img key={index} src={img} alt='Preview' className='w-24 h-24 object-cover rounded' />
                            ))}
                        </div>
                    </div>
                    
                    <div className='mt-8'>
                        <button
                            type='submit'
                            disabled={loading}
                            className='bg-blue-900 text-white py-3 px-6 rounded hover:bg-blue-800 transition disabled:opacity-50'
                        >
                            {loading ? 'Creating...' : 'Create Property'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default CreateProperty;