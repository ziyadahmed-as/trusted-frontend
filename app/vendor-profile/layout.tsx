'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, DollarSign, Settings, Star } from 'lucide-react';
import '@tailwindplus/elements';

export default function VendorProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <div className="bg-white border-b border-gray-200">
        <header className="relative bg-white z-50">
          <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
            Vendor Portal - Manage your business
          </p>

          <nav aria-label="Top" className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open menu</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" data-slot="icon" aria-hidden="true" className="size-6">
                  <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0 items-center gap-2">
                <Link href="/">
                  <span className="sr-only">TrestBiyyo</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white italic">TB</div>
                </Link>
                <span className="hidden md:block text-xl font-black italic tracking-tighter text-gray-900 border-l border-gray-200 pl-4 ml-2">Vendor Central</span>
              </div>

              {/* Flyout menus */}
              <div className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  <Link href="/vendor-profile/products" className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                    Products
                  </Link>
                  <Link href="/vendor-profile/orders" className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                    Orders
                  </Link>
                  <Link href="/vendor-profile/finance" className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                    Finance
                  </Link>
                  <Link href="/" className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                    Go to Store
                  </Link>
                </div>
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:ml-8 lg:flex">
                  <div className="flex items-center text-gray-700 hover:text-gray-800">
                    <img src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg" alt="" className="block h-auto w-5 shrink-0" />
                    <span className="ml-3 block text-sm font-medium">CAD</span>
                  </div>
                </div>

                {/* Profile / Notify */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Link href="#" className="group -m-2 flex items-center p-2">
                    <div className="relative">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600 transition-colors">
                        <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] font-black flex items-center justify-center border-2 border-white">3</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>
      
      <div className="flex flex-1 w-full mx-auto max-w-[1400px]">
        {/* Left Sidebar for Vendor Tasks */}
        <aside className="w-64 bg-white/50 border-r border-gray-200 hidden md:flex flex-col py-8 pr-6">
          <div className="mb-8 px-4">
            <h2 className="text-xl font-black text-gray-900 tracking-tight italic">Tasks <span className="text-indigo-600">Overview</span></h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage Store</p>
          </div>
          
          <nav className="space-y-2 flex-1">
            <Link href="/vendor-profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 hover:text-indigo-600 transition-all group">
              <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" /> Dashboard
            </Link>
            <Link href="/vendor-profile/products" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 hover:text-indigo-600 transition-all group">
              <Package className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" /> Products
            </Link>
            <Link href="/vendor-profile/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 hover:text-indigo-600 transition-all group">
              <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" /> Orders
            </Link>
            <Link href="/vendor-profile/finance" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 hover:text-indigo-600 transition-all group">
              <DollarSign className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" /> Finance
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full bg-transparent p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
