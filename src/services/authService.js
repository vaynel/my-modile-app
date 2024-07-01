import axios from 'axios';

// 환경 변수를 사용하여 API URL 설정
const API_URL =  "http://localhost:" + process.env.REACT_APP_SERVER_PORT + "/api";

// CSRF 토큰을 가져오는 함수
const getCsrfToken = async () => {
  const response = await axios.get(`${API_URL}/csrf-token`, { withCredentials: true });
  return response.data.csrfToken;
};

export const register = async (email, password) => {
  try {
    const csrfToken = await getCsrfToken();
    const result = await axios.post(`${API_URL}/register`, { email, password }, {
      headers: {
        'CSRF-Token': csrfToken
      },
      withCredentials: true
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const csrfToken = await getCsrfToken();
    const result = await axios.post(`${API_URL}/login`, { email, password }, {
      headers: {
        'CSRF-Token': csrfToken
      },
      withCredentials: true
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};
