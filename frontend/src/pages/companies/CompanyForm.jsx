import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../services/apiService';

const CompanyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    company_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchCompany();
    }
  }, [id, isEdit]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCompany(id);
      setFormData({
        company_name: data.company_name
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company_name.trim()) {
      setError('Company name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (isEdit) {
        await apiService.updateCompany(id, formData);
      } else {
        await apiService.createCompany(formData);
      }

      navigate('/companies');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: '24px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginTop: '24px'
  };

  const headerStyle = {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0'
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
    marginBottom: '16px',
    cursor: 'pointer',
    border: 'none'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  };

  const inputStyle = {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '8px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    borderRadius: '6px',
    border: '1px solid #fecaca'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px'
  };

  const buttonBaseStyle = {
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s'
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: loading ? '#9ca3af' : '#3b82f6',
    color: '#ffffff'
  };

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#ffffff',
    color: '#374151',
    border: '1px solid #d1d5db'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '48px',
    fontSize: '16px',
    color: '#6b7280'
  };

  if (loading && isEdit) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading company...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <button
        onClick={() => navigate('/companies')}
        style={backButtonStyle}
        onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
      >
        ← Back to Companies
      </button>

      <div style={headerStyle}>
        <h1 style={titleStyle}>
          {isEdit ? 'Edit Company' : 'Create New Company'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldStyle}>
          <label htmlFor="company_name" style={labelStyle}>
            Company Name *
          </label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Enter company name"
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <div style={buttonContainerStyle}>
          <button
            type="button"
            onClick={() => navigate('/companies')}
            style={secondaryButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={primaryButtonStyle}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = '#3b82f6';
            }}
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Company' : 'Create Company')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
