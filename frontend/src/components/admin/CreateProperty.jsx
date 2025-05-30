import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';

const BASE_URL = 'http://localhost:3000';

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
    const [activeTab, setActiveTab] = useState('basic');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 10) {
            toast.error('Maximum 10 images allowed');
            return;
        }

        const imageUrls = files.map(file => ({
            url: URL.createObjectURL(file),
            file
        }));
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...imageUrls]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // In a real app, you would upload images to cloud storage first
            const response = await axios.post(`${BASE_URL}/api/admin/properties`, {
                ...formData,
                images: formData.images.map(img => img.url) // Just URLs for demo
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_ADMIN_SECRET}`
                }
            });

            if (response.data.success) {
                toast.success('Property created successfully!');
                navigate('/admin/properties/manage');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='container mx-auto px-4 py-8'>
                <div className='max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
                    <div className='p-6'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Create New Property</h1>
                        <p className='text-gray-600 mb-6'>Fill in the details to list a new property</p>

                        {/* Tab Navigation */}
                        <div className='flex border-b mb-6'>
                            <button
                                className={`py-2 px-4 font-medium ${activeTab === 'basic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('basic')}
                            >
                                Basic Info
                            </button>
                            <button
                                className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('details')}
                            >
                                Details
                            </button>
                            <button
                                className={`py-2 px-4 font-medium ${activeTab === 'media' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('media')}
                            >
                                Media
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Basic Info Tab */}
                            {activeTab === 'basic' && (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                                        <input
                                            type='text'
                                            name='title'
                                            value={formData.title}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                            required
                                            placeholder='Beautiful Luxury Villa'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Property Type</label>
                                        <select
                                            name='property_type'
                                            value={formData.property_type}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                            required
                                        >
                                            <option value=''>Select Type</option>
                                            <option value='Apartment'>Apartment</option>
                                            <option value='Villa'>Villa</option>
                                            <option value='House'>House</option>
                                            <option value='Penthouse'>Penthouse</option>
                                        </select>
                                    </div>

                                    <div className='md:col-span-2'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                                        <textarea
                                            name='description'
                                            value={formData.description}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[120px]'
                                            required
                                            placeholder='Describe the property features and amenities...'
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Details Tab */}
                            {activeTab === 'details' && (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                                        <input
                                            type='text'
                                            name='address'
                                            value={formData.address}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                            required
                                            placeholder='123 Main Street'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                                        <input
                                            type='text'
                                            name='city'
                                            value={formData.city}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                            required
                                            placeholder='Phnom Penh'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Province</label>
                                        <select
                                            name='province'
                                            value={formData.province}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
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

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Price ($)</label>
                                        <div className='relative'>
                                            <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>$</span>
                                            <input
                                                type='number'
                                                name='price'
                                                value={formData.price}
                                                onChange={handleChange}
                                                className='w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                                required
                                                placeholder='500,000'
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Size (m²)</label>
                                        <div className='relative'>
                                            <input
                                                type='number'
                                                name='size'
                                                value={formData.size}
                                                onChange={handleChange}
                                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                                required
                                                placeholder='150'
                                            />
                                            <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'>m²</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Bedrooms</label>
                                        <input
                                            type='number'
                                            name='bedrooms'
                                            value={formData.bedrooms}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                            required
                                            placeholder='3'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Bathrooms</label>
                                        <input
                                            type='number'
                                            name='bathrooms'
                                            value={formData.bathrooms}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                            required
                                            placeholder='2'
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Media Tab */}
                            {activeTab === 'media' && (
                                <div>
                                    <div className='mb-6'>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Upload Images (Max 10)</label>
                                        <div className='flex items-center justify-center w-full'>
                                            <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
                                                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                                    <svg className='w-8 h-8 mb-4 text-gray-500' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 16'>
                                                        <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'/>
                                                    </svg>
                                                    <p className='mb-2 text-sm text-gray-500'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                                                    <p className='text-xs text-gray-500'>PNG, JPG, JPEG (MAX. 10MB each)</p>
                                                </div>
                                                <input 
                                                    type='file' 
                                                    multiple 
                                                    onChange={handleImageUpload} 
                                                    className='hidden' 
                                                    accept='image/*' 
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {formData.images.length > 0 && (
                                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                                            {formData.images.map((img, index) => (
                                                <div key={index} className='relative group'>
                                                    <img 
                                                        src={img.url} 
                                                        alt={`Preview ${index}`} 
                                                        className='w-full h-32 object-cover rounded-lg'
                                                    />
                                                    <button
                                                        type='button'
                                                        onClick={() => removeImage(index)}
                                                        className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                                                    >
                                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                                                            <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className='flex justify-between mt-8'>
                                {activeTab !== 'basic' && (
                                    <button
                                        type='button'
                                        onClick={() => setActiveTab(activeTab === 'details' ? 'basic' : 'details')}
                                        className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition'
                                    >
                                        Back
                                    </button>
                                )}

                                <div className='ml-auto'>
                                    {activeTab !== 'media' ? (
                                        <button
                                            type='button'
                                            onClick={() => setActiveTab(activeTab === 'basic' ? 'details' : 'media')}
                                            className='px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition'
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type='submit'
                                            disabled={loading}
                                            className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-70 flex items-center'
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                                    </svg>
                                                    Creating...
                                                </>
                                            ) : 'Create Property'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CreateProperty;