# Employee Management System API Documentation

## Initial Setup

### Creating Superuser
Before using the system, you must create a superuser account:

```bash
python manage.py createsuperuser
```

This superuser will be the only user who can initially create Admin and Manager accounts through the signup endpoint.

## Application Flow

### User Management Workflow
1. **System Bootstrap**: Create superuser using Django management command
2. **Account Creation**: Superuser creates initial Admin accounts
3. **Delegation**: Admin users can create Manager and Employee accounts
4. **Operations**: Different roles perform operations based on their permissions

### Data Management Workflow
1. **Companies**: Create companies first (Admin/Manager only)
2. **Departments**: Create departments within companies (Admin/Manager only)
3. **Employees**: Add employees to departments (Admin/Manager only)
4. **Reports**: View employee reports (All authenticated users)

## Authentication
All API endpoints require authentication using JWT tokens.

### Authentication Endpoints
- `POST /api/accounts/signup/` - Register a new user (Restricted to Superuser and Admin only)
- `POST /api/accounts/login/` - Login and get tokens
- `POST /api/accounts/logout/` - Logout and blacklist token
- `POST /api/accounts/token/refresh/` - Refresh access token

**Note**: User registration (`/signup/`) is restricted. Only Superuser and Admin roles can create new user accounts.

## Company Endpoints

### List/Create Companies
- **GET** `/api/core/companies/` - List all companies
- **POST** `/api/core/companies/` - Create a new company

**Response Format:**
```json
{
    "id": 1,
    "company_name": "Tech Corp",
    "number_of_departments": 3,
    "number_of_employees": 25
}
```

### Company Details
- **GET** `/api/core/companies/{id}/` - Get company details
- **PUT** `/api/core/companies/{id}/` - Update company
- **PATCH** `/api/core/companies/{id}/` - Partial update company
- **DELETE** `/api/core/companies/{id}/` - Delete company

## Department Endpoints

### List/Create Departments
- **GET** `/api/core/departments/` - List all departments
- **GET** `/api/core/departments/?company={company_id}` - Filter by company
- **POST** `/api/core/departments/` - Create a new department

**Response Format:**
```json
{
    "id": 1,
    "company": 1,
    "company_name": "Tech Corp",
    "department_name": "Engineering",
    "number_of_employees": 10
}
```

### Department Details
- **GET** `/api/core/departments/{id}/` - Get department details
- **PUT** `/api/core/departments/{id}/` - Update department
- **PATCH** `/api/core/departments/{id}/` - Partial update department
- **DELETE** `/api/core/departments/{id}/` - Delete department

## Employee Endpoints

### List/Create Employees
- **GET** `/api/core/employees/` - List all employees
- **GET** `/api/core/employees/?company={company_id}` - Filter by company
- **GET** `/api/core/employees/?department={department_id}` - Filter by department
- **GET** `/api/core/employees/?status={status}` - Filter by status
- **POST** `/api/core/employees/` - Create a new employee

### Employee Report
- **GET** `/api/core/employees/report/` - Get detailed report of hired employees only

**Features:**
- Returns only employees with status 'hired'
- Includes calculated days_employed field
- Ordered by company, department, then employee name
- Optimized with select_related for performance
- Accessible to all authenticated users

**Employee Status Options:**
- `application_received`
- `interview_scheduled`
- `hired`
- `not_accepted`

**Response Format:**
```json
{
    "id": 1,
    "company": 1,
    "company_name": "Tech Corp",
    "department": 1,
    "department_name": "Engineering",
    "employee_status": "hired",
    "employee_name": "John Doe",
    "email_address": "john@example.com",
    "mobile_number": "+1234567890",
    "address": "123 Main St",
    "designation": "Software Engineer",
    "hired_on": "2024-01-15",
    "days_employed": 227
}
```

### Employee Details
- **GET** `/api/core/employees/{id}/` - Get employee details
- **PUT** `/api/core/employees/{id}/` - Update employee
- **PATCH** `/api/core/employees/{id}/` - Partial update employee
- **DELETE** `/api/core/employees/{id}/` - Delete employee

### Employee Report Response Format
**Employee Report Response (Hired Employees Only):**
```json
[
    {
        "id": 1,
        "employee_name": "John Doe",
        "email_address": "john@example.com",
        "mobile_number": "+1234567890",
        "position": "Software Engineer",
        "hired_on": "2024-01-15",
        "days_employed": 227,
        "company_name": "Tech Corp",
        "department_name": "Engineering"
    }
]
```

## Utility Endpoints

### Company Departments
- **GET** `/api/core/companies/{company_id}/departments/` - Get all departments for a specific company

## Permissions

### User Creation Flow
1. **Superuser Creation**: Must be created via Django admin or management command
   - Only superuser can create Admin and Manager accounts
   - Superuser has full system access

2. **Account Creation Hierarchy**:
   - **Superuser** → Can create Admin and Manager accounts
   - **Admin** → Can create other user accounts (Admin, Manager, Employee)
   - **Manager** → Cannot create accounts (only CRUD operations)
   - **Employee** → Read-only access

### Role-based Access Control

#### Superuser
- Full system access
- Can create Admin and Manager accounts
- Can perform all CRUD operations
- Django admin access

#### Admin
- Full CRUD operations on all entities (Companies, Departments, Employees)
- Can create user accounts (Admin, Manager, Employee)
- Cannot access Django admin

#### Manager
- Full CRUD operations on all entities (Companies, Departments, Employees)
- **Cannot create user accounts**
- Read/Write access to all data

#### Employee
- **Read-only access** to all data
- Cannot create, update, or delete any records
- Cannot create user accounts

### Authentication Requirements
- All endpoints require valid JWT authentication
- Write operations are restricted based on user role
- Account creation is restricted to Superuser and Admin roles only

## Error Handling

### Common Error Responses
```json
{
    "error": "Error message describing what went wrong"
}
```

### Validation Errors
```json
{
    "field_name": ["Error message for this field"],
    "non_field_errors": ["General validation errors"]
}
```

## Data Validation

### Company
- Company name is required and cannot be empty
- Company name must be unique

### Department
- Department name is required and cannot be empty
- Department name must be unique within the same company
- Company is required

### Employee
- All fields except `hired_on` are required
- Email must be in valid format and unique across all employees
- Mobile number must be in format: '+999999999' (9-15 digits allowed)
- Employee name must be at least 2 characters long
- Designation must be at least 2 characters long
- Address must be at least 5 characters long
- Department must belong to the selected company
- `hired_on` is required only when status is 'hired'
- `hired_on` cannot be in the future
- `days_employed` is automatically calculated for hired employees
- Status transitions follow workflow rules (see below)

## Business Rules

### Cascading Deletions
- Cannot delete a company that has departments or employees
- Cannot delete a department that has employees
- Must delete employees first, then departments, then company

### Employee Status Workflow
- New employees start with 'application_received' status
- Status can be changed to: 'interview_scheduled', 'hired', or 'not_accepted'
- Only 'hired' employees have `hired_on` date and `days_employed` calculation

#### Allowed Status Transitions
- From 'application_received': can go to 'interview_scheduled' or 'not_accepted'
- From 'interview_scheduled': can go to 'hired' or 'not_accepted'
- From 'hired': cannot change status (final state)
- From 'not_accepted': cannot change status (final state)
