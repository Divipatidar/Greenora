import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import cartServices from '../Services/CartServices';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { auth } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isLoggedIn && auth.user?.id) {
      loadCart();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [auth.isLoggedIn, auth.user?.id]);

  const loadCart = async () => {
    if (!auth.isLoggedIn || !auth.user?.id) return;
    
    try {
      setLoading(true);
      const cartData = await cartServices.getCart(auth.user.id);
      
      let items = [];
      if (cartData && Array.isArray(cartData.items)) {
        items = cartData.items;
      }
      
      items = items.map(item => ({
        id: item.product.id,
        cartItemId: item.id, 
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.image,
        category: item.product.category.name,
        rating: item.product.ecoRating,
        reviews: item.product.reviews || 0,
        originalPrice: item.product.originalPrice || 0,
        discount: item.product.discount || 0,
        organic: item.product.ecoRating >= 4,
        inStock: item.product.stockStatus === 'IN_STOCK'
      }));
      
      setCartItems(items);
      setCartCount(items.reduce((total, item) => total + (item.quantity || 1), 0));
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!auth.isLoggedIn || !auth.user?.id) {
      throw new Error('User must be logged in to add items to cart');
    }

    try {
      await cartServices.addToCart(auth.user.id, productId, quantity);
      await loadCart(); 
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!auth.isLoggedIn || !auth.user?.id) return;

    try {
      await cartServices.updateCartItem(auth.user.id, productId, quantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const removeFromCart = async (userId, itemId) => {
    if (!auth.isLoggedIn || !auth.user?.id) return;

    try {
      await cartServices.removeFromCart(userId, itemId);
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!auth.isLoggedIn || !auth.user?.id) return;

    try {
      await cartServices.clearCart(auth.user.id);
      setCartItems([]);
      setCartCount(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};