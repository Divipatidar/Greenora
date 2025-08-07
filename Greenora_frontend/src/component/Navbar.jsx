import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  

  return (
    <nav className="navbar-container">
      <div className="navbar-content-wrapper">
        {/* Logo */}
        <div className="logo-section">
          <Link to="/" className="logo-link-group" style={{textDecoration: 'none', cursor: 'pointer'}}>
            <div className="logo-icon-wrapper">
              <Leaf className="logo-icon" />
            </div>
            <div>
              <span className="logo-text-main">Greenora</span>
              <p className="logo-text-tagline">ORGANIC MARKETPLACE</p>
            </div>
          </Link>
        </div>

        <div className="nav-links-section">
          <Link to="/" className="nav-link">
            <span>Home</span>
            <div className="nav-link-underline"></div>
          </Link>
          

          <Link to="/cart" className="nav-link icon-link cart-link">
            <div className="cart-icon-wrapper">
              <ShoppingCart className="h-6 w-6 transform group-hover:scale-110 transition-transform duration-300" />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>
            <span>Cart</span>
            <div className="nav-link-underline"></div>
          </Link>
          
          {auth.isLoggedIn && (
            <Link to="/orders" className="nav-link">
              <span>Orders</span>
              <div className="nav-link-underline"></div>
            </Link>
          )}
          
          {auth.isLoggedIn && (
            <Link to="/profile" className="nav-link icon-link">
              <User className="h-6 w-6 transform group-hover:scale-110 transition-transform duration-300" />
              <span>Profile</span>
              <div className="nav-link-underline"></div>
            </Link>
          )}
          
          {auth.isLoggedIn && auth.user?.role === 'ROLE_ADMIN' && (
            <Link to="/admin" className="dashboard-button admin-button">
              <span>Admin Dashboard</span>
            </Link>
          )}
          
          {auth.isLoggedIn && auth.user?.role === 'ROLE_VENDOR' && (
            <Link to="/vendor" className="dashboard-button vendor-button">
              <span>Vendor Dashboard</span>
            </Link>
          )}
          
          {!auth.isLoggedIn ? (
            <Link to="/login" className="auth-button login-button">
              Login
            </Link>
          ) : (
            <button 
              onClick={() => { logout(); navigate('/'); }} 
              className="auth-button logout-button"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        /* General Reset & Base Styles */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #333;
        }

        /* Navbar Container */
        .navbar-container {
          background-color: rgba(255, 255, 255, 0.98); /* Slightly less opaque white */
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* Softer, more prominent shadow */
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 4px solid #10b981; /* Stronger green border */
        }

        .navbar-content-wrapper {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1rem 1.5rem; /* Adjusted padding */
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo Section */
        .logo-section {
          display: flex;
          align-items: center;
        }

        .logo-link-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        .logo-link-group:hover {
          transform: scale(1.02);
        }

        .logo-icon-wrapper {
          background: linear-gradient(to bottom right, #059669, #10b981, #047857); /* More vibrant gradient */
          padding: 0.8rem; /* Slightly larger padding */
          border-radius: 1.25rem; /* More rounded */
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          transform: rotate(3deg); /* Slight rotation for character */
          transition: all 0.3s ease;
        }

        .logo-link-group:hover .logo-icon-wrapper {
          transform: rotate(0deg) scale(1.05); /* Straighten and slightly enlarge on hover */
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .logo-icon {
          height: 1.75rem; /* 28px */
          width: 1.75rem; /* 28px */
          color: white;
        }

        .logo-text-main {
          font-size: 2.25rem; /* 36px */
          font-weight: 900;
          background: linear-gradient(to right, #047857, #059669, #0d9488); /* Deep green gradient */
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          user-select: none;
          letter-spacing: -0.025em; /* Tighter tracking */
          line-height: 1; /* Adjust line height */
        }

        .logo-text-tagline {
          font-size: 0.7rem; /* 11px */
          color: #065f46; /* Darker green for tagline */
          font-weight: 800; /* Bolder */
          letter-spacing: 0.15em; /* Wider tracking */
          text-transform: uppercase;
          margin-top: 0.1rem; /* Adjust position */
        }

        /* Navigation Links Section */
        .nav-links-section {
          display: flex;
          align-items: center;
          gap: 2rem; /* Increased space between links */
        }

        .nav-link {
          color: #047857; /* Dark green text */
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          padding-bottom: 0.25rem; /* Space for underline */
        }

        .nav-link:hover {
          color: #059669; /* Slightly lighter green on hover */
        }

        .nav-link-underline {
          position: absolute;
          inset-x: 0;
          bottom: -4px; /* Position below the link */
          height: 3px;
          background: linear-gradient(to right, #10b981, #059669); /* Green gradient underline */
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .nav-link:hover .nav-link-underline {
          transform: scaleX(1);
        }

        .nav-link.icon-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Cart Icon with Badge */
        .cart-link {
          position: relative;
        }

        .cart-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          min-width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Dashboard Buttons (Admin/Vendor) */
        .dashboard-button {
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          padding: 0.6rem 1.2rem;
          border-radius: 9999px; /* Fully rounded */
          border: 2px solid;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          white-space: nowrap; /* Prevent text wrapping */
        }

        .admin-button {
          background: linear-gradient(to right, #d1fae5, #a7f3d0); /* Lighter green gradient */
          color: #047857; /* Dark green text */
          border-color: #6ee7b7; /* Green-400 border */
        }

        .admin-button:hover {
          background: linear-gradient(to right, #a7f3d0, #6ee7b7); /* Darker hover gradient */
          color: #059669;
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .vendor-button {
          background: linear-gradient(to right, #fef9c3, #fcd34d); /* Yellowish gradient */
          color: #a16207; /* Amber text */
          border-color: #fbbf24; /* Amber-400 border */
        }

        .vendor-button:hover {
          background: linear-gradient(to right, #fcd34d, #fbbf24); /* Darker hover gradient */
          color: #b45309;
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        /* Auth Buttons (Login/Logout) */
        .auth-button {
          font-weight: 700;
          padding: 0.75rem 1.8rem; /* Generous padding */
          border-radius: 9999px;
          transition: all 0.3s ease;
          transform: scale(1);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
          border: 2px solid;
          cursor: pointer;
          white-space: nowrap;
        }

        .login-button {
          background: linear-gradient(to right, #059669, #10b981, #047857); /* Strong green gradient */
          color: white;
          border-color: #059669;
        }

        .login-button:hover {
          background: linear-gradient(to right, #047857, #065f46, #0d9488); /* Darker hover */
          transform: scale(1.05) translateY(-1px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          border-color: #047857;
        }

        .logout-button {
          background: linear-gradient(to right, #ef4444, #dc2626, #b91c1c); /* Red gradient */
          color: white;
          border-color: #f87171; /* Red-400 border */
        }

        .logout-button:hover {
          background: linear-gradient(to right, #dc2626, #b91c1c, #991b1b); /* Darker hover */
          transform: scale(1.05) translateY(-1px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          border-color: #ef4444;
        }

        /* Responsive Adjustments */
        @media (max-width: 1024px) {
          .nav-links-section {
            gap: 1.5rem; /* Reduce gap for smaller screens */
          }

          .logo-text-main {
            font-size: 1.8rem; /* Adjust font size */
          }
          .logo-text-tagline {
            font-size: 0.6rem;
          }

          .nav-link, .dashboard-button, .auth-button {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
          }

          .auth-button {
            padding: 0.6rem 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .navbar-content-wrapper {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem;
          }

          .nav-links-section {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            margin-top: 1rem;
            border-top: 1px solid #e0f2f1;
            padding-top: 1rem;
          }

          .nav-link, .dashboard-button, .auth-button {
            width: 100%;
            text-align: left;
            padding: 0.75rem 1rem;
            justify-content: flex-start;
          }

          .nav-link-underline {
            display: none; /* Hide underline on mobile */
          }

          .logo-link-group {
            width: auto;
          }
        }

        @media (max-width: 480px) {
          .logo-text-main {
            font-size: 1.5rem;
          }
          .logo-text-tagline {
            font-size: 0.55rem;
          }

          .logo-icon-wrapper {
            padding: 0.6rem;
            border-radius: 1rem;
          }
          .logo-icon {
            height: 1.5rem;
            width: 1.5rem;
          }
        }

        /* Animations */
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
