import React from 'react';

const SingleBanner = () => {
  return (
    <div className="container mx-auto mb-5 rounded-lg overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product 1 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img className="w-full h-32 md:h-48 object-cover md:object-fill" src="https://via.placeholder.com/150" alt="Product 1" />
          <div className="p-4">
            <div className="uppercase tracking-wide text-sm text-gray-800 font-semibold">Natural Recycling Product 1</div>
            <p className="mt-2 text-gray-800 text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa facere, ipsum magnam pariatur maiores vero.
            </p>
          </div>
        </div>

        {/* Product 2 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img className="w-full h-32 md:h-48 object-cover md:object-fill" src="https://via.placeholder.com/150" alt="Product 2" />
          <div className="p-4">
            <div className="uppercase tracking-wide text-sm text-gray-800 font-semibold">Natural Recycling Product 2</div>
            <p className="mt-2 text-gray-800 text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa facere, ipsum magnam pariatur maiores vero.
            </p>
          </div>
        </div>

        {/* Product 3 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img className="w-full h-32 md:h-48 object-cover md:object-fill" src="https://via.placeholder.com/150" alt="Product 3" />
          <div className="p-4">
            <div className="uppercase tracking-wide text-sm text-gray-800 font-semibold">Natural Recycling Product 3</div>
            <p className="mt-2 text-gray-800 text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa facere, ipsum magnam pariatur maiores vero.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBanner;
