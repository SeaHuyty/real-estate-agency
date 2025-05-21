import { usePropertyStore } from './listhouse.jsx';
import PropertyCard from './PropertyCard.jsx';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Properties() {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);

    const { properties, loading, error, fetchProperties } = usePropertyStore();

    const [filters, setFilters] = useState({
        province: queryParams.get('province') || '',
        type: queryParams.get('type') || '',
        minprice: queryParams.get('minprice') || '',
        maxprice: queryParams.get('maxprice') || ''
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
        <div>
            <div className="flex gap-4 mb-4">
                <select
                    name="province"
                    value={filters.province}
                    onChange={handleChange}
                    className="p-2 border rounded"
                >
                    <option value="">Select Province</option>
                    <option value="phnompenh">Phnom Penh</option>
                    <option value="siemreap">Siem Reap</option>
                    <option value="battambang">Battambang</option>
                </select>

                <select
                    name="type"
                    value={filters.type}
                    onChange={handleChange}
                    className="p-2 border rounded"
                >
                    <option value="">Select Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                </select>

                <input
                    type="number"
                    name="minprice"
                    placeholder="Min Price"
                    value={filters.minprice}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="maxprice"
                    placeholder="Max Price"
                    value={filters.maxprice}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loading loading-spinner loading-lg" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    );
}

export default Properties;