import { usePropertyStore } from './listhouse.jsx';
import PropertyCard from './PropertyCard.jsx';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../landingPage/navbar.jsx';
import Footer from '../landingPage/footer.jsx'

function Properties() {
    const ITEMS_PER_PAGE = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const { properties, loading, error, fetchProperties } = usePropertyStore();

    const [filters, setFilters] = useState({
        province: queryParams.get('province') || '',
        type: queryParams.get('type') || '',
        minprice: queryParams.get('minprice') || '',
        maxprice: queryParams.get('maxprice') || '',
        bedrooms: queryParams.get('bedrooms') || ''
    });

    useEffect(() => {
        fetchProperties(filters);
    }, [filters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = { ...filters, [name]: value };

        // Remove empty values from query string
        const cleanedFilters = Object.fromEntries(
            Object.entries(updatedFilters).filter(([_, v]) => v)
        );
        const queryString = new URLSearchParams(cleanedFilters).toString();

        navigate(`/properties?${queryString}`);
        setFilters(updatedFilters);
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
            <div className='px-20 flex flex-col gap-10'>
                <div className="flex flex-col gap-[10px]">
                    <h1 className='font-semibold text-[24px]'>{filteredProperties.length} Properties Found</h1>
                    <div className='w-full flex gap-5 items-center'>
                        <form class="w-full flex flex-col gap-[2px]">
                            <label htmlFor="type" class="block text-sm font-medium text-gray-900 dark:text-white">Select Provinces</label>
                            <select 
                                name="province"
                                value={filters.province}
                                onChange={handleChange}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="">Select Province</option>
                                <option value="phnompenh">Phnom Penh</option>
                                <option value="siemreap">Siem Reap</option>
                                <option value="sihanouk">Sihanouk Ville</option>
                                <option value="kompot">Kompot</option>
                                <option value="kep">Kep</option>
                            </select>
                        </form>
                        <form class="w-full flex flex-col gap-[2px]">
                            <label htmlFor="type" class="block text-sm font-medium text-gray-900 dark:text-white">Property</label>
                            <select 
                                name="type"
                                value={filters.type}
                                onChange={handleChange}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="">Select Type</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="House">House</option>
                                <option value="Penthouse">Penthouse</option>
                            </select>
                        </form> 
                        <form class="w-full flex flex-col gap-[2px]">
                            <label htmlFor="type" class="block text-sm font-medium text-gray-900 dark:text-white">Minimum Price</label>
                            <input 
                                type="number" 
                                name="minprice" 
                                placeholder="Minimum Price"
                                value={filters.minprice}
                                onChange={handleChange}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        </form>
                        <form class="w-full flex flex-col gap-[2px]">
                            <label htmlFor="type" class="block text-sm font-medium text-gray-900 dark:text-white">Maximum Price</label>
                            <input 
                                type="number" 
                                name="maxprice" 
                                placeholder="Maximum Price"
                                value={filters.maxprice}
                                onChange={handleChange}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        </form>
                        <form class="w-full flex flex-col gap-[2px]">
                            <label htmlFor="type" class="block text-sm font-medium text-gray-900 dark:text-white">Maximum Price</label>
                            <input 
                                type="number" 
                                name="bedrooms" 
                                placeholder="Bedroom"
                                value={filters.maxprice}
                                onChange={handleChange}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        </form>             
                        <div className="w-full flex flex-col gap-[2px]">
                            <label htmlFor="type" class="block text-sm font-medium text-gray-900 dark:text-white">Search Properties</label>
                            <input
                                type='text'
                                placeholder='Search properties...'
                                className='w-100 px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300'
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
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
                                <PropertyCard key={property.id} property={property} className='flex flex-col gap-3' />
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
export default Properties;