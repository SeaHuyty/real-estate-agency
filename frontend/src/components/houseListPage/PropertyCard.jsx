import { Link } from "react-router-dom";

function PropertyCard({ property }) {
    const firstImage = property.property_thumbnail;

    return (
        <Link to={`/properties/${property.id}`}>
            <div className='rounded shadow-md p-4'>
                {firstImage ? (
                    <img src={firstImage} alt="{property.title" className='w-full h-48 object-cover rounded' />
                ) : (
                    <div className='w-full h-48 bg-gray-200 rounded flex items-center justify-center' >
                        <span>No Image</span>
                    </div>
                )}

                <h2 className='text-xl font-semibold mt-2'>{property.title}</h2>
                <p>{property.description}</p>
            </div>
        </Link>
    )
}

export default PropertyCard;