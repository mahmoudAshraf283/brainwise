import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../../services/apiService';

const EmployeeView = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEmployee(id);
      setEmployee(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hired':
        return '#10b981';
      case 'interview_scheduled':
        return '#f59e0b';
      case 'application_received':
        return '#3b82f6';
      case 'not_accepted':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'hired':
        return 'Hired';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'application_received':
        return 'Application Received';
      case 'not_accepted':
        return 'Not Accepted';
      default:
        return status;
    }
  };

  const containerStyle = {
    padding: '24px',
    maxWidth: '800px',
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

  const employeeInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const avatarStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px'
  };

  const nameStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '4px'
  };

  const designationStyle = {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '8px'
  };

  const statusBadgeStyle = {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#ffffff'
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  };

  const sectionStyle = {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px'
  };

  const fieldStyle = {
    marginBottom: '12px'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  };

  const valueStyle = {
    fontSize: '14px',
    color: '#111827'
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
        <div style={loadingStyle}>Loading employee...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <Link
          to="/employees"
          style={backButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          ← Back to Employees
        </Link>
        <div style={errorStyle}>
          {error}
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={containerStyle}>
        <Link
          to="/employees"
          style={backButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          ← Back to Employees
        </Link>
        <div style={errorStyle}>
          Employee not found
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Link
        to="/employees"
        style={backButtonStyle}
        onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
      >
        ← Back to Employees
      </Link>

      <div style={headerStyle}>
        <div style={employeeInfoStyle}>
          <div style={avatarStyle}>
            👤
          </div>
          <div>
            <h1 style={nameStyle}>{employee.employee_name}</h1>
            <p style={designationStyle}>{employee.designation}</p>
            <span 
              style={{
                ...statusBadgeStyle,
                backgroundColor: getStatusColor(employee.employee_status)
              }}
            >
              {getStatusLabel(employee.employee_status)}
            </span>
          </div>
        </div>
        <Link
          to={`/employees/${employee.id}/edit`}
          style={editButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          ✏️ Edit Employee
        </Link>
      </div>

      <div style={gridStyle}>
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Contact Information</h2>
          
          <div style={fieldStyle}>
            <div style={labelStyle}>
              <span>📧</span>
              <span>Email</span>
            </div>
            <div style={valueStyle}>{employee.email_address}</div>
          </div>

          <div style={fieldStyle}>
            <div style={labelStyle}>
              <span>📞</span>
              <span>Phone</span>
            </div>
            <div style={valueStyle}>{employee.mobile_number}</div>
          </div>

          <div style={fieldStyle}>
            <div style={labelStyle}>
              <span>📍</span>
              <span>Address</span>
            </div>
            <div style={valueStyle}>{employee.address}</div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Employment Details</h2>
          
          <div style={fieldStyle}>
            <div style={labelStyle}>
              <span>🏢</span>
              <span>Company</span>
            </div>
            <div style={valueStyle}>{employee.company_name}</div>
          </div>

          <div style={fieldStyle}>
            <div style={labelStyle}>
              <span>🏬</span>
              <span>Department</span>
            </div>
            <div style={valueStyle}>{employee.department_name}</div>
          </div>

          <div style={fieldStyle}>
            <div style={labelStyle}>
              <span>👔</span>
              <span>Designation</span>
            </div>
            <div style={valueStyle}>{employee.designation}</div>
          </div>

          <div style={fieldStyle}>
            <div style={labelStyle}>
              <span>📊</span>
              <span>Status</span>
            </div>
            <div style={valueStyle}>
              <span 
                style={{
                  ...statusBadgeStyle,
                  backgroundColor: getStatusColor(employee.employee_status)
                }}
              >
                {getStatusLabel(employee.employee_status)}
              </span>
            </div>
          </div>

          {employee.employee_status === 'hired' && employee.hired_on && (
            <>
              <div style={fieldStyle}>
                <div style={labelStyle}>
                  <span>📅</span>
                  <span>Hired Date</span>
                </div>
                <div style={valueStyle}>
                  {new Date(employee.hired_on).toLocaleDateString()}
                </div>
              </div>

              <div style={fieldStyle}>
                <div style={labelStyle}>
                  <span>⏰</span>
                  <span>Days Employed</span>
                </div>
                <div style={valueStyle}>
                  {employee.days_employed || 0} days
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
