import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiUser } from "react-icons/hi2";  // heroicon outline/solid v2

const EmployeeDashboard = () => {
    const BASE_URL = 'http://localhost:3000';
    const [employee, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/admins/employees`);
                const data = res.data;
                if (!data.success) {
                    throw new Error(data.message || 'Failed to fetch employees');
                }
                // toast.success('Employees fetched successfully');
                setEmployees(data.data);
            } catch (err) {
                console.log('Error Fetching Employees:', err);
                toast.error(err.response?.data?.message || 'Failed to fetch employees');
            }
        };
        fetchEmployees();
    }, [])

    return (
        <div>
            <Sidebar />
            <div className="ml-64 flex flex-col mt-10 h-screen p-10  bg-gray-50">
                <h1 className="text-3xl font-bold mb-6">Employee List</h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <table className="w-full table-auto text-sm text-left text-gray-700">
                        <thead className="text-xs uppercase bg-blue-100">
                        <tr>
                            <th className="px-4 py-2">Profile</th>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">Job Title</th>
                            <th className="px-4 py-2">Department</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employee.map(emp => (
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
                            <td className="px-4 py-2">{emp.phone}</td>
                            <td className="px-4 py-2">{emp.job_title}</td>
                            <td className="px-4 py-2">{emp.department}</td>
                            </tr>
                        ))}
                        {employee.length === 0 && (
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