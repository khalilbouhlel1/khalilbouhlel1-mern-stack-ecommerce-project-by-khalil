import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavBar = ({ setToken }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex justify-between items-center px-4 py-3">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h1 className="text-lg font-medium text-gray-700">
            <span className="text-indigo-600">Fripika</span> Admin
          </h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-all duration-200"
          >
            <span className="font-medium">Logout</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </nav>

      <div
        className={`fixed top-[57px] left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-40`}
      >
        <div className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/products-list"
                className={({ isActive }) =>
                  `block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : ''
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
                  `block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : ''
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
                  `block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : ''
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
                  `block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : ''
                  }`
                }
              >
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/newsletter"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm ${
                    isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <span className="ml-3">Newsletter</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

NavBar.propTypes = {
  setToken: PropTypes.func.isRequired
};

export default NavBar;