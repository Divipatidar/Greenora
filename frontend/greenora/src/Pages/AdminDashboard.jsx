import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Edit, Leaf, Trash2, XCircle, Save, UserPlus, Store, Tag, Package, Percent, LayoutList, AlertCircle } from 'lucide-react';
import productServices from '../Services/productServices';
import categoryServices from '../Services/CategoryServices';
import couponServices from '../Services/CouponServices';

const AdminDashboard = () => {
  const { auth } = useAuth();

  // State for managing categories
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // State for managing products
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', description: '', image: '' });
  const [productLoading, setProductLoading] = useState(false);

  // State for managing coupons
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'percentage', expiry: '', description: '' });
  const [couponLoading, setCouponLoading] = useState(false);

  // State for managing vendors
  const [vendors, setVendors] = useState([
    { id: 1, name: 'Green Farm Co.', email: 'greenfarm@example.com' },
    { id: 2, name: 'Healthy Harvest', email: 'healthyharvest@example.com' },
  ]);
  const [newVendor, setNewVendor] = useState({ name: '', email: '' });

  // Load data on component mount
  useEffect(() => {
    loadCategories();
    loadProducts();
    loadCoupons();
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

  // --- Category Management Functions ---
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
    
    try {
      setCategoryLoading(true);
      const addedCategory = await categoryServices.addCategory(newCategory);
      setCategories([...categories, addedCategory]);
      setNewCategory({ name: '' });
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
  };

  const handleSaveCategory = async () => {
    if (!editingCategory.name.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
    
    try {
      setCategoryLoading(true);
      const updatedCategory = await categoryServices.updateCategory(editingCategory.id, editingCategory);
      setCategories(categories.map(c => c.id === editingCategory.id ? updatedCategory : c));
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category. Please try again.');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setCategoryLoading(true);
        await categoryServices.deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
        // Also update products that might be using this category
        setProducts(products.map(p => p.category === categories.find(c => c.id === id)?.name ? { ...p, category: '' } : p));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      } finally {
        setCategoryLoading(false);
      }
    }
  };

  // --- Product Management Functions ---
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
      alert('Please fill all required product fields.');
      return;
    }
    
    try {
      setProductLoading(true);
      const selectedCategory = categories.find(c => c.name === newProduct.category);
      if (!selectedCategory) {
        alert('Please select a valid category.');
        return;
      }
      
      const addedProduct = await productServices.addProduct(newProduct, selectedCategory.id);
      setProducts([...products, addedProduct]);
      setNewProduct({ name: '', price: '', stock: '', category: '', description: '', image: '' });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setProductLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveProduct = async () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.stock || !editingProduct.category) {
      alert('Please fill all required product fields.');
      return;
    }
    
    try {
      setProductLoading(true);
      const updatedProduct = await productServices.updateProduct(editingProduct.id, editingProduct);
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setProductLoading(true);
        await productServices.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      } finally {
        setProductLoading(false);
      }
    }
  };

  // --- Coupon Management Functions ---
  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.expiry) {
      alert('Please fill all required coupon fields.');
      return;
    }
    
    try {
      setCouponLoading(true);
      const addedCoupon = await couponServices.create(newCoupon);
      setCoupons([...coupons, addedCoupon]);
      setNewCoupon({ code: '', discount: '', type: 'percentage', expiry: '', description: '' });
    } catch (error) {
      console.error('Error adding coupon:', error);
      alert('Failed to add coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon({ ...coupon });
  };

  const handleSaveCoupon = async () => {
    if (!editingCoupon.code || !editingCoupon.discount || !editingCoupon.expiry) {
      alert('Please fill all required coupon fields.');
      return;
    }
    
    try {
      setCouponLoading(true);
      const updatedCoupon = await couponServices.updateCoupon(editingCoupon.id, editingCoupon);
      setCoupons(coupons.map(c => c.id === editingCoupon.id ? updatedCoupon : c));
      setEditingCoupon(null);
    } catch (error) {
      console.error('Error updating coupon:', error);
      alert('Failed to update coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        setCouponLoading(true);
        await couponServices.deleteCoupon(id);
        setCoupons(coupons.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting coupon:', error);
        alert('Failed to delete coupon. Please try again.');
      } finally {
        setCouponLoading(false);
      }
    }
  };

  // --- Vendor Management Functions ---
  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.email) {
      alert('Please fill all vendor fields.');
      return;
    }
    const id = vendors.length > 0 ? Math.max(...vendors.map(v => v.id)) + 1 : 1;
    setVendors([...vendors, { id, ...newVendor }]);
    setNewVendor({ name: '', email: '' });
  };

  const handleDeleteVendor = (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== id));
    }
  };

  // Access control check
  if (!auth.isLoading && (!auth.isLoggedIn || auth.user?.role !== 'ROLE_ADMIN')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-700 text-lg font-semibold">
        <XCircle className="w-6 h-6 mr-2" /> Access denied. Admins only.
      </div>
    );
  }

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600 text-lg font-semibold">
        Loading authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-8 font-inter">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <header className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 sm:p-8 text-white text-center rounded-t-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center justify-center gap-3">
            <Leaf className="w-9 h-9 sm:w-10 sm:h-10 text-green-200" />
            Admin Dashboard
          </h1>
          <p className="text-green-200 text-lg mt-2">Manage your marketplace with ease</p>
        </header>

        <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Management Section */}
          <section className="bg-green-50 p-6 rounded-xl shadow-md border border-green-200 col-span-1 lg:col-span-1">
            <h2 className="text-2xl font-bold text-green-800 mb-5 flex items-center">
              <Package className="w-6 h-6 mr-2 text-green-600" /> Product Management
            </h2>

            {/* Add Product Form */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
                {/* Category Dropdown */}
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 md:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 md:col-span-2"
                />
              </div>
              <button
                onClick={handleAddProduct}
                disabled={productLoading}
                className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center text-sm font-medium disabled:opacity-50"
              >
                {productLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5 mr-2" /> Add Product
                  </>
                )}
              </button>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Existing Products</h3>
              {productLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-green-600 mt-2">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <p className="text-gray-500 text-center">No products added yet.</p>
              ) : (
                <ul className="space-y-3">
                  {products.map(product => (
                    <li key={product.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      {editingProduct && editingProduct.id === product.id ? (
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2 mr-2">
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm"
                          />
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm"
                          />
                           <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm"
                          />
                          {/* Category Dropdown for Editing */}
                          <select
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm bg-white"
                          >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="text-green-800 text-sm font-medium">
                          {product.name} - ${product.price?.toFixed(2) || '0.00'} ({product.stock || 0} in stock) [{product.category}]
                        </span>
                      )}
                      <div className="flex space-x-2">
                        {editingProduct && editingProduct.id === product.id ? (
                          <button onClick={handleSaveProduct} className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition">
                            <Save className="w-5 h-5" />
                          </button>
                        ) : (
                          <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition">
                            <Edit className="w-5 h-5" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Coupon Management Section */}
          <section className="bg-green-50 p-6 rounded-xl shadow-md border border-green-200 col-span-1 lg:col-span-1">
            <h2 className="text-2xl font-bold text-green-800 mb-5 flex items-center">
              <Percent className="w-6 h-6 mr-2 text-green-600" /> Coupon Management
            </h2>

            {/* Add Coupon Form */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Add New Coupon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
                <input
                  type="number"
                  placeholder="Discount Value"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
                <select
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="shipping">Free Shipping</option>
                </select>
                <input
                  type="date"
                  placeholder="Expiry Date"
                  value={newCoupon.expiry}
                  onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 md:col-span-2"
                />
              </div>
              <button
                onClick={handleAddCoupon}
                disabled={couponLoading}
                className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center text-sm font-medium disabled:opacity-50"
              >
                {couponLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5 mr-2" /> Add Coupon
                  </>
                )}
              </button>
            </div>

            {/* Coupon List */}
            <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Existing Coupons</h3>
              {couponLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-green-600 mt-2">Loading coupons...</p>
                </div>
              ) : coupons.length === 0 ? (
                <p className="text-gray-500 text-center">No coupons added yet.</p>
              ) : (
                <ul className="space-y-3">
                  {coupons.map(coupon => (
                    <li key={coupon.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      {editingCoupon && editingCoupon.id === coupon.id ? (
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2 mr-2">
                          <input
                            type="text"
                            value={editingCoupon.code}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm"
                          />
                          <input
                            type="number"
                            value={editingCoupon.discount}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, discount: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm"
                          />
                          <select
                            value={editingCoupon.type}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, type: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm bg-white"
                          >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                            <option value="shipping">Free Shipping</option>
                          </select>
                          <input
                            type="date"
                            value={editingCoupon.expiry}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, expiry: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm"
                          />
                        </div>
                      ) : (
                        <span className="text-green-800 text-sm font-medium">
                          {coupon.code} - {coupon.type === 'percentage' ? `${coupon.discount}%` : coupon.type === 'fixed' ? `$${coupon.discount}` : 'Free Shipping'} (Expires: {coupon.expiry})
                        </span>
                      )}
                      <div className="flex space-x-2">
                        {editingCoupon && editingCoupon.id === coupon.id ? (
                          <button onClick={handleSaveCoupon} className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition">
                            <Save className="w-5 h-5" />
                          </button>
                        ) : (
                          <button onClick={() => handleEditCoupon(coupon)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition">
                            <Edit className="w-5 h-5" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteCoupon(coupon.id)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Vendor Management Section */}
          <section className="bg-green-50 p-6 rounded-xl shadow-md border border-green-200 col-span-1 lg:col-span-1">
            <h2 className="text-2xl font-bold text-green-800 mb-5 flex items-center">
              <Store className="w-6 h-6 mr-2 text-green-600" /> Vendor Management
            </h2>

            {/* Add Vendor Form */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Add New Vendor</h3>
              <input
                type="text"
                placeholder="Vendor Name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                className="w-full p-2 border border-green-300 rounded-lg mb-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              />
              <input
                type="email"
                placeholder="Vendor Email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                className="w-full p-2 border border-green-300 rounded-lg mb-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              />
              <button
                onClick={handleAddVendor}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center text-sm font-medium"
              >
                <UserPlus className="w-5 h-5 mr-2" /> Add Vendor
              </button>
            </div>

            {/* Vendor List */}
            <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Existing Vendors</h3>
              {vendors.length === 0 ? (
                <p className="text-gray-500 text-center">No vendors added yet.</p>
              ) : (
                <ul className="space-y-3">
                  {vendors.map(vendor => (
                    <li key={vendor.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-green-800 text-sm font-medium">
                        {vendor.name} ({vendor.email})
                      </span>
                      <button onClick={() => handleDeleteVendor(vendor.id)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Category Management Section */}
          <section className="bg-green-50 p-6 rounded-xl shadow-md border border-green-200 col-span-1 lg:col-span-3">
            <h2 className="text-2xl font-bold text-green-800 mb-5 flex items-center">
              <LayoutList className="w-6 h-6 mr-2 text-green-600" /> Category Management
            </h2>

            {/* Add Category Form */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Add New Category</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="flex-grow p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
                <button
                  onClick={handleAddCategory}
                  disabled={categoryLoading}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center text-sm font-medium disabled:opacity-50"
                >
                  {categoryLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5 mr-2" /> Add Category
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Category List */}
            <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Existing Categories</h3>
              {categoryLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-green-600 mt-2">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-gray-500 text-center">No categories added yet.</p>
              ) : (
                <ul className="space-y-3">
                  {categories.map(category => (
                    <li key={category.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      {editingCategory && editingCategory.id === category.id ? (
                        <div className="flex-grow mr-2">
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                            className="w-full p-1 border border-green-300 rounded-md text-sm"
                          />
                        </div>
                      ) : (
                        <span className="text-green-800 text-sm font-medium">
                          {category.name}
                        </span>
                      )}
                      <div className="flex space-x-2">
                        {editingCategory && editingCategory.id === category.id ? (
                          <button onClick={handleSaveCategory} className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition">
                            <Save className="w-5 h-5" />
                          </button>
                        ) : (
                          <button onClick={() => handleEditCategory(category)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition">
                            <Edit className="w-5 h-5" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
