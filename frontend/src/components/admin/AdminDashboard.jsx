import { Link } from 'react-router-dom';
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';

const AdminDashboard = () => {
    return (
        <div className='w-full overflow-hidden'>
            <Navbar />
            <div className='px-20 py-10'>
                <h1 className='text-3xl font-bold mb-8'>Admin Dashboard</h1>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <Link to="/admin/properties/create" className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
                        <h2 className='text-xl font-semibold mb-2'>Create Property</h2>
                        <p className='text-gray-600'>Add new property listings</p>
                    </Link>
                    
                    <Link to="/admin/properties/manage" className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
                        <h2 className='text-xl font-semibold mb-2'>Manage Properties</h2>
                        <p className='text-gray-600'>View, edit or delete properties</p>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;