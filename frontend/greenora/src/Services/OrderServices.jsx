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

const API_URL = 'http://localhost:8080/orders';
export const placeOrder = async( userId,addressId,couponId) =>{
      try{
        const response= axios.post(`${API_URL}/user/${userId}/address/${addressId}/coupon/${couponId}`)
        return response;
      }
      catch(error){
        console.error('Error in place order:', error);
        throw error;
      }
}
export const getOrderByUser=async(userId)=>{
    try{
        const response= axios.get(`${API_URL}/user/${userId}`)
        return response;
      }
      catch(error){
        console.error('Error in place order:', error);
        throw error;
      }
}
export const getOrder=async(orderId)=>{
    try{
        const response= axios.get(`${API_URL}/${orderId}`)
        return response;
      }
      catch(error){
        console.error('Error in place order:', error);
        throw error;
      }
}
const OrderServices={
    getOrder,
    placeOrder,
    getOrderByUser
}
export default OrderServices;