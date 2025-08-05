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
import couponServices from '../Services/CouponServices';

const CartPage = () => {
  const { auth } = useAuth();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Organic Avocados",
      price: 24.99,
      originalPrice: 29.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400",
      category: "Fresh Fruits",
      inStock: true,
      organic: true,
      rating: 4.8,
      reviews: 124,
      discount: 17
    },
    {
      id: 2,
      name: "Organic Baby Spinach",
      price: 12.99,
      originalPrice: 15.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
      category: "Leafy Greens",
      inStock: true,
      organic: true,
      rating: 4.6,
      reviews: 89,
      discount: 19
    },
    {
      id: 3,
      name: "Organic Quinoa",
      price: 18.99,
      originalPrice: 22.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
      category: "Grains",
      inStock: false,
      organic: true,
      rating: 4.9,
      reviews: 156,
      discount: 17
    }
  ]);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isLoggedIn) {
      loadAvailableCoupons();
    }
  }, [auth]);

  const loadAvailableCoupons = async () => {
    try {
      setLoading(true);
      const coupons = await couponServices.fetchActiveCoupon();
      setAvailableCoupons(coupons);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const addToWishlist = (item) => {
    setWishlistItems(prev => {
      const existingItem = prev.find(wishItem => wishItem.id === item.id);
      if (existingItem) {
        return prev;
      }
      return [...prev, { ...item, addedToWishlist: new Date() }];
    });
    removeItem(item.id);
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const moveToCart = (wishlistItem) => {
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
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    try {
      setLoading(true);
      const response = await couponServices.validateCoupon(promoCode, subtotal);
      if (response && response.data) {
        setAppliedPromo({
          code: promoCode.toUpperCase(),
          discount: response.data.discount,
          amount: response.data.amount
        });
        setPromoCode('');
        setShowPromoInput(false);
      } else {
        alert('Invalid promo code. Please try again.');
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const promoDiscount = appliedPromo ? appliedPromo.amount : 0;
  const tax = (subtotal - promoDiscount) * 0.08;
  const total = subtotal + shipping - promoDiscount + tax;

  const inStockItems = cartItems.filter(item => item.inStock);
  const outOfStockItems = cartItems.filter(item => !item.inStock);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-green-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-full">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  Greenora
                </h1>
                <p className="text-xs text-green-600 font-semibold tracking-wide">ORGANIC MARKETPLACE</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-green-800 mb-2">Shopping Cart</h2>
          <p className="text-green-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 && wishlistItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl max-w-md mx-auto">
              <ShoppingBag className="h-24 w-24 text-green-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-green-800 mb-4">Your cart is empty</h3>
              <p className="text-green-600 mb-8">Start shopping for fresh organic products!</p>
              <button className="cart-btn primary w-full">
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
                              onClick={() => removeItem(item.id)}
                              className="remove-btn"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <p className="item-category">{item.category}</p>
                          
                          <div className="item-rating">
                            <div className="stars">
                              {[1,2,3,4,5].map(star => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= Math.floor(item.rating) ? 'star-filled' : 'star-empty'}`}
                                />
                              ))}
                            </div>
                            <span className="rating-text">({item.reviews})</span>
                          </div>
                          
                          <div className="item-actions">
                            <div className="quantity-controls">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="quantity-btn"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="quantity-display">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="quantity-btn"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="item-price">
                              <span className="current-price">${item.price.toFixed(2)}</span>
                              {item.originalPrice > item.price && (
                                <span className="original-price">${item.originalPrice.toFixed(2)}</span>
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
                              {[1,2,3,4,5].map(star => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= Math.floor(item.rating) ? 'star-filled' : 'star-empty'}`}
                                />
                              ))}
                            </div>
                            <span className="rating-text">({item.reviews})</span>
                          </div>
                          
                          <div className="item-price">
                            <span className="current-price">${item.price.toFixed(2)}</span>
                            {item.originalPrice > item.price && (
                              <span className="original-price">${item.originalPrice.toFixed(2)}</span>
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
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'free-shipping' : ''}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
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
                      <span className="discount-amount">-${appliedPromo.amount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Available Coupons */}
                {availableCoupons.length > 0 && (
                  <div className="coupons-section">
                    <h4 className="coupons-title">Available Coupons</h4>
                    <div className="coupons-list">
                      {availableCoupons.map(coupon => (
                        <div key={coupon.id} className="coupon-item">
                          <div className="coupon-code">{coupon.code}</div>
                          <div className="coupon-description">{coupon.description}</div>
                          <div className="coupon-discount">{coupon.discount}% off</div>
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
                <button className="checkout-btn">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>

                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="trust-item">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span>Free shipping on orders over $50</span>
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