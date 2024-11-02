import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/user/verify', {
        headers: {
          Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        if (!token.startsWith('Bearer ')) {
          localStorage.setItem('userToken', `Bearer ${token}`);
        }
      } else {
        localStorage.removeItem('userToken');
        setUser(null);
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      localStorage.removeItem('userToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshToken();
    const intervalId = setInterval(refreshToken, 14 * 60 * 1000); // Refresh every 14 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/user/login', { email, password });
      if (response.data.success) {
        const { token, ...userData } = response.data;
        const tokenToStore = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        localStorage.setItem('userToken', tokenToStore);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/user/register', userData);
      const { token, ...user } = response.data;
      localStorage.setItem('userToken', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/api/user/profile/update', userData);
      if (response.data.success) {
        setUser(prev => ({
          ...prev,
          ...response.data.user
        }));
        return { success: true };
      }
      return { 
        success: false, 
        message: response.data.message 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Update failed' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 