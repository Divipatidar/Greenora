import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Edit, Trash2, XCircle, Save, Package, LayoutList, AlertCircle } from 'lucide-react';
import productServices from '../Services/productServices';
import categoryServices from '../Services/CategoryServices';

const VendorDashboard = () => {
  const { auth } = useAuth();

  // State for managing categories (Vendors can select from existing categories)
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // State for managing products (Vendor's own products)
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', description: '', image: '' });
  const [productLoading, setProductLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadCategories();
    loadVendorProducts();
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

  const loadVendorProducts = async () => {
    try {
      setProductLoading(true);
      // In a real app, you'd filter products by vendor ID
      const data = await productServices.fetchProducts();
      // For now, we'll assume all products belong to the current vendor
      setProducts(data);
    } catch (error) {
      console.error('Error loading vendor products:', error);
    } finally {
      setProductLoading(false);
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

  // Access control check
  if (!auth.isLoading && (!auth.isLoggedIn || auth.user?.role !== 'ROLE_VENDOR')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-700 text-lg font-semibold">
        <XCircle className="w-6 h-6 mr-2" /> Access denied. Vendors only.
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 p-4 sm:p-8 font-inter">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <header className="bg-gradient-to-r from-amber-600 to-orange-700 p-6 sm:p-8 text-white text-center rounded-t-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center justify-center gap-3">
            <Package className="w-9 h-9 sm:w-10 sm:h-10 text-yellow-200" />
            Vendor Dashboard
          </h1>
          <p className="text-yellow-200 text-lg mt-2">Manage your products and orders</p>
        </header>

        <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Management Section */}
          <section className="bg-yellow-50 p-6 rounded-xl shadow-md border border-yellow-200 col-span-1 lg:col-span-2">
            <h2 className="text-2xl font-bold text-amber-800 mb-5 flex items-center">
              <Package className="w-6 h-6 mr-2 text-amber-600" /> My Products
            </h2>

            {/* Add Product Form */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-yellow-100">
              <h3 className="text-lg font-semibold text-amber-700 mb-3">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="p-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="p-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="p-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200"
                />
                {/* Category Dropdown */}
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="p-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 bg-white"
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
                  className="p-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 md:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="p-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 md:col-span-2"
                />
              </div>
              <button
                onClick={handleAddProduct}
                disabled={productLoading}
                className="mt-4 w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition duration-300 flex items-center justify-center text-sm font-medium disabled:opacity-50"
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
            <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-4">
              <h3 className="text-lg font-semibold text-amber-700 mb-3">My Existing Products</h3>
              {productLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto"></div>
                  <p className="text-amber-600 mt-2">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <p className="text-gray-500 text-center">No products added yet.</p>
              ) : (
                <ul className="space-y-3">
                  {products.map(product => (
                    <li key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      {editingProduct && editingProduct.id === product.id ? (
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2 mr-2">
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="p-1 border border-yellow-300 rounded-md text-sm"
                          />
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                            className="p-1 border border-yellow-300 rounded-md text-sm"
                          />
                           <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                            className="p-1 border border-yellow-300 rounded-md text-sm"
                          />
                          {/* Category Dropdown for Editing */}
                          <select
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="p-1 border border-yellow-300 rounded-md text-sm bg-white"
                          >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="text-amber-800 text-sm font-medium">
                          {product.name} - ${product.price?.toFixed(2) || '0.00'} ({product.stock || 0} in stock) [{product.category}]
                        </span>
                      )}
                      <div className="flex space-x-2">
                        {editingProduct && editingProduct.id === product.id ? (
                          <button onClick={handleSaveProduct} className="text-amber-600 hover:text-amber-800 p-1 rounded-full hover:bg-amber-100 transition">
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
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
