import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const productListRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const categories = {
    all: 'All Products',
    Men: 'Men',
    Women: 'Women',
    Kids: 'Kids',
    Accessories: 'Accessories'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/product/list');
        
        if (response.data.success) {
          setProducts(response.data.products);
          
          setTimeout(() => {
            if (productListRef.current?.children) {
              gsap.fromTo(
                productListRef.current.children,
                { opacity: 0, y: 20 },
                { 
                  opacity: 1, 
                  y: 0, 
                  duration: 0.5, 
                  stagger: 0.1,
                  ease: 'power3.out'
                }
              );
            }
          }, 0);
        } else {
          throw new Error(response.data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
        toast.error('Error loading products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await api.delete(`/api/product/delete/${productToDelete}`);
      if (response.data.success) {
        setProducts(prevProducts => 
          prevProducts.filter(product => product._id !== productToDelete)
        );
        toast.success('Product deleted successfully');
      } else {
        throw new Error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">
            Products <span className="text-gray-400">({filteredProducts.length})</span>
          </h1>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border-b border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-300"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border-b border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-300"
            >
              {Object.entries(categories).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div 
          ref={productListRef}
          className="flex flex-wrap gap-8"
        >
          {filteredProducts.map((product) => (
            <div 
              key={product._id}
              className="group relative bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 w-[200px]"
            >
              <div className="w-[200px] h-[150px] overflow-hidden">
                <img
                  src={Array.isArray(product.image) ? product.image[0] : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <p className="text-indigo-600 font-medium">{product.price} dt</p>
                
                {/* Action buttons */}
                <div className="mt-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-full hover:bg-red-50 transition-colors duration-300"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/update-product/${product._id}`}
                    className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50 transition-colors duration-300"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 transform transition-all">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg 
                  className="h-6 w-6 text-red-600" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-center mb-4">Delete Product</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProducts;