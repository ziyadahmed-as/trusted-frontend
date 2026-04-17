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
  TrendingUp,
  Tag,
  Package,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const navGroups = [
  {
    label: 'Command Center',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'KYC Moderation', href: '/admin/kyc', icon: FileCheck },
      { name: 'User Management', href: '/admin/users', icon: Users },
    ]
  },
  {
    label: 'Analytics & Commerce',
    items: [
      { name: 'Revenue Analytics', href: '/admin/revenue', icon: TrendingUp },
      { name: 'Category Hub', href: '/admin/categories', icon: Tag },
      { name: 'Inventory Control', href: '/admin/inventory', icon: Package },
    ]
  },
  {
    label: 'Platform',
    items: [
      { name: 'Conversations', href: '/admin/conversations', icon: MessageSquare },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() ?? 'AD';

  const displayName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.username ?? 'Admin';

  const roleLabel = user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin';

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-8 pt-8 pb-6">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-xl shadow-gray-200/80 group-hover:bg-indigo-600 transition-colors duration-300">
            TB
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-gray-900">TrestBiyyo</span>
            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.25em] -mt-0.5">Admin Suite</p>
          </div>
        </Link>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar space-y-6 pb-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-4 mb-2 text-[9px] font-black text-gray-300 uppercase tracking-[0.25em]">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group relative",
                      isActive
                        ? "bg-gray-900 text-white shadow-xl shadow-gray-200/80"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300",
                        isActive ? "bg-white/10" : "bg-gray-100 group-hover:bg-indigo-50"
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
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-3 border-t border-gray-50">
        {/* Platform Status */}
        <div className="px-4 py-3 bg-emerald-50/60 rounded-2xl flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>
          <div>
            <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Platform Status</p>
            <p className="text-[11px] font-bold text-emerald-600/80">Systems Operational</p>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-500 ml-auto" />
        </div>

        {/* User card */}
        <div className="bg-gray-900 rounded-2xl p-4 shadow-xl shadow-gray-200/60">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg flex-shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-black text-white truncate leading-tight">{displayName}</p>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all"
          >
            <LogOut className="w-3.5 h-3.5 text-indigo-400" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
