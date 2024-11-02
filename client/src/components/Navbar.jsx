import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa'
import { useShop } from '../context/ShopContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems } = useShop();

  return (
    <header className='bg-white shadow-md fixed w-full top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link to="/" className='text-2xl font-bold'>
              <span className='bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent'>Fripi</span>
              <span className='bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent'>Ka</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8'>
            <Link to="/" className='text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all'>
              Home
            </Link>
            <Link to="/collection" className='text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all'>
              Collection
            </Link>
            <Link to="/about" className='text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all'>
              About
            </Link>
            <Link to="/contact" className='text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all'>
              Contact
            </Link>
          </nav>

          {/* Right side icons */}
          <div className='flex items-center space-x-4'>
            {/* Search - Hidden on mobile */}
            <div className='hidden md:flex items-center relative'>
              <input
                type="text"
                placeholder="Search..."
                className='w-full bg-gray-100 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all'
              />
              <FaSearch className='absolute right-3 text-gray-500' />
            </div>

            {/* Account */}
            <Link to="/account" className='text-gray-600 hover:text-gray-900'>
              <FaUser className='h-5 w-5' />
            </Link>

            {/* Cart */}
            <div className="relative">
              <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                <FaShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden text-gray-600 hover:text-gray-900 focus:outline-none'
            >
              {isMenuOpen ? <FaTimes className='h-6 w-6' /> : <FaBars className='h-6 w-6' />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t'>
              <Link 
                to="/" 
                className='text-gray-600 hover:text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-all'
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/collection" 
                className='text-gray-600 hover:text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-all'
                onClick={() => setIsMenuOpen(false)}
              >
                Collection
              </Link>
              <Link 
                to="/about" 
                className='text-gray-600 hover:text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-all'
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className='text-gray-600 hover:text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-all'
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {/* Mobile Search */}
              <div className='relative mt-3 px-3'>
                <input
                  type="text"
                  placeholder="Search..."
                  className='w-full bg-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200'
                />
                <FaSearch className='absolute right-6 top-2.5 text-gray-500' />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar