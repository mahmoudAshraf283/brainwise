import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

const DepartmentsList = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    company: searchParams.get('company') || '',
  });

  useEffect(() => {
    fetchData();
  }, [filters.company]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const departmentParams = filters.company ? { company: filters.company } : {};
      const [departmentsData, companiesData] = await Promise.all([
        apiService.getDepartments(departmentParams),
        apiService.getCompanies()
      ]);
      setDepartments(departmentsData);
      setCompanies(companiesData);
    } catch (error) {
      setError('Failed to load departments');
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(newFilters);
    
    if (newFilters.company) {
      setSearchParams({ company: newFilters.company });
    } else {
      setSearchParams({});
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteDepartment(id);
      setDepartments(departments.filter(department => department.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      setError(error.message || 'Failed to delete department');
      setDeleteConfirm(null);
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.company_name : 'Unknown';
  };

  const filteredDepartments = departments.filter(department =>
    department.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCompanyName(department.company).toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const filterStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '20px',
    alignItems: 'end'
  };

  const tableStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3182ce',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
    cursor: 'pointer'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px'
        }}>
          <div>Loading departments...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Page Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Departments</h1>
          <nav>
            <span style={{
              backgroundColor: '#e2e8f0',
              color: '#4a5568',
              padding: '5px 12px',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              Departments
            </span>
          </nav>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <Link 
            to="/departments/new" 
            style={addButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            ➕ Add Department
          </Link>
        )}
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fed7d7',
          borderLeft: '4px solid #f56565',
          padding: '16px',
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#c53030', marginLeft: '12px' }}>{error}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={filterStyle}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Search Departments
          </label>
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Filter by Company
          </label>
          <select
            name="company"
            value={filters.company}
            onChange={handleFilterChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.company_name}
              </option>
            ))}
          </select>
        </div>

        {(user?.role === 'admin' || user?.role === 'manager') && (
          <Link to="/departments/new" style={buttonStyle}>
            + Add Department
          </Link>
        )}
      </div>

      {/* Departments Table */}
      <div style={tableStyle}>
        {filteredDepartments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
              No departments found
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              {searchTerm || filters.company 
                ? "Try adjusting your search or filters" 
                : "Get started by creating your first department"
              }
            </p>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Link to="/departments/new" style={buttonStyle}>
                + Add Department
              </Link>
            )}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  Department Name
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  Company
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  Employees
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'right',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((department) => (
                <tr key={department.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#dbeafe',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px'
                      }}>
                        🏢
                      </div>
                      <div style={{ fontWeight: '500' }}>
                        {department.department_name}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#6b7280' }}>
                    {getCompanyName(department.company)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {department.number_of_employees || 0} employees
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {(user?.role === 'admin' || user?.role === 'manager') ? (
                        <>
                          <Link
                            to={`/departments/${department.id}`}
                            style={{
                              padding: '8px',
                              color: '#3182ce',
                              textDecoration: 'none',
                              borderRadius: '4px',
                              border: '1px solid #e5e7eb'
                            }}
                            title="View Details"
                          >
                            👁️
                          </Link>
                          <Link
                            to={`/departments/${department.id}/edit`}
                            style={{
                              padding: '8px',
                              color: '#f59e0b',
                              textDecoration: 'none',
                              borderRadius: '4px',
                              border: '1px solid #e5e7eb'
                            }}
                            title="Edit"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(department.id)}
                            style={{
                              padding: '8px',
                              color: '#ef4444',
                              backgroundColor: 'transparent',
                              border: '1px solid #e5e7eb',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </>
                      ) : (
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
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            margin: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '24px' }}>🗑️</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                Delete Department
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Are you sure you want to delete this department? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsList;
