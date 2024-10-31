import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    Men: ["T-Shirts", "Jeans", "Shirts", "Hoodies"],
    Women: ["Dresses", "Tops", "Skirts", "Pants"],
    Kids: ["Boys", "Girls", "Infants"],
    Accessories: ["Bags", "Jewelry", "Hats", "Scarves"],
  };

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/product/${id}`);
        if (response.data.success) {
          const product = response.data.product;
          setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            subcategory: product.subcategory,
            sizes: product.sizes,
            image: product.image,
            stock: product.stock || {}
          });
          setImagePreview(Array.isArray(product.image) ? product.image[0] : product.image);
        }
      } catch (error) {
        toast.error("Failed to fetch product details");
        navigate("/products-list");
      }
    };
    fetchProduct();
  }, [id, navigate]);

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
      
      // Convert stock object to array of entries for MongoDB Map
      const stockEntries = Object.entries(formData.stock).map(([size, quantity]) => ({
        size,
        quantity: parseInt(quantity)
      }));

      const dataToSend = {
        ...formData,
        stock: JSON.stringify(stockEntries)
      };

      // Append all form data
      Object.keys(dataToSend).forEach(key => {
        if (key === 'sizes') {
          formDataToSend.append(key, JSON.stringify(dataToSend[key]));
        } else if (key === 'image') {
          // Only append image if it's a File object (new upload)
          if (dataToSend[key] instanceof File) {
            formDataToSend.append(key, dataToSend[key]);
          }
        } else {
          formDataToSend.append(key, dataToSend[key]);
        }
      });

      const response = await api.put(`/api/product/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        toast.success("Product updated successfully");
        navigate("/products-list");
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-light text-gray-900 mb-12 tracking-tight">
          Update Product
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  id="productName"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  id="productPrice"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-6">Categories</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Category</option>
                  {Object.keys(categories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Subcategory</option>
                  {formData.category &&
                    categories[formData.category].map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-6">Available Sizes</h3>
            <div className="flex flex-wrap gap-4">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded-md ${
                    formData.sizes.includes(size)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Section */}
          {formData.sizes.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-6">Stock Quantities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.sizes.map((size) => (
                  <div key={size} className="group">
                    <label htmlFor={`stock-${size}`} className="block text-sm font-medium text-gray-700 mb-2">
                      {size}
                    </label>
                    <input
                      id={`stock-${size}`}
                      type="number"
                      min="0"
                      value={formData.stock[size] || ''}
                      onChange={(e) => handleStockChange(size, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="0"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-6">Product Image</h3>
            <div className="flex items-center space-x-6">
              {imagePreview && (
                <div className="w-32 h-32 relative">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full md:w-auto px-8 py-3 rounded-full bg-indigo-500 text-white font-medium 
              transition-all duration-300 transform hover:scale-105 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
          >
            {isLoading ? 'Updating Product...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
