import axios from 'axios';
const API_URL = 'http://localhost:8080/email';

const token = localStorage.getItem('token');
export const sendEmail = async (emailData) => {
  try {
    const response = await axios.post(`${API_URL}/send`, emailData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error in sending email", error);
    throw error;
  }
}
