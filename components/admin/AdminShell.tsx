'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Search, Command } from 'lucide-react';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4 w-full max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-11 pr-16 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-gray-100 px-2 py-1 rounded-lg shadow-sm">
                <Command className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button title="Notifications" className="relative w-11 h-11 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all group">
              <Bell className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-600 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none mb-1">Django Admin</p>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter bg-indigo-50 px-2 py-0.5 rounded-md inline-block">Super Admin</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
                DA
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
