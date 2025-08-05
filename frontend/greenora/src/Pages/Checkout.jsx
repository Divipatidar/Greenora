import React from 'react';
// import Razorpay integration here when ready
const Checkout = () => {
  // TODO: Fetch cart items from context or service
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {/* TODO: Show cart summary here */}
      <div className="mb-8 text-gray-500">Cart summary and order details coming soon.</div>
      {/* Razorpay payment button placeholder */}
      <button className="bg-green-600 text-white px-6 py-3 rounded-full font-bold mt-4" disabled>
        Pay with Razorpay (coming soon)
      </button>
    </div>
  );
};
export default Checkout;