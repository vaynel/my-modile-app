import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';  // 이 부분을 수정합니다.
import axios from 'axios';
import { login as loginService, register as registerService } from '../services/authService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/token', { withCredentials: true });
        const { token } = response.data;
        if (token) {
          localStorage.setItem('token', token);
          const decodedToken = jwtDecode(token);
          setUser(decodedToken);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    } else {
      fetchToken();
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { token } = await loginService(email, password);
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      await registerService(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
