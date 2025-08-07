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

const API_URL = 'http://localhost:8080/address';

export const addAddress = async (address, userId) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}`, address);
    return response.data;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

export const updateAddress = async (addressId, address) => {
  try {
    const response = await axios.put(`${API_URL}/${addressId}`, address);
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const response = await axios.delete(`${API_URL}/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};
export const getbyid = async (addressId) => {
  try {
    const response = await axios.get(`${API_URL}/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting address by ID:', error);
    throw error;
  }
};


const addressService = {
  addAddress,
  updateAddress,
  deleteAddress,
  getbyid,
};

export default addressService;