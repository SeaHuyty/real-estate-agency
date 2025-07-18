import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiUser, HiPencil, HiTrash } from "react-icons/hi2";
import { Link } from 'react-router-dom'

const EmployeeDashboard = () => {
    const BASE_URL = 'http://localhost:3000';
    const [employee, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredEmployee, setFilteredEmployee] = useState([]);
    const [jobFilter, setJobFilter] = useState(); 

    useEffect(() => {   
        const fetchEmployees = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/admins/employees`);
                const data = res.data;
                if (!data.success) {
                    throw new Error(data.message || 'Failed to fetch employees');
                }
                toast.success('Employees fetched successfully');
                setEmployees(data.data);
                setFilteredEmployee(data.data);
            } catch (err) {
                console.log('Error Fetching Employees:', err);
                toast.error(err.response?.data?.message || 'Failed to fetch employees');
            }
        };
        fetchEmployees();
    }, [])
    
    const handleDelete = async (id) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this employee?");
            if (!confirm) {
                return;
            }
            const res = await axios.delete(`${BASE_URL}/api/admins/employees/${id}`);
            if (res.data.success) {
                setEmployees(prev => prev.filter(emp => emp.id !== id));
                toast.success("Employee deleted successfully");
            } else {
                toast.error(res.data.message || "Failed to delete employee");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete employee");
        }
    }
    useEffect (() => {
        let searchEmployee = [...employee];
        // if (!search) {
        //     setFilteredEmployee(employee);
        //     return;
        // }
        if (search && search.trim() !== '') {
            searchEmployee = searchEmployee.filter(emp =>
                emp.first_name.toLowerCase().includes(search.toLowerCase()) ||
                emp.last_name.toLowerCase().includes(search.toLowerCase()) ||
                emp.job_title.toLowerCase().includes(search.toLowerCase()) ||
                emp.department.toLowerCase().includes(search.toLowerCase()) ||
                emp.id.toString().includes(search)
                
            );
        }

        if (jobFilter && jobFilter.trim() !== '') {
            searchEmployee = searchEmployee.filter(emp => emp.job_title === jobFilter);
        }
        setFilteredEmployee(searchEmployee);
    }, [search, employee, jobFilter]);

    return (
        <div>
            <Sidebar />
            <div className="ml-64 flex flex-col h-screen p-5">
                <div className='flex justify-between items-center'>
                    <h1 className="text-3xl font-bold text-blue-900">Employee List</h1>
                    <div className='flex gap-5'>
                        <div class="relative w-100">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input 
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                class="block rounded-lg w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500" placeholder="Search Employees" required />
                        </div>
                        <div>
                            <select
                                value={jobFilter}
                                onChange={(e) => setJobFilter(e.target.value)}
                                className="rounded-lg px-4 py-2 text-sm text-gray-500 border border-gray-300 bg-gray-50"
                            >   
                                <option value="">All Job Title</option>
                                {
                                    [...new Set(employee.map(emp => emp.job_title))].map(title => (
                                        <option key={title} value={title}>{title}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow-md p-6 mt-6">
                    <table className="w-full table-auto text-sm text-left text-gray-700">
                        <thead className="text-xs uppercase bg-blue-100">
                            <tr>
                                <th className="px-4 py-2">Profile</th>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Job Title</th>
                                <th className="px-4 py-2">Department</th>
                                <th className="px-4 py-2">Salary</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployee.map(emp => (
                                <tr key={emp.id} className="border-b cursor-pointer hover:bg-gray-100">
                                    <td className="px-4 py-2 bg-center bg-cover">
                                        {emp.profile ? (
                                            <img src={emp.profile} className="w-15 h-15 rounded-full object-cover" />
                                        ):(
                                            <div className="w-15 h-15 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                <HiUser className="w-6 h-6" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">{emp.id}</td>
                                    <td className="px-4 py-2">{emp.first_name} {emp.last_name}</td>
                                    <td className="px-4 py-2">{emp.email}</td>
                                    <td className="px-4 py-2">{emp.job_title}</td>
                                    <td className="px-4 py-2">{emp.department}</td>
                                    <td className="px-4 py-2">{emp.salary}</td>
                                    <td className="px-4 py-2 flex gap-2 justify-center items-center mt-5">
                                        
                                        <Link to={`/hr/${emp.id}`} className="text-blue-600 hover:text-blue-800 cursor-pointer hover:scale-110"
                                            onClick={() => handleUpdate(emp.id)}>
                                        
                                            <HiPencil className="w-5 h-5" />
                                        </Link>
                                        {/* </button> */}
                                        <button
                                            className="text-red-600 hover:text-red-800 cursor-pointer hover:scale-110"
                                            onClick={() => handleDelete(emp.id)}
                                        >
                                            <HiTrash className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredEmployee.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDashboard