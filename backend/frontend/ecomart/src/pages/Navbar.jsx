import React, { useState, useEffect } from "react";
import { MenuIcon, UserCircleIcon, SearchIcon } from "@heroicons/react/solid";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://192.168.223.1:800/api/productsxx/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <nav className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
<a href="/home">
            <img 
  className="h-auto w-32 md:w-48 mx-auto mt-2"
  src="src\assets\Eco_Friend_Logo__2_-removebg-preview.png"
  alt="logo"
/></a>
              <div>

              </div>
              <div className="hidden md:block ml-9">
                <a
                  href="/home"
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Home
                </a>
                <a
                  href="/login"
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Signup
                </a>
                <a href="/about-us" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                  About Us

                </a>
                <a href="/contact-us" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                 Contact Us
                </a>
                <a href="/faq" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                 FaQ
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-gray-700 text-white px-3 py-1 pr-8 rounded-md focus:outline-none"
                />
                <SearchIcon className="h-5 w-5 absolute top-0 right-0 mt-2 mr-3" />
              </div>
              <a href="/profile">
                <UserCircleIcon className="h-6 w-6 text-white" />
              </a>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-400">
            <a
              href="#"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Login
            </a>
            <a
              href="#"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Signup
            </a>
            <a
              href="#"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Contact Us
            </a>
          </div>
          <div className="px-2 pt-2 pb-3 sm:px-3 bg-black">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-gray-700 text-white px-3 py-1 pr-8 rounded-md focus:outline-none"
              />
              <SearchIcon className="h-5 w-5 absolute top-0 right-0 mt-2 mr-3 bg-gray-200 rounded-2xl" />
            </div>
          </div>
          <div className="px-2 pt-2 pb-3 sm:px-3">
            <UserCircleIcon className="h-6 w-6 text-white" />
          </div>
        </div>
      )}
      {/* Display Products only when search term is entered */}
      {searchTerm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow"
              >
                <a href={`/product/${product.id}`} className="cursor-pointer">
                  <div className="flex-1 flex flex-col p-8">
                    <img
                      className="w-32 h-32 flex-shrink-0 mx-auto bg-black rounded-full"
                      src={product.image}
                      alt={product.name}
                    />
                    <h3 className="mt-6 text-gray-900 text-sm font-medium">
                      {product.name}
                    </h3>
                    <dl className="mt-1 flex-grow flex flex-col justify-between">
                      <dd className="text-gray-500 text-sm">
                        {product.description}
                      </dd>
                      <dd className="mt-3">
                        <span className="text-gray-900 font-medium">
                          {product.price}
                        </span>
                      </dd>
                    </dl>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
