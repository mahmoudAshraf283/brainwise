import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../../services/apiService';

const DepartmentView = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDepartmentData();
  }, [id]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      const [departmentData, employeesData] = await Promise.all([
        apiService.getDepartment(id),
        apiService.getDepartmentEmployees(id)
      ]);
      setDepartment(departmentData);
      setEmployees(employeesData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'onboarding':
        return '#f59e0b';
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#6b7280';
      case 'terminated':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'onboarding':
        return '🚀';
      case 'active':
        return '✅';
      case 'inactive':
        return '⏸️';
      case 'terminated':
        return '❌';
      default:
        return '❓';
    }
  };

  const containerStyle = {
    padding: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginTop: '24px'
  };

  const backButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '24px',
    cursor: 'pointer',
    border: 'none'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e5e7eb'
  };

  const departmentInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const iconStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  };

  const nameStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '4px'
  };

  const companyLinkStyle = {
    fontSize: '14px',
    color: '#3b82f6',
    textDecoration: 'none'
  };

  const editButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500'
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  };

  const statCardStyle = {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  };

  const statNumberStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: '4px'
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  };

  const sectionStyle = {
    marginBottom: '32px'
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const employeeListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px'
  };

  const employeeCardStyle = {
    padding: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    transition: 'all 0.2s',
    textDecoration: 'none'
  };

  const employeeHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  };

  const employeeNameStyle = {
    fontSize: '16px',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '4px'
  };

  const employeeEmailStyle = {
    fontSize: '14px',
    color: '#6b7280'
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: `${getStatusColor(status)}20`,
    color: getStatusColor(status)
  });

  const employeeDetailsStyle = {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '48px',
    color: '#6b7280'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '48px',
    fontSize: '16px',
    color: '#6b7280'
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '14px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    borderRadius: '6px',
    border: '1px solid #fecaca',
    marginBottom: '24px'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading department...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <Link
          to="/departments"
          style={backButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          ← Back to Departments
        </Link>
        <div style={errorStyle}>
          {error}
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div style={containerStyle}>
        <Link
          to="/departments"
          style={backButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          ← Back to Departments
        </Link>
        <div style={errorStyle}>
          Department not found
        </div>
      </div>
    );
  }

  const statusCounts = employees.reduce((acc, emp) => {
    const status = emp.status?.toLowerCase() || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={containerStyle}>
      <Link
        to="/departments"
        style={backButtonStyle}
        onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
      >
        ← Back to Departments
      </Link>

      <div style={headerStyle}>
        <div style={departmentInfoStyle}>
          <div style={iconStyle}>
            🏬
          </div>
          <div>
            <h1 style={nameStyle}>{department.department_name}</h1>
            {department.company && (
              <Link
                to={`/companies/${department.company.id}`}
                style={companyLinkStyle}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                📍 {department.company.company_name}
              </Link>
            )}
          </div>
        </div>
        <Link
          to={`/departments/${department.id}/edit`}
          style={editButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          ✏️ Edit Department
        </Link>
      </div>

      <div style={statsStyle}>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{employees.length}</div>
          <div style={statLabelStyle}>Total Employees</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{statusCounts.active || 0}</div>
          <div style={statLabelStyle}>Active Employees</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{statusCounts.onboarding || 0}</div>
          <div style={statLabelStyle}>Onboarding</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{statusCounts.inactive || 0}</div>
          <div style={statLabelStyle}>Inactive</div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          <span>👥</span>
          <span>Employees</span>
        </h2>
        
        {employees.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No employees found</h3>
            <p>This department doesn't have any employees yet.</p>
            <Link
              to="/employees/new"
              style={{
                ...editButtonStyle,
                marginTop: '16px',
                backgroundColor: '#10b981'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              ➕ Add Employee
            </Link>
          </div>
        ) : (
          <div style={employeeListStyle}>
            {employees.map((employee) => (
              <Link
                key={employee.id}
                to={`/employees/${employee.id}`}
                style={employeeCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={employeeHeaderStyle}>
                  <div>
                    <div style={employeeNameStyle}>
                      {employee.first_name} {employee.last_name}
                    </div>
                    <div style={employeeEmailStyle}>{employee.email}</div>
                  </div>
                  <div style={statusBadgeStyle(employee.status)}>
                    <span>{getStatusIcon(employee.status)}</span>
                    <span>{employee.status}</span>
                  </div>
                </div>
                <div style={employeeDetailsStyle}>
                  {employee.position && <div><strong>Position:</strong> {employee.position}</div>}
                  {employee.hire_date && <div><strong>Hired:</strong> {new Date(employee.hire_date).toLocaleDateString()}</div>}
                  {employee.salary && <div><strong>Salary:</strong> ${parseInt(employee.salary).toLocaleString()}</div>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentView;
