// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  key:'rzp_test_3XPbZ2s4nAbtpD',
  currency: 'INR',
  name: 'Greenora',
  description: 'Eco-friendly products',
  theme: {
    color: '#059669'
  }
};

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(window.Razorpay);
    };
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay script'));
    };
    document.head.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initializePayment = async (paymentData) => {
  try {
    const Razorpay = await loadRazorpayScript();
    
    const options = {
      key: RAZORPAY_CONFIG.key,
      amount: paymentData.amount,
      currency: RAZORPAY_CONFIG.currency,
      name: RAZORPAY_CONFIG.name,
      description: RAZORPAY_CONFIG.description,
      order_id: paymentData.orderId,
      handler: paymentData.handler,
      prefill: paymentData.prefill || {},
      notes: paymentData.notes || {},
      theme: RAZORPAY_CONFIG.theme,
      modal: {
        ondismiss: () => {
          if (paymentData.onDismiss) {
            paymentData.onDismiss();
          }
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
    
    return rzp;
  } catch (error) {
    console.error('Error initializing Razorpay payment:', error);
    throw error;
  }
};
 