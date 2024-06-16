import React from 'react';

const FourSmallContainers = () => {
  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-3">
      {/* First Container */}
      <div className="bg-gradient-to-tr from-green-400 to-blue-500 rounded-lg overflow-hidden shadow-lg">
        <img className="w-full h-48 object-cover" src="https://via.placeholder.com/300" alt="Product 1" />
        <div className="p-4">
          <div className="uppercase tracking-wide text-sm text-white font-semibold">Natural Recycling Products</div>
          <p className="mt-2 text-white text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa facere, ipsum magnam pariatur maiores vero.
          </p>
        </div>
      </div>
      
      {/* Second Container */}
      <div className="bg-gradient-to-tr from-green-400 to-blue-500 rounded-lg overflow-hidden shadow-lg">
        <img className="w-full h-48 object-cover" src="https://via.placeholder.com/300" alt="Product 2" />
        <div className="p-4">
          <div className="uppercase tracking-wide text-sm text-white font-semibold">Natural Recycling Products</div>
          <p className="mt-2 text-white text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa facere, ipsum magnam pariatur maiores vero.
          </p>
        </div>
      </div>
      
      {/* Third Container */}
      <div className="bg-gradient-to-tr from-green-400 to-blue-500 rounded-lg overflow-hidden shadow-lg">
        <img className="w-full h-48 object-cover" src="https://via.placeholder.com/300" alt="Product 3" />
        <div className="p-4">
          <div className="uppercase tracking-wide text-sm text-white font-semibold">Natural Recycling Products</div>
          <p className="mt-2 text-white text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa facere, ipsum magnam pariatur maiores vero.
          </p>
        </div>
      </div>
      
      {/* Fourth Container */}
      <div className="bg-gradient-to-tr from-green-400 to-blue-500 rounded-lg overflow-hidden shadow-lg">
        <img className="w-full h-48 object-cover" src="https://via.placeholder.com/300" alt="Product 4" />
        <div className="p-4">
          <div className="uppercase tracking-wide text-sm text-white font-semibold">Natural Recycling Products</div>
          <p className="mt-2 text-white text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa facere, ipsum magnam pariatur maiores vero.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FourSmallContainers;
