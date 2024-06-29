import axios from 'axios';


//const API_URL = 'http://localhost:5000/api/posts';
const API_URL ="http://localhost:"+ process.env.REACT_APP_SERVER_PORT+"/api/posts";


export const getPosts = async () => {
  console.log(API_URL)
  const response = await axios.get(API_URL);
  return response.data;
};

export const getPost = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, postData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
