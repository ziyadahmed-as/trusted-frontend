'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Star, Tag, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await apiClient.getPublicProducts();
        setProducts(data.results || data);
      } catch (err) {
        console.error('Failed to fetch catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter text-indigo-600">TrestBiyyo.</div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Products</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Vendors</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-gray-700 px-4 py-2 hover:bg-gray-50 rounded-lg">Login</Link>
            <Link href="/register" className="text-sm font-bold bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center pt-20">
        <section className="max-w-4xl mx-auto text-center px-6 py-24 space-y-10">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-widest animate-fade-in">
            Revolutionizing Ecommerce
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-gray-900">
            Build your <span className="text-indigo-600">multi-vendor</span> empire.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            The most advanced ecommerce platform for modern business. Scale faster, sell smarter, and win bigger with TrestBiyyo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link href="/register" className="w-full sm:w-auto bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95">
              Start Your Store
            </Link>
            <Link href="/register" className="w-full sm:w-auto bg-white border-2 border-gray-100 px-10 py-5 rounded-2xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all">
              Join as Buyer
            </Link>
          </div>
        </section>

        {/* Discover Products Section */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">Discover <span className="text-indigo-600">Products</span></h2>
              <p className="text-gray-500 font-bold">Explore the latest trending items from our top vendors.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group">
              View All Catalog <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-gray-100">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">No products available at the moment.</p>
              <p className="text-sm text-gray-400 mt-2">Come back later or start your own store!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group flex flex-col bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {/* Placeholder for Product Image */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                      <ShoppingBag className="w-20 h-20 opacity-20" />
                    </div>
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                        Low Stock
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-black uppercase tracking-wider text-gray-500">
                           <Tag className="w-3 h-3" /> {product.category_name || 'Category'}
                         </span>
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-auto mb-4">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price</span>
                        <span className="text-xl font-black text-gray-900">${parseFloat(product.price).toFixed(2)}</span>
                      </div>
                      <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm font-medium">
          &copy; 2026 TrestBiyyo Ecommerce. Built for excellence.
        </div>
      </footer>
    </div>
  );
}
