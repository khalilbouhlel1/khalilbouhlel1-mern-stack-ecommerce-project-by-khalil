import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import NavBar from './components/navBar';
import AddProducts from './pages/addProducts';
import ListProducts from './pages/listProducts';
import Orders from './pages/Orders';
import Login from './pages/login';
import UpdateProduct from './pages/updateProduct';
import UsersList from './pages/usersList';
import UpdateUser from './pages/updateUser';
import Newsletter from './pages/Newsletter';
import api from './services/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isVerifying, setIsVerifying] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await api.get('/api/user/verify-admin');

        if (!response.data.success) {
          localStorage.removeItem('token');
          setToken(null);
        } else {
          localStorage.setItem('token', token);
        }
      } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        {token ? (
          <>
            <NavBar onMenuClick={handleMenuClick} setToken={setToken} />
            <aside className="fixed left-0 top-16 w-64 h-full bg-white border-r border-gray-200 hidden lg:block">
              <nav className="mt-8">
                <ul className="space-y-2 px-4">
                  <li>
                    <NavLink
                      to="/products-list"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                          isActive ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                        }`
                      }
                    >
                      Products List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/add-products"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                          isActive ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                        }`
                      }
                    >
                      Add Product
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/users-list"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                          isActive ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                        }`
                      }
                    >
                      Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/orders"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                          isActive ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                        }`
                      }
                    >
                      Orders
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </aside>
            <main className="lg:ml-64 pt-16 p-8 transition-all duration-300">
              <Routes>
                <Route path="/" element={<Navigate to="/products-list" replace />} />
                <Route path="/add-products" element={<AddProducts />} />
                <Route path="/products-list" element={<ListProducts />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/update-product/:id" element={<UpdateProduct />} />
                <Route path="/users-list" element={<UsersList />} />
                <Route path="/update-user/:id" element={<UpdateUser />} />
                <Route path="/newsletter" element={<Newsletter />} />
              </Routes>
            </main>
          </>
        ) : (
          <Login setToken={setToken} />
        )}
      </div>
      <ToastContainer />
    </ErrorBoundary>
  );
};

export default App;