import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const ShopContext = createContext();

const initialState = {
  cart: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null
};

const shopReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
      
    case 'UPDATE_CART':
      return {
        ...state,
        cart: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
      
    case 'CLEAR_CART':
      return { ...initialState };
      
    default:
      return state;
  }
};

export const ShopProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, initialState);
  const { user } = useAuth();

  const getCartKey = () => {
    return user ? `cart_${user._id}` : 'cart_guest';
  };

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
      dispatch({ type: 'UPDATE_CART', payload: savedCart });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, [user]);

  const addToCart = (product, size, quantity) => {
    try {
      const updatedCart = [...state.cart];
      const existingItemIndex = updatedCart.findIndex(
        item => item.productId === product._id && item.size === size
      );

      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: Array.isArray(product.image) ? product.image[0] : product.image,
          size,
          quantity,
          userId: user?._id
        });
      }

      localStorage.setItem(getCartKey(), JSON.stringify(updatedCart));
      dispatch({ type: 'UPDATE_CART', payload: updatedCart });
      toast.success('Added to cart successfully!');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = (productId, size) => {
    try {
      const updatedCart = state.cart.filter(
        item => !(item.productId === productId && item.size === size)
      );
      localStorage.setItem(getCartKey(), JSON.stringify(updatedCart));
      dispatch({ type: 'UPDATE_CART', payload: updatedCart });
      dispatchCartUpdateEvent();
      toast.success('Item removed from cart');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to remove item from cart');
    }
  };

  const dispatchCartUpdateEvent = () => {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const updateQuantity = (productId, size, quantity) => {
    try {
      const updatedCart = state.cart.map(item => {
        if (item.productId === productId && item.size === size) {
          return { ...item, quantity: Math.max(1, quantity) };
        }
        return item;
      });
      localStorage.setItem(getCartKey(), JSON.stringify(updatedCart));
      dispatch({ type: 'UPDATE_CART', payload: updatedCart });
      dispatchCartUpdateEvent();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = () => {
    localStorage.removeItem(getCartKey());
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <ShopContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
