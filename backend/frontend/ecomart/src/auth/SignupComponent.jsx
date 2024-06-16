import React, { useState } from 'react';
import axios from 'axios';
import EmailActivationComponent from './EmailActivationComponent'; // Import the EmailActivationComponent
import User2SignupComponent from './User2SignupComponent';


const SignupComponent = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    whatsapp_number: '',
    username: '',
    id_proof: null // Add id_proof field to formData
  });
  const [message, setMessage] = useState(null); // State for success or error message
  const [showEmailActivation, setShowEmailActivation] = useState(false); // State to control EmailActivationComponent visibility

  const handleChange = (e) => {
    // Handle file input separately
    if (e.target.type === 'file') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      // Append form data fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      const response = await axios.post('http://192.168.223.1:800/api/signup/', formDataToSend);
      console.log(response.data);
      setMessage({ type: 'success', content: 'User signed up successfully.' });
      // Clear form fields upon successful signup
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        whatsapp_number: '',
        username: '',
        id_proof: null // Reset id_proof field
      });
      // Show the EmailActivationComponent after successful signup
      setShowEmailActivation(true);
    } catch (error) {
      console.error(error.response.data);
      setMessage({ type: 'error', content: error.response.data.detail });
    }
  };


  




  return (
    <div className="flex justify-center items-center h-scree mt-8n">
      {showEmailActivation ? (
        <EmailActivationComponent />
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md  rounded-lg shadow-md p-8">
          <h2 className="text-2xl text-green-400 mb-6 text-center font-bold">Sign Up</h2>
          {message && (
            <div className={`mb-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.content}
            </div>
          )}
          <div className="mb-4">
          
            <label htmlFor="email" className="block text-white text-sm font-bold mb-2">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-white text-sm font-bold mb-2">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-white text-sm font-bold mb-2">First Name</label>
            <input type="text" id="firstName" name="first_name" value={formData.first_name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-white text-sm font-bold mb-2">Last Name</label>
            <input type="text" id="lastName" name="last_name" value={formData.last_name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label htmlFor="whatsappNumber" className="block text-white text-sm font-bold mb-2">WhatsApp Phone Number</label>
            <input type="text" id="whatsappNumber" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-white text-sm font-bold mb-2">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          {/* New ID proof field */}
          <div className="mb-4">
            <label htmlFor="idProof" className="block text-white text-sm font-bold mb-2">ID Proof</label>
            <input type="file" id="idProof" name="id_proof" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline">Sign Up</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SignupComponent;
