'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PackageSearch, Plus, Search, Archive, Package,
  MoreVertical, Edit, Trash2, Eye, XCircle, Tag,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

export default function VendorProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [prodsData, catsData] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getCategories()
      ]);
      setProducts(prodsData.results || prodsData);
      setCategories(catsData.results || catsData);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        name: formData.name,
        slug: slug || `prod-${Date.now()}`,
        category: formData.category ? parseInt(formData.category, 10) : null,
        price: parseFloat(formData.price) || 0.00,
        stock: parseInt(formData.stock, 10) || 0,
        description: formData.description,
        is_active: true,
        is_digital: false
      };
      
      await apiClient.createProduct(payload);
      setShowModal(false);
      setFormData({ name: '', category: '', price: '', stock: '', description: '' });
      fetchData(); // reload products
    } catch (err: any) {
      console.error(err);
      let errorMessage = 'Failed to add product. Make sure all fields are correct.';
      if (err.errors && err.errors.detail) {
        errorMessage = err.errors.detail;
      } else if (err.errors && typeof err.errors === 'object') {
        const firstErrorKey = Object.keys(err.errors)[0];
        if (Array.isArray(err.errors[firstErrorKey])) {
           errorMessage = err.errors[firstErrorKey][0];
        }
      }
      alert(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.deleteProduct(id);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete product.');
      }
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link href="/vendor-profile" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-indigo-600 mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight flex items-center gap-4">
              Products <span className="text-gray-400">Dashboard</span>
            </h1>
            <p className="text-gray-500 font-bold tracking-tight">Manage your store inventory, pricing, and visibility.</p>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add New Product
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/30">
                    <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Product Info</th>
                    <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                    <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Stock</th>
                    <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <AnimatePresence mode='popLayout'>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-400 font-bold mb-2">No products found</p>
                          <p className="text-sm text-gray-500">Add your first product to get started.</p>
                        </td>
                      </tr>
                    ) : products.map((prod, idx) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={prod.id} 
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                              <Archive className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{prod.name}</p>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                {prod.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border bg-gray-50 text-gray-600 border-gray-100">
                             <Tag className="w-3 h-3" />
                             {prod.category ? categories.find(c => c.id === prod.category)?.name || `ID: ${prod.category}` : 'Uncategorized'}
                          </div>
                        </td>
                        <td className="px-6 py-6 font-bold text-gray-900">
                           ${parseFloat(prod.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-xs font-bold",
                            prod.stock > 10 ? "bg-emerald-50 text-emerald-600" : 
                            prod.stock > 0 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                          )}>
                            {prod.stock} in stock
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button title="View Store" className="p-2.5 bg-gray-50 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-gray-100 group/btn">
                              <Eye className="w-4 h-4 text-gray-400 group-hover/btn:text-indigo-600" />
                            </button>
                            <button title="Edit" className="p-2.5 bg-gray-50 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-gray-100 group/btn">
                              <Edit className="w-4 h-4 text-gray-400 group-hover/btn:text-indigo-600" />
                            </button>
                            <button 
                              onClick={() => handleDelete(prod.id)}
                              title="Delete" 
                              className="p-2.5 bg-gray-50 hover:bg-rose-50 hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-rose-100 group/btn"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 group-hover/btn:text-rose-600" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Add New Product</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Store Inventory</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <form id="product-form" onSubmit={handleAddProduct} className="space-y-6">
                  
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Name</label>
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Premium Wireless Headphones"
                      className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
                      <select 
                        required
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700 font-medium"
                      >
                        <option value="" disabled>Select a category...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price ($)</label>
                      <input 
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Initial Stock</label>
                    <input 
                      required
                      type="number"
                      min="0"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="e.g. 50"
                      className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700 font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Detailed product description..."
                      className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700 font-medium resize-none"
                    />
                  </div>

                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex space-x-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="product-form"
                  disabled={modalLoading}
                  className="flex-1 px-6 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {modalLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Product'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
