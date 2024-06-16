import React from 'react';

const Banner = () => {
  return (
    <div className="relative bg-cover bg-center h-80">
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary  opacity-50"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to ecomart</h1>
        <p className="text-lg md:text-xl mb-8">Discover amazing products and deals</p>
        <button className="px-8 py-3 bg-yellow-500 text-white rounded-lg text-xl hover:bg-yellow-600 transition duration-300 ease-in-out">Shop Now</button>
      </div>
    </div>
  );
};

export default Banner;
