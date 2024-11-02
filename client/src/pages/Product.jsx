import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useShop } from '../context/ShopContext';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useShop();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/product/${id}`);
        if (response.data.success) {
          setProduct(response.data.product);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1); // Reset quantity when size changes
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, product?.stock[selectedSize] || 1));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, quantity);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={Array.isArray(product.image) ? product.image[0] : product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-light text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-2xl font-medium text-indigo-600">{product.price} dt</span>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>

            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    disabled={!product.stock[size]}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-indigo-500 text-white'
                        : product.stock[size]
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            {selectedSize && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500">
                    {product.stock[selectedSize]} available
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              disabled={!selectedSize}
              onClick={handleAddToCart}
              className={`w-full md:w-auto px-8 py-3 rounded-full font-medium transition-all duration-300 
                ${
                  selectedSize
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
              {selectedSize ? 'Add to Cart' : 'Select a Size'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;