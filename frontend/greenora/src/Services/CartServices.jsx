import axios from 'axios';

// Add Axios interceptor to attach JWT token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const API_URL = 'http://localhost:8080/cart';

export const getCart = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axios.post(API_URL, {
      productId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await axios.put(`${API_URL}/${itemId}`, {
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

export const removeFromCart = async (itemId) => {
  try {
    const response = await axios.delete(`${API_URL}/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

export const clearCart = async () => {
  try {
    const response = await axios.delete(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

export const getCartTotal = async () => {
  try {
    const response = await axios.get(`${API_URL}/total`);
    return response.data;
  } catch (error) {
    console.error('Error getting cart total:', error);
    throw error;
  }
}

const cartServices = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartTotal
};

export default cartServices;