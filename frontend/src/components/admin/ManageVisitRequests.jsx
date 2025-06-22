import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../landingPage/navbar';
import Footer from '../landingPage/footer';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:3000';

const ManageVisitRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!token) throw new Error('No token found. Please login again');
                
                const [requestsRes, employeesRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/requests`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/api/admins/employees`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (requestsRes.data.success) setRequests(requestsRes.data.data);
                if (employeesRes.data.success) setEmployees(employeesRes.data.data);

            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleUpdate = async (id, status, assignedAgencyId, notes) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/requests/${id}`, 
                { status, assignedAgencyId, notes },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setRequests(requests.map(req => req.id === id ? response.data.data : req));
                toast.success('Request updated successfully');
            }
        } catch (err) {
            toast.error('Error updating request: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className='w-full'>
            <Navbar />
            <div className='px-4 md:px-20 py-8'>
                <h1 className='text-3xl font-bold mb-5'>Manage Visit Requests</h1>
                {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-lg'>{error}</div>}
                {loading ? (
                    <div className='flex justify-center'><div className='loading loading-spinner loading-lg' /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2">Property</th>
                                    <th className="py-2">User</th>
                                    <th className="py-2">Preferred Date</th>
                                    <th className="py-2">Status</th>
                                    <th className="py-2">Assign to Agency</th>
                                    <th className="py-2">Notes</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => (
                                    <tr key={request.id}>
                                        <td className="border px-4 py-2">{request.property_title}</td>
                                        <td className="border px-4 py-2">{request.user_name}</td>
                                        <td className="border px-4 py-2">{new Date(request.preferred_date).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">
                                            <select
                                                value={request.status}
                                                onChange={(e) => handleUpdate(request.id, e.target.value, request.assigned_agency_id, request.notes)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="assigned">Assigned</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <select
                                                value={request.assigned_agency_id || ''}
                                                onChange={(e) => handleUpdate(request.id, request.status, e.target.value, request.notes)}
                                            >
                                                <option value="">Select Agency</option>
                                                {employees.map(emp => (
                                                    <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <textarea 
                                                defaultValue={request.notes}
                                                onBlur={(e) => handleUpdate(request.id, request.status, request.assigned_agency_id, e.target.value)}
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <button 
                                                onClick={() => handleUpdate(request.id, request.status, request.assigned_agency_id, request.notes)}
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                            >
                                                Save
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ManageVisitRequests;