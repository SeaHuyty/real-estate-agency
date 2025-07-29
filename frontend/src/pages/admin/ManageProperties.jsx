import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/adminSidebar';
import { toast } from 'react-toastify';
import { HiPencil, HiTrash } from 'react-icons/hi2';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = 'http://localhost:3000';
const ITEMS_PER_PAGE = 6;

const ManageProperties = () => {
    const [properties, setProperties] = useState([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: ITEMS_PER_PAGE, pageCount: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchProperties(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const fetchProperties = async (page, search) => {
        setLoading(true);
        setError(null);
        try {
        if (!token) throw new Error('No token found. Please login again');

        const response = await axios.get(`${BASE_URL}/api/admins`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
            page,
            limit: ITEMS_PER_PAGE,
            ...(search ? { search: search.trim() } : {}),
            },
        });

        if (response.data.success) {
            setProperties(response.data.data);
            setMeta(response.data.meta);
        }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this property?')) return;
        try {
        const { data } = await axios.delete(`${BASE_URL}/api/admins/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
            toast.success('Deleted');
            fetchProperties(currentPage, searchTerm);
        }
        } catch (err) {
        toast.error(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className='flex h-screen bg-gray-50'>
            <Sidebar />
            <div className='px-10 py-5 w-full overflow-y-auto scrollbar-hide'>
                {/* Header + Search */}
                <div className='flex justify-between items-center mb-4'>
                    <h1 className='text-3xl font-bold'>Manage Properties</h1>
                    <div className='flex gap-2'>
                        <input
                            type='text'
                            placeholder='Search properties...'
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className='px-4 py-2 border focus:ring-2 focus:ring-blue-500'
                        />
                        <Link to="/admin/properties/create" className='bg-blue-900 text-white px-4 py-2 rounded'>
                            Add New Property
                        </Link>
                    </div>
                </div>

                {/* Error */}
                {error && <div className='mb-4 p-3 bg-red-100 text-red-700'>{error}</div>}
                {/* Loading */}
                {loading
                ? <div className='flex justify-center'><div className='loading loading-spinner loading-lg' /></div>
                    : <>
                        {/* Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {properties.map(p => (
                            <div key={p.id} className=''>
                                <img src={p.property_thumbnail || '/no-image.png'} alt={p.title} className='w-full h-48 object-cover rounded'/>
                                <div className='mt-2'>
                                    <div className='flex justify-between'>
                                        <h2 className='font-semibold'>{p.title}</h2>
                                        <span className='text-[20px] text-green-600 font-bold'>${Number(p.price).toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col justify-between gap-[10px]">
                                        <p className='text-sm'>{p.city}, {p.address}</p>
                                        <div className='flex justify-between items-center'>
                                            <div className="flex gap-[20px] text-[10px]">
                                                <div className="flex items-center gap-[5px]">
                                                    <img src="/bed.png" alt="" className='w-[20px] h-[20px]'/>
                                                    <span>{p.bedrooms} bedroom</span>
                                                </div>
                                                <div className="flex items-center gap-[5px]">
                                                    <img src="/bath.png" alt="" className='w-[20px] h-[20px]'/>
                                                    <span>{p.bathrooms} bathroom</span>
                                                </div>
                                                <div className="flex items-center gap-[5px]">
                                                    <img src="/size.png" alt="" className='w-[20px] h-[20px]'/>
                                                    <span>{p.size} m²</span>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2 cursor-pointer'>
                                                <HiPencil className='text-blue-900' size={24} onClick={() => navigate(`/admin/edit/${p.id}`)}/>
                                                <HiTrash className='text-red-600' size={24} onClick={() => handleDelete(p.id)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {properties.length > 0 && (
                            <div className='flex justify-between items-center mt-6'>
                                <div className='text-gray-600'>
                                    Showing {(currentPage - 1)*ITEMS_PER_PAGE + 1}–
                                    {Math.min(currentPage*ITEMS_PER_PAGE, meta.total)} of {meta.total}
                                </div>
                                <div className='flex gap-1'>
                                    <img
                                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className='px-4 py-2 duration-300 easy-in-out hover:bg-blue-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                                        src="/left_arrow.svg" alt='Previous'
                                    />
                                    {Array.from({ length: meta.pageCount }, (_, i) => (
                                    <button
                                        key={i+1}
                                        onClick={() => setCurrentPage(i+1)}
                                        className={`px-3 py-1 duration-300 easy-in-out hover:bg-blue-900 hover:text-white ${currentPage===i+1?'cursor-pointer bg-blue-900 transition-300 ease-in-out hover:bg-blue-900 hover:text-white text-white':'' }`}
                                        >{i+1}</button>
                                    ))}
                                    <img
                                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === meta.pageCount}
                                        className='px-4 py-2 duration-300 easy-in-out hover:bg-blue-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rotate-180'
                                        src="/left_arrow.svg" alt='Next'
                                    />
                                </div>
                            </div>
                        )}
                    </>
                }
            </div>
        </div>
    );
};

export default ManageProperties;
