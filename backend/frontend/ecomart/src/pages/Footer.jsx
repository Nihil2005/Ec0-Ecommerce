import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full lg:w-4/12 px-4">
            <h4 className="text-3xl font-semibold mb-4">About Us</h4>
            <p className="text-sm">
            Eco-Mart, an innovative e-commerce platform, stands at the forefront of the sustainability movement, offering a diverse array of eco-friendly products. With a mission to promote a greener lifestyle
            </p>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <h4 className="text-3xl font-semibold mb-4">Links</h4>
            <ul className="text-sm">
              <li className="mb-2"><a href="#" className="hover:text-blue-500 transition-colors duration-300">Home</a></li>
              <li className="mb-2"><a href="#" className="hover:text-blue-500 transition-colors duration-300">About</a></li>
              <li className="mb-2"><a href="#" className="hover:text-blue-500 transition-colors duration-300">Contact</a></li>
              <li className='mb-2'><a href="#" className="hover:text-blue-500 transition-colors duration-300">FaQ</a></li>
            </ul>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <h4 className="text-3xl font-semibold mb-4">Follow Us</h4>
            <div className="flex items-center">
              <a href="https://www.facebook.com/" className="mr-4 text-xl hover:text-blue-500 transition-colors duration-300">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://twitter.com/" className="mr-4 text-xl hover:text-blue-500 transition-colors duration-300">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="http://instagram.com/" className="text-xl hover:text-blue-500 transition-colors duration-300">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
           
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-700" />
        <div className="text-center text-sm text-gray-600">&copy; {new Date().getFullYear()} . All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
