import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

const EmployeesList = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesData, departmentsData] = await Promise.all([
        apiService.getEmployees(),
        apiService.getDepartments()
      ]);
      setEmployees(employeesData);
      setDepartments(departmentsData);
    } catch (error) {
      setError('Failed to load employees');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.department_name : 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hired': return '#10b981';
      case 'interview_scheduled': return '#f59e0b';
      case 'application_received': return '#3b82f6';
      case 'not_accepted': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'hired': return 'Hired';
      case 'interview_scheduled': return 'Interview Scheduled';
      case 'application_received': return 'Application Received';
      case 'not_accepted': return 'Not Accepted';
      default: return status;
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || employee.employee_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const containerStyle = {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  };

  const addButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer'
  };

  const actionButtonStyle = {
    padding: '4px 8px',
    margin: '0 2px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const viewButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#3b82f6',
    color: '#ffffff'
  };

  const editButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151'
  };

  const deleteButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#fef2f2',
    color: '#dc2626'
  };

  const handleDeleteEmployee = async (employeeId, employeeName) => {
    if (window.confirm(`Are you sure you want to delete "${employeeName}"?`)) {
      try {
        await apiService.deleteEmployee(employeeId);
        setEmployees(employees.filter(emp => emp.id !== employeeId));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px'
  };

  const filtersStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  };

  const inputStyle = {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    minWidth: '200px'
  };

  const selectStyle = {
    ...inputStyle,
    minWidth: '150px'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '48px'
  };

  const errorStyle = {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '24px'
  };

  const tableStyle = {
    width: '100%',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  };

  const tableHeaderStyle = {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  };

  const thStyle = {
    padding: '16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const tdStyle = {
    padding: '16px',
    borderBottom: '1px solid #f3f4f6'
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: `${getStatusColor(status)}20`,
    color: getStatusColor(status)
  });

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '48px'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Employees</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link 
            to="/employees/report" 
            style={{
              ...addButtonStyle,
              backgroundColor: '#10b981',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            📊 Employee Report
          </Link>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <Link 
              to="/employees/new" 
              style={addButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              ➕ Add Employee
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <div style={filtersStyle}>
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Statuses</option>
          <option value="application_received">Application Received</option>
          <option value="interview_scheduled">Interview Scheduled</option>
          <option value="hired">Hired</option>
          <option value="not_accepted">Not Accepted</option>
        </select>
      </div>

      {filteredEmployees.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No employees found</h3>
          <p style={{ color: '#6b7280' }}>
            {searchTerm || statusFilter 
              ? "Try adjusting your search or filters" 
              : "Get started by adding your first employee"
            }
          </p>
        </div>
      ) : (
        <div style={tableStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={tableHeaderStyle}>
              <tr>
                <th style={thStyle}>Employee</th>
                <th style={thStyle}>Department</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Hired Date</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} style={{ ':hover': { backgroundColor: '#f9fafb' } }}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px',
                        fontSize: '16px'
                      }}>
                        👤
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', color: '#111827' }}>
                          {employee.employee_name}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          {employee.designation || 'No designation'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#6b7280' }}>
                      {getDepartmentName(employee.department)}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(employee.employee_status)}>
                      {getStatusText(employee.employee_status)}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '14px' }}>
                      <div style={{ color: '#111827' }}>{employee.email_address}</div>
                      <div style={{ color: '#6b7280' }}>{employee.mobile_number}</div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>
                      {employee.hired_on ? new Date(employee.hired_on).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {(user?.role === 'admin' || user?.role === 'manager') && (
                        <>
                          <Link
                            to={`/employees/${employee.id}`}
                            style={viewButtonStyle}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                          >
                            View
                          </Link>
                          <Link
                            to={`/employees/${employee.id}/edit`}
                            style={editButtonStyle}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id, employee.employee_name)}
                            style={deleteButtonStyle}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#fef2f2'}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {user?.role === 'employee' && (
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#6b7280', 
                          fontStyle: 'italic',
                          padding: '8px'
                        }}>
                          View only
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeesList;
