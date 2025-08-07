import axios from 'axios';

const API_URL = 'http://localhost:8080/categories';

export const fetchCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; 
  }
}

export const addCategory = async (category) => {
  try {
    const response = await axios.post(API_URL, category);
    return response.data; 
  } catch (error) {
    console.error('Error adding category:', error);
    throw error; 
  }
}

export const updateCategory = async (categoryId, category) => {
  try {
    const response = await axios.put(`${API_URL}/${categoryId}`, category);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error; 
  }
}


export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_URL}/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error; 
  }
}
const  categoryServices={
    fetchCategories,
    deleteCategory,
    addCategory,
    updateCategory
}

export default categoryServices;