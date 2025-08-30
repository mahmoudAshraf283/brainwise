import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

const CompaniesList = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCompanies();
      setCompanies(data);
    } catch (error) {
      setError('Failed to load companies');
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    marginBottom: '24px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px'
  };

  const headerActionsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  };

  const cardActionsStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  };

  const actionButtonStyle = {
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
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

  const handleDelete = async (companyId, companyName) => {
    if (window.confirm(`Are you sure you want to delete "${companyName}"?`)) {
      try {
        await apiService.deleteCompany(companyId);
        setCompanies(companies.filter(c => c.id !== companyId));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const createButtonStyle = {
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
    transition: 'background-color 0.2s'
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
    textDecoration: 'none',
    color: 'inherit'
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
  };

  const iconStyle = {
    width: '48px',
    height: '48px',
    backgroundColor: '#eff6ff',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
    fontSize: '24px'
  };

  const companyNameStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827'
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  };

  const statStyle = {
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  };

  const statNumberStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3b82f6'
  };

  const statLabelStyle = {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px'
  };

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
          <p>Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerActionsStyle}>
        <div>
          <h1 style={titleStyle}>Companies</h1>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <Link 
            to="/companies/new" 
            style={createButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            ➕ Add Company
          </Link>
        )}
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {companies.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No companies found</h3>
          <p style={{ color: '#6b7280' }}>Get started by adding your first company</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {companies.map((company) => (
            <div
              key={company.id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={cardHeaderStyle}>
                <div style={iconStyle}>🏢</div>
                <div>
                  <h3 style={companyNameStyle}>{company.company_name}</h3>
                </div>
              </div>
              
              <div style={statsStyle}>
                <div style={statStyle}>
                  <div style={statNumberStyle}>{company.number_of_departments || 0}</div>
                  <div style={statLabelStyle}>Departments</div>
                </div>
                <div style={statStyle}>
                  <div style={statNumberStyle}>{company.number_of_employees || 0}</div>
                  <div style={statLabelStyle}>Employees</div>
                </div>
              </div>

              <div style={cardActionsStyle}>
                {(user?.role === 'admin' || user?.role === 'manager') ? (
                  <>
                    <Link
                      to={`/companies/${company.id}`}
                      style={{ ...actionButtonStyle, backgroundColor: '#3b82f6', color: '#ffffff' }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                      View
                    </Link>
                    <Link
                      to={`/companies/${company.id}/edit`}
                      style={editButtonStyle}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(company.id, company.company_name);
                      }}
                      style={deleteButtonStyle}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#fef2f2'}
                    >
                      Delete
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompaniesList;
