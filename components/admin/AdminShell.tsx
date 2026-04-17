'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Search, Command } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const displayName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.username ?? 'Admin';

  const roleLabel = user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin';

  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() ?? 'AD';

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 flex items-center justify-between px-10 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-5 w-full max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search users, KYC records, products..."
                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-12 pr-14 text-sm font-semibold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-100 transition-all outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-gray-100 px-2 py-1 rounded-lg shadow-sm">
                <Command className="w-3 h-3 text-gray-400" />
                <span className="text-[9px] font-black text-gray-400">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              title="Notifications"
              className="relative w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all group"
            >
              <Bell className="w-4.5 h-4.5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-7 w-px bg-gray-100 mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none mb-1">{displayName}</p>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tight bg-indigo-50 px-2 py-0.5 rounded-md inline-block">{roleLabel}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-100">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 lg:p-10 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
