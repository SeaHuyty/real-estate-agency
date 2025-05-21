import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/properties/${id}`);
                setProperty(res.data.data);
            } catch (error) {
                console.error('Failed to fetch property', error);
            }
        };

        fetchProperty();
    }, [id]);

    if (!property) return <p>Property not found</p>

    return (
        <div>
            <h2>{property.title}</h2>
            <p>Province: {property.province}</p>
            <p>Price: ${property.price}</p>
            <img src={property.images?.[0]} alt="" />
        </div>
    )
};

export default PropertyDetails;