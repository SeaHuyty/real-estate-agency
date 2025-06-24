import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';
import { useParams } from 'react-router-dom';
import Map from '../houseListPage/map.jsx';

const BASE_URL = 'http://localhost:3000';

const UpdateProperty = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        property_type: '',
        thumbnail: '',
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckBoxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const [imageUrls, setImageUrls] = useState(['']);

    const handleImageUrlChange = (value, index) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const handleAddImageInput = () => {
        if (imageUrls.length < 30) {
            setImageUrls([...imageUrls, '']);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Extract src from iframe if needed
            let locationInput = formData.location_url.trim();
            const match = locationInput.match(/src=["']([^"']+)["']/);
            const locationSrc = match ? match[1] : locationInput;

            const updatedFormData = {
                ...formData,
                location_url: locationSrc
            };
            // In a real app, you would upload images to cloud storage first
            const response = await axios.put(`${BASE_URL}/api/admins/${id}`, updatedFormData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Property updated:', response.data);
            toast.success('Property updated successfully');
            navigate('/admin');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update property');
        } finally {
            setLoading(false);
        }
    };

    useState(() => {
        const fetchPropertyData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/properties/${id}`);
                setFormData({
                    title: response.data.data.title,
                    description: response.data.data.description,
                    property_type: response.data.data.property_type,
                    thumbnail: response.data.data.property_thumbnail,
                    address: response.data.data.address,
                    city: response.data.data.city,
                    province: response.data.data.province,
                    price: response.data.data.price,
                    size: response.data.data.size,
                    bedrooms: response.data.data.bedrooms,
                    bathrooms: response.data.data.bathrooms,
                    location_url: response.data.data.location_url,
                    swimming_pool: response.data.data.swimming_pool,
                    gym: response.data.data.gym,
                    parking_lot: response.data.data.parking_lot,
                    garden: response.data.data.garden,
                    balcony: response.data.data.balcony,
                    security: response.data.data.security,
                    fire_security: response.data.data.fire_security,
                    elevator: response.data.data.elevator,
                    commercial_area: response.data.data.commercial_area,
                    non_flooding: response.data.data.non_flooding,
                    playground: response.data.data.playground,
                    common_area: response.data.data.common_area
                });

            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        };
        fetchPropertyData();
    }, [id]);

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='container mx-auto px-4 py-8'>
                <div className='max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
                    <div className='p-6'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Update Property</h1>
                        <p className='text-gray-600 mb-6'>Fill in the details to update property</p>

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
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>Thumbnail</label>
                                            <input
                                                name='thumbnail'
                                                value={formData.thumbnail}
                                                onChange={handleChange}
                                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                                required
                                                placeholder='Property Thumbnail URL'
                                            />
                                        </div>
                                        {formData.thumbnail && (
                                            <div className='mt-2 h-62 w-full justify-center flex items-center'>
                                                <img src={formData.thumbnail} alt="Property Thumbnail" className='h-full object-cover' />
                                            </div>
                                        )}
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
                                    <div className='px-10 mt-5'>
                                        <Map key={formData.location_url} src={formData.location_url}/>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'amenities' && (
                                <div className='mb-6'>
                                    <div className='amenities'>
                                        <h1 className='font-semibold'>Amenities</h1>
                                        <ul class="grid grid-cols-4 font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                                            <li class="w-full flex ps-3 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex justify-center items-center">
                                                    <input id="vue-checkbox-list" type="checkbox" checked={formData.swimming_pool} name='swimming_pool' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="vue-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Swimming Pool</h1>
                                                        <img className='w-[30px] h-[30px]' src="/swimming.png" alt="" />
                                                    </label>
                                                </div>
                                            </li>
                                            <li class="w-full flex ps-3 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex items-center justify-center">
                                                    <input id="react-checkbox-list" type="checkbox" checked={formData.parking_lot} name='parking_lot' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="react-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Parking lot</h1>
                                                        <img className='w-[30px] h-[30px]' src="/garage.png" alt="" />
                                                    </label>
                                                </div>
                                            </li>
                                            <li class="w-full flex ps-3 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex items-center">
                                                    <input id="angular-checkbox-list" type="checkbox" checked={formData.garden} name='garden' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="angular-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Garden</h1>
                                                        <img className='w-[30px] h-[30px]' src="/garden.png" alt="" />
                                                    </label>
                                                </div>
                                            </li>
                                            <li class="w-full flex ps-3  border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex items-center">
                                                    <input id="gym-checkbox-list" type="checkbox" checked={formData.gym} name='gym' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="gym-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Gym</h1>
                                                        <img className='w-[30px] h-[30px]' src="/gym.png" alt="" />
                                                    </label>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='Security mt-6'>
                                        <h1 className='font-semibold'>Security</h1>
                                        <ul class="grid grid-cols-4 font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                                            <li class="w-full flex ps-3  border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex items-center">
                                                    <input id="balcony-checkbox-list" type="checkbox" checked={formData.balcony} name='balcony' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="balcony-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Balcony</h1>
                                                        <img className='w-[30px] h-[30px]' src="/balcony.png" alt="" />
                                                    </label>
                                                </div>
                                            </li>
                                            <li class="w-full flex ps-3  border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex items-center">
                                                    <input id="elevator-checkbox-list" type="checkbox" checked={formData.elevator} name='elevator' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="elevator-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Elevator</h1>
                                                        <img className='w-[30px] h-[30px]' src="/elevator.png" alt="" />
                                                    </label>
                                                </div>
                                            </li>
                                            <li class="w-full flex ps-3  border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex items-center">
                                                    <input id="gym-checkbox-list" type="checkbox" checked={formData.security} name='security' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="gym-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Security</h1>
                                                        <img className='w-[30px] h-[30px]' src="/security.png" alt="" />
                                                    </label>
                                                </div>
                                            </li>
                                            <li class="w-full flex ps-3  border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex items-center">
                                                    <input id="gym-checkbox-list" type="checkbox" checked={formData.fire_security} name='fire_security' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="gym-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Fire Security</h1>
                                                        <img className='w-[30px] h-[30px]' src="/fire.png" alt="" />
                                                    </label>
                                                </div>
                                            </li>
                                            <li class="w-full flex ps-3  border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex items-center">
                                                    <input id="gym-checkbox-list" type="checkbox" checked={formData.non_flooding} name='non_flooding' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="gym-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Non-Flooding</h1>
                                                        <img className='w-[30px] h-[30px]' src="/nonflooding.png" alt="" /> 
                                                    </label>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='Security mt-6'>
                                        <h1 className='font-semibold'>Common Area</h1>
                                        <ul class="grid grid-cols-4 font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                                            <li class="w-full flex ps-3 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex items-center">
                                                    <input id="balcony-checkbox-list" type="checkbox" checked={formData.commercial_area} name='commercial_area' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="balcony-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Commercial Area</h1>
                                                        <img className='w-[30px] h-[30px]' src="/commercial.png" alt="" />
                                                    </label>
                                                </div>
                                            </li>
                                            <li class="w-full flex ps-3 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex items-center">
                                                    <input id="elevator-checkbox-list" type="checkbox" checked={formData.playground} name='playground' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="elevator-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Playground</h1>
                                                        <img className='w-[30px] h-[30px]' src="/playground.png" alt="" />
                                                    </label>
                                                </div>
                                            </li>
                                            <li class="w-full flex ps-3 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                <div class="flex items-center">
                                                    <input id="gym-checkbox-list" type="checkbox" checked={formData.common_area} name='common_area' class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm" onChange={handleCheckBoxChange} />
                                                    <label for="gym-checkbox-list" class="w-full flex gap-2 items-center py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        <h1>Common Area</h1>
                                                        <img className='w-[30px] h-[30px]' src="/common.png" alt="" />
                                                    </label>
                                                </div>
                                            </li>
                                            
                                        </ul>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'media' && (
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Image URLs (Max 30)
                                </label>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                                    {imageUrls.map((url, index) => (
                                    <div key={index}>
                                        <input
                                        type='text'
                                        value={url}
                                        onChange={(e) => handleImageUrlChange(e.target.value, index)}
                                        placeholder={`Image URL ${index + 1}`}
                                        className='w-full p-2 border rounded-md text-sm'
                                        />
                                        {url && (
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className='mt-2 w-full h-32 object-cover'
                                        />
                                        )}
                                    </div>
                                    ))}
                                </div>
                                {imageUrls.length < 30 && (
                                    <button
                                    type='button'
                                    onClick={handleAddImageInput}
                                    className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700'
                                    >
                                    Add Image URL
                                    </button>
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
                                                    Updating...
                                                </>
                                            ) : 'Update Property'}
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

export default UpdateProperty;