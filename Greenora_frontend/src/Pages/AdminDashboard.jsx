import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Edit, Leaf, Trash2, XCircle, Save, UserPlus, Store, Tag, Package, Percent, LayoutList, AlertCircle, Menu, ChevronRight, Eye, EyeOff, Users, ShoppingCart, CreditCard } from 'lucide-react';
import productServices from '../Services/productServices';
import categoryServices from '../Services/CategoryServices';
import couponServices from '../Services/CouponServices';
import authenticationService from '../Services/AuthenticationServices';
import orderServices from '../Services/orderServices';
import paymentServices from '../Services/paymentServices';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { auth } = useAuth();
  const [activeSection, setActiveSection] = useState('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Existing states
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '', categoryId: '', vendorId: '', ecoRating: '', quantity: '' });
  const [productLoading, setProductLoading] = useState(false);

  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [newCoupon, setNewCoupon] = useState({ couponCode: '', discountValue: '', minOrderAmt: '', isActive: true, validFrom: '', validUntil: '' });
  const [couponLoading, setCouponLoading] = useState(false);

  const [vendors, setVendors] = useState([]);
  const [newVendor, setNewVendor] = useState({ name: '', email: '', password: '', phoneNumber: '' });
  const [vendorLoading, setVendorLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // New states
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);

  const [payments, setPayments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);


  useEffect(() => {
    loadCategories();
    loadProducts();
    loadCoupons();
    loadVendors();
    loadUsers();
    loadOrders();
    loadPayments();
  }, []);

  const loadCategories = async () => {
    try {
      setCategoryLoading(true);
      const data = await categoryServices.fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setProductLoading(true);
      const data = await productServices.fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setProductLoading(false);
    }
  };

  const loadCoupons = async () => {
    try {
      setCouponLoading(true);
      const data = await couponServices.fetchActiveCoupon();
      setCoupons(data);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setCouponLoading(false);
    }
  };
  
  const loadVendors = async () => {
    try {
      setVendorLoading(true);
      const data = await authenticationService.getuserByRole("ROLE_VENDOR");
      setVendors(data);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setVendorLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUserLoading(true);
      const data = await authenticationService.getuserByRole("ROLE_USER");
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setUserLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrderLoading(true);
      const data = await orderServices.getallOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setOrderLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      setPaymentLoading(true);
      const data = await paymentServices.getAllPayments();
      setPayments(data);
      const total = data.reduce((sum, transaction) => sum + transaction.amount, 0);
      setTotalTransactions(total);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setPaymentLoading(false);
    }
  };
  
  // Custom alert/confirm functions to avoid browser pop-ups
  const showAlert = (message) => {
    console.warn("Custom Alert:", message);
    alert(message);
  };

  const showConfirm = (message) => {
    console.warn("Custom Confirm:", message);
    return window.confirm(message);
  };

  // Existing handlers...
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      showAlert('Category name cannot be empty.');
      return;
    }
    
    try {
      setCategoryLoading(true);
      const addedCategory = await categoryServices.addCategory(newCategory);
      setCategories([...categories, addedCategory]);
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding category:', error);
      showAlert('Failed to add category. Please try again.');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
  };

  const handleSaveCategory = async () => {
    if (!editingCategory.name.trim()) {
      showAlert('Category name cannot be empty.');
      return;
    }
    
    try {
      setCategoryLoading(true);
      const updatedCategory = await categoryServices.updateCategory(editingCategory.id, editingCategory);
      setCategories(categories.map(c => c.id === editingCategory.id ? updatedCategory : c));
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      showAlert('Failed to update category. Please try again.');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (showConfirm('Are you sure you want to delete this category?')) {
      try {
        setCategoryLoading(true);
        await categoryServices.deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
        setProducts(products.map(p => p.category?.id === id ? { ...p, category: null } : p));
      } catch (error) {
        console.error('Error deleting category:', error);
        showAlert('Failed to delete category. Please try again.');
      } finally {
        setCategoryLoading(false);
      }
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
      showAlert('Please fill all required product fields (Name, Price, Category).');
      return;
    }
    
    try {
      setProductLoading(true);
      const addedProduct = await productServices.addProduct(newProduct, newProduct.categoryId);
      setProducts([...products, addedProduct]);
      setNewProduct({ name: '', description: '', price: '', image: '', categoryId: '', vendorId: '', ecoRating: '', quantity: '' });
    } catch (error) {
      console.error('Error adding product:', error);
      showAlert('Failed to add product. Please try again.');
    } finally {
      setProductLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ 
      ...product,
      categoryId: product.category?.id || '',
      vendorId: product.vendor?.id || '',
      quantity: product.quantity || '',
      price: product.price || ''
    });
  };
  

  const handleSaveProduct = async () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.categoryId) {
      showAlert('Please fill all required product fields (Name, Price, Category).');
      return;
    }
    
    try {
      setProductLoading(true);
      const updatedProduct = await productServices.updateProduct(editingProduct.id, editingProduct);
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      showAlert('Failed to update product. Please try again.');
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (showConfirm('Are you sure you want to delete this product?')) {
      try {
        setProductLoading(true);
        await productServices.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Failed to delete product. Please try again.');
      } finally {
        setProductLoading(false);
      }
    }
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.couponCode || !newCoupon.discountValue || !newCoupon.validUntil) {
      showAlert('Please fill all required coupon fields (Code, Discount, Valid Until).');
      return;
    }
    
    try {
      setCouponLoading(true);
      const addedCoupon = await couponServices.create(newCoupon);
      setCoupons([...coupons, addedCoupon]);
      setNewCoupon({ couponCode: '', discountValue: '', minOrderAmt: '', isActive: true, validFrom: '', validUntil: '' });
    } catch (error) {
      console.error('Error adding coupon:', error);
      showAlert('Failed to add coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon({ ...coupon });
  };

  const handleSaveCoupon = async () => {
    if (!editingCoupon.couponCode || !editingCoupon.discountValue || !editingCoupon.validUntil) {
      showAlert('Please fill all required coupon fields (Code, Discount, Valid Until).');
      return;
    }
    
    try {
      setCouponLoading(true);
      const updatedCoupon = await couponServices.updateCoupon(editingCoupon.id, editingCoupon);
      setCoupons(coupons.map(c => c.id === editingCoupon.id ? updatedCoupon : c));
      setEditingCoupon(null);
    } catch (error) {
      console.error('Error updating coupon:', error);
      showAlert('Failed to update coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (showConfirm('Are you sure you want to delete this coupon?')) {
      try {
        setCouponLoading(true);
        await couponServices.deleteCoupon(id);
        setCoupons(coupons.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting coupon:', error);
        showAlert('Failed to delete coupon. Please try again.');
      } finally {
        setCouponLoading(false);
      }
    }
  };

  const handleAddVendor = async () => {
    if (!newVendor.name || !newVendor.email || !newVendor.password || !newVendor.phoneNumber) {
      showAlert('Please fill all vendor fields.');
      return;
    }
    try {
      setVendorLoading(true);
      await authenticationService.addVendor(newVendor);
      showAlert('Vendor added successfully!');
      setNewVendor({ name: '', email: '', password: '', phoneNumber: '' });
      loadVendors();
    } catch (error) {
      console.error('Error adding vendor:', error);
      showAlert(`Failed to add vendor: ${error.message || 'Please try again.'}`);
    } finally {
      setVendorLoading(false);
    }
  };

  // Modified function to update only the delivery status with the provided statuses
  const handleUpdateDeliveryStatus = async (orderId, newStatus) => {
    try {
      setOrderLoading(true);
      // Calls the backend to update the deliveryStatus
      await orderServices.updateOrderStatus(orderId, newStatus );
      loadOrders(); // Reload orders to reflect the changes
    } catch (error) {
      console.error('Error updating order status:', error);
      showAlert('Failed to update order status. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  // Access control for admin role
  if (!auth.isLoading && (!auth.isLoggedIn || auth.user?.role !== 'ROLE_ADMIN')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-800 text-xl font-semibold p-4 rounded-lg shadow-lg">
        <AlertCircle className="w-12 h-12 mb-4 text-red-600" />
        <h2 className="text-3xl font-bold mb-2">Access Denied</h2>
        <p className="text-lg">You must be logged in as an administrator to view this page.</p>
        <Link to="/login" className="mt-6 px-6 py-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition duration-300">
          Go to Login
        </Link>
      </div>
    );
  }

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700 text-xl font-semibold">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-gray-500 mr-3"></div>
        Loading authentication...
      </div>
    );
  }

  const renderSection = () => {
    // Common input/select classes for forms
    const formInputClass = "p-3 border border-green-300 rounded-lg focus:ring-4 focus:ring-green-400 focus:border-green-500 transition duration-300 shadow-md placeholder-gray-400 text-gray-800";
    const formTextAreaClass = "p-3 border border-green-300 rounded-lg focus:ring-4 focus:ring-green-400 focus:border-green-500 transition duration-300 shadow-md placeholder-gray-400 text-gray-800";
    const formSelectClass = "p-3 border border-green-300 rounded-lg focus:ring-4 focus:ring-green-400 focus:border-green-500 transition duration-300 shadow-md bg-white text-gray-800";

    // Common button classes for add/save
    const primaryButtonClass = "mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition duration-300 flex items-center justify-center text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed";
    
    // Common button classes for edit/delete actions in lists
    const actionButtonClass = "p-2 rounded-full hover:bg-green-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75";

    switch (activeSection) {
      case 'products':
        return (
          <section className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-4xl font-extrabold text-green-800 mb-8 flex items-center">
              <Package className="w-9 h-9 mr-4 text-green-600" /> Product Management
            </h2>

            {/* Add Product Form */}
            <div className="mb-10 p-7 bg-green-50 rounded-2xl shadow-inner border border-green-100">
              <h3 className="text-2xl font-bold text-green-700 mb-5">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className={formInputClass}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className={formInputClass}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  className={formInputClass}
                />
                <input
                  type="number"
                  placeholder="Eco Rating (1-5)"
                  value={newProduct.ecoRating}
                  onChange={(e) => setNewProduct({ ...newProduct, ecoRating: e.target.value })}
                  className={formInputClass}
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className={formInputClass}
                />
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className={formSelectClass}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Vendor ID"
                  value={newProduct.vendorId}
                  onChange={(e) => setNewProduct({ ...newProduct, vendorId: e.target.value })}
                  className={formInputClass}
                />
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className={`${formTextAreaClass} md:col-span-2`}
                  rows="4"
                />
              </div>
              <button
                onClick={handleAddProduct}
                disabled={productLoading}
                className={primaryButtonClass}
              >
                {productLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-6 h-6 mr-2" /> Add Product
                  </>
                )}
              </button>
            </div>

            {/* Product List */}
            <div className="bg-green-50 rounded-2xl shadow-inner border border-green-100 p-7">
              <h3 className="text-2xl font-bold text-green-700 mb-5">Existing Products</h3>
              {productLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-green-600 mx-auto"></div>
                  <p className="text-green-600 mt-4 text-xl">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <p className="text-gray-600 text-center py-6 text-lg">No products added yet. Start by adding one above!</p>
              ) : (
                <ul className="space-y-4">
                  {products.map(product => (
                    <li key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg">
                      {editingProduct && editingProduct.id === product.id ? (
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 mr-4 w-full">
                          <input
                            type="text"
                            placeholder="Product Name"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                           <input
                            type="number"
                            placeholder="Quantity"
                            value={editingProduct.quantity}
                            onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                           <input
                            type="number"
                            placeholder="Eco Rating (1-5)"
                            value={editingProduct.ecoRating}
                            onChange={(e) => setEditingProduct({ ...editingProduct, ecoRating: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={editingProduct.image}
                            onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                          <select
                            value={editingProduct.categoryId}
                            onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base bg-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                           <input
                            type="text"
                            placeholder="Vendor ID"
                            value={editingProduct.vendorId}
                            onChange={(e) => setEditingProduct({ ...editingProduct, vendorId: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                           <textarea
                            placeholder="Description"
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base col-span-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            rows="3"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-800 text-xl font-medium flex-grow break-words">
                          <span className="font-bold">{product.name}</span> - ₹{product.price?.toFixed(2) || '0.00'} <span className="text-gray-500 text-base">(Category: {product.category?.name || 'N/A'})</span>
                        </span>
                      )}
                      <div className="flex space-x-3 mt-3 sm:mt-0">
                        {editingProduct && editingProduct.id === product.id ? (
                          <button onClick={handleSaveProduct} className={`${actionButtonClass} text-green-600 hover:text-green-800 focus:ring-green-500`}>
                            <Save className="w-7 h-7" />
                          </button>
                        ) : (
                          <button onClick={() => handleEditProduct(product)} className={`${actionButtonClass} text-blue-600 hover:text-blue-800 focus:ring-blue-500`}>
                            <Edit className="w-7 h-7" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteProduct(product.id)} className={`${actionButtonClass} text-red-600 hover:text-red-800 focus:ring-red-500`}>
                          <Trash2 className="w-7 h-7" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      case 'coupons':
        return (
          <section className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-4xl font-extrabold text-green-800 mb-8 flex items-center">
              <Percent className="w-9 h-9 mr-4 text-green-600" /> Coupon Management
            </h2>

            {/* Add Coupon Form */}
            <div className="mb-10 p-7 bg-green-50 rounded-2xl shadow-inner border border-green-100">
              <h3 className="text-2xl font-bold text-green-700 mb-5">Add New Coupon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={newCoupon.couponCode}
                  onChange={(e) => setNewCoupon({ ...newCoupon, couponCode: e.target.value })}
                  className={formInputClass}
                />
                <input
                  type="number"
                  placeholder="Discount Value"
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                  className={formInputClass}
                />
                <input
                  type="number"
                  placeholder="Min Order Amount"
                  value={newCoupon.minOrderAmt}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmt: e.target.value })}
                  className={formInputClass}
                />
                <div className="flex items-center space-x-4 p-3 border border-green-300 rounded-lg bg-white shadow-sm">
                  <input
                    type="checkbox"
                    checked={newCoupon.isActive}
                    onChange={(e) => setNewCoupon({ ...newCoupon, isActive: e.target.checked })}
                    className="h-6 w-6 text-green-600 focus:ring-green-500 border-gray-300 rounded-md"
                  />
                  <label className="text-lg text-gray-700 font-medium">Is Active</label>
                </div>
                <input
                  type="date"
                  placeholder="Valid From"
                  value={newCoupon.validFrom}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
                  className={formInputClass}
                />
                <input
                  type="date"
                  placeholder="Valid Until"
                  value={newCoupon.validUntil}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                  className={formInputClass}
                />
              </div>
              <button
                onClick={handleAddCoupon}
                disabled={couponLoading}
                className={primaryButtonClass}
              >
                {couponLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Adding Coupon...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-6 h-6 mr-2" /> Add Coupon
                  </>
                )}
              </button>
            </div>

            {/* Coupon List */}
            <div className="bg-green-50 rounded-2xl shadow-inner border border-green-100 p-7">
              <h3 className="text-2xl font-bold text-green-700 mb-5">Existing Coupons</h3>
              {couponLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-green-600 mx-auto"></div>
                  <p className="text-green-600 mt-4 text-xl">Loading coupons...</p>
                </div>
              ) : coupons.length === 0 ? (
                <p className="text-gray-600 text-center py-6 text-lg">No coupons added yet. Add a new coupon above!</p>
              ) : (
                <ul className="space-y-4">
                  {coupons.map(coupon => (
                    <li key={coupon.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg">
                      {editingCoupon && editingCoupon.id === coupon.id ? (
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 mr-4 w-full">
                          <input
                            type="text"
                            value={editingCoupon.couponCode}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, couponCode: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                          <input
                            type="number"
                            value={editingCoupon.discountValue}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                          <input
                            type="number"
                            placeholder="Min Order Amount"
                            value={editingCoupon.minOrderAmt}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderAmt: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                           <input
                            type="date"
                            value={editingCoupon.validFrom}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, validFrom: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                          <input
                            type="date"
                            value={editingCoupon.validUntil}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, validUntil: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-800 text-xl font-medium flex-grow break-words">
                          <span className="font-bold">{coupon.couponCode}</span> - {coupon.discountValue}% off <span className="text-gray-500 text-base">(Expires: {coupon.validUntil})</span>
                        </span>
                      )}
                      <div className="flex space-x-3 mt-3 sm:mt-0">
                        {editingCoupon && editingCoupon.id === coupon.id ? (
                          <button onClick={handleSaveCoupon} className={`${actionButtonClass} text-green-600 hover:text-green-800 focus:ring-green-500`}>
                            <Save className="w-7 h-7" />
                          </button>
                        ) : (
                          <button onClick={() => handleEditCoupon(coupon)} className={`${actionButtonClass} text-blue-600 hover:text-blue-800 focus:ring-blue-500`}>
                            <Edit className="w-7 h-7" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteCoupon(coupon.id)} className={`${actionButtonClass} text-red-600 hover:text-red-800 focus:ring-red-500`}>
                          <Trash2 className="w-7 h-7" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      case 'vendors':
        return (
          <section className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-4xl font-extrabold text-green-800 mb-8 flex items-center">
              <Store className="w-9 h-9 mr-4 text-green-600" /> Vendor Management
            </h2>

            {/* Add Vendor Form */}
            <div className="mb-10 p-7 bg-green-50 rounded-2xl shadow-inner border border-green-100">
              <h3 className="text-2xl font-bold text-green-700 mb-5">Add New Vendor</h3>
              <input
                type="text"
                placeholder="Vendor Name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                className={`${formInputClass} w-full mb-5`}
              />
              <input
                type="email"
                placeholder="Vendor Email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                className={`${formInputClass} w-full mb-5`}
              />
              <div className="relative w-full mb-5">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={newVendor.password}
                  onChange={(e) => setNewVendor({ ...newVendor, password: e.target.value })}
                  className={`${formInputClass} w-full pr-10`} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={newVendor.phoneNumber}
                onChange={(e) => setNewVendor({ ...newVendor, phoneNumber: e.target.value })}
                className={`${formInputClass} w-full mb-5`}
              />
              <button
                onClick={handleAddVendor}
                disabled={vendorLoading}
                className={primaryButtonClass}
              >
                {vendorLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Adding Vendor...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-6 h-6 mr-2" /> Add Vendor
                  </>
                )}
              </button>
            </div>
            {/* Vendor List */}
            <div className="bg-green-50 rounded-2xl shadow-inner border border-green-100 p-7">
              <h3 className="text-2xl font-bold text-green-700 mb-5">Existing Vendors</h3>
              {vendorLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-green-600 mx-auto"></div>
                  <p className="text-green-600 mt-4 text-xl">Loading vendors...</p>
                </div>
              ) : vendors.length === 0 ? (
                <p className="text-gray-600 text-center py-6 text-lg">No vendors found.</p>
              ) : (
                <ul className="space-y-4">
                  {vendors.map(vendor => (
                    <li key={vendor.id} className="p-5 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg">
                      <span className="text-gray-800 text-xl font-medium flex-grow break-words">
                        <span className="font-bold">{vendor.name}</span> - {vendor.email}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      case 'users':
        return (
          <section className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-4xl font-extrabold text-green-800 mb-8 flex items-center">
              <Users className="w-9 h-9 mr-4 text-green-600" /> User Management
            </h2>
            <div className="bg-green-50 rounded-2xl shadow-inner border border-green-100 p-7">
              <h3 className="text-2xl font-bold text-green-700 mb-5">All Registered Users</h3>
              {userLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-green-600 mx-auto"></div>
                  <p className="text-green-600 mt-4 text-xl">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <p className="text-gray-600 text-center py-6 text-lg">No users found.</p>
              ) : (
                <ul className="space-y-4">
                  {users.map(user => (
                    <li key={user.id} className="p-5 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg">
                      <span className="text-gray-800 text-xl font-medium flex-grow break-words">
                        <span className="font-bold">{user.name}</span> - {user.email} <span className="text-gray-500 text-base">({user.role})</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      case 'orders':
        // New status options as requested by the user
        const deliveryStatusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];
        return (
          <section className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-4xl font-extrabold text-green-800 mb-8 flex items-center">
              <ShoppingCart className="w-9 h-9 mr-4 text-green-600" /> Order Management
            </h2>
            <div className="bg-green-50 rounded-2xl shadow-inner border border-green-100 p-7">
              <h3 className="text-2xl font-bold text-green-700 mb-5">All Orders</h3>
              {orderLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-green-600 mx-auto"></div>
                  <p className="text-green-600 mt-4 text-xl">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <p className="text-gray-600 text-center py-6 text-lg">No orders found.</p>
              ) : (
                <ul className="space-y-4">
                  {orders.map(order => (
                    <li key={order.id} className="p-5 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg">
                      <div className="flex flex-col sm:flex-row justify-between mb-4">
                        <div className="text-gray-800 text-xl font-medium">
                          Order #{order.id} - Total: ₹{order.totalAmt?.toFixed(2) || '0.00'}
                        </div>
                        <span className="text-sm text-gray-500 mt-2 sm:mt-0">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col">
                          <label className="text-sm font-bold text-green-700">Delivery Status</label>
                          <select
                            // The onChange handler is now correctly calling handleUpdateDeliveryStatus with the new status
                            value={order.deliveryStatus}
                            onChange={(e) => handleUpdateDeliveryStatus(order.id, e.target.value)}
                            className={formSelectClass}
                          >
                            {deliveryStatusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      case 'payments':
        return (
          <section className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-4xl font-extrabold text-green-800 mb-8 flex items-center">
              <CreditCard className="w-9 h-9 mr-4 text-green-600" /> Payment Management
            </h2>
            <div className="mb-8 p-6 bg-green-50 rounded-2xl shadow-inner border border-green-100 text-center">
              <h3 className="text-2xl font-bold text-green-700">Total Transactions</h3>
              <p className="text-5xl font-extrabold text-green-900 mt-2">
                ₹{totalTransactions.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 rounded-2xl shadow-inner border border-green-100 p-7">
              <h3 className="text-2xl font-bold text-green-700 mb-5">All Transactions</h3>
              {paymentLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-green-600 mx-auto"></div>
                  <p className="text-green-600 mt-4 text-xl">Loading transactions...</p>
                </div>
              ) : payments.length === 0 ? (
                <p className="text-gray-600 text-center py-6 text-lg">No transactions found.</p>
              ) : (
                <ul className="space-y-4">
                  {payments.map(payment => (
                    <li key={payment.id} className="p-5 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-gray-800 text-xl font-medium">
                          Transaction ID: <span className="font-bold">{payment.id}</span>
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          Date: {new Date(payment.datetime).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-green-600 text-2xl font-bold">
                        ₹{payment.amount?.toFixed(2) || '0.00'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      case 'categories':
        return (
          <section className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-4xl font-extrabold text-green-800 mb-8 flex items-center">
              <LayoutList className="w-9 h-9 mr-4 text-green-600" /> Category Management
            </h2>

            {/* Add Category Form */}
            <div className="mb-10 p-7 bg-green-50 rounded-2xl shadow-inner border border-green-100">
              <h3 className="text-2xl font-bold text-green-700 mb-5">Add New Category</h3>
              <div className="flex flex-col sm:flex-row gap-5">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className={`${formInputClass} flex-grow`}
                />
                 <input
                  type="text"
                  placeholder="Description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className={`${formInputClass} flex-grow`}
                />
                <button
                  onClick={handleAddCategory}
                  disabled={categoryLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition duration-300 flex items-center justify-center text-lg font-bold shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {categoryLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-6 h-6 mr-2" /> Add Category
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Category List */}
            <div className="bg-green-50 rounded-2xl shadow-inner border border-green-100 p-7">
              <h3 className="text-2xl font-bold text-green-700 mb-5">Existing Categories</h3>
              {categoryLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-green-600 mx-auto"></div>
                  <p className="text-green-600 mt-4 text-xl">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-gray-600 text-center py-6 text-lg">No categories added yet. Add a new category above!</p>
              ) : (
                <ul className="space-y-4">
                  {categories.map(category => (
                    <li key={category.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg">
                      {editingCategory && editingCategory.id === category.id ? (
                        <div className="flex-grow mr-4 w-full">
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                          <input
                            type="text"
                            value={editingCategory.description}
                            onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                            className="p-3 border border-blue-300 rounded-md text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-800 text-xl font-medium flex-grow break-words">
                          <span className="font-bold">{category.name}</span> <span className="text-gray-500 text-base">({category.description || 'No description'})</span>
                        </span>
                      )}
                      <div className="flex space-x-3 mt-3 sm:mt-0">
                        {editingCategory && editingCategory.id === category.id ? (
                          <button onClick={handleSaveCategory} className={`${actionButtonClass} text-green-600 hover:text-green-800 focus:ring-green-500`}>
                            <Save className="w-7 h-7" />
                          </button>
                        ) : (
                          <button onClick={() => handleEditCategory(category)} className={`${actionButtonClass} text-blue-600 hover:text-blue-800 focus:ring-blue-500`}>
                            <Edit className="w-7 h-7" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteCategory(category.id)} className={`${actionButtonClass} text-red-600 hover:text-red-800 focus:ring-red-500`}>
                          <Trash2 className="w-7 h-7" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const navItemClass = (section) => 
    `flex items-center p-4 rounded-xl transition-all duration-300 ease-in-out ${
      activeSection === section
        ? 'bg-green-600 text-white shadow-xl transform scale-105'
        : 'text-green-300 hover:bg-green-700 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-100 font-inter flex">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-b from-green-800 to-green-950 text-white transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-24'} p-6 flex flex-col shadow-2xl z-10`}>
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center gap-3">
            <Leaf className="h-12 w-12 text-green-300 drop-shadow-md" />
            {isSidebarOpen && <Menu className="h-10 w-10 text-green-300 drop-shadow-md" />}
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75">
            <ChevronRight className={`w-8 h-8 text-green-300 transform transition-transform ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`} />
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <button onClick={() => setActiveSection('products')} className={navItemClass('products')}>
                <Package className="w-8 h-8" />
                {isSidebarOpen && <span className="ml-4 text-lg font-medium">Product Management</span>}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('coupons')} className={navItemClass('coupons')}>
                <Percent className="w-8 h-8" />
                {isSidebarOpen && <span className="ml-4 text-lg font-medium">Coupon Management</span>}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('vendors')} className={navItemClass('vendors')}>
                <Store className="w-8 h-8" />
                {isSidebarOpen && <span className="ml-4 text-lg font-medium">Vendor Management</span>}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('categories')} className={navItemClass('categories')}>
                <LayoutList className="w-8 h-8" />
                {isSidebarOpen && <span className="ml-4 text-lg font-medium">Category Management</span>}
              </button>
            </li>
            {/* New navigation items */}
            <li>
              <button onClick={() => setActiveSection('users')} className={navItemClass('users')}>
                <Users className="w-8 h-8" />
                {isSidebarOpen && <span className="ml-4 text-lg font-medium">User Management</span>}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('orders')} className={navItemClass('orders')}>
                <ShoppingCart className="w-8 h-8" />
                {isSidebarOpen && <span className="ml-4 text-lg font-medium">Order Management</span>}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('payments')} className={navItemClass('payments')}>
                <CreditCard className="w-8 h-8" />
                {isSidebarOpen && <span className="ml-4 text-lg font-medium">Payment Management</span>}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <header className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 sm:p-10 text-white text-center rounded-4xl shadow-3xl mb-12 transform hover:scale-102 transition-transform duration-300">
          <h1 className="text-5xl sm:text-6xl font-extrabold flex items-center justify-center gap-5 drop-shadow-xl">
            <Leaf className="w-12 h-12" /> Admin Dashboard
          </h1>
          <p className="text-green-100 text-2xl mt-4 font-light">Empowering your marketplace management</p>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
