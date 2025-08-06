import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  User, 
  Mail, 
  Lock, 
  Save, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Phone,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthenticationServices from '../Services/AuthenticationServices';


// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} border rounded-lg p-4 shadow-lg flex items-center space-x-3 max-w-sm`}>
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  useEffect(() => {
    // Don't redirect while auth is loading
    if (auth.isLoading) {
      return;
    }
    
    if (!auth.isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load user data
    if (auth.user) {
      setFormData(prev => ({
        ...prev,
        name: auth.user.name || '',
        email: auth.user.email || '',
        phoneNumber: auth.user.phoneNumber || ''
      }));
    }


  }, [auth, navigate]);



  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      showToast('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showToast('Please enter a valid email address');
      return false;
    }

    if (formData.phoneNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber)) {
      showToast('Please enter a valid phone number');
      return false;
    }

    if (formData.password && formData.password.length < 6) {
      showToast('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      };

      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await AuthenticationServices.updateUser(auth.user.id, updateData);
      
      if (response) {
        showToast('Profile updated successfully!', 'success');
        
        // Clear password field on success
        setFormData(prev => ({
          ...prev,
          password: ''
        }));
      } else {
        showToast('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!auth.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-green-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-full cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/')}
                title="Go to Home"
              >
                <Link to="/">
                   <Leaf className="h-8 w-8 text-white cursor-pointer" />
                </Link>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  Profile
                </h1>
                <p className="text-xs text-green-600 font-semibold tracking-wide">MANAGE YOUR ACCOUNT</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="flex items-center space-x-6 relative z-10">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <User className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{auth.user?.name || 'User'}</h2>
                <p className="text-green-100 text-lg">{auth.user?.email || 'user@example.com'}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                    {auth.user?.role || 'Customer'}
                  </span>
                  <span className="text-green-100 text-sm">
                    Member since {new Date(auth.user?.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

                    {/* Profile Form */}
          <div className="form-container p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Edit Profile</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="form-label">
                    <User className="h-4 w-4" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="form-label">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="form-label">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="form-label">
                    <Lock className="h-4 w-4" />
                    New Password (leave blank to keep current)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input w-full pr-12"
                      placeholder="Enter new password (min 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-button w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <style jsx>{`
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
        }

        /* Profile Header */
        .profile-header {
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 1.5rem;
          padding: 2rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .profile-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        /* Form Styling */
        .form-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-input {
          background: #ffffff;
          border: 2px solid #e5e7eb;
          border-radius: 1rem;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .form-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
          transform: translateY(-1px);
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }

        .form-label svg {
          margin-right: 0.5rem;
          color: #10b981;
        }

        /* Submit Button */
        .submit-button {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-weight: 700;
          font-size: 1.125rem;
          padding: 1rem 2rem;
          border-radius: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
          overflow: hidden;
        }

        .submit-button:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
        }

        .submit-button:active {
          transform: translateY(0);
          box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .submit-button:hover::before {
          left: 100%;
        }

        /* Toast Animation */
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-header {
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }
          
          .form-container {
            margin: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;