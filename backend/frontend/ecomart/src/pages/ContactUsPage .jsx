import React, { useState } from 'react';
import axios from 'axios';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/send-email', formData); // Adjust the endpoint accordingly
      console.log(response.data);
      setMessage({ type: 'success', content: 'Message sent successfully!' });
      setFormData({ name: '', email: '', message: '' }); // Clear the form fields after successful submission
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      setMessage({ type: 'error', content: 'Failed to send message. Please try again later.' });
    }
  };

  return (
    <div className=" min-h-screen">
      <div className="container mx-auto py-12">
        <h1 className="text-4xl text-green-400 font-bold text-center mb-8">Contact Us</h1>
        <div className="flex flex-wrap justify-between">
          <div className="max-w-lg w-full md:w-1/2 mx-auto bg-white p-6 shadow-md rounded-lg mb-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline">
                  Send Message
                </button>
              </div>
            </form>
            {message && (
              <div className={`mt-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.content}
              </div>
            )}
          </div>
          <div className="max-w-lg w-full md:w-1/2 mx-auto bg-white p-6 shadow-md rounded-lg mb-6">
         
            <iframe
              title="Map"
              className="w-full h-64 "
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.9971826657173!2d-122.07948518431975!3d37.39433497982993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fbbd3d6ce90b5%3A0x2d623faed0afcdc0!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1638293364005!5m2!1sen!2sus"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
            <div className=''>
              <h2 className="text-2xl font-bold mb-4">Contact Details</h2>
              <p className="text-gray-700 mb-2 ">123 Main Street</p>
              <p className="text-gray-700 mb-2">Chennai - 600001 </p>
              <a href="tel:(91) 8807922862" className="text-black-500 hover:text-blue-700">(91) 8807922862</a>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> support@ecomart.com</p>
              <p className="text-gray-700 mb-2"><strong>Hours:</strong> 9am - 5pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
