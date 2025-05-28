import { usePropertyStore } from './listhouse.jsx';
import PropertyCard from './PropertyCard.jsx';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../landingPage/navbar.jsx';
import Footer from '../landingPage/footer.jsx'

function Properties() {
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

    return (
        <div className='w-full'>
            <Navbar />
            <div className='px-20 flex flex-col gap-10'>
                <div className="flex flex-col gap-[10px]">
                    <h1 className='font-semibold text-[24px]'>Search results for<b> {properties[0]?.city}</b></h1>
                    <div className='flex gap-5 items-center'>
                        <div className="flex flex-col gap-[2px]">
                            <label htmlFor="type" className='text-[15px]'>Select Provinces</label>
                            <select
                                name="province"
                                value={filters.province}
                                onChange={handleChange}
                                class=" w-full p-2.5 bg-gray-50 border border-gray-500 text-gray-900 text-sm"
                                >
                                <option value="">Select Province</option>
                                <option value="phnompenh">Phnom Penh</option>
                                <option value="siemreap">Siem Reap</option>
                                <option value="sihanouk">Sihanouk Ville</option>
                                <option value="kompot">Kompot</option>
                                <option value="kep">Kep</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-[2px]">
                            <label htmlFor="property" className='text-[15px]'>Property</label>
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleChange}
                                class="bg-gray-50 border border-gray-500 text-gray-900 text-sm w-full p-2.5"
                                >
                                <option value="">Select Type</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="House">House</option>
                                <option value="Penthouse">Penthouse</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-[2px]">
                            <label htmlFor="minPrice" className='text-[15px]'>Min Price</label>
                            <input
                                type="number"
                                name="minprice"
                                placeholder="Min Price"
                                value={filters.minprice}
                                onChange={handleChange}
                                class="bg-gray-50 border border-gray-500 text-gray-900 text-sm w-full p-2.5"
                                />
                        </div>
                        <div className="flex flex-col gap-[2px]">
                            <label htmlFor="maxPrice" className='text-[15px]'>Max Price</label>
                            <input
                                type="number"
                                name="maxprice"
                                placeholder="Max Price"
                                value={filters.maxprice}
                                onChange={handleChange}
                                class="bg-gray-50 border border-gray-500 text-gray-900 text-sm w-full p-2.5"
                            />
                        </div>
                        <div className="flex flex-col gap-[2px]">
                            <label htmlFor="bedroom" className='text-[15px]'>Bedroom</label>
                            <input
                                type="number"
                                name="bedrooms"
                                placeholder="Bedroom"
                                value={filters.bedrooms}
                                onChange={handleChange}
                                class="bg-gray-50 border border-gray-500 text-gray-900 text-sm w-full p-2.5"
                                />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-13">
                        {Array.isArray(properties) ? (
                            properties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                )}

            </div>
            <Footer />
        </div>
    );
}

export default Properties;