'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Package, Search, AlertTriangle, CheckCircle2,
  ArrowUpRight, Filter, Loader2, RefreshCw,
  Zap, Eye, ShoppingBag, BarChart3, TrendingDown,
  Users, Star, Clock, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

const stockConfig: Record<StockStatus, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  IN_STOCK: { label: 'In Stock', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: CheckCircle2 },
  LOW_STOCK: { label: 'Low Stock', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: AlertTriangle },
  OUT_OF_STOCK: { label: 'Out of Stock', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', icon: TrendingDown },
};

function getStockStatus(qty: number): StockStatus {
  if (qty <= 0) return 'OUT_OF_STOCK';
  if (qty <= 10) return 'LOW_STOCK';
  return 'IN_STOCK';
}

export default function InventoryControlPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | StockStatus>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.allSettled([
        apiClient.getProducts(),
        apiClient.getCategories(),
      ]);
      if (prodData.status === 'fulfilled') {
        const raw = prodData.value;
        setProducts(Array.isArray(raw) ? raw : raw.results || []);
      }
      if (catData.status === 'fulfilled') {
        const raw = catData.value;
        setCategories(Array.isArray(raw) ? raw : raw.results || []);
      }
    } catch (e) {
      console.error('Failed to fetch inventory:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = products
    .filter((p) => {
      const matchSearch =
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.vendor_name?.toLowerCase().includes(search.toLowerCase());
      const status = getStockStatus(p.stock_quantity ?? 999);
      const matchFilter = activeFilter === 'ALL' || status === activeFilter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      if (sortBy === 'stock') return (a.stock_quantity ?? 0) - (b.stock_quantity ?? 0);
      return (a.name || '').localeCompare(b.name || '');
    });

  const inStock = products.filter((p) => getStockStatus(p.stock_quantity ?? 999) === 'IN_STOCK').length;
  const lowStock = products.filter((p) => getStockStatus(p.stock_quantity ?? 999) === 'LOW_STOCK').length;
  const outOfStock = products.filter((p) => getStockStatus(p.stock_quantity ?? 999) === 'OUT_OF_STOCK').length;
  const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price || 0) * (p.stock_quantity || 0)), 0);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
          <Zap className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] animate-pulse">Loading Global Catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
              Global Catalog
            </span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
            Inventory <span className="text-gray-300">Control</span>
          </h1>
          <p className="text-gray-500 font-bold tracking-tight max-w-xl mt-2">
            Real-time visibility across {products.length} SKUs from all verified vendors on the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="w-11 h-11 flex items-center justify-center bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
            title="Refresh inventory"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-700 uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
            <Filter className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
        </div>
      </section>

      {/* KPI Row */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { label: 'Total SKUs', value: products.length, icon: Package, color: 'gray', sub: 'Catalog entries' },
          { label: 'In Stock', value: inStock, icon: CheckCircle2, color: 'emerald', sub: 'Healthy stock' },
          { label: 'Low Stock', value: lowStock, icon: AlertTriangle, color: 'amber', sub: 'Needs attention' },
          { label: 'Out of Stock', value: outOfStock, icon: TrendingDown, color: 'rose', sub: 'Critical items' },
        ].map((kpi, i) => (
          <motion.button
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={cn(
              "bg-white p-6 rounded-[2.5rem] border shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center gap-4 cursor-pointer transition-all hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] text-left",
              activeFilter === (i === 0 ? 'ALL' : Object.keys(stockConfig)[i - 1])
                ? 'border-gray-900 ring-2 ring-gray-200'
                : 'border-gray-100'
            )}
            onClick={() => {
              if (i === 0) setActiveFilter('ALL');
              else setActiveFilter((['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'] as StockStatus[])[i - 1]);
            }}
            title={`Filter by ${kpi.label}`}
            aria-label={`Filter by ${kpi.label}`}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
              kpi.color === 'gray' && 'bg-gray-50 text-gray-600',
              kpi.color === 'emerald' && 'bg-emerald-50 text-emerald-600',
              kpi.color === 'amber' && 'bg-amber-50 text-amber-600',
              kpi.color === 'rose' && 'bg-rose-50 text-rose-600',
            )}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">{kpi.value}</p>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
            </div>
          </motion.button>
        ))}
      </section>

      {/* Inventory Value Banner */}
      <section className="bg-gray-900 rounded-[3rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-gray-200/50">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
            <ShoppingBag className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Inventory Value</p>
            <p className="text-4xl font-black text-white tracking-tighter">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {lowStock > 0 && (
            <div className="flex items-center gap-2 px-5 py-3 bg-amber-500/20 border border-amber-500/30 rounded-2xl">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-amber-300">{lowStock} items need restocking</span>
            </div>
          )}
          {outOfStock > 0 && (
            <div className="flex items-center gap-2 px-5 py-3 bg-rose-500/20 border border-rose-500/30 rounded-2xl">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-black text-rose-300">{outOfStock} items out of stock</span>
            </div>
          )}
          {lowStock === 0 && outOfStock === 0 && (
            <div className="flex items-center gap-2 px-5 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black text-emerald-300">All inventory healthy</span>
            </div>
          )}
        </div>
      </section>

      {/* Search & Sort */}
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="relative group flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or vendor names..."
            className="w-full bg-white border border-gray-100 rounded-[2rem] py-4 pl-12 pr-6 text-sm font-medium focus:ring-4 focus:ring-gray-50 focus:border-gray-900 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort by:</span>
          {(['name', 'price', 'stock'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                sortBy === s ? "bg-gray-900 text-white shadow-md" : "bg-white border border-gray-100 text-gray-500 hover:text-gray-900"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <section className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 pb-0 flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-900 tracking-tighter">
            Product Catalog
            <span className="ml-3 px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {filtered.length} items
            </span>
          </h3>
          <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
            {(['ALL', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  activeFilter === f ? "bg-white text-gray-900 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto mt-6">
          {filtered.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-4 text-gray-400">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-sm font-black uppercase tracking-widest">No products found</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {filtered.slice(0, 50).map((product: any, i: number) => {
                    const status = getStockStatus(product.stock_quantity ?? 999);
                    const cfg = stockConfig[status];
                    return (
                      <motion.tr
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="group hover:bg-gray-50/60 transition-colors cursor-pointer"
                        onClick={() => setSelectedProduct(selectedProduct?.id === product.id ? null : product)}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                              {product.images?.[0]?.image ? (
                                <img src={product.images[0].image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-gray-900 truncate max-w-[180px] group-hover:text-indigo-600 transition-colors">{product.name}</p>
                              <p className="text-[10px] font-bold text-gray-400">SKU: {product.sku || `P-${String(product.id).padStart(4, '0')}`}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            {product.category_name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-black text-gray-900">${parseFloat(product.price || 0).toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-gray-900">{product.stock_quantity ?? '—'}</span>
                            {status === 'LOW_STOCK' && <span className="text-[9px] text-amber-500 font-black uppercase">Low!</span>}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-black uppercase tracking-widest",
                            cfg.bg, cfg.text, cfg.border
                          )}>
                            <cfg.icon className="w-3 h-3" />
                            {cfg.label}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-black">
                              {(product.vendor_name || product.vendor || 'V').toString().charAt(0).toUpperCase()}
                            </div>
                            <p className="text-xs font-bold text-gray-600 truncate max-w-[100px]">{product.vendor_name || 'Vendor'}</p>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm flex items-center gap-1.5 ml-auto">
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
        {filtered.length > 50 && (
          <div className="p-6 text-center border-t border-gray-50">
            <p className="text-xs font-bold text-gray-400">Showing first 50 of {filtered.length} products</p>
          </div>
        )}
      </section>
    </div>
  );
}
