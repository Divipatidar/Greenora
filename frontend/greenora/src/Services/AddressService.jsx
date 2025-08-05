import axios from 'axios';

const API_URL = 'http://localhost:8080/address';
export const addAddress = async (address,userId) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}`, address);
    return response.data; // Assuming the API returns the added address
  } catch (error) {
    console.error('Error adding address:', error);
    throw error; // Re-throw the error for further handling if needed
  }

}
export const updateAddress = async (addressId, address) => {
  try {
    const response = await axios.put(`${API_URL}/${addressId}`, address);
    return response.data; // Assuming the API returns the updated address
  } catch (error) {
    console.error('Error updating address:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export const deleteAddress = async (addressId) => {
  try {
    const response = await axios.delete(`${API_URL}/${addressId}`);
    return response.data; // Assuming the API returns a success message or status
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}
const addressService = {
  addAddress,
  updateAddress,
  deleteAddress
};

export default addressService;