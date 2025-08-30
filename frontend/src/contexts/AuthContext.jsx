import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

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
    // Check if user is logged in on app start
    try {
      const currentUser = apiService.getCurrentUser();
      if (currentUser && apiService.isAuthenticated()) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('AuthContext: Error getting current user:', error);
      // Clear potentially corrupted data
      apiService.clearStorage();
    }
    setLoading(false);

    // Listen for token refresh events
    const handleTokenRefresh = (event) => {
      console.log('Token refreshed, updating user session');
      // Token was refreshed, user session is still valid
      const currentUser = apiService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };

    // Listen for token expiry events
    const handleTokenExpiry = () => {
      console.log('Token expired, logging out user');
      setUser(null);
      apiService.clearStorage();
    };

    // Add event listeners
    window.addEventListener('tokenRefreshed', handleTokenRefresh);
    window.addEventListener('tokenExpired', handleTokenExpiry);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefresh);
      window.removeEventListener('tokenExpired', handleTokenExpiry);
    };
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Attempting login...');
      const response = await apiService.login(credentials);
      console.log('AuthContext: Login response:', response);
      setUser(response.user);
      console.log('AuthContext: User set to:', response.user);
      return response;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
