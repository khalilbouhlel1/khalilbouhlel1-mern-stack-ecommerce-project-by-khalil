import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
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

export const newsletterService = {
  subscribe: async (email) => {
    try {
      const response = await api.post('/api/newsletter/subscribe', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api; 