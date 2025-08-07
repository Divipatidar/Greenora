import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, Star, Leaf, Truck, Shield, Phone, Mail, MapPin, Recycle, Award, User, ChevronDown } from 'lucide-react';
import '../styles/Home.css';
import productServices from '../Services/productServices';
import categoryServices from '../Services/CategoryServices';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../component/Navbar';
import cartServices from '../Services/CartServices';

const GrenoraHomepage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const heroSlides = [
    {
      title: "Live Sustainably",
      subtitle: "Eco-Friendly Products for Every Home",
      description: "Discover our curated collection of sustainable, organic, and environmentally conscious products",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1400&h=800&fit=crop",
      cta: "Shop Eco Products"
    },
    {
      title: "Zero Waste Living",
      subtitle: "Reduce, Reuse, Recycle",
      description: "Transform your lifestyle with our plastic-free and sustainable alternatives",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=800&fit=crop",
      cta: "Start Your Journey"
    },
    {
      title: "Planet First",
      subtitle: "Every Purchase Makes a Difference",
      description: "Join thousands in choosing products that care for our planet and future generations",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&h=800&fit=crop",
      cta: "Make Impact"
    }
  ];

  const { auth, logout } = useAuth();

  // Styles object
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 25%, #ecfdf5 50%, #d1fae5 100%)',
    },
    
    // Hero Section Styles
    heroSection: {
      position: 'relative',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'all 1s ease-in-out',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, rgba(6,95,70,0.8) 0%, rgba(4,120,87,0.6) 50%, rgba(5,150,105,0.7) 100%)',
    },
    welcomeBadge: {
      position: 'absolute',
      top: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20,
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(20px)',
      padding: '0.75rem 2rem',
      borderRadius: '9999px',
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
      color: '#065f46',
      fontWeight: 'bold',
      fontSize: '1.125rem',
      border: '2px solid rgba(16, 185, 129, 0.2)',
    },
    heroContent: {
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      padding: '0 1rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    heroCard: {
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '2rem',
      padding: '3rem 2rem',
      border: '2px solid rgba(255,255,255,0.2)',
      boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 8vw, 5rem)',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '1.5rem',
      lineHeight: '1.1',
      textShadow: '0 4px 8px rgba(0,0,0,0.3)',
    },
    heroSubtitle: {
      fontSize: 'clamp(1.25rem, 4vw, 2rem)',
      color: '#d1fae5',
      marginBottom: '1rem',
      fontWeight: '600',
      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    heroDescription: {
      fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
      color: 'rgba(255,255,255,0.95)',
      marginBottom: '2rem',
      maxWidth: '800px',
      margin: '0 auto 2rem auto',
      lineHeight: '1.6',
    },
    heroCTA: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      padding: '1rem 2.5rem',
      borderRadius: '9999px',
      fontWeight: 'bold',
      fontSize: '1.25rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    slideIndicators: {
      position: 'absolute',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '1rem',
      zIndex: 20,
    },
    slideIndicator: {
      width: '1rem',
      height: '1rem',
      borderRadius: '50%',
      border: '2px solid white',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    slideIndicatorActive: {
      background: 'white',
      transform: 'scale(1.25)',
      boxShadow: '0 0 20px rgba(255,255,255,0.6)',
    },

    // Category Section Styles
    categorySection: {
      padding: '3rem 0',
      background: 'white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    categoryContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    categoryHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    categoryTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#065f46',
      background: 'linear-gradient(135deg, #065f46, #059669)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    dropdownContainer: {
      position: 'relative',
    },
    dropdownButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(135deg, #059669, #10b981)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '9999px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
    },
    dropdown: {
      position: 'absolute',
      right: 0,
      top: '100%',
      marginTop: '0.5rem',
      width: '16rem',
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
      border: '1px solid #d1fae5',
      zIndex: 50,
      overflow: 'hidden',
    },
    dropdownItem: {
      width: '100%',
      textAlign: 'left',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      background: 'transparent',
      border: 'none',
      color: '#065f46',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      margin: '0.25rem',
    },
    categoryPills: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      marginTop: '1.5rem',
    },
    categoryPill: {
      padding: '0.5rem 1.5rem',
      borderRadius: '9999px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.875rem',
    },
    categoryPillActive: {
      background: 'linear-gradient(135deg, #059669, #10b981)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
      transform: 'translateY(-2px)',
    },
    categoryPillInactive: {
      background: '#f0fdf4',
      color: '#065f46',
      border: '1px solid #d1fae5',
    },

    // Features Section Styles
    featuresSection: {
      padding: '5rem 0',
      background: 'white',
    },
    featuresContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    featuresHeader: {
      textAlign: 'center',
      marginBottom: '4rem',
    },
    featuresTitle: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: 'bold',
      color: '#065f46',
      marginBottom: '1rem',
      background: 'linear-gradient(135deg, #065f46, #059669)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    featuresSubtitle: {
      fontSize: '1.25rem',
      color: '#059669',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '3rem',
    },
    featureCard: {
      textAlign: 'center',
      padding: '2rem',
      borderRadius: '1.5rem',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
      border: '2px solid #d1fae5',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    featureIcon: {
      background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
      padding: '2rem',
      borderRadius: '50%',
      width: '6rem',
      height: '6rem',
      margin: '0 auto 1.5rem auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
    },
    featureTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#065f46',
      marginBottom: '1rem',
    },
    featureDescription: {
      color: '#059669',
      fontSize: '1rem',
      lineHeight: '1.6',
    },

    // Products Section Styles
    productsSection: {
      padding: '5rem 0',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)',
    },
    productsContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    productsHeader: {
      textAlign: 'center',
      marginBottom: '4rem',
    },
    productsTitle: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: 'bold',
      color: '#065f46',
      marginBottom: '1rem',
      background: 'linear-gradient(135deg, #065f46, #059669)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    productsSubtitle: {
      fontSize: '1.25rem',
      color: '#059669',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '2rem',
    },
    productCard: {
      background: 'white',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      border: '2px solid #f0fdf4',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    productImageContainer: {
      position: 'relative',
      overflow: 'hidden',
    },
    productImage: {
      width: '100%',
      height: '14rem',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    },
    productBadge: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      background: '#059669',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      boxShadow: '0 2px 10px rgba(5, 150, 105, 0.3)',
    },
    productEcoBadge: {
      position: 'absolute',
      top: '3.5rem',
      left: '1rem',
      background: '#10b981',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.625rem',
      fontWeight: 'bold',
      boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
    },
    wishlistButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      padding: '0.5rem',
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    productContent: {
      padding: '1.25rem',
    },
    productName: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#065f46',
      marginBottom: '0.5rem',
      lineHeight: '1.4',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.5rem',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginLeft: '0.5rem',
      fontWeight: '500',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
    },
    price: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#059669',
    },
    originalPrice: {
      fontSize: '1rem',
      color: '#9ca3af',
      textDecoration: 'line-through',
    },
    addToCartButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #059669, #10b981)',
      color: 'white',
      padding: '0.75rem',
      borderRadius: '9999px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
    },
    viewAllButton: {
      background: 'white',
      color: '#059669',
      border: '2px solid #059669',
      padding: '1rem 2.5rem',
      borderRadius: '9999px',
      fontWeight: 'bold',
      fontSize: '1.125rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      marginTop: '4rem',
    },

    // Footer Styles
    footer: {
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
      color: 'white',
      padding: '4rem 0 2rem 0',
    },
    footerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '3rem',
    },
    footerLogo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem',
    },
    footerLogoIcon: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      padding: '0.75rem',
      borderRadius: '50%',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    },
    footerLogoText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white',
    },
    footerLogoSubtext: {
      fontSize: '0.75rem',
      color: '#d1fae5',
      fontWeight: '600',
      letterSpacing: '0.1em',
    },
    footerDescription: {
      color: '#d1fae5',
      marginBottom: '1.5rem',
      fontSize: '1rem',
      lineHeight: '1.6',
    },
    footerSocial: {
      display: 'flex',
      gap: '1.5rem',
    },
    footerSocialLink: {
      color: '#d1fae5',
      textDecoration: 'none',
      fontSize: '1rem',
      transition: 'color 0.3s ease',
    },
    footerTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: 'white',
    },
    footerList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    footerListItem: {
      marginBottom: '0.75rem',
    },
    footerLink: {
      color: '#d1fae5',
      textDecoration: 'none',
      fontSize: '1rem',
      transition: 'color 0.3s ease',
    },
    footerContact: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1rem',
    },
    footerBottom: {
      borderTop: '1px solid #047857',
      marginTop: '3rem',
      paddingTop: '2rem',
      textAlign: 'center',
    },
    footerBottomText: {
      color: '#d1fae5',
      fontSize: '1rem',
    },

    loadingText: {
      textAlign: 'center',
      color: '#059669',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      padding: '2.5rem 0',
    },
    errorText: {
      textAlign: 'center',
      color: '#dc2626',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      padding: '2.5rem 0',
    },
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const categoriesData = await categoryServices.fetchCategories();
        setCategories(categoriesData);
        
        if (!auth.isLoading && auth.isLoggedIn && auth.token) {
          const productsData = await productServices.fetchProducts();
          setProducts(productsData);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, [auth]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCategoryClick = async (categoryId) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      const categoryProducts = await productServices.getbycategory(categoryId);
      setProducts(categoryProducts);
      setShowCategoryDropdown(false);
    } catch (err) {
      setError('Failed to load category products');
    } finally {
      setLoading(false);
    }
  };

  const handleShowAllProducts = async () => {
    try {
      setLoading(true);
      setSelectedCategory(null);
      const allProducts = await productServices.fetchProducts();
      setProducts(allProducts);
    } catch (err) {
      setError('Failed to load all products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!auth.isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    
    try {
      await cartServices.addToCart(auth.user.id, product.id, 1);
      
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const toggleWishlist = (productId) => {
    if (!auth.isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    
    setWishlistItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div style={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section style={styles.heroSection}>
        {auth.isLoggedIn && (
          <div style={styles.welcomeBadge}>
            Welcome, {auth.user?.name || auth.user?.username || 'User'}!
          </div>
        )}
        <div style={styles.heroOverlay}></div>
        <img
          src={heroSlides[currentSlide].image}
          alt="Hero"
          style={styles.heroImage}
        />
        
        <div style={styles.heroContent}>
          <div style={styles.heroCard}>
            <h2 style={styles.heroTitle}>
              {heroSlides[currentSlide].title}
            </h2>
            <p style={styles.heroSubtitle}>
              {heroSlides[currentSlide].subtitle}
            </p>
            <p style={styles.heroDescription}>
              {heroSlides[currentSlide].description}
            </p>
            <button 
              style={styles.heroCTA}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.4)';
              }}
            >
              {heroSlides[currentSlide].cta}
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div style={styles.slideIndicators}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                ...styles.slideIndicator,
                ...(index === currentSlide ? styles.slideIndicatorActive : {})
              }}
              onMouseEnter={(e) => {
                if (index !== currentSlide) {
                  e.target.style.background = 'rgba(255,255,255,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentSlide) {
                  e.target.style.background = 'transparent';
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* Category Navigation */}
      <section style={styles.categorySection}>
        <div style={styles.categoryContainer}>
          <div style={styles.categoryHeader}>
            <h3 style={styles.categoryTitle}>Categories</h3>
            <div style={styles.dropdownContainer}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                style={styles.dropdownButton}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #047857, #059669)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.3)';
                }}
              >
                <span>Browse Categories</span>
                <ChevronDown style={{
                  height: '1.25rem',
                  width: '1.25rem',
                  transform: showCategoryDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }} />
              </button>
              
              {showCategoryDropdown && (
                <div style={styles.dropdown}>
                  <div style={{ padding: '1rem' }}>
                    <button
                      onClick={handleShowAllProducts}
                      style={styles.dropdownItem}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#f0fdf4';
                        e.target.style.color = '#047857';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#065f46';
                      }}
                    >
                      All Products
                    </button>
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        style={styles.dropdownItem}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#f0fdf4';
                          e.target.style.color = '#047857';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#065f46';
                        }}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Category Pills */}
          <div style={styles.categoryPills}>
            <button
              onClick={handleShowAllProducts}
              style={{
                ...styles.categoryPill,
                ...(selectedCategory === null ? styles.categoryPillActive : styles.categoryPillInactive)
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== null) {
                  e.target.style.background = '#ecfdf5';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== null) {
                  e.target.style.background = '#f0fdf4';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              All Products
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                style={{
                  ...styles.categoryPill,
                  ...(selectedCategory === category.id ? styles.categoryPillActive : styles.categoryPillInactive)
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.id) {
                    e.target.style.background = '#ecfdf5';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.id) {
                    e.target.style.background = '#f0fdf4';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.featuresContainer}>
          <div style={styles.featuresHeader}>
            <h2 style={styles.featuresTitle}>Why Choose Eco-Friendly?</h2>
            <p style={styles.featuresSubtitle}>
              Make a positive impact on the planet while enjoying premium sustainable products
            </p>
          </div>
          <div style={styles.featuresGrid}>
            {[
              {
                icon: Recycle,
                title: "100% Sustainable",
                description: "All our products are made from renewable, biodegradable, or recycled materials with minimal environmental impact."
              },
              {
                icon: Award,
                title: "Certified Organic",
                description: "Every product meets strict organic and fair-trade standards, ensuring quality and ethical sourcing."
              },
              {
                icon: Leaf,
                title: "Carbon Neutral",
                description: "We offset 100% of our carbon footprint through reforestation and renewable energy partnerships."
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={styles.featureCard}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.2)';
                  e.target.style.background = 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)';
                }}
              >
                <div
                  style={styles.featureIcon}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.15)';
                  }}
                >
                  <feature.icon style={{ height: '2rem', width: '2rem', color: '#059669' }} />
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={styles.productsSection}>
        <div style={styles.productsContainer}>
          <div style={styles.productsHeader}>
            <h2 style={styles.productsTitle}>
              {selectedCategory ? `Products in ${categories.find(c => c.id === selectedCategory)?.name}` : 'Featured Eco Products'}
            </h2>
            <p style={styles.productsSubtitle}>
              Carefully curated sustainable products that make a difference for you and the planet
            </p>
          </div>

          {loading ? (
            <div style={styles.loadingText}>Loading products...</div>
          ) : error ? (
            <div style={styles.errorText}>{error}</div>
          ) : (
            <div style={styles.productsGrid}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={styles.productCard}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                    e.target.style.borderColor = '#d1fae5';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                    e.target.style.borderColor = '#f0fdf4';
                  }}
                >
                  <div style={styles.productImageContainer}>
                    <img
                      src={product.image || 'https://via.placeholder.com/400x400?text=No+Image'}
                      alt={product.name}
                      style={styles.productImage}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                    {product.badge && (
                      <span style={styles.productBadge}>
                        {product.badge}
                      </span>
                    )}
                    {product.eco && (
                      <span style={styles.productEcoBadge}>
                        {product.eco}
                      </span>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      style={styles.wishlistButton}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.95)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <Heart
                        style={{
                          height: '1.25rem',
                          width: '1.25rem',
                          color: wishlistItems.includes(product.id) ? '#ef4444' : '#6b7280',
                          fill: wishlistItems.includes(product.id) ? '#ef4444' : 'none',
                        }}
                      />
                    </button>
                  </div>
                  <div style={styles.productContent}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <div style={styles.ratingContainer}>
                      <div style={styles.rating}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            style={{
                              height: '1rem',
                              width: '1rem',
                              color: i < Math.floor(product.rating || 0) ? '#fbbf24' : '#d1d5db',
                              fill: i < Math.floor(product.rating || 0) ? '#fbbf24' : 'none',
                            }}
                          />
                        ))}
                      </div>
                      <span style={styles.ratingText}>
                        {product.rating ? product.rating.toFixed(1) : '0.0'} ({product.reviews || 0})
                      </span>
                    </div>
                    <div style={styles.priceContainer}>
                      <span style={styles.price}>₹{product.price}</span>
                      {product.originalPrice && (
                        <span style={styles.originalPrice}>₹{product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      style={styles.addToCartButton}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #047857, #059669)';
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.3)';
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <button
              style={styles.viewAllButton}
              onMouseEnter={(e) => {
                e.target.style.background = '#059669';
                e.target.style.color = 'white';
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#059669';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }}
            >
              View All Eco Products
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerGrid}>
            <div>
              <div style={styles.footerLogo}>
                <div style={styles.footerLogoIcon}>
                  <Leaf style={{ height: '2rem', width: '2rem', color: 'white' }} />
                </div>
                <div>
                  <div style={styles.footerLogoText}>Greenora</div>
                  <div style={styles.footerLogoSubtext}>ECO • SUSTAINABLE • ORGANIC</div>
                </div>
              </div>
              <p style={styles.footerDescription}>
                Leading the sustainable living movement with premium eco-friendly products that care for you and the planet.
              </p>
              <div style={styles.footerSocial}>
                {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    style={styles.footerSocialLink}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#d1fae5';
                    }}
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={styles.footerTitle}>Eco Products</h4>
              <ul style={styles.footerList}>
                {['Zero Waste Items', 'Organic Home Care', 'Sustainable Fashion', 'Solar Products'].map((item) => (
                  <li key={item} style={styles.footerListItem}>
                    <a
                      href="#"
                      style={styles.footerLink}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#d1fae5';
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={styles.footerTitle}>Sustainability</h4>
              <ul style={styles.footerList}>
                {['Our Mission', 'Carbon Neutral', 'Eco Certifications', 'Impact Report'].map((item) => (
                  <li key={item} style={styles.footerListItem}>
                    <a
                      href="#"
                      style={styles.footerLink}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#d1fae5';
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={styles.footerTitle}>Contact Us</h4>
              <div>
                {[
                  { icon: Phone, text: '+1 (555) 123-4567' },
                  { icon: Mail, text: 'hello@greenora.com' },
                  { icon: MapPin, text: '123 Eco Street, Green City' }
                ].map((contact, index) => (
                  <div key={index} style={styles.footerContact}>
                    <contact.icon style={{ height: '1.25rem', width: '1.25rem', color: '#10b981' }} />
                    <span style={{ color: '#d1fae5', fontSize: '1rem' }}>{contact.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.footerBottom}>
            <p style={styles.footerBottomText}>
              © 2025 Greenora. All rights reserved. Made with 🌱 for a sustainable future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GrenoraHomepage;