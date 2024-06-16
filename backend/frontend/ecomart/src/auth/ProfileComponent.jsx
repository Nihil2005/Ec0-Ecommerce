import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa'; 

const ProfileComponent = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [productData, setProductData] = useState({
    name: '',
    image: null,
    description: '',
    price: '',
    stock: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [updatedProductData, setUpdatedProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });

  useEffect(() => {
    fetchUserData();
    fetchCategories();
    fetchUserProducts();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.get('http://192.168.223.1:800/api', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      setError('Failed to fetch user data');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.223.1:800/api/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const fetchUserProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://192.168.223.1:800/api/user-products/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setUserProducts(response.data);
    } catch (error) {
      console.error('Error fetching user products:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setProductData({ ...productData, image: imageFile });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('image', productData.image);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('stock', productData.stock);
      formData.append('category', productData.category);

      const response = await axios.post('http://192.168.223.1:800/api/products/find', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });
      
      console.log('Product uploaded successfully:', response.data);
      setSuccessMessage('Product uploaded successfully');
      setProductData({
        name: '',
        image: null,
        description: '',
        price: '',
        stock: '',
        category: ''
      });
      setUploading(false);
      fetchUserProducts();
    } catch (error) {
      console.error('Error uploading product:', error.message);
      setErrorMessage('Error uploading product');
      setUploading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://192.168.223.1:800/api/products/${productId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      fetchUserProducts();
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  const handleUpdate = (product) => {
    setUpdatingProduct(product);
    setUpdatedProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category
    });
  };

  const handleUpdatedProductChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProductData({ ...updatedProductData, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', updatedProductData.name);
      formData.append('description', updatedProductData.description);
      formData.append('price', updatedProductData.price);
      formData.append('stock', updatedProductData.stock);
      formData.append('category', updatedProductData.category);

      const response = await axios.patch(`http://192.168.223.1:800/api/products/${updatingProduct.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });
      console.log('Product updated successfully:', response.data);
      setUpdatingProduct(null);
      fetchUserProducts();
    } catch (error) {
      console.error('Error updating product:', error.message);
      setErrorMessage('Error updating product');
    } finally {
      setUploading(false);
    }
  };








  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
    // Redirect or do whatever you need after logout
  };

const  aiachatbot =()=>{
  window.location.href = '/aiachatbot';
}



  return (
    <div className="flex flex-col lg:flex-row min-h-screen mt-4 bg-gray-100">
      <div className="w-full lg:w-64 bg-gray-800 text-gray-100">
        <div className="p-4 text-lg font-bold">User Dahboard</div>
        <ul className="mt-4">
          <li className="px-4 py-2 bg-green-400 hover:bg-gray-700">Dashboard</li>
         <button className='p-3 hover:bg-slate-700 '    onClick={aiachatbot}   >AI Assistant</button>
       <div>
       <button  className='bg-red-700 p-3 rounded-xl'   onClick={handleLogout} >Logout</button>
       </div>
        
        </ul>
      </div>

      <div className="flex-1 p-8 ">
        <div className="mb-8 bg-blue-400 shadow-lg rounded-xl mx-auto">
          <h2 className="text-xl font-bold mb-4 ml-4">User Profile</h2>
          {loading && <div className="text-center mt-8">Loading...</div>}
          {error && <div className="text-center mt-8">Error: {error}</div>}
          {userData && (
            <div className='ml-4'>
              <p><span className="font-bold">Email:</span> {userData.email}</p>
              <p><span className="font-bold">First Name:</span> {userData.first_name}</p>
              <p><span className="font-bold">Last Name:</span> {userData.last_name}</p>
              <p><span className="font-bold">Phone:</span> {userData.whatsapp_number}</p>
            </div>
          )}
          {successMessage && <div className="text-white text-center mt-4 bg-green-400 px-3 py-3">{successMessage}</div>}
          {errorMessage && <div className="text-white text-center mt-4 bg-red-500 px-3 py-3" >{errorMessage}</div>}
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <h2 className="text-xl font-bold mb-4">Upload Product</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Product Name"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Product Description"
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              placeholder="Product Price"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
              Stock
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="stock"
              type="number"
              placeholder="Product Stock"
              name="stock"
              value={productData.stock}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Product'}
          </button>
        </form>

        <div>
          <h2 className="text-xl font-bold mb-4">Products Uploaded by You</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProducts.map(product => (
              <li key={product.id} className="border p-4 rounded-md">
                <div>{product.name}</div>
                <div>{product.description}</div>
                <div>{product.price}</div>
                <img src={product.image} alt={product.name} className="w-full h-auto" />
                <div className="flex justify-between items-center mt-4">
                  <button onClick={() => handleDelete(product.id)} className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md">
                    <FaTrash className="mr-2" /> Delete
                  </button>
                  <button onClick={() => handleUpdate(product)} className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md">
                    <FaEdit className="mr-2" /> Update
                  </button>
                </div>
                {updatingProduct && updatingProduct.id === product.id && (
                  <form onSubmit={handleUpdateSubmit} className="mt-4">
                    <h2 className="text-xl font-bold mb-2">Update Product</h2>
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="update-name">
                        Name
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="update-name"
                        type="text"
                        placeholder="Product Name"
                        name="name"
                        value={updatedProductData.name}
                        onChange={handleUpdatedProductChange}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="update-description">
                        Description
                      </label>
                      <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="update-description"
                        placeholder="Product Description"
                        name="description"
                        value={updatedProductData.description}
                        onChange={handleUpdatedProductChange}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="update-price">
                        Price
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="update-price"
                        type="number"
                        placeholder="Product Price"
                        name="price"
                        value={updatedProductData.price}
                        onChange={handleUpdatedProductChange}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="update-stock">
                        Stock
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="update-stock"
                        type="number"
                        placeholder="Product Stock"
                        name="stock"
                        value={updatedProductData.stock}
                        onChange={handleUpdatedProductChange}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="update-category">
                        Category
                      </label>
                      <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="update-category"
                        name="category"
                        value={updatedProductData.category}
                        onChange={handleUpdatedProductChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Update
                    </button>
                  </form>
                )}
                 {/* Display the count of users who watched this product */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
