# Employee Management System - Backend

A Django REST API backend for managing companies, departments, and employees with role-based access control.

## Project Structure

```
backend/
├── employee_management/          # Main Django project
│   ├── settings.py              # Django settings
│   ├── urls.py                  # Main URL configuration
│   └── wsgi.py                  # WSGI configuration
├── accounts/                    # User authentication app
│   ├── models.py                # User model with roles
│   ├── serializers.py           # User serializers
│   ├── views.py                 # Authentication views
│   ├── urls.py                  # Authentication URLs
│   └── admin.py                 # Admin configurations (centralized)
├── core/                        # Core business logic app
│   ├── models.py                # Company, Department, Employee models
│   ├── serializers.py           # API serializers with validation
│   ├── views.py                 # API views with business logic
│   ├── urls.py                  # Core API URLs
│   ├── permissions.py           # Custom permission classes
│   └── admin.py                 # Empty (moved to accounts)
├── db.sqlite3                   # SQLite database
├── manage.py                    # Django management script
├── API_DOCUMENTATION.md         # API documentation
└── README.md                    # This file
```

## Features Implemented

### ✅ Mandatory Requirements Completed

#### 1. Models
- **User Accounts** (accounts/models.py)
  - User Name
  - Email Address (Login ID)
  - Role (Admin, Manager, Employee)

- **Company** (core/models.py)
  - Company Name
  - Number of Departments (calculated property)
  - Number of Employees (calculated property)

- **Department** (core/models.py)
  - Company (Foreign Key)
  - Department Name
  - Number of Employees (calculated property)

- **Employee** (core/models.py)
  - Company (Foreign Key)
  - Department (Foreign Key - filtered by company)
  - Employee Status (Application Received, Interview Scheduled, Hired, Not Accepted)
  - Employee Name
  - Email Address
  - Mobile Number
  - Address
  - Designation (Position/Title)
  - Hired On (only if hired)
  - Days Employed (calculated property)

#### 2. Validations & Business Logic
- ✅ All required fields validation
- ✅ Email and mobile number format validation in serializers
- ✅ Unique email constraint validation
- ✅ Employee status workflow validation
- ✅ Automatic calculation of department/employee counts
- ✅ Automatic calculation of days employed
- ✅ Department filtering by company
- ✅ Cascading deletion protection
- ✅ Proper error handling and messages

#### 3. Security & Permissions
- ✅ Role-based access control (Admin, Manager, Employee)
- ✅ JWT token authentication
- ✅ Custom permission classes
- ✅ Secure API endpoints

#### 4. RESTful APIs
- ✅ Company CRUD operations
- ✅ Department CRUD operations  
- ✅ Employee CRUD operations
- ✅ Proper HTTP methods (GET, POST, PATCH, DELETE)
- ✅ RESTful URL structure
- ✅ Comprehensive API documentation

## Architecture Design

### Separation of Concerns
- **Models**: Simple data models without business logic or validation
- **Serializers**: Handle ALL data validation and transformation
- **Views**: Handle HTTP requests/responses and contain CRUD operations with business logic
- **Permissions**: Separate permission classes for reusability

### Clean Code Principles
- Single Responsibility Principle
- Don't Repeat Yourself (DRY)
- Proper error handling
- Comprehensive validation
- Clear naming conventions

## Setup Instructions

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brainwise/backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser** (optional)
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at: `http://localhost:8000/`

### Environment Configuration

The project uses Django's default SQLite database for development. For production, update the database configuration in `settings.py`.

## API Usage

### Authentication
1. Register a new user: `POST /api/accounts/signup/`
2. Login: `POST /api/accounts/login/`
3. Use the returned JWT token in the Authorization header: `Bearer <token>`


## Permission System

### Roles and Access Levels
- **Admin**: Full CRUD access to all resources
- **Manager**: Full CRUD access to all resources
- **Employee**: Read-only access to all resources

### Security Features
- JWT token-based authentication
- Role-based authorization
- Input validation and sanitization
- CORS protection
- SQL injection prevention through ORM

## Data Validation

### Automatic Validations
- Email format validation (with regex pattern)
- Phone number format validation (international format)
- Required field validation
- Unique constraints (company names, department names per company, employee emails)
- Foreign key constraints
- Text field minimum length validation

### Business Rule Validations
- Department must belong to selected company
- Hired date required for hired employees
- Hired date cannot be in future
- Cascading deletion prevention
- Employee status workflow transitions
- Unique email addresses across employees
- Company name uniqueness
- Department name uniqueness per company

## Error Handling

The API returns appropriate HTTP status codes and descriptive error messages:
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server errors


## Admin Interface

Access the Django admin at: `http://localhost:8000/admin/`

All model administrations are centralized in the `accounts` app for better organization.

## Development Notes

### Code Organization
- Data validation and field-level logic are in serializers
- CRUD operations and business workflow logic are in views
- Permissions are modular and reusable
- Views handle database transactions and complex business operations
- Models are kept simple without business logic or validation
- Admin configurations centralized for better management
