'use client';

import React from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Mail,
  MapPin,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

export default function UserManagementPage() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiClient.getUsers()
      .then(data => setUsers(data.results || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const roleColors = {
    SUPER_ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    ADMIN: "bg-indigo-100 text-indigo-700 border-indigo-200",
    VENDOR: "bg-emerald-100 text-emerald-700 border-emerald-200",
    BUYER: "bg-slate-100 text-slate-700 border-slate-200",
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100">
              <UsersIcon className="w-6 h-6" />
            </div>
            <span className="text-sm font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">Directory</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
            User <span className="text-gray-400">Management</span>
          </h1>
          <p className="text-gray-500 font-bold tracking-tight">Access, monitor, and manage roles for all TrestBiyyo ecosystem users.</p>
        </div>
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 flex items-center gap-3 group">
          <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Invite User
        </button>
      </section>

      {/* Control Bar */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email or ID..." 
              className="w-full bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl py-4 pl-14 pr-4 text-sm font-semibold"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all whitespace-nowrap">
              Role: All
            </button>
            <button className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all whitespace-nowrap">
              Status: Active
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex items-center justify-center">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs ring-1 ring-gray-100 shadow-sm">
                U{i}
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white font-black text-xs ring-1 ring-gray-100 shadow-xl shadow-indigo-100">
              +4k
            </div>
          </div>
        </div>
      </section>

      {/* User Profiles Map/Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {users.map((user, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={user.id} 
            className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] group hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-8 right-8">
              <button title="More Options" className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-indigo-100/50 flex items-center justify-center text-3xl font-black text-indigo-600 group-hover:rotate-6 transition-transform duration-500 uppercase">
                  {(user.username || 'U').charAt(0)}
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-8 h-8 rounded-xl border-4 border-white flex items-center justify-center",
                  user.is_active ? "bg-emerald-500" : "bg-rose-500"
                )}>
                  {user.is_active ? <ShieldCheck className="w-3.5 h-3.5 text-white" /> : <ShieldAlert className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-1 truncate max-w-full italic uppercase">{user.username}</h3>
              <div className="flex items-center gap-1.5 justify-center mb-6">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-xs font-bold text-gray-400 truncate">{user.email}</p>
              </div>

              <div className={cn(
                "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border mb-10",
                roleColors[user.role as keyof typeof roleColors]
              )}>
                {user.role?.replace('_', ' ') || 'USER'}
              </div>

              <div className="w-full grid grid-cols-2 gap-4 pt-8 border-t border-gray-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-black text-gray-300 uppercase tracking-tighter">
                    <MapPin className="w-3 h-3" />
                    Role
                  </div>
                  <p className="text-xs font-bold text-gray-500">{user.role}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-black text-gray-300 uppercase tracking-tighter">
                    <Calendar className="w-3 h-3" />
                    Joined
                  </div>
                  <p className="text-xs font-bold text-gray-500">{new Date(user.date_joined).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="w-full mt-10 grid grid-cols-2 gap-3">
                <button className="py-3 px-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">Profile</button>
                <button className="py-3 px-4 bg-gray-50 text-gray-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Message</button>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
