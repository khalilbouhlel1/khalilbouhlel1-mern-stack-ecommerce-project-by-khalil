import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/user/${id}`);
        if (response.data.success) {
          const { name, email } = response.data.user;
          setFormData({ name, email });
        } else {
          throw new Error(response.data.message || 'Failed to fetch user details');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch user details');
        navigate('/users-list');
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put(`/api/user/update/${id}`, formData);
      if (response.data.success) {
        toast.success('User updated successfully');
        navigate('/users-list');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-light text-gray-900 mb-12 tracking-tight">
          Update User
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Updating...' : 'Update User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser; 