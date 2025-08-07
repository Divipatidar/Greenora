import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  CreditCard, 
  CheckCircle, 
  Shield, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import OrderServices from '../Services/OrderServices';
import { sendEmail } from '../Services/EmailSErvices';
const Payment = () => {
  const { auth } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          resolve(false);
        };
        document.head.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    
    if (!auth.isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!auth.user.addresId) {
      alert('Please add a delivery address first.');
      navigate('/address');
      return;
    }
  }, [auth, navigate]);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }

    try {
      setLoading(true);
      
      

      const order = await OrderServices.placeOrder({
        userId: auth.user.id,
        addressId: auth.user.addresId,
        couponId: null
      });
      
      const options = {
        key: "rzp_test_3XPbZ2s4nAbtpD",
        amount: order.amount * 100, 
        currency: order.currency,
        name: "Greenora",
        description: "Organic Products Purchase",
        order_id:order.razorpayOrderId,
        handler: async function (response) {
          try {
            console.log('Payment successful:', response);
            await clearCart();
            await sendEmail
             ({
              to: auth.user.email,
              subject: 'Payment Confirmation',
              body: `Your payment of ₹${order.amount} was successful. Thank you for shopping with us!`
            });
            navigate('/payment/success?orderId=' + order.id);
          } catch (error) {
            console.error('Payment completion error:', error);
            alert('Payment completed but there was an error. Please contact support.');
          }
        },
        prefill: {
          name: auth.user.name || '',
          email: auth.user.email || '',
          contact: auth.user.phoneNumber || ''
        },
        notes: {
          address: "Delivery address from user profile",
          order_id: order.id
        },
        theme: {
          color: "#10B981"
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
                  Payment
                </h1>
                <p className="text-xs text-green-600 font-semibold tracking-wide">
                  Complete your purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-green-800 mb-6">Payment</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <hr className="my-4" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-green-600" />
                    <span className="font-semibold">Razorpay Payment Gateway</span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Secure payment powered by Razorpay. You'll be redirected to complete your payment.
                  </p>
                </div>

                {/* Payment Requirements */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">Payment Requirements</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Credit/Debit card or UPI payment
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Payment confirmation will be sent via email
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Order will be processed after successful payment
                    </li>
                  </ul>
                </div>

                {/* Security Notice */}
                <div className="mt-6 bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Secure Payment</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Checkout
              </button>
              <button
                onClick={handlePayment}
                disabled={loading || !razorpayLoaded}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : !razorpayLoaded ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Loading Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay ₹{total.toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;