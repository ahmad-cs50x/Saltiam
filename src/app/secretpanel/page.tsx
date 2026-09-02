"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from '../../lib/apiClient';
import { toast } from 'react-toastify';
import { fetchBlogs, adminLogout, changePassword, forgetPassword, verifyOTP, resetPassword } from '../../services/api';

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [forgetEmail, setForgetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  // Modals state
  const [showChangePass, setShowChangePass] = useState(false);
  const [showForgetPass, setShowForgetPass] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Product Form State
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'food-salt',
    availability: 'In Stock',
    itemsSold: 0,
    isFeatured: false,
    images: []
  });

  const [activeTab, setActiveTab] = useState('blogs'); 
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;

  useEffect(() => {
    if (status !== 'loading' && role !== 'super') {
      toast.error('Only super users can access the admin dashboard.');
      router.replace('/');
    }
  }, [role, router, status]);

  // Helper function to strip HTML tags from text
  const stripHTML = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  };

  const getProductImageSrc = (img) => {
    if (!img) return null;
    if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/uploads/') || img.startsWith('uploads/')) return img;
    return `/uploads/${img}`;
  };

  // Fixed: Was breaking JavaScript with wrong backticks
  const getProductName = (productRef) => {
    if (!productRef) return 'Unknown Product';
    const id = typeof productRef === 'string' ? productRef : productRef._id || productRef.id;
    const product = products.find(p => p._id === id || p.id === id);
    return product ? product.name : productRef.name || 'Unknown Product';
  };

  useEffect(() => {
    fetchBlogs().then(res => setBlogs(res.data || [])).catch(() => setError('Failed to load blogs'));
    
    // Fetch reviews
    api.get('/api/reviews')
      .then(res => setReviews(res.data || []))
      .catch(err => console.error("Failed to load reviews", err));

    // Fetch products
    fetchProducts();

    // Fetch users
    fetchUsers();

    const params = searchParams;
    if (params.get('show') === 'otp') {
      setShowOTP(true);
      setForgetEmail(params.get('email') || '');
    }
    if (params.get('show') === 'newpass') {
      setShowNewPass(true);
      setForgetEmail(params.get('email') || '');
    }

    // Auto-logout on browser/tab close with email notification
    const handleBeforeUnload = async () => {
      try {
        const data = JSON.stringify({ action: 'auto-logout' });
        navigator.sendBeacon('/api/admin/logout-notification', data);
        localStorage.removeItem('adminToken');
      } catch (err) {
        console.error('Auto-logout notification failed:', err);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users');
      const usersData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await api.put(`/api/users/${id}`, { role });
      await fetchUsers();
      toast.success(`User is now a ${role} user.`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update user role.');
    }
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
      localStorage.removeItem('adminToken');
      router.push('/admin-login');
    } catch (err) {
      setError('Logout failed');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPass !== confirm || newPass.length < 6) {
      setError('Passwords do not match or too short');
      return;
    }
    try {
      await changePassword({ currentPassword: current, newPassword: newPass });
      alert('Password changed successfully!');
      setShowChangePass(false);
      setCurrent('');
      setNewPass('');
      setConfirm('');
    } catch (err) {
      setError(err.response?.data?.error || 'Change failed');
    }
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await forgetPassword({ email: forgetEmail });
      setShowForgetPass(false);
      setShowOTP(true);
    } catch (err) {
      setError('Send OTP failed');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await verifyOTP({ email: forgetEmail, otp });
      setShowOTP(false);
      setShowNewPass(true);
    } catch (err) {
      setError('Invalid OTP');
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPass !== confirm || newPass.length < 6) {
      setError('Passwords do not match or too short');
      return;
    }
    try {
      await resetPassword({ email: forgetEmail, otp, newPassword: newPass });
      alert('Password updated successfully!');
      setShowNewPass(false);
      router.push('/admin-login');
    } catch (err) {
      setError('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/api/blogs/${id}`);
        // Refresh blogs from server to ensure UI consistency
        const refreshed = await fetchBlogs();
        setBlogs(refreshed.data || []);
        toast.success('Blog deleted successfully');
      } catch (err) {
        const errMsg = err.response?.data?.error || err.message || 'Delete failed';
        setError(errMsg);
        toast.error(errMsg);
      }
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/api/reviews/${id}`, { credentials: 'include' });
        setReviews(prev => prev.filter(r => r._id !== id));
        toast.success('Review deleted successfully');
      } catch (err) {
        console.error("Delete review failed", err);
        if (err.response && err.response.status === 401) {
          toast.error('Session expired. Please log in again.');
          router.push('/admin-login');
        } else {
          toast.error('Failed to delete review');
        }
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/api/users/${id}`);
        setUsers(prev => prev.filter(u => u._id !== id));
        toast.success('User deleted successfully');
      } catch (err) {
        console.error("Delete user failed", err);
        toast.error('Failed to delete user');
      }
    }
  };

  // Product Management Handlers (rest of your code unchanged...)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('description', productForm.description);
    formData.append('category', productForm.category);
    formData.append('availability', productForm.availability);
    formData.append('itemsSold', productForm.itemsSold || 0);
    formData.append('isFeatured', productForm.isFeatured);
    
    if (productForm.images) {
      for (let i = 0; i < productForm.images.length; i++) {
        formData.append('images', productForm.images[i]);
      }
    }

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, formData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/api/products', formData);
        toast.success('Product created successfully');
      }
      setShowProductModal(false);
      fetchProducts();
      resetProductForm();
    } catch (err) {
      console.error("Product save failed", err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save product';
      toast.error(errorMessage);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        console.error("Delete product failed", err);
        toast.error('Failed to delete product');
      }
    }
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      availability: product.availability,
      itemsSold: product.itemsSold,
      isFeatured: product.isFeatured || false,
      images: []
    });
    setShowProductModal(true);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      category: 'food-salt',
      availability: 'In Stock',
      itemsSold: 0,
      isFeatured: false,
      images: []
    });
  };

  const toggleFeatured = async (productId, currentStatus) => {
    try {
      await api.put(`/api/products/${productId}`, {
        isFeatured: !currentStatus
      });
      await fetchProducts();
      toast.success(currentStatus ? 'Removed from featured list' : 'Added to featured list');
    } catch (err) {
      console.error("Toggle featured failed", err);
      toast.error('Failed to update featured status');
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-200 to-rose-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('blogs')} className={`flex-1 py-4 px-6 font-bold whitespace-nowrap
           rounded-xl transition shadow-lg ${
              activeTab === 'blogs'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                : 'bg-white text-rose-900 hover:bg-rose-400'
            }`}
          >
            📝 Blogs Dashboard
          </button>
          <button onClick={() => setActiveTab('products')} className={`flex-1 py-4 px-6 font-bold whitespace-nowrap
          rounded-xl transition shadow-lg ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                : 'bg-white text-rose-900 hover:bg-rose-400'
            }`}
          >
            🛍️ Products Dashboard
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`flex-1 py-4 px-6 font-bold whitespace-nowrap
          rounded-xl transition shadow-lg ${
              activeTab === 'reviews'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                : 'bg-white text-rose-900 hover:bg-rose-400'
            }`}
          >
            ⭐ Reviews Dashboard
          </button>
          <button onClick={() => setActiveTab('users')} className={`flex-1 py-4 px-6 font-bold whitespace-nowrap
          rounded-xl transition shadow-lg ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                : 'bg-white text-rose-900 hover:bg-rose-400'
            }`}
          >
            👥 Registered Users
          </button>
          <button onClick={() => setActiveTab('featured')} className={`flex-1 py-4 px-6 font-bold whitespace-nowrap
          rounded-xl transition shadow-lg ${
              activeTab === 'featured'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                : 'bg-white text-rose-900 hover:bg-rose-400'
            }`}
          >
            ⭐ Featured Products
          </button>
        </div>

        {/* 📝 Blogs Dashboard */}
        {activeTab === 'blogs' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Blogs</h2>
              <Link href="/uploadblog" className="px-6 py-3 bg-green-700 hover:bg-green-900 text-white font-semibold rounded-xl shadow-lg transition">
                + Upload
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-pink-200">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {blogs.map(blog => (
                    <tr key={blog._id} className="bg-rose-50 hover:bg-rose-100 transition">
                      <td className="px-4 py-5 text-sm sm:text-base text-gray-800 font-medium truncate max-w-xs">{stripHTML(blog.title)}</td>
                      <td className="px-4 py-5">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Link href={`/viewblog/${blog._id}`} className="px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition whitespace-nowrap">View</Link>
                          <Link href={`/editblog/${blog._id}`} className="px-4 py-2 bg-yellow-500 text-white text-xs sm:text-sm rounded-lg hover:bg-yellow-600 transition whitespace-nowrap">Edit</Link>
                          <button onClick={() => handleDelete(blog._id)} className="px-4 py-2 bg-red-600 text-white text-xs sm:text-sm rounded-lg hover:bg-red-700 transition whitespace-nowrap">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {blogs.length === 0 && (
              <div className="text-center py-16 px-6">
                <h3 className="text-2xl font-bold text-pink-800 mb-2">No Blogs Yet</h3>
                <p className="text-gray-600">Click "Create New Blog" to share your first Himalayan salt story!</p>
              </div>
            )}
          </div>
        )}

        {/* 🛍️ Products Dashboard */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Products</h2>
              <button onClick={() => { resetProductForm(); setShowProductModal(true); }}
              className="px-6 py-3 bg-green-700 hover:bg-green-900 text-white font-semibold rounded-xl shadow-lg transition">
                + Add New Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-pink-200">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Image</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {products.map(product => (
                    <tr key={product._id} className="bg-rose-50 hover:bg-rose-100 transition">
                      <td className="px-4 py-4">
                        {product.images && product.images.length > 0 ? (
                          <img src={getProductImageSrc(product.images?.[0]) || "/placeholder-product.jpg"} alt={product.name || "Product"} className="w-12 h-12 object-cover rounded-lg border border-pink-200" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">No Img</div>
                        )}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-gray-800">
                        {product.name}
                        {product.isFeatured && <span className="ml-2 text-yellow-500" title="Featured Product">★</span>}
                      </td>
                      <td className="px-4 py-5 text-sm text-gray-600 capitalize">{product.category.replace('-', ' ')}</td>
                      <td className="px-4 py-5 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          product.availability === 'In Stock' ? 'bg-green-100 text-green-800' :
                          product.availability === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.availability}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button 
                            onClick={() => toggleFeatured(product._id, product.isFeatured)} 
                            className={`px-3 py-2 text-white text-xs sm:text-sm rounded-lg transition whitespace-nowrap ${
                              product.isFeatured ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 hover:bg-gray-500'
                            }`}
                            title={product.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                          >
                            {product.isFeatured ? '★ Featured' : '☆ Feature'}
                          </button>
                          <button onClick={() => openEditProduct(product)} className="px-4 py-2 bg-blue-500 text-white text-xs sm:text-sm 
                          rounded-lg hover:bg-blue-600 transition whitespace-nowrap">Edit</button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="px-4 py-2 bg-red-600 text-white text-xs sm:text-sm 
                          rounded-lg hover:bg-red-700 transition whitespace-nowrap">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {products.length === 0 && (
              <div className="text-center py-16 px-6">
                <h3 className="text-2xl font-bold text-pink-800 mb-2">No Products Yet</h3>
                <p className="text-gray-600">Start adding your Himalayan salt products!</p>
              </div>
            )}
          </div>
        )}

        {/* ⭐ Reviews Dashboard */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Reviews</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-pink-200">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">User</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Comment</th>
                    <th className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {reviews.map(review => (
                    <tr key={review._id} className="bg-rose-50 hover:bg-rose-100 transition">
                      <td className="px-4 py-5 text-sm text-gray-800 font-medium">{getProductName(review.productId)}</td>
                      <td className="px-4 py-5 text-sm text-gray-800">{review.userName}</td>
                      <td className="px-4 py-5 text-sm text-yellow-600 font-bold">{review.rating} ★</td>
                      <td className="px-4 py-5 text-sm text-gray-600 truncate max-w-xs">{review.comment}</td>
                      <td className="px-4 py-5 text-center">
                        <button onClick={() => handleDeleteReview(review._id)} className="px-4 py-2 bg-red-600 text-white text-xs sm:text-sm rounded-lg hover:bg-red-700 transition whitespace-nowrap">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {reviews.length === 0 && (
              <div className="text-center py-16 px-6">
                <h3 className="text-2xl font-bold text-pink-800 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">Customer reviews will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* 👥 Registered Users Dashboard */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Registered Users</h2>
              <span className="text-white font-semibold bg-white/20 px-4 py-2 rounded-full">
                {users.length} Users
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-pink-200">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Joined</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {users.map(user => (
                    <tr key={user._id} className="bg-rose-50 hover:bg-rose-100 transition">
                      <td className="px-4 py-5 text-sm text-gray-800 font-medium">{user.name}</td>
                      <td className="px-4 py-5 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-5 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-5 text-sm">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${user.role === 'super' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                          {user.role === 'super' ? 'Super user' : 'Normal user'}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <button
                          onClick={() => updateUserRole(user._id, user.role === 'super' ? 'normal' : 'super')}
                          disabled={user.email === 'ranaahmadranaahmad741@gmail.com'}
                          className="mr-2 px-4 py-2 bg-purple-600 text-white text-xs sm:text-sm rounded-lg hover:bg-purple-700 transition whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {user.role === 'super' ? 'Make Normal' : 'Make Super'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)} 
                          className="px-4 py-2 bg-red-600 text-white text-xs sm:text-sm rounded-lg hover:bg-red-700 transition whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="text-center py-16 px-6">
                <h3 className="text-2xl font-bold text-pink-800 mb-2">No Registered Users Yet</h3>
                <p className="text-gray-600">Users who register will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* ⭐ Featured Products Dashboard */}
        {activeTab === 'featured' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Featured Products Management</h2>
              <span className="text-white font-semibold bg-white/20 px-4 py-2 rounded-full">
                {products.filter(p => p.isFeatured).length} Featured
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-pink-200">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Image</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-4 text-left text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-pink-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {products.filter(p => p.isFeatured).map(product => (
                    <tr key={product._id} className="bg-rose-50 hover:bg-rose-100 transition">
                      <td className="px-4 py-4">
                        {product.images && product.images.length > 0 ? (
                          <img src={getProductImageSrc(product.images?.[0]) || "/placeholder-product.jpg"} alt={product.name || "Product"} className="w-12 h-12 object-cover rounded-lg border border-pink-200" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">No Img</div>
                        )}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-gray-800">
                        {product.name}
                        <span className="ml-2 text-yellow-500" title="Featured Product">★</span>
                      </td>
                      <td className="px-4 py-5 text-sm text-gray-600 capitalize">{product.category.replace('-', ' ')}</td>
                      <td className="px-4 py-5 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          product.availability === 'In Stock' ? 'bg-green-100 text-green-800' :
                          product.availability === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.availability}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button 
                            onClick={() => toggleFeatured(product._id, product.isFeatured)} 
                            className="px-3 py-2 bg-orange-500 text-white text-xs sm:text-sm rounded-lg hover:bg-orange-600 transition whitespace-nowrap"
                            title="Remove from Featured"
                          >
                            ✕ Unfeature
                          </button>
                          <button onClick={() => openEditProduct(product)} className="px-4 py-2 bg-blue-500 text-white text-xs sm:text-sm 
                          rounded-lg hover:bg-blue-600 transition whitespace-nowrap">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {products.filter(p => p.isFeatured).length === 0 && (
              <div className="text-center py-16 px-6">
                <h3 className="text-2xl font-bold text-pink-800 mb-2">No Featured Products Yet</h3>
                <p className="text-gray-600">Go to Products Dashboard and click the "☆ Feature" button to add products here!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl my-8 relative">
            <button 
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-pink-800 mb-6 text-center">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Product Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full text-black px-4 py-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Description</label>
                <textarea 
                  required 
                  rows="4"
                  className="w-full px-4 text-black py-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Category</label>
                  <select 
                    className="w-full px-4 text-black py-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  >
                    <option value="food-salt">Food Salt</option>
                    <option value="sea-salt">Sea Salt</option>
                    <option value="animal-salt">Animal Salt</option>
                    <option value="home-decor">Home & Decor</option>
                    <option value="rock-salt">Rock Salt</option>
                    <option value="salt-brick">Salt Brick</option>
                    <option value="salt-lamps">Salt Lamps</option>
                    <option value="salt-beauty">Salt & Beauty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Availability</label>
                  <select 
                    className="w-full text-black px-4 py-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                    value={productForm.availability}
                    onChange={(e) => setProductForm({...productForm, availability: e.target.value})}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Items Sold</label>
                  <input 
                    type="number" 
                    className="w-full text-black px-4 py-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                    value={productForm.itemsSold}
                    onChange={(e) => setProductForm({...productForm, itemsSold: e.target.value})}
                  />
                </div>
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({...productForm, isFeatured: e.target.checked})}
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-gray-700 font-bold">
                    Feature this product
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Product Images</label>
                <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center bg-pink-50 hover:bg-pink-100 transition cursor-pointer relative">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setProductForm({...productForm, images: e.target.files})}
                  />
                  <p className="text-pink-600 font-medium">Click to upload images (Max 10)</p>
                  {productForm.images && productForm.images.length > 0 && (
                    <p className="mt-2 text-sm text-green-600">{productForm.images.length} files selected</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="submit" className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-xl font-bold  hover:bg-rose-7000 hover:shadow-lg transition">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals remain the same */}
      {showChangePass && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">Change Admin Password</h2>
            <form onSubmit={handleChangePassword}>
              <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">Current Password</label>
                <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required className="w-full px-4 py-3 border border-pink-300 rounded-lg focus:ring-4 focus:ring-pink-200 focus:outline-none" />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">New Password</label>
                <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required minLength="6" className="w-full px-4 py-3 border border-pink-300 rounded-lg focus:ring-4 focus:ring-pink-200 focus:outline-none" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength="6" className="w-full px-4 py-3 border border-pink-300 rounded-lg focus:ring-4 focus:ring-pink-200 focus:outline-none" />
              </div>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-rose-600 text-white py-3 rounded-lg font-bold hover:bg-rose-700 transition">Update Password</button>
                <button type="button" onClick={() => { setShowChangePass(false); setError(''); }} className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForgetPass && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-pink-800">Forgot Password?</h2>
            <p className="text-gray-600 mt-2 text-sm">Enter your email and we'll send you an OTP instantly</p>
            <form onSubmit={handleForgetPassword} className="space-y-5 mt-6">
              <input type="email" value={forgetEmail} onChange={(e) => setForgetEmail(e.target.value)} required className="w-full px-5 py-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition text-gray-800 placeholder-gray-500" placeholder="admin@example.com" />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-4 rounded-xl hover:from-pink-700 hover:to-rose-700 transform shadow-lg">Send OTP Now</button>
            </form>
            <button onClick={() => { setShowForgetPass(false); setError(''); }} className="w-full mt-4 text-gray-600 hover:text-pink-700">Cancel</button>
          </div>
        </div>
      )}

      {showOTP && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-pink-700">Verify OTP</h2>
            <p className="text-gray-600 mt-2">We sent a 6-digit code to your email</p>
            <form onSubmit={handleVerifyOTP} className="mt-6">
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 mb-6" placeholder="000000" />
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <button type="submit" className="w-full bg-pink-600 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 transition">Verify OTP</button>
            </form>
          </div>
        </div>
      )}

      {showNewPass && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-pink-700">Set New Password</h2>
            <p className="text-gray-600 mt-2">Create a strong password for your account</p>
            <form onSubmit={handleSetNewPassword} className="mt-6">
              <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required minLength="6" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 mb-4" placeholder="New Password" />
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength="6" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 mb-6" placeholder="Confirm New Password" />
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <button type="submit" className="w-full bg-pink-600 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 transition">Reset Password</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
