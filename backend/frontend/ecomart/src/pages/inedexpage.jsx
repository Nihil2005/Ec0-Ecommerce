import React from 'react';
import { motion } from 'framer-motion';

const LandingPage = ({ imageUrl }) => {
  return (
    <motion.div 
      className="bg-black min-h-screen flex flex-col justify-center items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-4xl w-full p-6 md:p-12 bg-black shadow-lg rounded-lg flex flex-col md:flex-row items-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="md:w-1/2 md:mr-8 mb-6 md:mb-0">
          <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREKzrZj2jYkwqO0A-fXj6SpLmPNYBznWJ-2JtZtZMHlw&s' alt="Landing" className="w-full rounded-lg" />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-4xl text-white md:text-6xl font-bold text-center md:text-left mb-8">Welcome to EcoMart</h1>
          <p className="text-lg md:text-xl  text-white text-center md:text-left mb-8">Where sustainable choices meet convenience! At Eco Mart, we are committed to providing you with a wide range of eco-friendly products that make it easy for you to live a more environmentally-conscious lifestyle.Thank you for choosing Eco Mart!</p>
          <div className="flex justify-center md:justify-start">
            <motion.button 
              className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4  mr-4 rounded-3xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            ><a href='/signup'>
              Get Started
              </a>
            </motion.button>
            <motion.button 
              className="bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-3xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <a href='about-us'>
              Learn More
              </a>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default LandingPage;
