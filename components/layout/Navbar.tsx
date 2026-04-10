'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, UserCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export function Navbar() {
  const { cartCount, openDrawer } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 md:hidden transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-gray-200">
                <span className="text-white font-black text-xl italic tracking-tighter">TB</span>
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">
                Trest<span className="text-indigo-600">Biyyo</span>
              </span>
            </Link>
          </div>

          {/* Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search premium products..."
                className="w-full bg-gray-50 border-2 border-transparent text-gray-900 text-sm rounded-2xl focus:ring-0 focus:border-indigo-600 outline-none block pl-12 p-3.5 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Account */}
            <Link 
              href="/login" 
              className="hidden sm:flex items-center gap-2 p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <UserCircle className="w-6 h-6" />
              <span className="text-sm font-bold hidden lg:block">Account</span>
            </Link>

            {/* Cart Reveal Button */}
            <button 
              onClick={openDrawer}
              className="relative p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all group flex items-center gap-3 active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-sm"
                  >
                    {cartCount}
                  </motion.div>
                )}
              </div>
              {cartCount > 0 && (
                <span className="text-sm font-bold text-gray-900 hidden sm:block">
                  {cartCount} <span className="text-gray-400 font-medium">items</span>
                </span>
              )}
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
}
