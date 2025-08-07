import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Leaf, Mail, Lock, ArrowRight, CheckCircle, Check, X, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authenticationServices from '../Services/AuthenticationServices';
import { useAuth } from '../context/AuthContext'; 

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({ 
    email: '',
    password: '',
    rememberMe: false
  });

  // New state for Forgot Password modal
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordPassword, setForgotPasswordPassword] = useState(''); // New state for password
  const [forgotPasswordEmailError, setForgotPasswordEmailError] = useState('');
  const [forgotPasswordPasswordError, setForgotPasswordPasswordError] = useState(''); // New state for password error
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [showForgotPasswordPassword, setShowForgotPasswordPassword] = useState(false); // New state for showing password

  const navigate = useNavigate();
  const { login } = useAuth(); 

  // Toast functions
  const showToast = (type, title, message) => {
    const id = Date.now();
    const newToast = { id, type, title, message };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };
  

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case 'ROLE_USER':
        return '/'; 
      case 'ROLE_VENDOR':
        return '/vendor'; 
      case 'ROLE_ADMIN':
        return '/admin'; 
      default:
        return '/'; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('error', 'Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Login attempt:', formData);
      const response = await authenticationServices.login({
        email: formData.email,
        password: formData.password
      });
      
      if (response && response.jwt && response.user) {
        login(response.jwt, response.user); 
        
        console.log('Login successful! User role received:', response.user.role);

        showToast('success', 'Login Successful', 'Welcome back! Redirecting to your dashboard...');
        
        setFormData({ email: '', password: '', rememberMe: false });
        
        navigate(getRedirectPath(response.user.role), { replace: true });
      } else {
        showToast('error', 'Authentication Error', 'No authentication token or user received. Please contact support.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Server error occurred';
        
        switch (status) {
          case 401:
            showToast('error', 'Invalid Credentials', 'Email or password is incorrect. Please try again.');
            break;
          case 429:
            showToast('warning', 'Too Many Attempts', 'Too many login attempts. Please wait a moment and try again.');
            break;
          case 500:
            showToast('error', 'Server Error', 'Internal server error. Please try again later.');
            break;
          default:
            showToast('error', 'Login Failed', message);
        }
      } else if (error.request) {
        showToast('error', 'Network Error', 'Unable to connect to server. Please check your internet connection.');
      } else {
        showToast('error', 'Unexpected Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // New functions for Forgot Password logic
  const handleForgotPasswordLinkClick = (e) => {
    e.preventDefault();
    setIsForgotPasswordModalOpen(true);
  };
  
  const handleForgotPasswordEmailChange = (e) => {
    setForgotPasswordEmail(e.target.value);
    if (forgotPasswordEmailError) {
      setForgotPasswordEmailError('');
    }
  };
  
  const handleForgotPasswordPasswordChange = (e) => {
    setForgotPasswordPassword(e.target.value);
    if (forgotPasswordPasswordError) {
      setForgotPasswordPasswordError('');
    }
  };

  const validateForgotPasswordForm = () => {
    let isValid = true;
    if (!forgotPasswordEmail) {
      setForgotPasswordEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      setForgotPasswordEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    if (!forgotPasswordPassword) {
      setForgotPasswordPasswordError('Password is required');
      isValid = false;
    } else if (forgotPasswordPassword.length < 6) {
      setForgotPasswordPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    return isValid;
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validateForgotPasswordForm()) {
      showToast('error', 'Validation Error', 'Please enter a valid email and new password.');
      return;
    }
  
    setIsForgotPasswordLoading(true);
    
    try {
      // Call the authentication service method with both email and password
      const response = await authenticationServices.forgotPassword(forgotPasswordEmail, forgotPasswordPassword);
      
      showToast('success', 'Password Updated', 'Your password has been successfully updated.');
      
      setForgotPasswordEmail('');
      setForgotPasswordPassword('');
      setIsForgotPasswordModalOpen(false);
      
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Server error occurred';
        
        switch (status) {
          case 404:
            showToast('warning', 'Email Not Found', 'Email not found. Please check and try again.');
            break;
          case 429:
            showToast('warning', 'Too Many Attempts', 'Too many password reset attempts. Please wait a moment and try again.');
            break;
          case 500:
            showToast('error', 'Server Error', 'Internal server error. Please try again later.');
            break;
          default:
            showToast('error', 'Reset Failed', message);
        }
      } else if (error.request) {
        showToast('error', 'Network Error', 'Unable to connect to server. Please check your internet connection.');
      } else {
        showToast('error', 'Unexpected Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };
  
  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
    setForgotPasswordEmail('');
    setForgotPasswordPassword('');
    setForgotPasswordEmailError('');
    setForgotPasswordPasswordError('');
  };


  const Toast = ({ toast }) => {
    const getIcon = () => {
      switch (toast.type) {
        case 'success':
          return <CheckCircle2 className="toast-icon" />;
        case 'error':
          return <AlertCircle className="toast-icon" />;
        case 'warning':
          return <AlertTriangle className="toast-icon" />;
        case 'info':
          return <Info className="toast-icon" />;
        default:
          return <AlertCircle className="toast-icon" />;
      }
    };

    return (
      <div className={`toast ${toast.type}`}>
        {getIcon()}
        <div className="toast-content">
          <div className="toast-title">{toast.title}</div>
          <div className="toast-message">{toast.message}</div>
        </div>
        <button
          className="toast-close"
          onClick={() => removeToast(toast.id)}
        >
          <X className="toast-close-icon" />
        </button>
      </div>
    );
  };

  return (
    <div className="login-container">
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>

      <div className="bg-element-1"></div>
      <div className="bg-element-2"></div>
      <div className="bg-element-3"></div>

      {/* Header */}
      <header className="login-header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-wrapper">
                <div className="logo-icon">
                <Link to="/">
                   <Leaf className="h-8 w-8 text-white cursor-pointer" />
                </Link>

                </div>
                <div className="logo-indicator"></div>
              </div>
              <div className="logo-text">
                <h1>Greenora</h1>
                <p>Organic Marketplace</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          <div className="login-card">
            <div className="card-header">
              <div className="card-logo-wrapper">
                <div className="card-logo">
                  <Leaf />
                </div>
                <div className="card-logo-badge">
                  <CheckCircle />
                </div>
              </div>
              
              <h2 className="card-title">Welcome Back</h2>
              <p className="card-subtitle">Sign in to your Greenora account</p>
              <div className="card-divider"></div>
            </div>

            <div className="form-container">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-group">
                  <div className="input-icon">
                    <Mail />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                {formErrors.email && (
                  <div className="error-message">
                    <AlertCircle className="error-icon" />
                    {formErrors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <div className="input-icon">
                    <Lock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input password-input ${formErrors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {formErrors.password && (
                  <div className="error-message">
                    <AlertCircle className="error-icon" />
                    {formErrors.password}
                  </div>
                )}
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <div className="custom-checkbox">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <div className="checkbox-checkmark">
                      <Check />
                    </div>
                  </div>
                  <span className="checkbox-label">Remember me</span>
                </label>
                {/* Changed the anchor tag to a button with an onClick handler */}
                <button type="button" onClick={handleForgotPasswordLinkClick} className="forgot-password-link">
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button 
                type="submit" 
                className={`login-button ${isLoading ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                <div className="button-content">
                  {isLoading && <div className="loading-spinner"></div>}
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  {!isLoading && (
                    <div className="button-icon">
                      <ArrowRight />
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="form-divider">
              <div className="divider-line"></div>
              <div className="divider-text">
                <span>or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="social-buttons">
              <button className="social-button">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              
              <button className="social-button">
                <svg className="social-icon" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="signup-section">
              <p className="signup-text">
                Don't have an account?{' '}
                <Link to="/signup" className="signup-link">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordModalOpen && (
        <div className="modal-overlay" style={{
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
          <div className="login-card" style={{ maxWidth: '400px' }}>
            <div className="card-header" style={{ marginBottom: '1.5rem' }}>
              <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Reset Password</h2>
              <p className="card-subtitle">Enter your email and new password.</p>
            </div>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="form-group">
                <label htmlFor="forgotPasswordEmail" className="form-label">
                  Email Address
                </label>
                <div className="input-group">
                  <div className="input-icon">
                    <Mail />
                  </div>
                  <input
                    type="email"
                    id="forgotPasswordEmail"
                    name="forgotPasswordEmail"
                    value={forgotPasswordEmail}
                    onChange={handleForgotPasswordEmailChange}
                    className={`form-input ${forgotPasswordEmailError ? 'error' : ''}`}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                {forgotPasswordEmailError && (
                  <div className="error-message">
                    <AlertCircle className="error-icon" />
                    {forgotPasswordEmailError}
                  </div>
                )}
              </div>
              
              {/* New Password Input Field */}
              <div className="form-group">
                <label htmlFor="forgotPasswordPassword" className="form-label">
                  New Password
                </label>
                <div className="input-group">
                  <div className="input-icon">
                    <Lock />
                  </div>
                  <input
                    type={showForgotPasswordPassword ? 'text' : 'password'}
                    id="forgotPasswordPassword"
                    name="forgotPasswordPassword"
                    value={forgotPasswordPassword}
                    onChange={handleForgotPasswordPasswordChange}
                    className={`form-input ${forgotPasswordPasswordError ? 'error' : ''}`}
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordPassword(!showForgotPasswordPassword)}
                    className="password-toggle"
                  >
                    {showForgotPasswordPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {forgotPasswordPasswordError && (
                  <div className="error-message">
                    <AlertCircle className="error-icon" />
                    {forgotPasswordPasswordError}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="social-button"
                  onClick={closeForgotPasswordModal}
                  disabled={isForgotPasswordLoading}
                  style={{ width: 'auto', flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`login-button ${isForgotPasswordLoading ? 'loading' : ''}`}
                  disabled={isForgotPasswordLoading}
                  style={{ width: 'auto', flex: 1, padding: '0.75rem' }}
                >
                  <div className="button-content">
                    {isForgotPasswordLoading && <div className="loading-spinner"></div>}
                    {isForgotPasswordLoading ? 'Sending...' : 'Send '}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        /* General Reset & Base Styles */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.5;
          color: #333;
          background-color: #f0fdf4; /* Light green background */
        }

        /* --- Toast Notifications --- */
        .toast-container {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 1000;
          width: 100%;
          max-width: 320px;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .toast {
          pointer-events: auto;
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          color: white;
          font-weight: 500;
          animation: slideInRight 0.4s ease-out forwards;
          position: relative;
          overflow: hidden;
        }

        .toast-success {
          background: linear-gradient(135deg, #22c55e, #10b981);
        }

        .toast-error {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .toast-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .toast-info {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .toast-icon {
          margin-right: 0.5rem;
        }

        .toast-content {
          flex: 1;
        }

        .toast-title {
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .toast-message {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .toast-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          margin-left: 0.75rem;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }

        .toast-close:hover {
          opacity: 1;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* --- Login Page Layout & General Styles --- */
        .login-container {
          min-height: 100vh;
          background: linear-gradient(to bottom right, #f0fdf4, #ecfdf5, #f0fdfa);
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Animated Background Elements */
        .bg-element-1, .bg-element-2, .bg-element-3 {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 15s infinite ease-in-out;
          z-index: 0;
        }

        .bg-element-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .bg-element-2 {
          width: 300px;
          height: 300px;
          bottom: 15%;
          right: 10%;
          animation-delay: 5s;
        }

        .bg-element-3 {
          width: 250px;
          height: 250px;
          top: 50%;
          left: 40%;
          animation-delay: 10s;
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        /* Header */
        .login-header {
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 2px solid #dcfce7;
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.75rem 1rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-wrapper {
          position: relative;
        }

        .logo-icon {
          background: linear-gradient(to right, #16a34a, #059669);
          padding: 0.75rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon svg {
          height: 2rem;
          width: 2rem;
          color: white;
        }

        .logo-indicator {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 12px;
          height: 12px;
          background-color: #34d399; /* Emerald green */
          border-radius: 50%;
          border: 2px solid white;
        }

        .logo-text h1 {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(to right, #047857, #065f46);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          line-height: 2.25rem;
        }

        .logo-text p {
          font-size: 0.7rem;
          color: #065f46;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Main content area */
        .main-content {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          z-index: 1;
        }

        .content-wrapper {
          width: 100%;
          max-width: 500px; /* Adjusted max-width for login card */
        }

        /* Login Card */
        .login-card {
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .card-logo-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
        }

        .card-logo {
          background: linear-gradient(to right, #16a34a, #059669);
          padding: 1rem;
          border-radius: 9999px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-logo svg {
          height: 3rem;
          width: 3rem;
          color: white;
        }

        .card-logo-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background-color: #34d399;
          border-radius: 50%;
          padding: 0.3rem;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .card-logo-badge svg {
          width: 1rem;
          height: 1rem;
          color: white;
        }

        .card-title {
          font-size: 2rem;
          font-weight: 800;
          color: #065f46;
          margin-bottom: 0.5rem;
        }

        .card-subtitle {
          color: #065f46;
          font-size: 0.95rem;
        }

        .card-divider {
          width: 60px;
          height: 3px;
          background: linear-gradient(to right, #10b981, #34d399);
          margin: 1.5rem auto 0;
          border-radius: 9999px;
        }

        /* Form Styles */
        .form-container {
          margin-top: 2rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #065f46;
          margin-bottom: 0.5rem;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #10b981;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #a7f3d0;
          border-radius: 0.75rem;
          background-color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          color: #064e3b;
          outline: none;
          transition: all 0.2s ease-in-out;
        }

        .form-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
        }

        .error-message .error-icon {
          margin-right: 0.25rem;
          width: 1rem;
          height: 1rem;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #10b981;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #059669;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
          color: #065f46;
        }

        .custom-checkbox {
          position: relative;
          width: 18px;
          height: 18px;
          border: 2px solid #10b981;
          border-radius: 0.3rem;
          margin-right: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .checkbox-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkbox-checkmark {
          color: white;
          font-size: 0.8rem;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .checkbox-input:checked ~ .custom-checkbox {
          background-color: #10b981;
          border-color: #10b981;
        }

        .checkbox-input:checked ~ .custom-checkbox .checkbox-checkmark {
          opacity: 1;
        }
        
        .forgot-password-link {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          color: #10b981;
          text-decoration: none;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .forgot-password-link:hover {
          color: #059669;
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          background: linear-gradient(to right, #16a34a, #059669);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .login-button:hover {
          background: linear-gradient(to right, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .login-button .loading-spinner {
          animation: spin 1s linear infinite;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 0.5rem;
        }

        /* Divider */
        .form-divider {
          position: relative;
          margin: 2rem 0;
        }

        .divider-line {
          border-top: 1px solid #dcfce7;
        }

        .divider-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 0 1rem;
          color: #065f46;
          font-weight: 600;
          font-size: 0.875rem;
        }

        /* Social Buttons */
        .social-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .social-button {
          width: 100%;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #a7f3d0;
          color: #065f46;
          font-weight: 600;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease-in-out;
        }

        .social-button:hover {
          background-color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .social-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.5rem;
        }

        /* Signup Link */
        .signup-section {
          text-align: center;
          margin-top: 1.5rem;
        }

        .signup-text {
          color: #065f46;
        }

        .signup-link {
          color: #10b981;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .signup-link:hover {
          color: #059669;
          text-decoration: underline;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .login-card {
            padding: 2rem 1.5rem;
          }

          .card-title {
            font-size: 1.75rem;
          }

          .header-text h1 {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .logo-icon {
            padding: 0.5rem;
          }
          .logo-icon svg {
            height: 1.5rem;
            width: 1.5rem;
          }
          .logo-text h1 {
            font-size: 1.5rem;
          }
          .logo-text p {
            font-size: 0.6rem;
          }

          .login-card {
            padding: 1.5rem 1rem;
          }

          .card-logo-wrapper {
            width: 60px;
            height: 60px;
          }
          .card-logo svg {
            height: 2.5rem;
            width: 2.5rem;
          }

          .card-title {
            font-size: 1.5rem;
          }

          .form-input,
          .login-button,
          .social-button {
            padding: 0.6rem 1rem 0.6rem 2.2rem;
            font-size: 0.9rem;
          }

          .input-icon {
            left: 0.5rem;
          }

          .password-toggle {
            right: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;