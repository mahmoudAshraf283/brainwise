import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    companies: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employeesData, departmentsData, companiesData] = await Promise.all([
        apiService.getEmployees(),
        apiService.getDepartments(),
        apiService.getCompanies()
      ]);
      
      setStats({
        employees: employeesData.length,
        departments: departmentsData.length,
        companies: companiesData.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    margin: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const statCardsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const userDetailsStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div style={statCardsStyle}>
        <div style={{ ...cardStyle, backgroundColor: '#3182ce', color: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Employees</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>{stats.employees}</p>
        </div>

        <div style={{ ...cardStyle, backgroundColor: '#f56500', color: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Departments</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>{stats.departments}</p>
        </div>

        <div style={{ ...cardStyle, backgroundColor: '#38a169', color: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Companies</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>{stats.companies}</p>
        </div>
      </div>

      {/* User Details Section */}
      <div style={userDetailsStyle}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '20px', 
          fontWeight: 'bold',
          paddingBottom: '10px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          Your Details
        </h2>
        <div style={{ 
          backgroundColor: '#f56500', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px' 
        }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ opacity: 0.9 }}>Email:</span>
            <span style={{ marginLeft: '10px', fontWeight: '500' }}>
              {user?.email}
            </span>
          </div>
          <div>
            <span style={{ opacity: 0.9 }}>Designation:</span>
            <span style={{ marginLeft: '10px', fontWeight: '500' }}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '20px', 
          fontWeight: 'bold',
          paddingBottom: '10px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          <Link 
            to="/employees/report" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            📊 View Employee Report
          </Link>
          <Link 
            to="/employees" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            👥 Manage Employees
          </Link>
          <Link 
            to="/companies" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: '#f59e0b',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
          >
            🏢 Manage Companies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;