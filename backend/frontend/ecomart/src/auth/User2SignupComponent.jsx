import React, { useState } from 'react';
import axios from 'axios';

const User2SignupComponent = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        address: '',
        whatsapp_number: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://192.168.223.1:800/api/usersingnup/', formData);
            console.log(response.data); // Log response from the server
            // Handle success, e.g., show a success message to the user
        } catch (error) {
            console.error('Error:', error.response.data); // Log error response from the server
            // Handle error, e.g., show an error message to the user
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Signup</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                    <label className="block mb-1">Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                    <label className="block mb-1">First Name:</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                    <label className="block mb-1">Last Name:</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                    <label className="block mb-1">Address:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                    <label className="block mb-1">WhatsApp Number:</label>
                    <input type="text" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
                </div>
                {/* Add more input fields for other data */}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
            </form>
        </div>
    );
};

export default User2SignupComponent;
