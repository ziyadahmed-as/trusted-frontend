'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Tag, Plus, ChevronRight, Loader2, Search,
  Package, Layers, Edit3, Trash2, Check, X,
  Zap, AlertCircle, FolderOpen, Grid3X3, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

const CATEGORY_COLORS = [
  { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600', dot: 'bg-indigo-500' },
  { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-600', dot: 'bg-violet-500' },
  { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', dot: 'bg-amber-500' },
  { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600', dot: 'bg-rose-500' },
  { bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-600', dot: 'bg-cyan-500' },
];

export default function CategoryHubPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchCategories = useCallback(async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (e) {
      // silently fail on categories
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const filtered = categories.filter(
    (c) => c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newCatName.trim()) { setCreateError('Category name is required.'); return; }
    setCreateLoading(true);
    setCreateError(null);
    try {
      const response = await fetch(`${apiClient.getCurrentApiUrl()}/products/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newCatName.trim(), description: newCatDesc.trim() }),
      });
      if (!response.ok) throw new Error('Failed to create category.');
      setNewCatName('');
      setNewCatDesc('');
      setCreating(false);
      fetchCategories();
    } catch (e: any) {
      setCreateError(e.message || 'Creation failed.');
    } finally {
      setCreateLoading(false);
    }
  };

  const totalProducts = categories.reduce((sum, c) => sum + (c.product_count || 0), 0);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
          <Zap className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] animate-pulse">Loading Taxonomy Hub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-violet-100">
              <Tag className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.2em] bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-100">
              Taxonomy Hub
            </span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
            Category <span className="text-gray-300">Manager</span>
          </h1>
          <p className="text-gray-500 font-bold tracking-tight max-w-xl mt-2">
            Organize the marketplace taxonomy. All {categories.length} categories, {totalProducts} products indexed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-100 rounded-2xl">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              aria-label="Switch to Grid View"
              className={cn("p-2 rounded-xl transition-all", viewMode === 'grid' ? 'bg-white shadow-sm border border-gray-100 text-gray-900' : 'text-gray-400')}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              aria-label="Switch to List View"
              className={cn("p-2 rounded-xl transition-all", viewMode === 'list' ? 'bg-white shadow-sm border border-gray-100 text-gray-900' : 'text-gray-400')}
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-200 hover:bg-indigo-600 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Category
          </button>
        </div>
      </section>

      {/* Statistics Banner */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Categories', value: categories.length, icon: Tag, color: 'indigo' },
          { label: 'Products Listed', value: totalProducts, icon: Package, color: 'emerald' },
          { label: 'Avg. Products / Cat.', value: categories.length ? Math.round(totalProducts / categories.length) : 0, icon: Hash, color: 'violet' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center gap-4"
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
              stat.color === 'indigo' && 'bg-indigo-50 text-indigo-600',
              stat.color === 'emerald' && 'bg-emerald-50 text-emerald-600',
              stat.color === 'violet' && 'bg-violet-50 text-violet-600',
            )}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Search & Create Form */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="relative group flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name..."
            className="w-full bg-white border border-gray-100 rounded-[2rem] py-4 pl-12 pr-6 text-sm font-medium focus:ring-4 focus:ring-gray-50 focus:border-gray-900 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Create Category Inline Form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            className="bg-indigo-50 border border-indigo-100 rounded-[3rem] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                <FolderOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tighter">New Category</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Category Name *</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Electronics, Fashion..."
                  className="w-full bg-white border border-indigo-200 rounded-2xl py-3.5 px-5 text-sm font-semibold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Description</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short category description..."
                  className="w-full bg-white border border-indigo-200 rounded-2xl py-3.5 px-5 text-sm font-semibold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            {createError && (
              <div className="mb-4 flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-xs font-bold">{createError}</p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCreate}
                disabled={createLoading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {createLoading ? 'Creating...' : 'Create Category'}
              </button>
              <button
                onClick={() => { setCreating(false); setCreateError(null); setNewCatName(''); setNewCatDesc(''); }}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Grid / List */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 mx-auto mb-6">
            <Tag className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-gray-900 tracking-tighter mb-2">No Categories Found</h3>
          <p className="text-sm font-bold text-gray-400">
            {search ? `No categories match "${search}"` : 'Create your first category to get started.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((cat: any, i: number) => {
              const palette = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              return (
                <motion.button
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedCat(selectedCat?.id === cat.id ? null : cat)}
                  title={`View details for ${cat.name}`}
                  aria-label={`View details for ${cat.name}`}
                  className={cn(
                    "bg-white rounded-[2.5rem] border p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)] transition-all duration-500 cursor-pointer group text-left",
                    selectedCat?.id === cat.id ? "border-indigo-200 ring-2 ring-indigo-100" : "border-gray-100 hover:border-gray-200"
                  )}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={cn("w-14 h-14 rounded-3xl flex items-center justify-center", palette.bg, palette.border, "border")}>
                      <FolderOpen className={cn("w-7 h-7", palette.text)} />
                    </div>
                    <div className={cn("w-2.5 h-2.5 rounded-full mt-2", palette.dot)} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tighter mb-1 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-400 mb-6 line-clamp-2">
                    {cat.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-300" />
                      <span className="text-sm font-black text-gray-900">{cat.product_count ?? 0}</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Products</span>
                    </div>
                    <ChevronRight className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      selectedCat?.id === cat.id ? "text-indigo-600 rotate-90" : "text-gray-200 group-hover:text-gray-400"
                    )} />
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </section>
      ) : (
        /* List View */
        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Products</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {filtered.map((cat: any, i: number) => {
                    const palette = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                    return (
                      <motion.tr
                        key={cat.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-gray-50/60 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", palette.bg)}>
                              <FolderOpen className={cn("w-5 h-5", palette.text)} />
                            </div>
                            <p className="text-sm font-black text-gray-900">{cat.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-gray-900">{cat.product_count ?? 0}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">items</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-gray-400 truncate max-w-xs">{cat.description || '—'}</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                               title="Edit Category"
                               aria-label="Edit Category"
                               className="p-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 rounded-xl transition-colors"
                             >
                               <Edit3 className="w-4 h-4" />
                             </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
