import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

// Request interceptor
api.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data?.message || 'An error occurred');
  }
);

export const productService = {
  getProducts: async () => {
    try {
      const response = await api.get('/api/product/list');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch products');
    }
  }
};

export default api; 