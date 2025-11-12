import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    return savedUser && savedToken ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [checkedOnce, setCheckedOnce] = useState(false);

  useEffect(() => {
    if (!checkedOnce) checkAuthStatus();
  }, [checkedOnce]);

  // ✅ Check if user is authenticated using JWT
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        setCheckedOnce(true);
        return;
      }

      const response = await api.get('/api/auth/me');
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('✅ User authenticated:', response.data.user.name);
      } else {
        // Token is invalid or expired
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.log('❌ Auth check failed:', error.response?.status);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
      setCheckedOnce(true);
    }
  };

  // ✅ Login with JWT
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      console.log('✅ Login successful');
      return { success: true, user };
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data?.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  // ✅ Register with JWT
  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      console.log('✅ Registration successful');
      return { success: true, user };
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data?.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  // ✅ Logout (JWT - just remove local storage)
  const logout = () => {
    console.log('🚪 Logging out...');
    
    // Remove tokens and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    console.log('✅ Logout complete, redirecting to home...');
    navigate('/'); // Redirect to Landing Page
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}