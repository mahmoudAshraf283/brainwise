import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';

// Lazy load page components
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const CompaniesList = React.lazy(() => import('./pages/companies/CompaniesList'));
const CompanyForm = React.lazy(() => import('./pages/companies/CompanyForm'));
const CompanyView = React.lazy(() => import('./pages/companies/CompanyView'));
const DepartmentsList = React.lazy(() => import('./pages/departments/DepartmentsList'));
const DepartmentForm = React.lazy(() => import('./pages/departments/DepartmentForm'));
const DepartmentView = React.lazy(() => import('./pages/departments/DepartmentView'));
const EmployeesList = React.lazy(() => import('./pages/employees/EmployeesList'));
const EmployeeForm = React.lazy(() => import('./pages/employees/EmployeeForm'));
const EmployeeView = React.lazy(() => import('./pages/employees/EmployeeView'));
const EmployeeReport = React.lazy(() => import('./pages/employees/EmployeeReport'));

// Preload critical components on app initialization
const preloadCriticalComponents = () => {
  // Preload Dashboard after a short delay (most likely next page after login)
  setTimeout(() => {
    import('./pages/Dashboard');
  }, 100);
  
  // Preload frequently used components
  setTimeout(() => {
    import('./pages/employees/EmployeesList');
    import('./pages/companies/CompaniesList');
  }, 500);
};

// Initialize preloading
preloadCriticalComponents();

// Lazy Loading Error Boundary
class LazyLoadErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>
            Failed to load component
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '15px' }}>
            Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
            <Route path="/login" element={
              <LazyLoadErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <Login />
                </Suspense>
              </LazyLoadErrorBoundary>
            } />
            <Route path="/*" element={
              <ProtectedRoute>
                <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
                  <Navbar />
                  <LazyLoadErrorBoundary>
                    <Suspense fallback={<PageLoadingSpinner />}>
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
                    </Suspense>
                  </LazyLoadErrorBoundary>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Add CSS animation for loading spinners
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default App;
