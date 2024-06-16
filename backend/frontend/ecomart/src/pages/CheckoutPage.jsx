import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
  const { productId } = useParams(); // Retrieve the product ID from the URL parameters
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/productsxx/${productId}`);
        setProduct(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error.message);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <div className="container mx-auto mt-8">
      {isLoading ? (
        <p>Loading...</p>
      ) : product ? (
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <img src={product.image} alt={product.name} className="mb-4" />
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-gray-700 mb-4">Price: {product.price}</p>
          {/* Add shipping and payment form here */}
          <form className="mb-4">
            <div className="mb-4">
              <label htmlFor="shippingAddress" className="block text-gray-700">Shipping Address:</label>
              <input type="text" id="shippingAddress" className="border border-gray-300 px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="paymentMethod" className="block text-gray-700">Payment Method:</label>
              <select id="paymentMethod" className="border border-gray-300 px-4 py-2 w-full">
                <option value="creditCard">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Place Order
            </button>
          </form>
        </div>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default CheckoutPage;
