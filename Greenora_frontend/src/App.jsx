import { useEffect, useState } from 'react'
import Home from './Pages/Home'
import LoginPage from './Pages/Login'
import SignupPage from './Pages/SignUp'
import CartPage from './component/Cart'
import Profile from './Pages/Profile'
import Address from './Pages/Address'
import Checkout from './Pages/Checkout'
import Payment from './Pages/Payment'
import PaymentSuccess from './Pages/PaymentSuccess'
import Orders from './Pages/Orders'
import AdminDashboard from './Pages/AdminDashboard'
import VendorDashboard from './Pages/VendorDashboard'
import { Route, Routes, Navigate } from 'react-router-dom'
import PrivateRoute from './context/PrivateRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { auth } = useAuth();
  return(
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/address" element={<PrivateRoute><Address /></PrivateRoute>} />
      <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
      <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
      <Route path="/payment/success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      <Route path="/admin" element={
        <PrivateRoute>
          {auth.isLoggedIn && auth.user?.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <Navigate to="/" />}
        </PrivateRoute>
      } />
      <Route path="/vendor" element={
        <PrivateRoute>
          {auth.isLoggedIn && auth.user?.role === 'ROLE_VENDOR' ? <VendorDashboard /> : <Navigate to="/" />}
        </PrivateRoute>
      } />
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}

export default App
