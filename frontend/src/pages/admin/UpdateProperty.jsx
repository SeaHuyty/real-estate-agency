import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../../components/admin/adminSidebar';
import 'react-toastify/dist/ReactToastify.css'; 

const BASE_URL = 'http://localhost:3000';

const UpdateProperty = () => {
    const { id } = useParams();
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
        swimming_pool: false,
        gym: false,
        parking_lot: false,
        garden: false,
        balcony: false,
        security: false,
        fire_security: false,
        elevator: false,
        commercial_area: false,
        non_flooding: false,
        playground: false,
        common_area: false
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

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/properties/${id}`);
                const property = res.data.data;
                setFormData({
                    title: property.title || '',
                    description: property.description || '',
                    property_type: property.property_type || '',
                    address: property.address || '',
                    city: property.city || '',
                    province: property.province || '',
                    price: property.price || '',
                    size: property.size || '',
                    bedrooms: property.bedrooms || '',
                    bathrooms: property.bathrooms || '',
                    location_url: property.location_url || '',
                    swimming_pool: property.swimming_pool || false,
                    gym: property.gym || false,
                    parking_lot: property.parking_lot || false,
                    garden: property.garden || false,
                    balcony: property.balcony || false,
                    security: property.security || false,
                    fire_security: property.fire_security || false,
                    elevator: property.elevator || false,
                    commercial_area: property.commercial_area || false,
                    non_flooding: property.non_flooding || false,
                    playground: property.playground || false,
                    common_area: property.common_area || false,
                });

                if (property.property_thumbnail) {
                    setThumbnailPreview(property.property_thumbnail);
                }
                
                if (property.images && Array.isArray(property.images)) {
                    setImagePreviews(property.images.map(url => ({ preview: url, isExisting: true })));
                }

            } catch (err) {
                console.error("Failed to fetch property", err);
                toast.error("Failed to load property data.");
            }
        };
        fetchProperty();
    }, [id]);

    // Clean up object URLs
    useEffect(() => {
        return () => {
            if (thumbnailPreview && !thumbnailPreview.startsWith('http')) URL.revokeObjectURL(thumbnailPreview);
            imagePreviews.forEach(p => {
                if (p.preview && !p.isExisting) URL.revokeObjectURL(p.preview)
            });
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
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        maxFiles: 1
    });

    // Images dropzone
    const onImagesDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.filter(file => !imageFiles.some(f => f.name === file.name));
        
        if (newFiles.length + imagePreviews.length > 30) {
            toast.error('Maximum 30 images allowed');
            return;
        }

        setImageFiles(prev => [...prev, ...newFiles]);
        setImagePreviews(prev => [
            ...prev, 
            ...newFiles.map(file => ({ file, preview: URL.createObjectURL(file), isExisting: false }))
        ]);
    }, [imageFiles, imagePreviews]);

    const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps } = useDropzone({
        onDrop: onImagesDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        maxFiles: 30
    });

    const removeImage = (index) => {
        const imageToRemove = imagePreviews[index];
        if (!imageToRemove.isExisting) {
            const newImageFiles = imageFiles.filter(f => f.name !== imageToRemove.file.name);
            setImageFiles(newImageFiles);
        }
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(newPreviews);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('thumbnail', file); // API reuses this endpoint
        const response = await axios.post(`${BASE_URL}/api/admins/upload/thumbnail`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
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
            // 1. Upload new thumbnail if a new file is staged
            let thumbnailUrl = thumbnailPreview;
            if (thumbnailFile) {
                thumbnailUrl = await uploadFile(thumbnailFile);
            }

            // 2. Upload only new images
            const newImageUrls = [];
            const newFilesToUpload = imagePreviews.filter(p => !p.isExisting).map(p => p.file);
            for (const file of newFilesToUpload) {
                const url = await uploadFile(file);
                newImageUrls.push(url);
            }
            
            // 3. Combine existing images with newly uploaded ones
            const existingImageUrls = imagePreviews.filter(p => p.isExisting).map(p => p.preview);
            const finalImageUrls = [...existingImageUrls, ...newImageUrls];

            // 4. Submit all data
            const propertyData = {
                ...formData,
                thumbnail: thumbnailUrl,
                images: finalImageUrls,
            };

            const res = await axios.put(`${BASE_URL}/api/admins/${id}`, propertyData, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });

            if (!res.data.success) {
                throw new Error(res.data.message || 'Update Failed');
            } 
            toast.success('Property updated successfully');
            navigate('/admin/properties/manage');

        } catch (err) {
            console.error('Error:', err);
            toast.error(err.response?.data?.message || 'Failed to update property');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className='flex h-screen'>
            <Sidebar />
                <div className='w-full overflow-hidden px-5'>
                    <div className='p-6'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Update Property</h1>
                        <p className='text-gray-600 mb-6'>Edit the details of the property</p>

                        {/* Tab Navigation */}
                        <div className='flex border-b mb-6'>
                            <button className={`py-2 px-4 font-medium ${activeTab === 'basic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('basic')}>Basic Info</button>
                            <button className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('details')}>Details</button>
                            <button className={`py-2 px-4 font-medium ${activeTab === 'location' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('location')}>Location</button>
                            <button className={`py-2 px-4 font-medium ${activeTab === 'amenities' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('amenities')}>Amenities</button>
                            <button className={`py-2 px-4 font-medium ${activeTab === 'media' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('media')}>Media</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Basic Info Tab */}
                            {activeTab === 'basic' && (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                                        <input type='text' name='title' value={formData.title} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded-lg' required />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Property Type</label>
                                        <select name='property_type' value={formData.property_type} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded-lg' required>
                                            <option value=''>Select Type</option>
                                            <option value='Apartment'>Apartment</option>
                                            <option value='Villa'>Villa</option>
                                            <option value='House'>House</option>
                                            <option value='Penthouse'>Penthouse</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                                        <textarea name='description' value={formData.description} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[300px]' required />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Thumbnail</label>
                                        <div {...getThumbnailRootProps()} className='border-2 border-dashed rounded-lg p-4 text-center cursor-pointer'>
                                            <input {...getThumbnailInputProps()} />
                                            {thumbnailPreview ? (
                                                <img src={thumbnailPreview} alt="Thumbnail" className='h-48 w-full object-contain mx-auto'/>
                                            ) : <p>Drag & drop or click to select a thumbnail</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Details, Location, Amenities Tabs... (same as your CreateProperty component) */}
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

                            {activeTab === 'amenities' && (
                                <div className='mb-6'>
                                    <h1 className='font-semibold mb-2'>Amenities</h1>
                                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {Object.keys(formData).filter(key => typeof formData[key] === 'boolean').map((amenity) => (
                                            <li key={amenity} className="w-full flex items-center ps-3">
                                                <input id={`${amenity}-checkbox`} type="checkbox" name={amenity} checked={formData[amenity]} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"/>
                                                <label htmlFor={`${amenity}-checkbox`} className="w-full py-3 ms-2 text-sm font-medium capitalize">{amenity.replace(/_/g, ' ')}</label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Media Tab */}
                            {activeTab === 'media' && (
                                <div className='mb-6'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Property Images (Max 30)</label>
                                    <div {...getImagesRootProps()} className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 cursor-pointer'>
                                        <input {...getImagesInputProps()} />
                                        <p>Drag & drop images here, or click to select</p>
                                    </div>
                                    {uploadProgress > 0 && <p>Uploading: {uploadProgress}%</p>}
                                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                                        {imagePreviews.map((img, index) => (
                                            <div key={index} className='relative group'>
                                                <img src={img.preview} alt={`preview ${index}`} className='w-full h-32 object-cover rounded'/>
                                                <button type='button' onClick={() => removeImage(index)} className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100'>×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation and Submit Buttons */}
                            <div className='flex justify-end mt-8'>
                                <button type='submit' disabled={loading} className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70'>
                                    {loading ? 'Updating...' : 'Update Property'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* <Footer /> */}
            </div>
    );
};

export default UpdateProperty;