import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, User, Mail, Lock, Save, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import authenticationServices from '../Services/AuthenticationServices';

const Profile = () => {
  const { auth, login } = useAuth();
  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!auth.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear messages when user starts typing
    if (message) setMessage(null);
    if (error) setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      const updated = await authenticationServices.updateUser(auth.user.id, formData);
      if (updated) {
        setMessage('Profile updated successfully!');
        login(auth.token, { ...auth.user, ...formData }); // update context
        setFormData(prev => ({ ...prev, password: '' })); // clear password field
      } else {
        setError('Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-full">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-sm text-green-600 font-semibold">Manage your account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white text-center">
              <div className="bg-white/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{auth.user?.name || 'User'}</h2>
              <p className="text-green-100">{auth.user?.email}</p>
              <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                {auth.user?.role === 'ROLE_ADMIN' ? 'Administrator' : 
                 auth.user?.role === 'ROLE_VENDOR' ? 'Vendor' : 'Customer'}
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-green-700 font-semibold mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-green-700 font-semibold mb-2 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-green-700 font-semibold mb-2 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    New Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      className="w-full p-3 pr-12 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white"
                      placeholder="Leave blank to keep current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Leave blank if you don't want to change your password</p>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Update Profile
                    </>
                  )}
                </button>
              </form>

              {/* Messages */}
              {message && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">{message}</span>
                </div>
              )}
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="bg-gray-50 p-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-medium">
                    {auth.user?.role === 'ROLE_ADMIN' ? 'Administrator' : 
                     auth.user?.role === 'ROLE_VENDOR' ? 'Vendor' : 'Customer'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium">
                    {auth.user?.createdAt ? new Date(auth.user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {auth.user?.updatedAt ? new Date(auth.user.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;