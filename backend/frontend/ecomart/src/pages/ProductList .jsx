import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.223.1:800/api/productsxx/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  // Slice the products array to show only the first 10 products
  const displayedProducts = products.slice(0, 10);

  return (
    <div className="container px-4 mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
      {displayedProducts.map((product) => (
        <div key={product.id} className="max-w-xs border-dotted border-4 border-rounded rounded-2xl overflow-hidden shadow-lg">
          <img className="w-full h-48 object-cover" src={product.image} alt={product.name} />
          <div className="px-6 py-4">
            <div className="font-bold text-white text-xl mb-2">{product.name}</div>

            <p className="text-white text-base">Price: ₹ {product.price}</p>
            <p className="text-white text-base">Seller: {product.seller_name}</p>
            {/* Use Link to navigate to the product detail page */}
            <Link
              to={`/product/${product.id}`} // Pass product id as a parameter to the product detail page
              className="block w-full bg-green-400 hover:bg-green-800 text-white font-bold px-2 py-2 rounded-md text-center"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
