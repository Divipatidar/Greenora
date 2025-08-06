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

export const validateCoupon = async (code, orderAmount) => {
  try {
    const response = await axios.get(`${API_URL}/validate`, {
      params: { code, orderAmount }
    });
    
    // Handle the new response format
    const couponData = response.data;
    
    if (couponData && couponData.active) {
      // Check if order amount meets minimum requirement
      if (orderAmount >= couponData.minOrderAmt) {
        return {
          valid: true,
          coupon: couponData,
          discount: couponData.discountValue,
          discountType: couponData.discountType || 'percentage', // percentage or fixed
          minOrderAmt: couponData.minOrderAmt,
          validFrom: couponData.validFrom,
          validUntil: couponData.validUntil
        };
      } else {
        return {
          valid: false,
          error: `Minimum order amount of ₹${couponData.minOrderAmt} required`
        };
      }
    } else {
      return {
        valid: false,
        error: 'Invalid or inactive coupon code'
      };
    }
  } catch (error) {
    console.error('Error in validate coupon', error);
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
