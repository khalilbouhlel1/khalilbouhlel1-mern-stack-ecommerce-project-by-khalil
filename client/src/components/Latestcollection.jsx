import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBox } from 'react-icons/fa';

const LatestCollection = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getProducts();
        
        if (response.success) {
          const latestProducts = response.products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8);
          
          setProducts(latestProducts);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-light mb-2 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Latest Collection
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Discover our newest arrivals, featuring the latest trends and timeless pieces
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link 
              key={product._id} 
              to={`/product/${product._id}`}
              className="group relative block overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={Array.isArray(product.image) ? product.image[0] : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white p-1.5 rounded-full shadow-md">
                    <FaShoppingCart className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm font-medium text-indigo-600">{product.price} dt</p>
                  <span className="text-xs text-gray-500">
                    {Object.values(product.stock || {}).reduce((a, b) => a + b, 0)} left
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <FaBox className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">No products available.</p>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/collection"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-sm rounded-full 
                     font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            View All Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestCollection;