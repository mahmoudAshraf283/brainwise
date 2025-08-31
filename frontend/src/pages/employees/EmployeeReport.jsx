import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

const EmployeeReport = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetchEmployeeReport();
  }, []);

  const fetchEmployeeReport = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEmployeeReport();
      setEmployees(data);
    } catch (error) {
      setError('Failed to load employee report');
      console.error('Error fetching employee report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedEmployees = () => {
    let sortableEmployees = [...employees];
    
    // Apply search filter
    if (searchTerm) {
      sortableEmployees = sortableEmployees.filter(employee =>
        employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      sortableEmployees.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle different data types
        if (sortConfig.key === 'hired_on') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (sortConfig.key === 'days_employed') {
          aValue = parseInt(aValue) || 0;
          bValue = parseInt(bValue) || 0;
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableEmployees;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDaysEmployed = (days) => {
    if (days === null || days === undefined) return 'N/A';
    return `${days} days`;
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <span style={{ color: '#ccc' }}>↕️</span>;
    }
    return sortConfig.direction === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div>Loading employee report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        color: '#ef4444', 
        textAlign: 'center', 
        padding: '20px' 
      }}>
        {error}
      </div>
    );
  }

  const sortedEmployees = getSortedEmployees();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h1 style={{ margin: 0, color: '#1f2937' }}>Employee Report</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#6b7280' }}>
            Total Hired Employees: {employees.length}
          </span>
          <button
            onClick={fetchEmployeeReport}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search employees by name, email, company, department, or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 15px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Employee Report Table */}
      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {sortedEmployees.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280'
          }}>
            {searchTerm ? 'No employees found matching your search.' : 'No hired employees found.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th
                    onClick={() => handleSort('employee_name')}
                    style={{
                      padding: '12px 15px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#374151',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    Employee Name {getSortIcon('employee_name')}
                  </th>
                  <th
                    onClick={() => handleSort('email_address')}
                    style={{
                      padding: '12px 15px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#374151',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    Email Address {getSortIcon('email_address')}
                  </th>
                  <th
                    onClick={() => handleSort('mobile_number')}
                    style={{
                      padding: '12px 15px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#374151',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    Mobile Number {getSortIcon('mobile_number')}
                  </th>
                  <th
                    onClick={() => handleSort('position')}
                    style={{
                      padding: '12px 15px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#374151',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    Position {getSortIcon('position')}
                  </th>
                  <th
                    onClick={() => handleSort('hired_on')}
                    style={{
                      padding: '12px 15px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#374151',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    Hired On {getSortIcon('hired_on')}
                  </th>
                  <th
                    onClick={() => handleSort('days_employed')}
                    style={{
                      padding: '12px 15px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#374151',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    Days Employed {getSortIcon('days_employed')}
                  </th>
                  <th
                    onClick={() => handleSort('company_name')}
                    style={{
                      padding: '12px 15px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#374151',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    Company Name {getSortIcon('company_name')}
                  </th>
                  <th
                    onClick={() => handleSort('department_name')}
                    style={{
                      padding: '12px 15px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#374151',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    Department Name {getSortIcon('department_name')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.map((employee, index) => (
                  <tr 
                    key={employee.id}
                    style={{ 
                      borderBottom: '1px solid #e5e7eb',
                      background: index % 2 === 0 ? 'white' : '#f9fafb'
                    }}
                  >
                    <td style={{ padding: '12px 15px', color: '#1f2937', fontWeight: '500' }}>
                      {employee.employee_name}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#6b7280' }}>
                      {employee.email_address}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#6b7280' }}>
                      {employee.mobile_number}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#6b7280' }}>
                      {employee.position}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#6b7280' }}>
                      {formatDate(employee.hired_on)}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#6b7280' }}>
                      {formatDaysEmployed(employee.days_employed)}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#6b7280' }}>
                      {employee.company_name}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#6b7280' }}>
                      {employee.department_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {employees.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#f0f9ff', 
          borderRadius: '8px',
          border: '1px solid #e0f2fe'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#0c4a6e' }}>Summary Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <strong>Total Hired Employees:</strong> {employees.length}
            </div>
            <div>
              <strong>Average Days Employed:</strong>{' '}
              {Math.round(
                employees
                  .filter(emp => emp.days_employed !== null)
                  .reduce((acc, emp) => acc + emp.days_employed, 0) / 
                employees.filter(emp => emp.days_employed !== null).length
              ) || 0} days
            </div>
            <div>
              <strong>Companies Represented:</strong>{' '}
              {new Set(employees.map(emp => emp.company_name)).size}
            </div>
            <div>
              <strong>Departments Represented:</strong>{' '}
              {new Set(employees.map(emp => emp.department_name)).size}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeReport;
