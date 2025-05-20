import { usePropertyStore } from './listhouse.jsx';
import PropertyCard from './PropertyCard.jsx';
import { useState } from 'react';

function properties() {
    const { properties, loading, error, fetchProperties } = usePropertyStore();
    const [selectedProvince, setSelectedProvince] = useState("");

    const handleChange = (e) => {
        const province = e.target.value;
        console.log(province);
        setSelectedProvince(province);
        fetchProperties(province);
    }

    return (
        <div>
            <select
                    value={selectedProvince}
                    onChange={handleChange}
                    className="mb-4 p-2 border rounded">
                    <option value="">Select Province</option>
                    <option value="phnompenh">Phnom Penh</option>
                    <option value="siemreap">Siem Reap</option>
                    <option value="battambang">Battambang</option>
            </select>
    
            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <div className='loading loading-spinner loading-lg' />
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap 6'>
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    )
}
export default properties;