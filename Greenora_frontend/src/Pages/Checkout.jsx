import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  MapPin, 
  Plus, 
  Edit, 
  ArrowRight, 
  ArrowLeft,
  CreditCard,
  CheckCircle,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import addressService from '../Services/AddressService';
import OrderServices from '../Services/OrderServices';

const Checkout = () => {
  const { auth } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('address'); // address, confirmation

  useEffect(() => {
    // Don't redirect while auth is loading
    if (auth.isLoading) {
      return;
    }
    
    if (!auth.isLoggedIn) {
      navigate('/login');
      return;
    }

    loadAddresses();
  }, [auth, navigate]);

  const loadAddresses = async () => {
    try {
      const addressData = await addressService.getbyid(auth.user.addresId);
      setAddresses(addressData ? [addressData] : []);
    } catch (error) {
      console.error('Error loading addresses:', error);
      setAddresses([]);
    }
  };

  const proceedToPayment = () => {
    if (addresses.length === 0) {
      alert('Please add a delivery address first.');
      navigate('/address');
      return;
    }

    navigate('/payment');
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
                <Link to="/">
                   <Leaf className="h-8 w-8 text-white cursor-pointer" />
                </Link>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  {checkoutStep === 'address' ? 'Delivery Address' :
                   checkoutStep === 'payment' ? 'Payment' : 'Order Confirmation'}
                </h1>
                <p className="text-xs text-green-600 font-semibold tracking-wide">
                  {checkoutStep === 'address' ? 'SELECT YOUR DELIVERY ADDRESS' :
                   checkoutStep === 'payment' ? 'COMPLETE YOUR PURCHASE' : 'THANK YOU FOR YOUR ORDER!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {checkoutStep === 'address' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-green-800 mb-6">Delivery Address</h2>
              
              {addresses.length > 0 ? (
                <div className="space-y-6">
                  {/* Show existing address with payment button */}
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
                        onClick={() => navigate('/address')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-semibold"
                        title="Edit address"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <p className="text-gray-800 font-medium text-lg">{addresses[0].street}</p>
                      <p className="text-gray-700 text-base">
                        {addresses[0].city}, {addresses[0].state} {addresses[0].pincode}
                      </p>
                      <p className="text-gray-700 text-base">{addresses[0].country}</p>
                    </div>

                    {/* Continue to Payment Button */}
                    <div className="border-t border-green-200 pt-4">
                      <button
                        onClick={proceedToPayment}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center"
                      >
                        <span>Continue to Payment</span>
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No address found</h3>
                  <p className="text-gray-500 mb-6">Add your delivery address to get started.</p>
                  <button
                    onClick={() => navigate('/address')}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </button>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {checkoutStep === 'payment' && (
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
                      <CheckCircle className="h-5 w-5 text-green-600" />
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
                  onClick={() => setCheckoutStep('address')}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                >
                  Back to Address
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
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
        )}

        {/* Confirmation Step */}
        {checkoutStep === 'confirmation' && (
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
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Total:</span>
                    <span className="font-semibold">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-semibold">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="font-semibold text-green-600">Paid</span>
                  </div>
                </div>
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
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                >
                  Continue Shopping
      </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;