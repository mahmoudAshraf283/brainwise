import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../services/apiService';

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    employee_name: '',
    email_address: '',
    mobile_number: '',
    address: '',
    designation: '',
    company: '',
    department: '',
    employee_status: 'application_received',
    hired_on: ''
  });
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'application_received', label: 'Application Received' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'hired', label: 'Hired' },
    { value: 'not_accepted', label: 'Not Accepted' }
  ];

  useEffect(() => {
    fetchCompanies();
    fetchDepartments();
    if (isEdit) {
      fetchEmployee();
    }
  }, [id, isEdit]);

  useEffect(() => {
    // Filter departments when company changes
    if (formData.company) {
      const filtered = departments.filter(dept => dept.company === parseInt(formData.company));
      setFilteredDepartments(filtered);
      
      // Reset department if current selection is not valid for the new company
      if (formData.department && !filtered.find(d => d.id === parseInt(formData.department))) {
        setFormData(prev => ({ ...prev, department: '' }));
      }
    } else {
      setFilteredDepartments([]);
      setFormData(prev => ({ ...prev, department: '' }));
    }
  }, [formData.company, departments]);

  const fetchCompanies = async () => {
    try {
      const data = await apiService.getCompanies();
      setCompanies(data);
    } catch (error) {
      setError('Failed to load companies');
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await apiService.getDepartments();
      setDepartments(data);
    } catch (error) {
      setError('Failed to load departments');
    }
  };

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEmployee(id);
      setFormData({
        employee_name: data.employee_name,
        email_address: data.email_address,
        mobile_number: data.mobile_number,
        address: data.address,
        designation: data.designation,
        company: data.company,
        department: data.department,
        employee_status: data.employee_status,
        hired_on: data.hired_on || ''
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear hired_on when status is not 'hired'
    if (name === 'employee_status' && value !== 'hired') {
      setFormData(prev => ({ ...prev, hired_on: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.employee_name.trim()) {
      setError('Employee name is required');
      return;
    }

    if (!formData.email_address.trim()) {
      setError('Email address is required');
      return;
    }

    if (!formData.mobile_number.trim()) {
      setError('Mobile number is required');
      return;
    }

    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }

    if (!formData.designation.trim()) {
      setError('Designation is required');
      return;
    }

    if (!formData.company) {
      setError('Company is required');
      return;
    }

    if (!formData.department) {
      setError('Department is required');
      return;
    }

    if (formData.employee_status === 'hired' && !formData.hired_on) {
      setError('Hired date is required for hired employees');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const submitData = { ...formData };
      
      // Convert string IDs to integers
      submitData.company = parseInt(formData.company);
      submitData.department = parseInt(formData.department);
      
      // Remove hired_on if status is not hired
      if (formData.employee_status !== 'hired') {
        submitData.hired_on = null;
      }

      console.log('Submitting employee data:', submitData);

      if (isEdit) {
        await apiService.updateEmployee(id, submitData);
      } else {
        await apiService.createEmployee(submitData);
      }

      navigate('/employees');
    } catch (error) {
      console.error('Employee save error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
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
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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

  const selectStyle = {
    ...inputStyle,
    backgroundColor: '#ffffff'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical'
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '8px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    borderRadius: '6px',
    border: '1px solid #fecaca',
    gridColumn: '1 / -1'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
    gridColumn: '1 / -1'
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
        <div style={loadingStyle}>Loading employee...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <button
        onClick={() => navigate('/employees')}
        style={backButtonStyle}
        onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
      >
        ← Back to Employees
      </button>

      <div style={headerStyle}>
        <h1 style={titleStyle}>
          {isEdit ? 'Edit Employee' : 'Create New Employee'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldStyle}>
          <label htmlFor="employee_name" style={labelStyle}>
            Employee Name *
          </label>
          <input
            type="text"
            id="employee_name"
            name="employee_name"
            value={formData.employee_name}
            onChange={handleChange}
            placeholder="Enter employee name"
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="email_address" style={labelStyle}>
            Email Address *
          </label>
          <input
            type="email"
            id="email_address"
            name="email_address"
            value={formData.email_address}
            onChange={handleChange}
            placeholder="Enter email address"
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="mobile_number" style={labelStyle}>
            Mobile Number *
          </label>
          <input
            type="tel"
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            placeholder="+1234567890"
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="designation" style={labelStyle}>
            Designation *
          </label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Enter designation"
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="company" style={labelStyle}>
            Company *
          </label>
          <select
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            style={selectStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          >
            <option value="">Select a company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.company_name}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label htmlFor="department" style={labelStyle}>
            Department *
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            style={selectStyle}
            disabled={!formData.company}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          >
            <option value="">Select a department</option>
            {filteredDepartments.map(department => (
              <option key={department.id} value={department.id}>
                {department.department_name}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label htmlFor="employee_status" style={labelStyle}>
            Status *
          </label>
          <select
            id="employee_status"
            name="employee_status"
            value={formData.employee_status}
            onChange={handleChange}
            required
            style={selectStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {formData.employee_status === 'hired' && (
          <div style={fieldStyle}>
            <label htmlFor="hired_on" style={labelStyle}>
              Hired Date *
            </label>
            <input
              type="date"
              id="hired_on"
              name="hired_on"
              value={formData.hired_on}
              onChange={handleChange}
              required
              style={inputStyle}
              max={new Date().toISOString().split('T')[0]}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
        )}

        <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          <label htmlFor="address" style={labelStyle}>
            Address *
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            required
            style={textareaStyle}
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
            onClick={() => navigate('/employees')}
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
            {loading ? 'Saving...' : (isEdit ? 'Update Employee' : 'Create Employee')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
