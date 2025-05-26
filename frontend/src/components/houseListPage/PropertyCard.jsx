import { Link } from "react-router-dom";
// import pin from '/pin.png'
// import bed from '/bed.png'
// import bath from '/bath.png'
// import save from '/save.png'
// import chat from '/chat.png'

function PropertyCard({ property }) {
    const firstImage = property.property_thumbnail;

    return (
        <Link to={`/properties/${property.id}`}>
            <div className="gap-[20px]">

                <div className=''>
                    {firstImage ? (
                        <img src={firstImage} alt="property.title" className='w-full h-[300px] object-cover' />
                    ) : (
                        <div className='w-full h-48 bg-gray-200 rounded flex items-center justify-center' >
                            <span>No Image</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-between gap-[10px]">
                    <h2 className=" text-[20px] font-semibold">
                        {property.title}
                    </h2>
                    <p className='text-[14px] flex items-center gap-[5px] text-gray-500'>
                        <img className='w-[20px] h-[20px]' src="/pin.png" alt="" />
                        <span>{property.address}, {property.city}</span>
                    </p>
                    <p className='text-[20px] font-semibold p-[5px] mx-w'>$ {property.price}</p>
                    <div className='flex justify-between gap[10px]'>
                        <div className="flex gap-[20px] text-[14px]">
                            <div className="flex items-center gap-[5px] bg-white p-2 rounded-[5px]">
                                <img src="/bed.png" alt="" className='w-[20px] h-[20px]'/>
                                <span>{property.bedrooms} bedroom</span>
                            </div>
                            <div className="flex items-center gap-[5px] bg-white p-2 rounded-[5px]">
                                <img src="/bath.png" alt="" className='w-[20px] h-[20px]'/>
                                <span>{property.bathrooms} bathroom</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PropertyCard;