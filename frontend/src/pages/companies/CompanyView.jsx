import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../../services/apiService';

const CompanyView = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const [companyData, departmentsData] = await Promise.all([
        apiService.getCompany(id),
        apiService.getCompanyDepartments(id)
      ]);
      setCompany(companyData);
      setDepartments(departmentsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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

  const companyInfoStyle = {
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

  const departmentListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px'
  };

  const departmentCardStyle = {
    padding: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    transition: 'all 0.2s'
  };

  const departmentNameStyle = {
    fontSize: '16px',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '8px'
  };

  const departmentStatsStyle = {
    fontSize: '14px',
    color: '#6b7280'
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
        <div style={loadingStyle}>Loading company...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <Link
          to="/companies"
          style={backButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          ← Back to Companies
        </Link>
        <div style={errorStyle}>
          {error}
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div style={containerStyle}>
        <Link
          to="/companies"
          style={backButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          ← Back to Companies
        </Link>
        <div style={errorStyle}>
          Company not found
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Link
        to="/companies"
        style={backButtonStyle}
        onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
      >
        ← Back to Companies
      </Link>

      <div style={headerStyle}>
        <div style={companyInfoStyle}>
          <div style={iconStyle}>
            🏢
          </div>
          <div>
            <h1 style={nameStyle}>{company.company_name}</h1>
          </div>
        </div>
        <Link
          to={`/companies/${company.id}/edit`}
          style={editButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          ✏️ Edit Company
        </Link>
      </div>

      <div style={statsStyle}>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{company.number_of_departments || 0}</div>
          <div style={statLabelStyle}>Departments</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{company.number_of_employees || 0}</div>
          <div style={statLabelStyle}>Total Employees</div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          <span>🏬</span>
          <span>Departments</span>
        </h2>
        
        {departments.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏬</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No departments found</h3>
            <p>This company doesn't have any departments yet.</p>
            <Link
              to="/departments/new"
              style={{
                ...editButtonStyle,
                marginTop: '16px',
                backgroundColor: '#10b981'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              ➕ Add Department
            </Link>
          </div>
        ) : (
          <div style={departmentListStyle}>
            {departments.map((department) => (
              <Link
                key={department.id}
                to={`/departments/${department.id}`}
                style={{
                  ...departmentCardStyle,
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={departmentNameStyle}>{department.department_name}</div>
                <div style={departmentStatsStyle}>
                  {department.number_of_employees || 0} employees
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyView;
