import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const { productId } = useParams();

  const handleBuyNow = (product) => {
    const message = `I am interested in purchasing this product:\n\n${product.name}\nPrice: ${product.price}\n\nDescription: ${product.description}\n\nView Product: ${window.location.href}`;
    const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://192.168.223.1:800/api/productsxy/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error.message);
      }
    };

    const fetchSuggestedProducts = async () => {
      try {
        const response = await axios.get(`http://192.168.223.1:800/api/productsxx/`);
        setSuggestedProducts(response.data);
      } catch (error) {
        console.error('Error fetching suggested products:', error.message);
      }
    };

    fetchProduct();
    fetchSuggestedProducts();
  }, [productId]);

  return (
    <div className="container mx-auto mt-8 p-4">
      {product ? (
        <div className="max-w-xl mx-auto border-dotted border-4 rounded overflow-hidden shadow-lg">
          <img className="w-full h-auto" src={product.image} alt={product.name} style={{ maxHeight: '300px', width: '100%' }} />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{product.name}</div>
            <p className="text-white text-base"><strong>Description:</strong> {product.description}</p>
            <p className="text-white text-base"><strong>Price: ₹ </strong> {product.price}</p>
            <p className="text-white text-base"><strong>Seller:</strong> {product.seller_name}</p>
            
            <button onClick={() => handleBuyNow(product)} className="block mt-4 text-white px-3 py-4 bg-green-500 hover:bg-green-800">
              Contact Seller on WhatsApp
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {suggestedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Suggested Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestedProducts.slice(0, 5).map((product) => ( // Show only the first 5 suggested products
              <div key={product.id} className="max-w-xs rounded border-dotted border-4 overflow-hidden shadow-lg">
                <img className="w-full h-auto" src={product.image} alt={product.name} style={{ maxHeight: '300px', width: '100%' }} />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{product.name}</div>
                  <p className="text-white text-base">Price: ₹ {product.price}</p>
                  <p className="text-white text-base">Seller: {product.seller_name}</p>
                  <button onClick={() => handleBuyNow(product)} className="mt-4 bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
