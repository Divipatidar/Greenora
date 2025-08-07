import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Leaf, Mail, Lock, User, Phone, ArrowRight, Check, X, AlertCircle, CheckCircle } from 'lucide-react'; // Removed Users, ChevronDown
import authenticationServices from '../Services/AuthenticationServices.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Updated Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'toast-success' : 'toast-error';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className="toast-overlay">
      <div className={`toast-position ${bgColor} toast-notification`}>
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="toast-close-btn"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [showRoleDropdown, setShowRoleDropdown] = useState(false); // Removed
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'ROLE_USER' // Set role to ROLE_USER by default
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Removed roles array as it's no longer needed for selection
  // const roles = [
  //   { value: 'ROLE_USER', label: 'Customer', description: 'Shop organic products' },
  //   { value: 'ROLE_VENDOR', label: 'Vendor', description: 'Sell organic products' },
  // ];

  const { login } = useAuth();
  const navigate = useNavigate();

  // Show toast notification
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  // Close toast notification
  const closeToast = () => {
    setToast(null);
  };

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Full name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Full name can only contain letters and spaces';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/\s+/g, '').replace(/-/g, '');
    if (!phoneRegex.test(cleanPhone)) return 'Please enter a valid phone number';
    if (cleanPhone.length < 10) return 'Phone number must be at least 10 digits';
    return '';
  };

  // Removed validateRole as role is now fixed
  // const validateRole = (role) => {
  //   if (!role) return 'Please select an account type';
  //   return '';
  // };

  // Real-time validation
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      // case 'role': // Removed role validation
      //   error = validateRole(value);
      //   break;
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return error === '';
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {};
    newErrors.name = validateName(formData.name);
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.phone = validatePhone(formData.phone);
    // newErrors.role = validateRole(formData.role); // Removed role validation

    setErrors(newErrors);
    
    // Return true if no errors
    return Object.values(newErrors).every(error => error === '');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Real-time validation
    validateField(name, value);

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  // Removed handleRoleSelect as role is now fixed
  // const handleRoleSelect = (roleValue) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     role: roleValue
  //   }));
  //   validateField('role', roleValue);
  //   setShowRoleDropdown(false);
  // };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Medium';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return '';
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'text-red-500';
      case 2: return 'text-orange-500';
      case 3: return 'text-yellow-500';
      case 4: return 'text-blue-500';
      case 5: return 'text-green-500';
      default: return '';
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
    
    // Enhanced validation with toast
    if (!validateAllFields()) {
      const firstError = Object.values(errors).find(error => error !== '');
      showToast(firstError || 'Please fix the errors in the form', 'error');
      return;
    }

    // Your original validation logic
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill in all required fields!', 'error');
      return;
    }
    // No need to check formData.role as it's fixed to ROLE_USER
    // if (!formData.role) {
    //   showToast('Please select a role!', 'error');
    //   return;
    // }

    setIsLoading(true);

    try {
        const response = await authenticationServices.signup(formData);
      
      if (!response || !response.role) { 
        throw new Error('No user role received from server after signup. Please contact support.');
      }
      
      // Assuming 'response.jwt' might be undefined or null if not returned by signup API.
      // localStorage.setItem('token', response.jwt); // Only set if JWT is actually returned
      
      // Pass the relevant user data to the login context.
      // If 'response.jwt' is truly not returned, you might pass null or an empty string.
      login(response.jwt || null, { name: response.name, email: response.email, phone: response.phone, role: response.role }); 
      
      showToast(`Registration successful! Redirecting...`, 'success');
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'ROLE_USER' // Reset role to ROLE_USER
      });
      setErrors({});
      setTimeout(() => {
        // Access role directly from the response object for redirection
        navigate(getRedirectPath(response.role)); 
      }, 1200);
      
    } catch (error) {
      console.error('Registration error:', error);
      showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // const selectedRole = roles.find(role => role.value === formData.role); // Not needed anymore

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Header */}
      <header className="header">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="logo-wrapper">
              <div className="logo-icon">
              <Link to="/">
                 <Leaf className="h-8 w-8 text-white cursor-pointer" />
             </Link>

              </div>
              <div className="logo-text">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  Greenora
                </h1>
                <p className="text-xs text-green-600 font-semibold tracking-wide">ORGANIC MARKETPLACE</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content-wrapper">
        <div className="signup-card-container">
          {/* Signup Card */}
          <div className="signup-card">
            <div className="signup-card-header">
              <div className="signup-card-logo">
                <Leaf className="h-12 w-12 text-white mx-auto" />
              </div>
              <h2 className="signup-card-title">Join Greenora</h2>
              <p className="signup-card-subtitle">Create your account and start shopping organic</p>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                {errors.name && (
                  <p className="error-message">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="error-message">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="password-strength-bar">
                      <div 
                        className={`password-strength-fill ${getPasswordStrengthColor().replace('text-', 'bg-')}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className={`strength-text mt-1 ${getPasswordStrengthColor()}`}>
                      {getPasswordStrengthText()}
                    </p>
                  </div>
                )}
                
                {errors.password && (
                  <p className="error-message">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>
              
              {/* Phone Field */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="error-message">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Role selection removed */}
              {/* No longer need the role dropdown UI elements */}

              {/* Signup Button */}
              <button 
                type="submit" 
                className="signup-button"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="spinner"></div>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8 divider">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-200 divider-line"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/10 text-green-600 font-semibold divider-text">or</span>
              </div>
            </div>

            {/* Social Signup */}
            <div className="space-y-3 social-buttons-container">
              <button className="social-button">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
              
              <button className="social-button">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Sign up with Facebook
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6 login-link-section">
              <p className="text-green-700 login-link-text">
                Already have an account? 
                <Link to="/login" className="login-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

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
        .toast-overlay {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 1000; /* Ensure toast is on top */
          width: 100%;
          max-width: 320px; /* Limit toast width */
          pointer-events: none; /* Allow clicks through overlay if no toast */
        }

        .toast-position {
          pointer-events: auto; /* Re-enable clicks for the toast itself */
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem; /* Rounded corners */
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Soft shadow */
          color: white;
          font-weight: 500;
          animation: slideInRight 0.4s ease-out forwards; /* Animation for entry */
          margin-bottom: 0.75rem; /* Space between multiple toasts */
          position: relative;
          overflow: hidden; /* For progress bar */
        }

        .toast-success {
          background: linear-gradient(135deg, #22c55e, #10b981); /* Green gradient */
        }

        .toast-error {
          background: linear-gradient(135deg, #ef4444, #dc2626); /* Red gradient */
        }

        .toast-notification svg {
          margin-right: 0.5rem;
        }

        .toast-close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          margin-left: 0.75rem;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }

        .toast-close-btn:hover {
          opacity: 1;
        }

        /* Animations for Toast */
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

        /* --- Signup Page Layout & General Styles --- */
        .min-h-screen {
          min-height: 100vh;
        }

        .bg-gradient-to-br {
          background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
        }

        .from-green-50 { --tw-gradient-from: #f0fdf4; --tw-gradient-to: rgba(240, 253, 244, 0); }
        .via-emerald-50 { --tw-gradient-via: #ecfdf5; }
        .to-teal-50 { --tw-gradient-to: #f0fdfa; }

        /* Header */
        .header {
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 2px solid #dcfce7;
        }

        .header .container {
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding: 1rem;
        }

        .header .flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header .logo-icon {
          background: linear-gradient(to right, #16a34a, #059669);
          padding: 0.75rem;
          border-radius: 9999px;
        }

        .header .logo-icon svg {
          height: 2rem;
          width: 2rem;
          color: white;
        }

        .header .logo-text h1 {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(to right, #047857, #065f46);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .header .logo-text p {
          font-size: 0.75rem;
          color: #065f46;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Main Content Area */
        .main-content-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
          padding: 2rem 1rem;
        }

        .signup-card-container {
          width: 100%;
          max-width: 560px;
        }

        .signup-card {
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .signup-card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .signup-card-logo {
          background: linear-gradient(to right, #16a34a, #059669);
          padding: 1.25rem;
          border-radius: 9999px;
          width: 5rem;
          height: 5rem;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signup-card-logo svg {
          height: 3rem;
          width: 3rem;
          color: white;
        }

        .signup-card-title {
          font-size: 2rem;
          font-weight: 800;
          color: #065f46;
          margin-bottom: 0.5rem;
        }

        .signup-card-subtitle {
          color: #065f46;
          font-size: 1rem;
        }

        /* --- Form Group Styles --- */
        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #065f46;
          margin-bottom: 0.5rem;
        }

        .input-wrapper {
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

        .error-message svg {
          margin-right: 0.25rem;
        }

        /* Password Toggle */
        .password-toggle-btn {
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

        .password-toggle-btn:hover {
          color: #059669;
        }

        /* Password Strength Indicator */
        .password-strength-bar {
          height: 0.5rem;
          background-color: #e5e7eb; /* Gray background */
          border-radius: 9999px;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .password-strength-fill {
          height: 100%;
          transition: width 0.3s ease-in-out;
        }

        .strength-text {
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .text-red-500 { color: #ef4444; }
        .bg-red-500 { background-color: #ef4444; }
        .text-orange-500 { color: #f97316; }
        .bg-orange-500 { background-color: #f97316; }
        .text-yellow-500 { color: #f59e0b; }
        .bg-yellow-500 { background-color: #f59e0b; }
        .text-blue-500 { color: #3b82f6; }
        .bg-blue-500 { background-color: #3b82f6; }
        .text-green-500 { color: #22c55e; }
        .bg-green-500 { background-color: #22c55e; }


        /* Role Dropdown (styles kept for reference, but UI elements removed) */
        .role-dropdown-button {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #a7f3d0;
          border-radius: 0.75rem;
          background-color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          color: #064e3b;
          outline: none;
          transition: all 0.2s ease-in-out;
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }

        .role-dropdown-button:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .role-dropdown-button.error {
          border-color: #ef4444;
        }

        .role-dropdown-icon {
          transition: transform 0.2s ease;
        }

        .role-dropdown-icon.rotate-180 {
          transform: rotate(180deg);
        }

        .role-dropdown-menu {
          position: absolute;
          top: calc(100% + 0.25rem); /* Position below the button with a small gap */
          left: 0;
          right: 0;
          background-color: white;
          border: 1px solid #a7f3d0;
          border-radius: 0.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 30; /* Higher z-index to prevent overlap */
          overflow: hidden; /* Ensures rounded corners */
        }

        .role-dropdown-item {
          width: 100%;
          padding: 0.75rem 1rem;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .role-dropdown-item:hover {
          background-color: #ecfdf5; /* Light green hover */
        }

        .role-dropdown-item:not(:last-child) {
          border-bottom: 1px solid #dcfce7; /* Separator */
        }

        .role-dropdown-item .label {
          font-weight: 600;
          color: #065f46;
        }

        .role-dropdown-item .description {
          font-size: 0.875rem;
          color: #10b981;
        }

        /* Signup Button */
        .signup-button {
          width: 100%;
          background: linear-gradient(to right, #16a34a, #059669); /* Green gradient */
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
          transition: all 0.2s ease-in-out;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .signup-button:hover {
          background: linear-gradient(to right, #059669, #047857); /* Darker hover gradient */
          transform: translateY(-2px); /* Slight lift effect */
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .signup-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .signup-button .spinner {
          animation: spin 1s linear infinite;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          width: 1.25rem;
          height: 1.25rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Divider */
        .divider {
          position: relative;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .divider-line {
          border-top: 1px solid #dcfce7;
        }

        .divider-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white; /* Match card background */
          padding: 0 1rem;
          color: #065f46;
          font-weight: 600;
          font-size: 0.875rem;
        }

        /* Social Buttons */
        .social-buttons-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .social-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1rem;
          border: 1px solid #a7f3d0;
          border-radius: 0.75rem;
          background-color: rgba(255, 255, 255, 0.9);
          color: #065f46;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .social-button:hover {
          background-color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .social-button svg {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.5rem;
        }

        /* Login Link */
        .login-link-section {
          text-align: center;
          margin-top: 1.5rem;
        }

        .login-link-text {
          color: #065f46;
        }

        .login-link {
          color: #10b981;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .login-link:hover {
          color: #059669;
          text-decoration: underline;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .signup-card {
            padding: 2rem 1.5rem;
          }

          .signup-card-title {
            font-size: 1.75rem;
          }

          .header .logo-text h1 {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .header .logo-icon {
            padding: 0.5rem;
          }
          .header .logo-icon svg {
            height: 1.5rem;
            width: 1.5rem;
          }
          .header .logo-text h1 {
            font-size: 1.5rem;
          }
          .header .logo-text p {
            font-size: 0.6rem;
          }

          .signup-card {
            padding: 1.5rem 1rem;
          }

          .signup-card-logo {
            width: 4rem;
            height: 4rem;
            padding: 1rem;
          }
          .signup-card-logo svg {
            height: 2rem;
            width: 2rem;
          }

          .signup-card-title {
            font-size: 1.5rem;
          }

          .form-input,
          .role-dropdown-button,
          .social-button,
          .signup-button {
            padding: 0.6rem 1rem 0.6rem 2.2rem;
            font-size: 0.9rem;
          }

          .input-icon {
            left: 0.5rem;
          }

          .password-toggle-btn {
            right: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
