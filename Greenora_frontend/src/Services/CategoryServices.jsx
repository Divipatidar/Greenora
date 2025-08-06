import axios from 'axios';

const API_URL = 'http://localhost:8080/categories';

export const fetchCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Assuming the API returns an array of categories
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export const addCategory = async (category) => {
  try {
    const response = await axios.post(API_URL, category);
    return response.data; // Assuming the API returns the added category
  } catch (error) {
    console.error('Error adding category:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export const updateCategory = async (categoryId, category) => {
  try {
    const response = await axios.put(`${API_URL}/${categoryId}`, category);
    return response.data; // Assuming the API returns the updated category
  } catch (error) {
    console.error('Error updating category:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}


export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_URL}/${categoryId}`);
    return response.data; // Assuming the API returns a success message or status
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}
const  categoryServices={
    fetchCategories,
    deleteCategory,
    addCategory,
    updateCategory
}

export default categoryServices;