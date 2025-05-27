import { Link } from "react-router-dom";

function PropertyCard({ property }) {
    const firstImage = property.property_thumbnail;

    return (
        <Link to={`/properties/${property.id}`}>
            <div className='flex flex-col gap-3'>
                <div>
                    {firstImage ? (
                        <img src={firstImage} alt="property.title" className='w-full h-[300px] object-cover' />
                    ) : (
                        <div className='w-full h-48 bg-gray-200 rounded flex items-center justify-center' >
                            <span>No Image</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-between gap-[10px]">
                    <div className="flex justify-between">
                        <h2 className="text-[20px] font-semibold">{property.title}</h2>
                        <p className='text-[20px] font-semibold text-green-600'>$ {Number(property.price).toLocaleString()}</p>
                    </div>
                    <p className='text-[14px] flex items-center gap-[10px] text-gray-500'>
                        <img className='w-[20px] h-[20px]' src="/pin.png" alt="" />
                        <span>{property.address}, {property.city}</span>
                    </p>
                    <div className="flex gap-[20px] text-[14px]">
                        <div className="flex items-center gap-[5px] bg-white">
                            <img src="/bed.png" alt="" className='w-[20px] h-[20px]'/>
                            <span>{property.bedrooms} bedroom</span>
                        </div>
                        <div className="flex items-center gap-[5px] bg-white">
                            <img src="/bath.png" alt="" className='w-[20px] h-[20px]'/>
                            <span>{property.bathrooms} bathroom</span>
                        </div>
                        <div className="flex items-center gap-[5px] bg-white">
                            <img src="/size.png" alt="" className='w-[20px] h-[20px]'/>
                            <span>{property.size} m²</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PropertyCard;