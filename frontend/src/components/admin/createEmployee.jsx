import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar'

const CreateEmployee = () => {
    const BASE_URL = 'http://localhost:3000';
    const navigate = useNavigate();
    const [formData, setFormdata] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        hireDate: '',
        jobTitle: '',
        department: '',
        salary: ''
    });
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormdata((prev) => ({
            ...prev,
            [id]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const res = await axios.post(`${BASE_URL}/api/admins/createEmployee`, formData)
            const data = res.data;
            if (!data.success) {
                throw new Error(data.message || 'Created Failed');
            } 
            toast.success('Employee created successfully');
        } catch (err) {
            console.error('Error in handleSubmit:', err);
            toast.error(err.response?.data?.message || 'Failed to create property');
        }
    }
    return (
        <div>
            <Sidebar />
            <div className='ml-32 w-full flex flex-col gap-5 items-center justify-center h-screen'>
                <h1 className='text-[25px] font-bold'>Add Employee</h1>
                {/* <div className='flex justify-center gap-5'> */}
                    <form onSubmit={handleSubmit} className='w-full flex justify-center gap-5'>
                        <div className='w-150 border border-gray-300 rounded-lg p-5'>
                            <h1 className='font-bold'>Personal Information</h1>
                            <div className='mt-5 grid grid-cols-2 gap-5'>
                                <div className="mb-4 w-full">
                                    <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Id</label>
                                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" 
                                        type="number" id="id"
                                        value={formData.id}
                                        onChange={handleChange}
                                        required
                                        placeholder='1'
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                    <input type="text" id="firstName" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" 
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder='John'
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                                    <input type="text" id="lastName" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" 
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        placeholder='Doe'
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input type="text" id="email" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder='john.doe@example.com'
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                                    <input type="number" id="phone" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" 
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder='1234567890'
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date Of Birth</label>
                                    <input type="date" id="dob" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" 
                                        value={formData.dob}
                                        onChange={handleChange}
                                        required
                                        placeholder='19-03-06'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='w-150 border border-gray-300 rounded-lg p-5'>
                            <h1 className='font-bold'>Company Information</h1>
                            <div className='mt-5 grid grid-cols-2 gap-5'>
                                <div className="mb-4">
                                    <label htmlFor="hireDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hire Date</label>
                                    <input type="date" id="hireDate" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" 
                                        value={formData.hireDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="jobTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Title</label>
                                    <input type="text" id="jobTitle" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" 
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                        required
                                        placeholder='Software Engineer'
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department</label>
                                    <input type="text" id="department" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" 
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                        placeholder='Engineering'
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="salary" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Salary</label>
                                    <input type="number" id="salary" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" 
                                        value={formData.salary}
                                        onChange={handleChange}
                                        required
                                        placeholder='50000'
                                    />
                                </div>
                                <div className="mb-4">
                                    <button type='submit' className="w-full bg-blue-900 border border-gray-300 text-white text-sm rounded-lg block w-full p-2.5 cursor-pointer transition duration-250 ease-in-out hover:bg-blue-700"> Submit </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            {/* </div> */}
        </div>
    )
}

export default CreateEmployee