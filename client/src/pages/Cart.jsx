import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useShop } from '../context/ShopContext';

const Cart = () => {
  const { cart, totalAmount, removeFromCart, updateQuantity } = useShop();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (index, newQuantity) => {
    try {
      setIsUpdating(true);
      const item = cart[index];
      await updateQuantity(item.productId, item.size, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/"
            className="inline-block bg-indigo-500 text-white px-8 py-3 rounded-full hover:bg-indigo-600 transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-light text-gray-900 mb-8">Shopping Cart</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.map((item, index) => (
              <div key={`${item.productId}-${item.size}`} className="flex items-center p-4 mb-4 bg-white rounded-lg shadow">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-500">Size: {item.size}</p>
                  <p className="text-indigo-600 font-medium">{item.price} dt</p>
                  
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        disabled={isUpdating}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        disabled={isUpdating}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{totalAmount} dt</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{totalAmount} dt</span>
                </div>
              </div>
              <button
                className="w-full bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition-colors duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;