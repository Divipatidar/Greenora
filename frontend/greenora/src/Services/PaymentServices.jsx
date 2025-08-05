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

const API_URL = 'http://localhost:8080/payment';

export const makePayment=async(payment)=>{
    try{
       const  response= axios.post(`${API_URL}`,payment);
       return response;
    }
    catch (error) {
    console.error('Error in make payment:', error);
    throw error; 
     }
}
export const getOrder=async(orderId)=>{
    try{
       const  response= axios.get(`${API_URL}/order/${orderId}`);
       return response;
    }
    catch (error) {
    console.error('Error in get order in  payment:', error);
    throw error; 
     }  
}


const paymentServices={
    getOrder,
    makePayment
}
export default paymentServices;