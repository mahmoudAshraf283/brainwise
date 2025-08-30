# BrainWise Frontend

A modern React-based employee management system frontend built with Vite and featuring role-based access control.

## 🚀 Features

- **Modern React 19.1.1** with functional components and hooks
- **Role-Based Access Control** (Admin, Manager, Employee)
- **JWT Authentication** with automatic token refresh
- **Responsive Design** with custom CSS styling
- **Employee Management** - CRUD operations for employees
- **Company Management** - Manage companies and departments
- **Department Management** - Department-wise employee organization
- **Real-time Dashboard** with statistics and analytics
- **Protected Routes** with authentication checks
- **Error Boundary** for graceful error handling

## 🛠️ Tech Stack

- **React 19.1.1** - UI Library
- **Vite 7.1.2** - Build tool and development server
- **React Router DOM 7.8.2** - Client-side routing
- **Axios 1.11.0** - HTTP client with interceptors

## 📦 Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:5173
   ```

## 🏗️ Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── ErrorBoundary.jsx      # Global error handling
│   │   ├── Navbar.jsx             # Navigation bar with user menu
│   │   └── ProtectedRoute.jsx     # Route protection component
│   ├── contexts/
│   │   ├── AuthContext.jsx        # Authentication state management
│   ├── pages/
│   │   ├── Dashboard.jsx          # Main dashboard with stats
│   │   ├── Login.jsx              # Login page
│   │   ├── companies/
│   │   │   ├── CompaniesList.jsx  # Companies listing page
│   │   │   ├── CompanyForm.jsx    # Add/Edit company form
│   │   │   └── CompanyView.jsx    # Company details view
│   │   ├── departments/
│   │   │   ├── DepartmentForm.jsx # Add/Edit department form
│   │   │   ├── DepartmentsList.jsx# Departments listing page
│   │   │   └── DepartmentView.jsx # Department details view
│   │   └── employees/
│   │       ├── EmployeeForm.jsx   # Add/Edit employee form
│   │       ├── EmployeesList.jsx  # Employees listing page
│   │       └── EmployeeView.jsx   # Employee details view
│   ├── services/
│   │   └── apiService.js          # API service with auth interceptors
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Global styles
│   ├── index.css                  # Base styles
│   └── main.jsx                   # Application entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full access to all features + Django admin access
- **Manager**: Full CRUD operations on employees, companies, departments
- **Employee**: Read-only access to view data

### Token Management
- **Access Token Lifetime**: 15 minutes
- **Refresh Token Lifetime**: 60 days
- **Automatic Token Refresh**: Handled by Axios interceptors
- **Secure Token Storage**: localStorage with error handling

### Protected Features
- Role-based UI component rendering
- Action buttons hidden for employees
- Admin dashboard access for privileged users
- Automatic logout on token expiry

## 🌐 API Integration

The frontend communicates with a Django REST API backend:

- **Base URL**: `http://localhost:8000/api`
- **Authentication**: JWT Bearer tokens
- **Error Handling**: Axios interceptors with retry logic
- **Token Refresh**: Automatic refresh on 401 responses

### API Endpoints Used
- `/accounts/login/` - User authentication
- `/accounts/logout/` - User logout
- `/accounts/token/refresh/` - Token refresh
- `/core/companies/` - Company management
- `/core/departments/` - Department management
- `/core/employees/` - Employee management

## 🎨 Styling & UI

- **Custom CSS**: No external UI libraries for maximum customization
- **Responsive Design**: Mobile-friendly layouts
- **Color Scheme**: Professional blue and gray tones
- **Interactive Elements**: Hover effects and smooth transitions
- **Loading States**: Custom spinners and loading indicators

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Features Overview

### Dashboard
- Real-time statistics (employees, companies, departments)
- User information display
- Quick navigation to main features

### Employee Management
- Complete CRUD operations
- Employee search and filtering
- Department and company associations
- Hire date tracking

### Company Management
- Company profiles with descriptions
- Department associations
- Employee count tracking

### Department Management
- Department organization
- Company associations
- Employee listings by department

## 🛡️ Security Features

- **XSS Protection**: React's built-in protection
- **CSRF Protection**: Token-based authentication
- **Role-based Access**: UI restrictions based on user roles
- **Secure Token Storage**: Proper token lifecycle management
- **Automatic Logout**: On token expiry or refresh failure

## 🐛 Error Handling

- **Error Boundary**: Catches and displays React errors gracefully
- **API Error Handling**: User-friendly error messages
- **Network Error Recovery**: Automatic retry mechanisms
- **Validation Errors**: Form-level error display

