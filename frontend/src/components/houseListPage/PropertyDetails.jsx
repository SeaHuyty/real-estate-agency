import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = 'http://localhost:3000';
import React from 'react';
import Slider from './slider'
import Map from './map'
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';
import PropertyCard from './PropertyCard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [imageIndex, setImageIndex] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [showVisitForm, setShowVisitForm] = useState(false);
    const [visitDate, setVisitDate] = useState('');
    const [visitNotes, setVisitNotes] = useState('');
    const navigate = useNavigate();

    // const handleRequestVisit = async (e) => {
    //     e.preventDefault();
    //     const token = localStorage.getItem('accessToken');
    //     if (!token) {
    //         toast.error("Please login to request a visit.");
    //         return;
    //     }
    //     // This is a placeholder for the actual user ID.
    //     // In a real application, you would get this from the logged-in user's context or token.
    //     const userId = 1;

    //     try {
    //         await axios.post(`${BASE_URL}/api/requests`, 
    //             { userId, propertyId: id, preferredDate: visitDate, notes: visitNotes },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );
    //         toast.success("Visit request submitted successfully!");
    //         setShowVisitForm(false);
    //     } catch (error) {
    //         toast.error("Failed to submit visit request.");
    //     }
    // };

    const handleVisitRequest = () => {
        const token = localStorage.getItem('userToken');

        if (token) {
            navigate(`/properties/${id}/request-visit`);
        } else {
            toast.error('Please login to request a visit.');
            navigate('/signup');
        }
    };

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

    useEffect(() => {
        const fetchSimilarProperties = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/properties/similar/${id}`);
                const filteredProperties = res.data.data.sort(() => 0.5 - Math.random()).slice(0, 2);
                setSimilarProperties(filteredProperties);
            } catch (error) {
                console.error('Failed to fetch similar properties', error);
            }
        };

        fetchSimilarProperties();
    }, [id]);

    if (!property) return <p>Property not found</p>

    return (
        <div className='w-full'>
            <Navbar />  
            <div className='px-20 w-full h-full flex gap-5'>
                <div className='flex-3'>
                    <div className='flex flex-col gap-5'>
                        <Slider
                            thumbnail={property.property_thumbnail}
                            images={property.images} 
                            imageIndex={imageIndex} 
                            setImageIndex={setImageIndex} />
                        <div className='info'>
                            <div className='flex justify-between gap-5'>
                                <div className='flex flex-col gap-3 w-full'>
                                    <h1 className='font-semibold text-[27px]'>{property.title}</h1>
                                    <div className='flex gap-2 items-center text-[14px] text-gray-500'>
                                        <img className='w-[20px] h-[20px]' src="/pin.png" alt="" />
                                        <span>{property.address}, {property.city}</span>
                                    </div>
                                    <div className='w-max rounded-[5px] font-semibold text-[20px] text-green-600'>$ {Number(property.price).toLocaleString()}</div>
                                </div>
                                <button
                                    onClick={handleVisitRequest}
                                    className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition h-fit"
                                >
                                    Request Visit
                                </button>
                            </div>
                            {/* {showVisitForm && (
                                <form onSubmit={handleRequestVisit} className="mt-4 p-4 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Request a Visit</h3>
                                    <div className="mb-2">
                                        <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700">Preferred Date</label>
                                        <input type="date" id="visitDate" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="visitNotes" className="block text-sm font-medium text-gray-700">Notes</label>
                                        <textarea id="visitNotes" value={visitNotes} onChange={(e) => setVisitNotes(e.target.value)} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                                    </div>
                                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Submit Request</button>
                                    <button type="button" onClick={() => setShowVisitForm(false)} className="ml-2 text-gray-600">Cancel</button>
                                </form>
                            )} */}
                            <div className='mt-[15px] text-[14px] text-gray-500 leading-[20px]'>
                                {property.description}
                            </div>

                            <div className='details mt-3 flex flex-col gap-7 mt-10'>
                                <div className='Details '>
                                    <h1 className='font-semibold'>Details</h1>
                                    <div className='grid grid-cols-3 gap-7 mt-5'>
                                        <div className='utility flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/size.png" alt="" />
                                            <div>
                                                <h1>{property.size} m²</h1>
                                            </div>
                                        </div>
                                        <div className='pet flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/bed.png" alt="" />
                                            <div>
                                                <h1>{property.bedrooms} Beds</h1>
                                            </div>
                                        </div>
                                        <div className='property fee flex gap-3 items-center'>
                                            <img className='w-[30px] h-[30px]' src="/bath.png" alt="" />
                                            <div>
                                                <h1>{property.bathrooms} Bathrooms</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {(property.swimming_pool || property.gym || property.parking_lot || property.garden || property.balcony || property.elevator) && (
                                    <div className='General'>
                                        <h1 className='font-semibold'>Amenities</h1>
                                        <div className='grid grid-cols-3 gap-7 mt-5'>
                                            {property.swimming_pool && (
                                                <div className='w-full flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/swimming.png" alt="" />
                                                    <div>
                                                        <h1 className='w-[50px]'>Swimming Pool</h1>
                                                    </div>
                                                </div>
                                            )}
                                            {property.parking_lot && (
                                                <div className='flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/garage.png" alt="" />
                                                    <div>
                                                        <h1>Parking lot</h1>
                                                    </div>
                                                </div>
                                            )}
                                            {property.garden && (
                                                <div className='property fee flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/garden.png" alt="" />
                                                    <div>
                                                        <h1>Garden</h1>
                                                    </div>
                                                </div>
                                            )}
                                            {property.gym && (
                                                <div className='property fee flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/gym.png" alt="" />
                                                    <div>
                                                        <h1>Gym</h1>
                                                    </div>
                                                </div>
                                            )}
                                            {property.balcony && (
                                                <div className='property fee flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/balcony.png" alt="" />
                                                    <div>
                                                        <h1>Balcony</h1>
                                                    </div>
                                                </div>
                                            )}
                                            {property.elevator && (
                                                <div className='property fee flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/elevator.png" alt="" />
                                                    <div>
                                                        <h1>Elevator</h1>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {(property.security || property.fire_security || property.non_flooding) && (
                                    <div className='security'>
                                        <h1 className='font-semibold'>Security</h1>
                                        <div className='grid grid-cols-3 gap-7 mt-5'>
                                            {property.fire_security && (
                                                <div className='utility flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/fire.png" alt="" />
                                                    <div>
                                                        <h1>Fire Security</h1>
                                                    </div>
                                                </div>
                                            )}
                                            {property.security && (
                                                <div className='pet flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/security.png" alt="" />
                                                    <div>
                                                        <h1>Security</h1>
                                                    </div>
                                                </div>
                                            )}
                                            {property.non_flooding && (
                                                <div className='property fee flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/nonflooding.png" alt="" />
                                                    <div>
                                                        <h1>Non-Flooding</h1>
                                                    </div>
                                                </div>                                        
                                            )}
                                        </div>
                                    </div>
                                )}

                                {(property.commercial_area || property.playground || property.common_area) && (
                                    <div className='community'>
                                        <h1 className='font-semibold'>Community Area</h1>
                                        <div className='grid grid-cols-3 gap-7 mt-5'>
                                            {property.commercial_area && (
                                                <div className='utility flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/commercial.png" alt="" />
                                                    <div>
                                                        <h1 className='w-[50px]'>Commercial Area</h1>
                                                    </div>
                                                </div>
                                            )}
                                            {(property.playground) && (
                                                <div className='pet flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/playground.png" alt="" />
                                                    <div>
                                                        <h1>Playground</h1>
                                                    </div>
                                                </div>
                                            )}
                                            {property.common_area && (
                                                <div className='property fee flex gap-3 items-center'>
                                                    <img className='w-[30px] h-[30px]' src="/common.png" alt="" />
                                                    <div>
                                                        <h1>Common Area</h1>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='mt-12'>
                        <h1 className='font-semibold text-[22px] mb-4'>Similar Properties</h1>
                        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5'>
                            {similarProperties.map(property => (
                                <PropertyCard key={property.id} property={property} className='flex flex-col gap-3' />
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-2'>
                    <div className='flex flex-col gap-2'>
                        <h1 className='font-semibold text-[20px]'>Location</h1>
                        <Map key={property.location_url} src={property.location_url}/>
                    </div>
                    {/* end */}
                </div>
            </div>
            <Footer />
        </div>
    )
};

export default PropertyDetails;