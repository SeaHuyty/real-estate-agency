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
        <div className='w-full overflow-hidden'>
            <Navbar />
            <div className='px-20 flex flex-col gap-10'>
                <div className="flex flex-col gap-[10px]">
                    <h1 className='font-semibold text-[24px]'>Search results for<b> Phnom Penh</b></h1>
                    <div className='flex gap-5 items-center'>
                        <div className="flex flex-col gap-[2px]">
                            <label htmlFor="type" className='text-[10px]'>Phnom Penh</label>
                            <select
                                name="province"
                                value={filters.province}
                                onChange={handleChange}
                                className='w-[128px] border rounded-[5px] text-[14px]'
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
                            <label htmlFor="property" className='text-[10px]'>Property</label>
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleChange}
                                className=" border rounded"
                                >
                                <option value="">Select Type</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="House">House</option>
                                <option value="Penthouse">Penthouse</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-[2px]">
                            <label htmlFor="minPrice" className='text-[10px]'>Min Price</label>
                            <input
                                type="number"
                                name="minprice"
                                placeholder="Min Price"
                                value={filters.minprice}
                                onChange={handleChange}
                                className=" border rounded"
                                />
                        </div>
                        <div className="flex flex-col gap-[2px]">
                            <label htmlFor="maxPrice" className='text-[10px]'>Max Price</label>
                            <input
                                type="number"
                                name="maxprice"
                                placeholder="Max Price"
                                value={filters.maxprice}
                                onChange={handleChange}
                                className=" border rounded"
                            />
                        </div>
                        <div className="flex flex-col gap-[2px]">
                            <label htmlFor="bedroom" className='text-[10px]'>Bedroom</label>
                            <input
                                type="number"
                                name="bedrooms"
                                placeholder="Bedroom"
                                value={filters.bedrooms}
                                onChange={handleChange}
                                className=" border rounded"
                                />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-10">
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