import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Companies', href: '/companies', icon: '🏢' },
    { name: 'Departments', href: '/departments', icon: '🏛️' },
    { name: 'Employees', href: '/employees', icon: '👥' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const headerStyle = {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: '0',
    zIndex: '50'
  };

  const navStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr',
    gap: '16px',
    alignItems: 'center',
    height: '64px'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit'
  };

  const logoIconStyle = {
    height: '32px',
    width: '32px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px'
  };

  const logoTextStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827'
  };

  const navLinksStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  };

  const navLinkStyle = (href) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    color: isActive(href) ? '#3b82f6' : '#6b7280',
    backgroundColor: isActive(href) ? '#eff6ff' : 'transparent',
    transition: 'all 0.2s'
  });

  const profileSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px'
  };

  const profileButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    position: 'relative'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '4px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    minWidth: '180px',
    zIndex: '10'
  };

  const dropdownItemStyle = {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#374151',
    textAlign: 'left',
    textDecoration: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        {/* Logo and Brand */}
        <div>
          <Link to="/" style={logoStyle}>
            <div style={logoIconStyle}>
              <span style={{ color: 'white', fontSize: '16px' }}>🧠</span>
            </div>
            <span style={logoTextStyle}>BrainWise</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div style={navLinksStyle}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              style={navLinkStyle(item.href)}
            >
              <span style={{ marginRight: '8px' }}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Profile Section */}
        <div style={profileSectionStyle}>
          {/* Admin Dashboard Link */}
          {(user?.is_staff || user?.is_superuser || user?.role === 'admin') && (
            <a
              href="http://localhost:8000/admin/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: '#dc2626',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
              title="Django Admin Dashboard"
            >
              <span style={{ marginRight: '6px', fontSize: '16px' }}>⚙️</span>
              Admin
            </a>
          )}
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={profileButtonStyle}
            >
              <span style={{ fontSize: '16px' }}>👤</span>
              <span>{user?.first_name || user?.email || 'User'}</span>
              <span style={{ fontSize: '12px' }}>▼</span>
            </button>

            {isProfileMenuOpen && (
              <div style={dropdownStyle}>
                <div style={{ ...dropdownItemStyle, cursor: 'default', color: '#6b7280' }}>
                  {user?.email}
                </div>
                <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }}></div>
                <button
                  onClick={handleLogout}
                  style={{
                    ...dropdownItemStyle,
                    ':hover': { backgroundColor: '#f3f4f6' }
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <span style={{ marginRight: '8px' }}>🚪</span>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
