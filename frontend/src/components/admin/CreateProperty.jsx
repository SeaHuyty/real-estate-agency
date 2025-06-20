import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';

const BASE_URL = 'http://localhost:3000';

const CreateProperty = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
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
        location_url: '',
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [uploadProgress, setUploadProgress] = useState(0);

    // Thumbnail state
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');

    // Images state
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Clean up object URLs
    useEffect(() => {
        return () => {
            if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview.preview));
        };
    }, [thumbnailPreview, imagePreviews]);

    // Thumbnail dropzone
    const onThumbnailDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    }, []);

    const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
        onDrop: onThumbnailDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 1
    });

    // Images dropzone
    const onImagesDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.filter(file => 
            file.type.startsWith('image/') && 
            !imageFiles.some(existingFile => existingFile.name === file.name)
        );
        
        if (newFiles.length + imageFiles.length > 30) {
            toast.error('Maximum 30 images allowed');
            return;
        }

        setImageFiles(prev => [...prev, ...newFiles]);
        setImagePreviews(prev => [
            ...prev, 
            ...newFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }))
        ]);
    }, [imageFiles]);

    const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps } = useDropzone({
        onDrop: onImagesDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 30
    });

    const removeImage = (index) => {
        const newFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('thumbnail', file);

        const response = await axios.post(`${BASE_URL}/api/admins/upload/thumbnail`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(progress);
            }
        });

        return response.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Extract src from iframe if needed
            let rawIframe = formData.location_url;
            let srcMatch = rawIframe.match(/src="([^"]+)"/);
            let locationSrc = srcMatch ? srcMatch[1] : '';
            
            // Upload thumbnail
            let thumbnailUrl = '';
            if (thumbnailFile) {
                thumbnailUrl = await uploadFile(thumbnailFile);
            }

            // Upload other images
            const imageUrls = [];
            for (const file of imageFiles) {
                const url = await uploadFile(file);
                imageUrls.push(url);
            }

            // Submit property data with image URLs
            const propertyData = {
                ...formData,
                location_url: locationSrc,
                thumbnail: thumbnailUrl,
                images: imageUrls
            };

            const res = await axios.post(`${BASE_URL}/api/admins`, propertyData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = res.data;
            if (!data.success) {
                throw new Error(data.message || 'Created Failed');
            } 
            toast.success('Property created successfully');
            navigate('/admin/properties/manage');
        } catch (err) {
            console.error('Error:', err);
            toast.error(err.response?.data?.message || 'Failed to create property');
        } finally {
            setLoading(false);
            setUploadProgress(0);
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
                                className={`py-2 px-4 font-medium ${activeTab === 'location' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('location')}
                            >
                                Location
                            </button>
                            <button
                                className={`py-2 px-4 font-medium ${activeTab === 'amenities' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('amenities')}
                            >
                                Amenities
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

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                                        <textarea
                                            name='description'
                                            value={formData.description}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[300px]'
                                            required
                                            placeholder='Describe the property features and amenities...'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Thumbnail</label>
                                        <div 
                                            {...getThumbnailRootProps()} 
                                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer 
                                                ${thumbnailFile ? 'border-green-500' : 'border-gray-300'}`}
                                        >
                                            <input {...getThumbnailInputProps()} type='file' name='thumbnail' />
                                            {thumbnailPreview ? (
                                                <div className='mt-2'>
                                                    <img 
                                                        src={thumbnailPreview} 
                                                        alt="Thumbnail preview" 
                                                        className='h-48 w-full object-contain mx-auto'
                                                    />
                                                    <p className='text-sm text-gray-500 mt-2'>Click to change or drag a new image</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className='text-gray-500'>Drag & drop a thumbnail image here, or click to select</p>
                                                    <p className='text-xs text-gray-400 mt-1'>Recommended size: 800x600px</p>
                                                </div>
                                            )}
                                        </div>
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

                            {activeTab === 'location' && (
                                <div className='mb-6'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Location URL</label>
                                    <input
                                        type='text'
                                        name='location_url'
                                        value={formData.location_url}
                                        onChange={handleChange}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                        required
                                        placeholder='<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16004.860910661548!2d104.92720480000001!3d11.509877949999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109512f138297f1%3A0x34ef8a478031b776!2sISPP%20-%20International%20School%20of%20Phnom%20Penh!5e1!3m2!1sen!2skh!4v1748704813210!5m2!1sen!2skh" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
                                    />
                                </div>
                            )}

                            {activeTab === 'media' && (
                                <div className='mb-6'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Property Images (Max 30)
                                    </label>
                                    <div 
                                        {...getImagesRootProps()} 
                                        className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 cursor-pointer'
                                    >
                                        <input {...getImagesInputProps()} />
                                        <p className='text-gray-500'>Drag & drop images here, or click to select</p>
                                        <p className='text-xs text-gray-400 mt-1'>You can upload up to 30 images</p>
                                    </div>

                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <div className='mb-4'>
                                            <div className='w-full bg-gray-200 rounded-full h-2.5'>
                                                <div 
                                                    className='bg-blue-600 h-2.5 rounded-full' 
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                            <p className='text-sm text-gray-600 mt-1'>Uploading: {uploadProgress}%</p>
                                        </div>
                                    )}

                                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className='relative group'>
                                                <img
                                                    src={preview.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className='w-full h-32 object-cover rounded'
                                                />
                                                <button
                                                    type='button'
                                                    onClick={() => removeImage(index)}
                                                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition'
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
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