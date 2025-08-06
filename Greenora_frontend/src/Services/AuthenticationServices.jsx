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

const jwt =localStorage.getItem('token');

const API_URL = 'http://localhost:8080/users';
export const signup  = async (user) => {
    try {      
    const response = await axios.post(API_URL+'/signup', user);
    return response.data; 
  } catch (error) {
    console.error('Error signing up:', error);
    
  } 
} 

export const login = async (credentials) => {
  try {
    const response = await axios.post(API_URL+'/login', credentials);
    return response.data; 
  } catch (error) { 
    console.error('Error logging in:', error);
   
  }
}
export const logout = () => {
  // Implement logout logic if needed, e.g., clearing tokens or user data
  localStorage.removeItem('token');
  console.log('User logged out');
}
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, userData);
    return response.data; 
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export const getuserbyid = async (userId) =>  {
    try {
    const response = await axios.get(`${API_URL}/${userId}`,{
      headers: {
        Authorization : `Bearer ${jwt}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching user by ID:', error);
  } 
}
export const addVendor= async(vendor)=>{
  try {      
    const response = await axios.post(API_URL+'/vendor', vendor);
    return response.data; 
  } catch (error) {
    console.error('Error in vedor adding ', error);
    
  } 
}

const authenticationServices = {
  signup,
  login,
  logout,
  updateUser,
  getuserbyid,
  addVendor
};

export default authenticationServices;