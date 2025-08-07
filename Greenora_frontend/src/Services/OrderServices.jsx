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

const API_URL = 'http://localhost:8080/orders';



export const placeOrder = async ({ userId, addressId, couponId }) => {
  try {
    let url = `${API_URL}/user/${userId}/address/${addressId}`;
    
    // If couponId is provided, add it as a query param
    if (couponId) {
      url += `?couponId=${couponId}`;
    }

    const response = await axios.post(url); // No body, since your API doesn't expect one
    return response.data;
  } catch (error) {
    console.error('Error in place order:', error);
    throw error;
  }
};


export const getOrderByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error in get order by user:', error);
    throw error;
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error in get order:', error);
    throw error;
  }
};



const OrderServices = {
  getOrder,
  placeOrder,
  getOrderByUser,
};

export default OrderServices;