import React, { useState } from 'react';
import axios from 'axios';
import ProfileComponent from './ProfileComponent'; // Import your ProfileComponent
import ForgotPasswordComponent from './ForgotPasswordComponent'; // Import ForgotPasswordComponent

const LoginComponent = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to toggle Forgot Password screen

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.223.1:800/api/login/', formData);
      console.log(response.data);
      if (response && response.data && response.data.token && response.data.success) {
        const token = response.data.token;
        localStorage.setItem('token', token); // Store token in localStorage
        setUserData(response.data);
        setMessage({ type: 'success', content: 'User authenticated.' });
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      setMessage({ type: 'error', content: error.response ? error.response.data.error : error.message });
    }
  };

  if (userData) {
    return <ProfileComponent userData={userData} />;
  }

  if (showForgotPassword) {
    return <ForgotPasswordComponent />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h2 className="text-2xl text-green-400 mb-6 text-center font-bold">Login</h2>
        {message && (
          <div className={`mb-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.content}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-white text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-white text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline">Login</button>
          <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-white">Forgot Password?</button>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;
