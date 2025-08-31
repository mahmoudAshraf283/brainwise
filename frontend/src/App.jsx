import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompaniesList from './pages/companies/CompaniesList';
import CompanyForm from './pages/companies/CompanyForm';
import CompanyView from './pages/companies/CompanyView';
import DepartmentsList from './pages/departments/DepartmentsList';
import DepartmentForm from './pages/departments/DepartmentForm';
import DepartmentView from './pages/departments/DepartmentView';
import EmployeesList from './pages/employees/EmployeesList';
import EmployeeForm from './pages/employees/EmployeeForm';
import EmployeeView from './pages/employees/EmployeeView';
import EmployeeReport from './pages/employees/EmployeeReport';

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div style={{
          width: '64px',
          height: '64px',
          border: '4px solid #dbeafe',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{
          width: '64px',
          height: '64px',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          position: 'absolute',
          top: '0',
          left: '0',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
      <p style={{
        marginTop: '24px',
        color: '#374151',
        fontWeight: '600',
        fontSize: '18px'
      }}>
        Loading BrainWise...
      </p>
      <p style={{
        color: '#6b7280',
        fontSize: '14px'
      }}>
        Employee Management System
      </p>
    </div>
  </div>
);

// Loading component for page transitions
const PageLoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '256px'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderBottom: '2px solid #3b82f6',
        borderRadius: '50%',
        margin: '0 auto',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{
        marginTop: '8px',
        color: '#4b5563',
        fontSize: '14px'
      }}>
        Loading...
      </p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
                  <Navbar />
                  <Routes>
                    <Route index element={<Dashboard />} />
                    
                    {/* Company Routes */}
                    <Route path="companies" element={<CompaniesList />} />
                    <Route path="companies/new" element={<CompanyForm />} />
                    <Route path="companies/:id" element={<CompanyView />} />
                    <Route path="companies/:id/edit" element={<CompanyForm />} />
                    
                    {/* Department Routes */}
                    <Route path="departments" element={<DepartmentsList />} />
                    <Route path="departments/new" element={<DepartmentForm />} />
                    <Route path="departments/:id" element={<DepartmentView />} />
                    <Route path="departments/:id/edit" element={<DepartmentForm />} />
                    
                    {/* Employee Routes */}
                    <Route path="employees" element={<EmployeesList />} />
                    <Route path="employees/new" element={<EmployeeForm />} />
                    <Route path="employees/report" element={<EmployeeReport />} />
                    <Route path="employees/:id" element={<EmployeeView />} />
                    <Route path="employees/:id/edit" element={<EmployeeForm />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
