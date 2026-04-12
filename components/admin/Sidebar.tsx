'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'KYC Moderation', href: '/admin/kyc', icon: FileCheck },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Conversations', href: '/admin/conversations', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-8 pb-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-transform">
            TB
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900">TrestBiyyo.</span>
        </Link>
      </div>

      <nav className="flex-1 px-6 pt-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-4 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Management</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-5 py-4 rounded-[1.5rem] text-sm font-bold transition-all duration-500 group relative",
                isActive 
                  ? "bg-gray-900 text-white shadow-2xl shadow-gray-200" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300",
                  isActive ? "bg-white/10" : "bg-gray-50 group-hover:bg-indigo-50"
                )}>
                  <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-600 transition-colors")} />
                </div>
                {item.name}
              </div>
              {isActive && (
                <motion.div layoutId="active-pill" className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 space-y-4">
        <div className="p-5 bg-emerald-50/50 border border-emerald-100/50 rounded-3xl flex items-center gap-4">
           <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
           </div>
           <div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Platform Status</p>
              <p className="text-xs font-bold text-emerald-600/80">Systems Operational</p>
           </div>
        </div>

        <div className="bg-gray-900 rounded-[2.5rem] p-6 shadow-2xl shadow-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white/20 flex items-center justify-center text-white font-black shadow-lg">
              DA
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-white truncate leading-tight mb-1">Django Admin</p>
              <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-tighter">Super Admin</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all">
            <LogOut className="w-4 h-4 text-indigo-400" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
