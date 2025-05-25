import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SinglePage from '../singlePage/singlePage';
const BASE_URL = 'http://localhost:3000';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [imageIndex, setImageIndex] = useState(null);

    // Lock scroll when popup is active
    useEffect(() => {
        if (imageIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Clean up on unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [imageIndex]);
// Fetch property details
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
            
            {/* single Page style */}
            <SinglePage />
        </div>
    )
};

export default PropertyDetails;