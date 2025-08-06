import React, { useEffect, useState } from 'react';
import { Leaf, Package, Calendar, DollarSign, Truck, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import OrderServices from '../Services/OrderServices';
import couponServices from '../Services/CouponServices';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Don't redirect while auth is loading
    if (auth.isLoading) {
      return;
    }
    
    if (!auth.isLoggedIn) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [auth, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await OrderServices.getOrderByUser(auth.user.id);
      setOrders(ordersData || []);
      
      if (ordersData && ordersData.length > 0) {
        const couponsData = await couponServices.fetchActiveCoupon();
        setCoupons(couponsData || []);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!auth.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view your orders.</p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-green-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-full hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => navigate('/')}
                title="Go to Home"
              >
                <Leaf className="w-8 h-8 text-white" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  My Orders
                </h1>
                <p className="text-sm text-green-600 font-semibold">Track your orders and deliveries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full w-16 h-16 border-4 border-green-200 border-t-green-600 mx-auto mb-6"></div>
            <p className="text-green-700 text-lg font-semibold">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={loadOrders}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <Package className="w-24 h-24 text-green-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-green-800 mb-4">No Orders Yet</h3>
              <p className="text-green-600 mb-8">Start shopping to see your orders here!</p>
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100 hover:shadow-2xl transition-shadow duration-300">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">Order #{order.id}</h3>
                      <p className="text-green-100 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{formatDate(order.orderDate)}</span>
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.deliveryStatus)} bg-white/95`}>
                        {getStatusIcon(order.deliveryStatus)}
                        <span className="ml-2">{order.deliveryStatus || 'Processing'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.orderItems && order.orderItems.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <img 
                          src={item.product?.image || 'https://via.placeholder.com/80x80?text=Product'} 
                          alt={item.product?.name || 'Product'}
                          className="w-8 h-8 object-cover rounded-full shadow-md flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-lg mb-1">{item.product?.name || 'Product'}</h4>
                          <p className="text-gray-600 text-sm mb-1">Quantity: <span className="font-medium">{item.quantity}</span></p>
                          <p className="text-green-600 font-bold text-lg">₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-center sm:text-left">
                        <p className="text-gray-600 text-sm font-medium">Total Amount</p>
                        <p className="text-3xl font-bold text-green-600">₹{order.totalAmt || 0}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300 flex items-center justify-center font-semibold transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>

                  {/* Order Details */}
                  {selectedOrder === order.id && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-green-100">
                      <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-green-600" />
                        Order Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Order ID:</span>
                            <span className="font-semibold text-gray-800">#{order.id}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Order Date:</span>
                            <span className="font-semibold text-gray-800">{formatDate(order.orderDate)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.deliveryStatus)}`}>
                              {order.deliveryStatus || 'Processing'}
                            </span>
                          </div>
                          {order.deliveryDate && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-gray-600">Expected Delivery:</span>
                              <span className="font-semibold text-gray-800">{formatDate(order.deliveryDate)}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="font-semibold text-gray-800">Online Payment</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Customer:</span>
                            <span className="font-semibold text-gray-800">{order.user?.name || order.user?.email || 'N/A'}</span>
                          </div>
                          {order.coupon && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-gray-600">Coupon Used:</span>
                              <span className="font-semibold text-green-600">{order.coupon.code || order.coupon.name || 'Applied'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;