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
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 flex items-center justify-between px-12 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <div className="relative w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search metrics, users, or records..." 
                className="w-full bg-gray-50 border border-transparent rounded-[1.25rem] py-3.5 pl-14 pr-16 text-sm font-semibold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-100 transition-all outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-white border border-gray-100 px-2.5 py-1.5 rounded-xl shadow-sm">
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
