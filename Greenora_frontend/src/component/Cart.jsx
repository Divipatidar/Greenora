import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Heart, 
  Star, 
  ArrowRight, 
  Tag, 
  Truck, 
  Shield, 
  RotateCcw,
  Gift,
  AlertCircle,
  X
} from 'lucide-react';
import '../styles/Cart.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import couponServices from '../Services/CouponServices';
import cartServices from '../Services/CartServices';
import { Link } from 'react-router-dom';
const CartPage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.isLoggedIn) {
        navigate('/login');
      } else {
        loadCartData();
      }
    }
  }, [auth.isLoggedIn, navigate, auth.isLoading]);

  // Add a refresh function that can be called
  const refreshCart = () => {
    if (!auth.isLoggedIn) {
      navigate('/login');
      return;
    }
      loadCartData();
    
  };

  useEffect(() => {
       couponServices.fetchActiveCoupon().then(setAvailableCoupons);  
  },[auth.isLoggedIn]);

  const loadCartData = async () => {
    try {
      setCartLoading(true);
      const cartData = await cartServices.getCart(auth.user.id);
      
      let items = [];
      if (cartData && Array.isArray(cartData.items)) {
        items = cartData.items;
      }
      
      // Correctly map the nested product data from the API response
      items = items.map(item => ({
        id: item.product.id,
        cartItemId: item.id, // Keep cart item ID for removal
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.image,
        category: item.product.category.name,
        rating: item.product.ecoRating, // Mapping ecoRating to rating
        reviews: item.product.reviews || 0,
        originalPrice: item.product.originalPrice || 0,
        discount: item.product.discount || 0,
        organic: item.product.ecoRating >= 4, // Assuming an ecoRating of 4 or more implies 'organic'
        inStock: item.product.stockStatus === 'IN_STOCK'
      }));
      
      setCartItems(items);
      
      const coupons = await couponServices.fetchActiveCoupon();
      setAvailableCoupons(coupons || []);
    } catch (error) {
      console.error('Error loading cart data:', error);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (!auth.isLoggedIn) {
      navigate('/login');
      return;
    }

    if (newQuantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      await cartServices.updateCartItem(auth.user.id, id, newQuantity);
      setCartItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (id) => {
    if (!auth.isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const cartItem = cartItems.find(item => item.id === id);
      if (cartItem) {
        await cartServices.removeFromCart(auth.user.id,cartItem.id);
        setCartItems(items => items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const addToWishlist = async (item) => {
    if (!auth.isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
      if (cartItem) {
        await cartServices.removeFromCart(auth.user.id,cartItem.id);
      }
      
      setWishlistItems(prev => {
        const existingItem = prev.find(wishItem => wishItem.id === item.id);
        if (existingItem) {
          return prev;
        }
        return [...prev, { ...item, addedToWishlist: new Date() }];
      });
      setCartItems(items => items.filter(cartItem => cartItem.id !== item.id));
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const moveToCart = async (wishlistItem) => {
    if (!auth.isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      await cartServices.addToCart(auth.user.id, wishlistItem.id, 1);
      setCartItems(prev => {
        const existingItem = prev.find(cartItem => cartItem.id === wishlistItem.id);
        if (existingItem) {
          return prev.map(item => 
            item.id === wishlistItem.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...wishlistItem, quantity: 1 }];
      });
      removeFromWishlist(wishlistItem.id);
    } catch (error) {
      console.error('Error moving to cart:', error);
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    try {
      setLoading(true);
      const response = await couponServices.validateCoupon(promoCode, subtotal);
      if (response && response.valid) {
        setAppliedPromo({
          code: response.coupon.couponCode,
          discount: response.coupon.discountValue,
          amount: response.discountType === 'fixed' 
                  ? response.discount 
                  : (subtotal * response.discount / 100)
        });
        setPromoCode('');
        setShowPromoInput(false);
      } else {
        alert(response.error || 'Invalid promo code. Please try again.');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      alert('Failed to apply promo code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/address');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50; // Assuming free shipping over 500
  const promoDiscount = appliedPromo ? appliedPromo.amount : 0;
  const tax = (subtotal - promoDiscount) * 0.08;
  const total = subtotal + shipping - promoDiscount + tax;

  // Filter items - assume all items are in stock if inStock property is not set
  const inStockItems = cartItems.filter(item => item.inStock !== false);
  const outOfStockItems = cartItems.filter(item => item.inStock === false);

  if (!auth.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view your cart.</p>
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
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-full">
               <Link to="/">
                   <Leaf className="h-8 w-8 text-white cursor-pointer" />
                </Link>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
                <p className="text-xs text-green-600 font-semibold tracking-wide">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-green-800 mb-2">Shopping Cart</h2>
              <p className="text-green-600">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <button 
              onClick={refreshCart}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh Cart
            </button>
          </div>
        </div>

        {cartLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-green-700 text-lg font-semibold">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 && wishlistItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl max-w-md mx-auto">
              <ShoppingBag className="h-24 w-24 text-green-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-green-800 mb-4">Your cart is empty</h3>
              <p className="text-green-600 mb-8">Start shopping for fresh organic products!</p>
              <button 
                onClick={() => navigate('/')}
                className="cart-btn primary w-full"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* In Stock Items */}
              {inStockItems.length > 0 && (
                <div className="cart-section">
                  <h3 className="section-title">Available Items ({inStockItems.length})</h3>
                  <div className="space-y-4">
                    {inStockItems.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="item-image">
                          <img src={item.image || 'https://via.placeholder.com/200x200?text=Product'} alt={item.name} />
                          {item.organic && (
                            <div className="organic-badge">
                              <Leaf className="h-4 w-4" />
                              Organic
                            </div>
                          )}
                          {item.discount > 0 && (
                            <div className="discount-badge">
                              -{item.discount}%
                            </div>
                          )}
                        </div>
                        
                        <div className="item-details">
                          <div className="item-header">
                            <h4 className="item-name">{item.name}</h4>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="remove-btn"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <p className="item-category">{item.category || 'General'}</p>
                          
                          <div className="item-rating">
                            <div className="stars">
                              {[...Array(5)].map((_, index) => (
                                <Star 
                                  key={index} 
                                  className={`h-4 w-4 ${index < Math.floor(item.rating || 0) ? 'star-filled' : 'star-empty'}`}
                                />
                              ))}
                            </div>
                            <span className="rating-text">({item.rating ? item.rating.toFixed(1) : '0.0'} - {item.reviews || 0} reviews)</span>
                          </div>
                          
                          <div className="item-actions">
                            <div className="quantity-controls">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="quantity-btn"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="quantity-display">{item.quantity || 1}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                className="quantity-btn"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="item-price">
                              <span className="current-price">₹{(item.price || 0).toFixed(2)}</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="original-price">₹{item.originalPrice.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="item-footer">
                            <button 
                              onClick={() => addToWishlist(item)}
                              className="action-btn"
                            >
                              <Heart className="h-4 w-4" />
                              Save for Later
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Out of Stock Items */}
              {outOfStockItems.length > 0 && (
                <div className="cart-section">
                  <h3 className="section-title out-of-stock">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Out of Stock ({outOfStockItems.length})
                  </h3>
                  <div className="space-y-4">
                    {outOfStockItems.map(item => (
                      <div key={item.id} className="cart-item out-of-stock">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                          <div className="out-of-stock-overlay">
                            <span>Out of Stock</span>
                          </div>
                        </div>
                        
                        <div className="item-details">
                          <div className="item-header">
                            <h4 className="item-name">{item.name}</h4>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="remove-btn"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <p className="item-category">{item.category}</p>
                          <p className="out-of-stock-text">This item is currently unavailable</p>
                          
                          <div className="item-footer">
                            <button 
                              onClick={() => addToWishlist(item)}
                              className="action-btn"
                            >
                              <Heart className="h-4 w-4" />
                              Save for Later
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Items */}
              {wishlistItems.length > 0 && (
                <div className="cart-section">
                  <h3 className="section-title">Saved for Later ({wishlistItems.length})</h3>
                  <div className="space-y-4">
                    {wishlistItems.map(item => (
                      <div key={item.id} className="cart-item wishlist-item">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                          {item.organic && (
                            <div className="organic-badge">
                              <Leaf className="h-4 w-4" />
                              Organic
                            </div>
                          )}
                          {item.discount > 0 && (
                            <div className="discount-badge">
                              -{item.discount}%
                            </div>
                          )}
                        </div>
                        
                        <div className="item-details">
                          <div className="item-header">
                            <h4 className="item-name">{item.name}</h4>
                            <button 
                              onClick={() => removeFromWishlist(item.id)}
                              className="remove-btn"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <p className="item-category">{item.category}</p>
                          
                          <div className="item-rating">
                            <div className="stars">
                              {[...Array(5)].map((_, index) => (
                                <Star 
                                  key={index} 
                                  className={`h-4 w-4 ${index < Math.floor(item.rating || 0) ? 'star-filled' : 'star-empty'}`}
                                />
                              ))}
                            </div>
                            <span className="rating-text">({item.rating ? item.rating.toFixed(1) : '0.0'} - {item.reviews || 0} reviews)</span>
                          </div>
                          
                          <div className="item-price">
                            <span className="current-price">₹{item.price.toFixed(2)}</span>
                            {item.originalPrice > item.price && (
                              <span className="original-price">₹{item.originalPrice.toFixed(2)}</span>
                            )}
                          </div>
                          
                          <div className="item-footer">
                            <button 
                              onClick={() => moveToCart(item)}
                              className="action-btn primary"
                            >
                              <Plus className="h-4 w-4" />
                              Move to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="cart-summary">
                <h3 className="summary-title">Order Summary</h3>
                
                {/* Summary Details */}
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal ({inStockItems.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'free-shipping' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {appliedPromo && (
                    <div className="summary-row promo-row">
                      <span className="promo-code">
                        {appliedPromo.code} (-{appliedPromo.discount}%)
                        <button 
                          onClick={removePromoCode}
                          className="remove-promo"
                        >
                          ×
                        </button>
                      </span>
                      <span className="discount-amount">-₹{appliedPromo.amount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Available Coupons */}
                {availableCoupons.length > 0 && (
                  <div className="coupons-section">
                    <h4 className="coupons-title">Available Coupons</h4>
                    <div className="coupons-list">
                      {availableCoupons.map(coupon => (
                        <div key={coupon.id} className="coupon-item">
                          <div className="coupon-code">Code: {coupon.couponCode}</div>
                          <div className="coupon-description">Discount: {coupon.discountValue}% off</div>
                          <div className="coupon-description">Min. Order: ₹{coupon.minOrderAmt.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Promo Code */}
                <div className="promo-section">
                  {!showPromoInput ? (
                    <button 
                      onClick={() => setShowPromoInput(true)}
                      className="promo-toggle"
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Have a promo code?
                    </button>
                  ) : (
                    <div className="promo-input">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="promo-field"
                      />
                      <button 
                        onClick={applyPromoCode}
                        disabled={loading}
                        className="apply-btn"
                      >
                        {loading ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={proceedToCheckout}
                  disabled={cartItems.length === 0}
                  className="checkout-btn"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>

                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="trust-item">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span>Free shipping on orders over ₹500</span>
                  </div>
                  <div className="trust-item">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="trust-item">
                    <RotateCcw className="h-5 w-5 text-green-600" />
                    <span>30-day return policy</span>
                  </div>
                  <div className="trust-item">
                    <Gift className="h-5 w-5 text-green-600" />
                    <span>Gift wrapping available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;