import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarouselPage = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.223.1:800/api/images/');
        const data = response.data;
        const baseUrl = 'http://192.168.223.1:800'; // Replace with your Django server's base URL
        const urls = data.image_urls.map(image => baseUrl + image.image_carosal);
        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % imageUrls.length);
    }, 3000); // Change image every 3 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, [imageUrls]);

  return (
    <div className="relative">
      <div className="carousel bg-black-400 rounded-xl shadow-lg overflow-hidden">
        {/* Render images */}
        {imageUrls.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className={index === currentIndex ? "block w-full  object-cover " : "hidden"} // Show only the current image
            style={{ maxHeight: '85vh' }} // Set maximum height to maintain aspect ratio
          />
        ))}
      </div>
      {/* Navigation dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        {imageUrls.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 mx-1 rounded-full bg-gray-400 ${
              index === currentIndex ? 'bg-gray-800' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselPage;
