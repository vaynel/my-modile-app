import axios from 'axios';

// const API_URL =`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api`
// const API_URL = process.env.REACT_APP_API_URL;
const API_URL ="http://localhost:"+ process.env.REACT_APP_SERVER_PORT+"/api";

export const register = async (email, password) => {
  try {
    
    const response = await axios.post(`${API_URL}/register`, { email, password });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    console.log(API_URL);
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
