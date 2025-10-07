import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Axios configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🟡 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log(`🟢 API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('🔴 API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        await verifyToken();
      }
    } catch (error) {
      console.error('🔴 Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    try {
      const response = await API.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('🔴 Token verification failed:', error.response?.data?.message);
      logout();
    }
  };

  const register = async (userData) => {
    try {
      console.log('🟡 Starting registration process...', userData);
      
      const response = await API.post('/auth/register', userData);
      
      if (response.data.success) {
        console.log('🟢 Registration successful!', response.data.user);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        
        return { 
          success: true, 
          user: response.data.user,
          message: response.data.message 
        };
      }
    } catch (error) {
      console.error('🔴 Registration failed:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Registration failed. Please try again.';
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Login failed. Please try again.';
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const logout = () => {
    console.log('🟡 Logging out user...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};