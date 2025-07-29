import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaHome,
    FaMapMarkerAlt,
    FaImage,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSpinner
} from 'react-icons/fa';

const BASE_URL = 'http://localhost:3000';

const RequestVisit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);

    // Check authentication and fetch property data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if user is logged in
                const userToken = localStorage.getItem('userToken');
                if (!userToken) {
                    setShowLoginModal(true);
                    setLoading(false);
                    return;
                }

                // Validate token by making a test request
                try {
                    await axios.get(`${BASE_URL}/api/user`, {
                        headers: { Authorization: `Bearer ${userToken}` }
                    });
                } catch (tokenError) {
                    // Token is invalid or expired
                    if (tokenError.response?.status === 401 ||
                        tokenError.response?.data?.error === 'TOKEN_EXPIRED') {
                        localStorage.removeItem('userToken');
                        setShowLoginModal(true);
                        setLoading(false);
                        toast.error('Your session has expired. Please login again.');
                        return;
                    }
                }

                // Fetch property details
                const propertyResponse = await axios.get(`${BASE_URL}/api/properties/${id}`);
                if (propertyResponse.data.success) {
                    setProperty(propertyResponse.data.data);
                }

                // TODO: Fetch user details from token if needed
                // For now, we'll let user fill in their details manually

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load property details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/user/auth/google-login`, {
                token: credentialResponse.credential,
            });

            if (res.data.token) {
                localStorage.setItem('userToken', res.data.token);
                setShowLoginModal(false);
                toast.success('Login successful! You can now request a visit.');

                // Optionally pre-fill form with user data from Google
                if (res.data.user) {
                    setFormData(prev => ({
                        ...prev,
                        name: res.data.user.name || '',
                        email: res.data.user.email || ''
                    }));
                }
            } else {
                console.error('Login failed: No token received:', res.data.error);
                toast.error('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed. Please try again.');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s\-\(\)]{9,}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.preferredDate) {
            newErrors.preferredDate = 'Preferred date is required';
        } else {
            const selectedDate = new Date(formData.preferredDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.preferredDate = 'Please select a future date';
            }
        }

        if (!formData.preferredTime) {
            newErrors.preferredTime = 'Preferred time is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setSubmitting(true);

        try {
            const userToken = localStorage.getItem('userToken');

            if (!userToken) {
                setShowLoginModal(true);
                return;
            }

            // Combine date and time for the API
            const preferredDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);

            const response = await axios.post(
                `${BASE_URL}/api/requests`,
                {
                    propertyId: parseInt(id),
                    preferredDate: preferredDateTime.toISOString(),
                    notes: formData.message || null
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                }
            );

            if (response.data.success) {
                toast.success('Visit request submitted successfully! We will contact you soon.');
                navigate(`/properties/${id}`);
            }
        } catch (error) {
            console.error('Error submitting request:', error);

            // Handle token expiration
            if (error.response?.data?.error === 'TOKEN_EXPIRED' ||
                error.response?.status === 401) {
                localStorage.removeItem('userToken');
                setShowLoginModal(true);
                toast.error('Your session has expired. Please login again.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to submit visit request');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Generate time slots for the dropdown
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
                slots.push({ value: time, label: displayTime });
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"
                    />
                    <p className="text-gray-600 text-lg">Loading property details...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <motion.button
                            whileHover={{ x: -5 }}
                            onClick={() => navigate(`/properties/${id}`)}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Property
                        </motion.button>

                        <div className="text-right">
                            <h1 className="text-2xl font-bold text-gray-800">Request a Visit</h1>
                            <p className="text-gray-600">Schedule your property viewing</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Property Information Card */}
                    {property && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="relative">
                                {property.property_thumbnail ? (
                                    <img
                                        src={property.property_thumbnail}
                                        alt={property.title}
                                        className="w-full h-64 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                        <FaImage className="text-gray-400 text-4xl" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        Property #{property.id}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{property.title}</h2>

                                <div className="flex items-center text-gray-600 mb-4">
                                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                    <span>{property.location || 'Location not specified'}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                                        <FaHome className="text-blue-600 text-xl mx-auto mb-1" />
                                        <p className="text-sm text-gray-600">Type</p>
                                        <p className="font-semibold text-gray-800">{property.type || 'N/A'}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-3 text-center">
                                        <span className="text-green-600 text-xl font-bold">$</span>
                                        <p className="text-sm text-gray-600">Price</p>
                                        <p className="font-semibold text-gray-800">
                                            ${property.price ? property.price.toLocaleString() : 'Contact for price'}
                                        </p>
                                    </div>
                                </div>

                                {property.description && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                                        <p className="text-gray-600 text-sm line-clamp-3">{property.description}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Visit Request Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Schedule Your Visit</h2>
                            <p className="text-blue-100">Fill out the form below and we'll contact you to confirm your appointment</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <FaUser className="mr-2 text-blue-500" />
                                    Personal Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your full name"
                                            aria-describedby={errors.name ? "name-error" : undefined}
                                        />
                                        {errors.name && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                id="name-error"
                                                className="mt-1 text-sm text-red-600 flex items-center"
                                            >
                                                <FaExclamationTriangle className="mr-1" />
                                                {errors.name}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your email address"
                                            aria-describedby={errors.email ? "email-error" : undefined}
                                        />
                                        {errors.email && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                id="email-error"
                                                className="mt-1 text-sm text-red-600 flex items-center"
                                            >
                                                <FaExclamationTriangle className="mr-1" />
                                                {errors.email}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your phone number"
                                        aria-describedby={errors.phone ? "phone-error" : undefined}
                                    />
                                    {errors.phone && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            id="phone-error"
                                            className="mt-1 text-sm text-red-600 flex items-center"
                                        >
                                            <FaExclamationTriangle className="mr-1" />
                                            {errors.phone}
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            {/* Visit Scheduling */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-blue-500" />
                                    Visit Scheduling
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Date *
                                        </label>
                                        <input
                                            type="date"
                                            id="preferredDate"
                                            name="preferredDate"
                                            value={formData.preferredDate}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.preferredDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                            aria-describedby={errors.preferredDate ? "date-error" : undefined}
                                        />
                                        {errors.preferredDate && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                id="date-error"
                                                className="mt-1 text-sm text-red-600 flex items-center"
                                            >
                                                <FaExclamationTriangle className="mr-1" />
                                                {errors.preferredDate}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Time *
                                        </label>
                                        <select
                                            id="preferredTime"
                                            name="preferredTime"
                                            value={formData.preferredTime}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.preferredTime ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                            aria-describedby={errors.preferredTime ? "time-error" : undefined}
                                        >
                                            <option value="">Select a time</option>
                                            {timeSlots.map(slot => (
                                                <option key={slot.value} value={slot.value}>
                                                    {slot.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.preferredTime && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                id="time-error"
                                                className="mt-1 text-sm text-red-600 flex items-center"
                                            >
                                                <FaExclamationTriangle className="mr-1" />
                                                {errors.preferredTime}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <FaClock className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-blue-800 mb-1">Business Hours</h4>
                                            <p className="text-sm text-blue-600">
                                                We're available for property visits Monday through Friday, 9:00 AM to 5:30 PM.
                                                Weekend appointments may be available upon request.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Message */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Additional Information
                                </h3>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message (Optional)
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                        placeholder="Any specific questions or requirements for your visit?"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Let us know if you have any specific questions or requirements for your visit.
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                                        submitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    {submitting ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Submitting Request...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="mr-2" />
                                            Submit Visit Request
                                        </>
                                    )}
                                </motion.button>

                                <p className="mt-3 text-sm text-gray-600 text-center">
                                    By submitting this form, you agree to be contacted by our team regarding your visit request.
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Login Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowLoginModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <FaUser className="text-blue-600 text-2xl" />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
                                <p className="text-gray-600 mb-6">
                                    Please login with your Google account to request a property visit.
                                </p>

                                <div className="space-y-4">
                                    <GoogleLogin
                                        onSuccess={handleLoginSuccess}
                                        onError={(error) => {
                                            console.error('Google Login Error:', error);
                                            toast.error('Google login failed. Please check your internet connection and try again.');
                                        }}
                                        theme="outline"
                                        size="large"
                                        width="100%"
                                        useOneTap={false}
                                        auto_select={false}
                                    />

                                    <button
                                        onClick={() => setShowLoginModal(false)}
                                        className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RequestVisit;