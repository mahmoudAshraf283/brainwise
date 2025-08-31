import axios from 'axios';

// API configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class ApiService {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              console.log('Attempting to refresh token...');
              const response = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
                refresh: refreshToken,
              });

              const { access } = response.data;
              localStorage.setItem('access_token', access);
              console.log('Token refreshed successfully');

              // Emit custom event to notify components about token refresh
              window.dispatchEvent(new CustomEvent('tokenRefreshed', { 
                detail: { token: access } 
              }));

              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Emit logout event
            window.dispatchEvent(new CustomEvent('tokenExpired'));
            // Refresh failed, redirect to login
            this.clearStorage();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  clearStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await api.post('/accounts/login/', credentials);
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.error || 'Login failed');
    }
  }

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/accounts/logout/', { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearStorage();
    }
  }

  async signup(userData) {
    try {
      const response = await api.post('/accounts/signup/', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.error || 'Signup failed');
    }
  }



  // Company methods
  async getCompanies() {
    try {
      const response = await api.get('/core/companies/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch companies');
    }
  }

  async getCompany(id) {
    try {
      const response = await api.get(`/core/companies/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch company');
    }
  }

  async createCompany(data) {
    try {
      const response = await api.post('/core/companies/', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create company');
    }
  }

  async updateCompany(id, data) {
    try {
      const response = await api.put(`/core/companies/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update company');
    }
  }

  async patchCompany(id, data) {
    try {
      const response = await api.patch(`/core/companies/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update company');
    }
  }

  async deleteCompany(id) {
    try {
      const response = await api.delete(`/core/companies/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete company');
    }
  }

  // Department methods
  async getDepartments(params = {}) {
    try {
      const response = await api.get('/core/departments/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch departments');
    }
  }

  async getDepartment(id) {
    try {
      const response = await api.get(`/core/departments/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch department');
    }
  }

  async createDepartment(data) {
    try {
      const response = await api.post('/core/departments/', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create department');
    }
  }

  async updateDepartment(id, data) {
    try {
      const response = await api.put(`/core/departments/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update department');
    }
  }

  async patchDepartment(id, data) {
    try {
      const response = await api.patch(`/core/departments/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update department');
    }
  }

  async deleteDepartment(id) {
    try {
      const response = await api.delete(`/core/departments/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete department');
    }
  }

    // Employee methods
  async getEmployees(filters = {}) {
    try {
      const response = await api.get('/core/employees/', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch employees');
    }
  }

  async getEmployee(id) {
    try {
      const response = await api.get(`/core/employees/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch employee');
    }
  }

  async createEmployee(data) {
    try {
      console.log('Creating employee with data:', data);
      const response = await api.post('/core/employees/', data);
      return response.data;
    } catch (error) {
      console.error('Create employee error:', error.response?.data);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail ||
                          JSON.stringify(error.response?.data) ||
                          'Failed to create employee';
      throw new Error(errorMessage);
    }
  }

  async updateEmployee(id, data) {
    try {
      const response = await api.put(`/core/employees/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Update employee error:', error.response?.data);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail ||
                          JSON.stringify(error.response?.data) ||
                          'Failed to update employee';
      throw new Error(errorMessage);
    }
  }

  async patchEmployee(id, data) {
    try {
      const response = await api.patch(`/core/employees/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update employee');
    }
  }

  async deleteEmployee(id) {
    try {
      const response = await api.delete(`/core/employees/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete employee');
    }
  }

  async getEmployeeReport() {
    try {
      const response = await api.get('/core/employees/report/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch employee report');
    }
  }

  // Utility methods
  async getCompanyDepartments(companyId) {
    try {
      const response = await api.get(`/core/companies/${companyId}/departments/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch company departments');
    }
  }

  async getDepartmentEmployees(departmentId) {
    try {
      const response = await api.get('/core/employees/', { 
        params: { department: departmentId } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch department employees');
    }
  }

  async getCompanyEmployees(companyId) {
    try {
      const response = await api.get('/core/employees/', { 
        params: { company: companyId } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch company employees');
    }
  }

  async getEmployeesByStatus(status) {
    try {
      const response = await api.get('/core/employees/', { 
        params: { status: status } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch employees by status');
    }
  }

  // Helper methods
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  }

  // Check if token is expired (basic check)
  isTokenExpired() {
    const token = localStorage.getItem('access_token');
    if (!token) return true;
    
    try {
      // Decode JWT token (basic decode, not verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }

  // Manual token refresh method
  async manualRefreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);
      
      // Emit custom event to notify components
      window.dispatchEvent(new CustomEvent('tokenRefreshed', { 
        detail: { token: access } 
      }));

      return access;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      this.clearStorage();
      window.dispatchEvent(new CustomEvent('tokenExpired'));
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;
