import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import Product from './pages/Product'
import Cart from './pages/Cart'
import { ShopProvider } from './context/ShopContext';
import { AppError, handleApiError } from './utils/errorHandler';
import ErrorBoundary from './components/ErrorBoundary'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
const App = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <ErrorBoundary>
          <div className='min-h-screen'>
            <Navbar />
            <main className='pt-16'>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
              <Footer />
            </main>
            <ToastContainer position="bottom-right" />
          </div>
        </ErrorBoundary>
      </ShopProvider>
    </AuthProvider>
  )
}

export default App