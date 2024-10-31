import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import PropTypes from 'prop-types';

const StockSection = ({ sizes, stock, onStockChange }) => (
  <div className="mt-8">
    <span className="block text-sm font-medium text-gray-600 mb-4">
      Stock Quantities
    </span>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {sizes.map(size => (
        <div key={size} className="group transition-all duration-300">
          <label htmlFor={`stock-${size}`} className="block text-sm font-medium text-gray-600 mb-2">
            {size}
          </label>
          <input
            id={`stock-${size}`}
            type="number"
            min="0"
            value={stock[size] || ''}
            onChange={(e) => onStockChange(size, e.target.value)}
            className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-indigo-500 focus:ring-0 transition-colors duration-300"
            placeholder="0"
            required
          />
        </div>
      ))}
    </div>
  </div>
);

StockSection.propTypes = {
  sizes: PropTypes.arrayOf(PropTypes.string).isRequired,
  stock: PropTypes.object.isRequired,
  onStockChange: PropTypes.func.isRequired
};

const AddProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    sizes: [],
    image: null,
    stock: {}
  });

  const categories = {
    Men: ["T-Shirts", "Jeans", "Shirts", "Hoodies", "Jackets", "Sweaters", "Sweatshirts", "Trousers"],
    Women: ["Dresses", "Tops", "Skirts", "Pants", "Jackets", "Sweaters", "Sweatshirts", "Trousers"],
    Kids: ["Boys", "Girls", "Infants", "T-Shirts", "Jeans", "Shirts", "Hoodies", "Jackets", "Sweaters", "Sweatshirts", "Trousers"],
    Accessories: ["Bags", "Jewelry", "Hats", "Scarves", "Belts", "Sunglasses", "Wallets"],
  };

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];

      // Update stock object
      const newStock = { ...prev.stock };
      if (!prev.sizes.includes(size)) {
        // If adding a size, initialize stock to 0
        newStock[size] = 0;
      } else {
        // If removing a size, delete its stock entry
        delete newStock[size];
      }

      return {
        ...prev,
        sizes: newSizes,
        stock: newStock
      };
    });
  };

  const handleStockChange = (size, value) => {
    const stockValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: stockValue
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === "sizes") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await api.post('/api/product/', formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Product added successfully");
        // Reset form
        setFormData({
          name: "",
          price: "",
          description: "",
          category: "",
          subcategory: "",
          sizes: [],
          image: null,
          stock: {}
        });
        setImagePreview(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-light text-gray-900 mb-12 tracking-tight">
          Add New Product
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="group transition-all duration-300">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2 transition-colors group-focus-within:text-indigo-500">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-indigo-500 focus:ring-0 transition-colors duration-300"
                  required
                />
              </div>

              <div className="group transition-all duration-300">
                <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-2 transition-colors group-focus-within:text-indigo-500">
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-indigo-500 focus:ring-0 transition-colors duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="group transition-all duration-300">
                <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-2 transition-colors group-focus-within:text-indigo-500">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-indigo-500 focus:ring-0 transition-colors duration-300"
                  required
                >
                  <option value="">Select Category</option>
                  {Object.keys(categories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {formData.category && (
                <div className="group transition-all duration-300">
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-600 mb-2 transition-colors group-focus-within:text-indigo-500">
                    Subcategory
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-indigo-500 focus:ring-0 transition-colors duration-300"
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {categories[formData.category].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="group transition-all duration-300">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-2 transition-colors group-focus-within:text-indigo-500">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-indigo-500 focus:ring-0 transition-colors duration-300 resize-none"
              required
            />
          </div>

          {/* Sizes Section */}
          <div>
            <span className="block text-sm font-medium text-gray-600 mb-4">
              Available Sizes
            </span>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                    formData.sizes.includes(size)
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Section */}
          <div>
            {formData.sizes.length > 0 ? (
              <StockSection 
                sizes={formData.sizes}
                stock={formData.stock}
                onStockChange={handleStockChange}
              />
            ) : (
              <p className="text-sm text-gray-500 mt-4">
                Please select sizes to add stock quantities
              </p>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-600 mb-2">
              Product Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="image-upload" 
                aria-label="Click to upload product image"
                className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors duration-300 cursor-pointer"
              >
                <div className="space-y-2 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm text-gray-500">Drop an image here or click to upload</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 h-48 w-full object-cover rounded-lg shadow-md"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full md:w-auto px-8 py-3 rounded-full bg-indigo-500 text-white font-medium 
              transition-all duration-300 transform hover:scale-105 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
          >
            {isLoading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
