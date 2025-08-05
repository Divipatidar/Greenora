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

const API_URL = 'http://localhost:8080/coupons';

export const create = async (coupon) => {
  try {
    const response = await axios.post(API_URL, coupon);
    return response.data;
  } catch (error) {
    console.error("Error in create coupon", error);
    throw error;
  }
}

export const updateCoupon = async (couponId, coupon) => {
  try {
    const response = await axios.put(`${API_URL}/${couponId}`, coupon);
    return response.data;
  } catch (error) {
    console.error("Error in update coupon", error);
    throw error;
  }
}

export const deleteCoupon = async (couponId) => {
  try {
    const response = await axios.delete(`${API_URL}/${couponId}`);
    return response.data;
  } catch (error) {
    console.error("Error in delete coupon", error);
    throw error;
  }
}

export const validateCoupon = async (code, amount) => {
  try {
    const response = await axios.get(`${API_URL}/validate`, {
      params: { code, amount }
    });
    return response.data;
  } catch (error) {
    console.error("Error in validate coupon", error);
    throw error;
  }
}

export const fetchActiveCoupon = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return response.data;
  } catch (error) {
    console.error("Error in fetch active coupon", error);
    throw error;
  }
}

const couponServices = {
  create,
  fetchActiveCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
};

export default couponServices;
