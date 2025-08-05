import React, { useEffect, useState } from 'react';
import { Leaf, Package, Calendar, DollarSign, Truck, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import OrderServices from '../Services/OrderServices';
import couponServices from '../Services/CouponServices';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!auth.isLoggedIn) return;
    loadOrders();
  }, [auth]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await OrderServices.getOrderByUser(auth.user.id);
      setOrders(ordersData.data || ordersData || []);
      
      if (ordersData && ordersData.length > 0) {
        const couponsData = await couponServices.fetchActiveCoupon();
        setCoupons(couponsData.data || couponsData || []);
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
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view your orders.</p>
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
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
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-full">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  My Orders
                </h1>
                <p className="text-sm text-green-600 font-semibold">Track your purchases</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-green-700 text-lg font-semibold">Loading your orders...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={loadOrders}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Package className="h-24 w-24 text-green-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-green-800 mb-4">No Orders Yet</h2>
              <p className="text-green-600 mb-8">Start shopping to see your orders here!</p>
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-green-800">Order History</h2>
                  <p className="text-green-600">You have {orders.length} order{orders.length !== 1 ? 's' : ''}</p>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Package className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                            <p className="text-sm text-gray-500">Placed on {formatDate(order.date || order.createdAt)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(order.status)}
                              <span>{order.status}</span>
                            </div>
                          </span>
                          
                          <button
                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            className="text-green-600 hover:text-green-700 transition-colors duration-200"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(order.date || order.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold">${order.total?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Details */}
                      {selectedOrder?.id === order.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3">Order Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Order ID:</span>
                              <span className="font-medium">#{order.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className="font-medium">{order.status}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total:</span>
                              <span className="font-medium">${order.total?.toFixed(2) || '0.00'}</span>
                            </div>
                            {order.shippingAddress && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Shipping Address:</span>
                                <span className="font-medium">{order.shippingAddress}</span>
                              </div>
                            )}
                            {order.paymentMethod && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-medium">{order.paymentMethod}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Coupons */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <Leaf className="h-6 w-6 mr-2 text-green-600" />
                  Available Coupons
                </h3>
                
                {coupons.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No coupons available at the moment.</p>
                ) : (
                  <div className="space-y-4">
                    {coupons.map(coupon => (
                      <div key={coupon.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-green-800 text-lg">{coupon.code}</span>
                          <span className="text-green-600 font-semibold">{coupon.discount}% off</span>
                        </div>
                        {coupon.description && (
                          <p className="text-sm text-green-700 mb-2">{coupon.description}</p>
                        )}
                        {coupon.expiry && (
                          <p className="text-xs text-green-600">Expires: {formatDate(coupon.expiry)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">How to use coupons:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Apply at checkout</li>
                    <li>• One coupon per order</li>
                    <li>• Cannot be combined with other offers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;