import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  MapPin, 
  Plus, 
  Edit, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import addressService from '../Services/AddressService';

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

const AddressPage = () => {
  const { auth ,updateUser} = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({

    street: '',
    city: '',
    state: '',
    pincode: '',
    country: ''
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
    loadAddress();
  }, [auth, navigate]);

  const loadAddress = async () => {
    try {
      setLoading(true);
      const addressData = await addressService.getbyid(auth.user.addresId);
      setAddress(addressData);
    } catch (error) {
      console.error('Error loading address:', error);
      // Don't show error toast if no address exists (404 is expected)
      if (error.response?.status !== 404) {
        showToast('Failed to load address', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

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
    const requiredFields = ['street', 'city', 'state', 'pincode', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (missingFields.length > 0) {
      showToast(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
      return false;
    }

    // Validate pincode format
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      showToast('Please enter a valid 6-digit pincode', 'error');
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
      if (editingAddress) {
        await addressService.updateAddress(auth.user.addresId, formData);
        showToast('Address updated successfully!', 'success');
      } else {
       const address1= await addressService.addAddress(formData, auth.user.id);


       const updatedUser = { ...auth.user, addresId: address1.id };
      
      // Call the new updateUser function to instantly update the context
      updateUser(updatedUser); 

      setAddress([...address, address1]);
        showToast('Address added successfully!', 'success');
        
        
        // Redirect to payment flow after adding address
        setTimeout(() => {
          navigate('/checkout');
        }, 1500);
      }
      
      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: ''
      });
      loadAddress();
    } catch (error) {
      console.error('Error saving address:', error);
      showToast('Failed to save address. Please try again.', 'error');
    }
  };

  const handleEdit = () => {
    setEditingAddress(address);
    setFormData({
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || ''
    });
    setShowForm(true);
  };



  const cancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: ''
    });
  };



  if (!auth.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Required</h2>
            <p className="text-gray-600 mb-6">Please log in to manage your addresses.</p>
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
                  Address Management
                </h1>
                <p className="text-xs text-green-600 font-semibold tracking-wide">MANAGE YOUR DELIVERY ADDRESS</p>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Address Form */}
          {showForm && (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-8">
              <div className="max-w-md w-full mx-4">
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-center relative">
                    <button
                      onClick={cancelForm}
                      className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <div className="bg-white/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {editingAddress ? 'Edit Address' : 'Add Your Address'}
                    </h2>
                    <p className="text-green-100">
                      {editingAddress ? 'Update your delivery details' : 'Enter your delivery details to continue'}
                    </p>
                  </div>

                  {/* Form */}
                  <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Street Address */}
                      <div className="form-group">
                        <label className="form-label">
                          Street Address *
                        </label>
                        <div className="input-wrapper">
                          <MapPin className="input-icon" />
                          <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter your street address"
                            required
                          />
                        </div>
                      </div>

                      {/* City & State */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label">
                            City *
                          </label>
                          <div className="input-wrapper">
                            <MapPin className="input-icon" />
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="form-input"
                              placeholder="City"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            State *
                          </label>
                          <div className="input-wrapper">
                            <MapPin className="input-icon" />
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              className="form-input"
                              placeholder="State"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pincode & Country */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label">
                            Pincode *
                          </label>
                          <div className="input-wrapper">
                            <MapPin className="input-icon" />
                            <input
                              type="text"
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleInputChange}
                              className="form-input"
                              placeholder="400001"
                              maxLength="6"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Country *
                          </label>
                          <div className="input-wrapper">
                            <MapPin className="input-icon" />
                            <input
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="form-input"
                              placeholder="India"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button 
                        type="submit" 
                        className="address-button"
                      >
                        <span>{editingAddress ? 'Update Address' : 'Add Address'}</span>
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Address List */}
                      <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Address</h2>
                {!showForm && !address && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </button>
                )}
              </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading address...</p>
              </div>
            ) : !address ? (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No address found</h3>
                <p className="text-gray-500 mb-6">Add your delivery address to get started.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50 hover:border-green-300 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-green-500 p-3 rounded-full mr-4">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">Delivery Address</h3>
                        <p className="text-sm text-gray-600">
                          Your primary delivery address
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleEdit}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-semibold"
                      title="Edit address"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-800 font-medium text-lg">{address.street}</p>
                    <p className="text-gray-700 text-base">
                      {address.city}, {address.state} {address.pincode}
                    </p>
                    <p className="text-gray-700 text-base">{address.country}</p>
                  </div>

                  {/* Redirect to Payment Button */}
                  <div className="border-t border-green-200 pt-4">
                    <button
                      onClick={() => navigate('/payment')}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}
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

        /* Form Group */
        .form-group {
          margin-bottom: 1.5rem;
        }

        /* Form Label */
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        /* Input Wrapper */
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        /* Input Icon */
        .input-icon {
          position: absolute;
          left: 1rem;
          z-index: 10;
          height: 1.25rem;
          width: 1.25rem;
          color: #6b7280;
          transition: color 0.3s ease;
        }

        /* Form Input */
        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 1rem;
          font-size: 1rem;
          background-color: #ffffff;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #111827;
        }

        .form-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
          background-color: #ffffff;
        }

        .form-input:focus + .input-icon {
          color: #10b981;
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        /* Address Button */
        .address-button {
          width: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-weight: 700;
          font-size: 1.125rem;
          padding: 1rem 2rem;
          border-radius: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
          overflow: hidden;
        }

        .address-button:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
        }

        .address-button:active {
          transform: translateY(0);
          box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
        }

        .address-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .address-button:hover::before {
          left: 100%;
        }

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
      `}</style>
    </div>
  );
};

export default AddressPage; 