import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Edit, Trash2, XCircle, Save, Package, LayoutList, AlertCircle, Leaf } from 'lucide-react';
import productServices from '../Services/productServices';
import categoryServices from '../Services/CategoryServices';
import { Link } from 'react-router-dom';
const VendorDashboard = () => {
  const { auth } = useAuth();

  // State for managing categories (Vendors can select from existing categories)
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // State for managing products (Vendor's own products)
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '', categoryId: '', ecoRating: '', quantity: '' });
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
      const data = await productServices.vendorProducts(auth.user.id);
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
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
      alert('Please fill all required product fields.');
      return;
    }

    try {
      setProductLoading(true);
      const productToAdd = { ...newProduct, vendorId: auth.user.id };
      const addedProduct = await productServices.addProduct(productToAdd,newProduct.categoryId);
      setProducts([...products, addedProduct]);
      setNewProduct({ name: '', description: '', price: '', image: '', categoryId: '', ecoRating: '', quantity: '' });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setProductLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      categoryId: product.category?.id,
      vendorId: product.vendor?.id,
      quantity: product.quantity,
      price: product.price,
      ecoRating: product.ecoRating
    });
  };


  const handleSaveProduct = async () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.categoryId) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-8 font-inter">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <header className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 sm:p-8 text-white text-center rounded-t-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center justify-center gap-3 tracking-wide">
          <Link to="/">
                   <Leaf className="h-8 w-8 text-white cursor-pointer" />
                </Link>            Vendor Dashboard
          </h1>
          <p className="text-green-200 text-lg mt-2">Manage your eco-friendly products</p>
        </header>

        <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Management Section */}
          <section className="bg-green-50 p-6 rounded-xl shadow-lg border border-green-200 col-span-1 lg:col-span-2 transform transition duration-300 hover:scale-[1.01]">
            <h2 className="text-2xl font-bold text-green-800 mb-5 flex items-center">
              <Package className="w-6 h-6 mr-2 text-green-600" /> My Products
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
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
                <input
                  type="number"
                  placeholder="Eco Rating (1-5)"
                  value={newProduct.ecoRating}
                  onChange={(e) => setNewProduct({ ...newProduct, ecoRating: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white text-gray-700"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
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
              <h3 className="text-lg font-semibold text-green-700 mb-3">My Existing Products</h3>
              {productLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-green-600 mt-2">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="flex items-center justify-center text-gray-500 p-4 bg-gray-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <p>No products added yet.</p>
                </div>
              ) : (
                <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {products.map(product => (
                    <li key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                      {editingProduct && editingProduct.id === product.id ? (
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2 mr-2 w-full">
                           <input
                            type="text"
                            placeholder="Product Name"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm"
                          />
                           <input
                            type="number"
                            placeholder="Quantity"
                            value={editingProduct.quantity}
                            onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm"
                          />
                           <input
                            type="number"
                            placeholder="Eco Rating (1-5)"
                            value={editingProduct.ecoRating}
                            onChange={(e) => setEditingProduct({ ...editingProduct, ecoRating: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={editingProduct.image}
                            onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm"
                          />
                          <select
                            value={editingProduct.categoryId}
                            onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm bg-white text-gray-700"
                          >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                           <textarea
                            placeholder="Description"
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="p-1 border border-green-300 rounded-md text-sm col-span-2"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col flex-grow">
                          <span className="text-green-800 font-bold text-base">{product.name}</span>
                          <span className="text-gray-600 text-sm">Price: ₹{product.price?.toFixed(2) || '0.00'} | Qty: {product.quantity || 0}</span>
                          <span className="text-gray-500 text-xs">Category: {product.category?.name} | Eco Rating: {product.ecoRating}</span>
                        </div>
                      )}
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        {editingProduct && editingProduct.id === product.id ? (
                          <button onClick={handleSaveProduct} className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition">
                            <Save className="w-5 h-5" />
                          </button>
                        ) : (
                          <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition">
                            <Edit className="w-5 h-5" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition">
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