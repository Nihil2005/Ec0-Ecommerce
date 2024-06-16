import React from 'react';
import { useSpring, animated } from 'react-spring';

const SuperBanner = () => {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  return (
    <animated.div className="bg-blue-500 text-white py-8" style={fadeIn}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold tracking-tight leading-10 sm:text-4xl sm:leading-none md:text-5xl">
              Super Banner Component
            </h2>
            <p className="mt-3 text-lg leading-6 sm:mt-4">
              This is a customizable super banner component built with React and Tailwind CSS.
            </p>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-gray-50 transition ease-in-out duration-150">
                  Get Started
                </a>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150">
                  Learn More
                </a>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 mt-6 lg:mt-0">
            <div className="w-full h-auto overflow-hidden">
              <img
                className="w-full h-auto transform scale-150 rotate-12"
                src="https://source.unsplash.com/random/800x600"
                alt="Random Image"
              />
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default SuperBanner;
