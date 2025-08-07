import axios from 'axios';

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

const API_URL = 'http://localhost:8080/products';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; 
  }
}

export const addProduct = async (product,categoryId) => {
  try {
    const response = await axios.post(`${API_URL}/${categoryId}`, product);
    return response.data; 
  } catch (error) {
    console.error('Error adding product:', error);
    throw error; 
  }
}
export const updateProduct = async (productId, product) => {
  try {
    const response = await axios.put(`${API_URL}/${productId}`, product);
    return response.data; 
  } catch (error) {
    console.error('Error updating product:', error);
    throw error; 
  }
}

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error; 
  }
}

export const getbycategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/category/${categoryId}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error; 
  }
}
export const getbyproductname = async (productName) => {
  try {
    const response = await axios.get(`${API_URL}/name/${productName}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching products by name:', error);
    throw error; 
  }
}
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/${productId}`);
    return response.data; 
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error; 
  }
}

// Wishlist functionality
export const addToWishlist = async (productId) => {
  try {
    const response = await axios.post(`${API_URL}/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
}

export const removeFromWishlist = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
}

export const getWishlist = async () => {
  try {
    const response = await axios.get(`${API_URL}/wishlist`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
}

export const isInWishlist = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/wishlist/check/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    throw error;
  }
}
export const vendorProducts=async(id)=>{
  try {
    const response = await axios.get(`${API_URL}/vendor/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error; 
  }
}

const productServices = {
  fetchProducts,
  addProduct,
  updateProduct,
  getProductById,
  getbycategory,
  getbyproductname,
  deleteProduct,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isInWishlist,
  vendorProducts
};

export default productServices;