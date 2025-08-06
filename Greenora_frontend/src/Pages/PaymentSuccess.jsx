import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  CheckCircle, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import OrderServices from '../Services/OrderServices';
const PaymentSuccess = () => {
  const { auth } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null); // Add state for order details
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    // Don't redirect while auth is loading
    if (auth.isLoading) {
      return;
    }
    
    if (!auth.isLoggedIn) {
      navigate('/login');
      return;
    }

    // Get order ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId');
    setOrderId(orderIdParam);

    // Fetch order details if orderId exists
    if (orderIdParam) {
      fetchOrderDetails(orderIdParam);
    }
  }, [auth, navigate]);

  // Add function to fetch order details
  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      const details = await OrderServices.getOrder(id);
      setOrderDetails(details);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use order details if available, otherwise fall back to cart items
  const total = orderDetails 
    ? orderDetails.totalAmount
    : cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const itemCount = orderDetails 
    ? orderDetails.items?.length || orderDetails.itemCount
    : cartItems.length;

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
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  Order Confirmation
                </h1>
                <p className="text-xs text-green-600 font-semibold tracking-wide">
                  Thank you for your order!
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-green-800 mb-4">Order Confirmed!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. Your order has been successfully placed and payment has been processed.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h3>
              {loading ? (
                <div className="text-gray-500">Loading order details...</div>
              ) : (
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold">{orderDetails?.id || orderId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Total:</span>
                    <span className="font-semibold">₹{orderDetails?.totalAmt.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="font-semibold text-green-600">
                      {orderDetails?.paymentStatus || 'Paid'}
                    </span>
                  </div>
                  {orderDetails?.orderDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-semibold">
                        {new Date(orderDetails.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {orderDetails?.deliveryStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Status:</span>
                      <span className="font-semibold text-blue-600">
                        {orderDetails.deliveryStatus}
                      </span>
                    </div>
                  )}
                  {orderDetails?.deliveryDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Delivery:</span>
                      <span className="font-semibold">
                        {new Date(orderDetails.deliveryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {orderDetails?.coupon && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coupon Applied:</span>
                      <span className="font-semibold text-green-600">
                        {orderDetails.coupon.code || orderDetails.coupon.name || 'Applied'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;