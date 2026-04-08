'use client';

import React from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  FileCheck,
  ArrowUpRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/admin/StatCard';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiClient.getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const activities = stats?.recent_activities || [];

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
            Dashboard <span className="text-gray-400">Overview</span>
          </h1>
          <p className="text-gray-500 font-bold tracking-tight">Welcome back. Here's what's happening with Trest today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
            Download Report
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
            View Analytics
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Vendors" 
          value={stats?.total_vendors?.toString() || "0"} 
          subValue="Active platform partners" 
          icon={Users} 
          trend="up" 
          trendValue="12.5%" 
          color="indigo" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${(stats?.total_revenue / 1000).toFixed(1)}k`} 
          subValue="Total delivered sales" 
          icon={DollarSign} 
          trend="up" 
          trendValue="8.2%" 
          color="emerald" 
        />
        <StatCard 
          title="Pending KYCs" 
          value={stats?.pending_kycs?.toString() || "0"} 
          subValue="Require verification" 
          icon={FileCheck} 
          trend="down" 
          trendValue="15.0%" 
          color="amber" 
        />
        <StatCard 
          title="Total Products" 
          value={stats?.total_products?.toString() || "0"} 
          subValue="Live catalog items" 
          icon={ShoppingBag} 
          trend="up" 
          trendValue="4.1%" 
          color="rose" 
        />
      </section>

      {/* Deep Insights Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] min-h-[400px] flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Sales & Productivity</h3>
            <p className="text-gray-400 font-bold max-w-sm">Live data integration successful. Revenue tracking activated for {stats?.total_orders} total orders.</p>
            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs font-bold text-gray-400">Current Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <span className="text-xs font-bold text-gray-400">Previous Period</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Activity Live</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-6 flex-1">
              {activities.map((activity: any, idx: number) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="relative">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm",
                      activity.type === 'KYC' ? "bg-amber-50 text-amber-600" :
                      activity.type === 'SALE' ? "bg-emerald-50 text-emerald-600" :
                      "bg-indigo-50 text-indigo-600"
                    )}>
                      {activity.type === 'KYC' && <FileCheck className="w-5 h-5" />}
                      {activity.type === 'SALE' && <ShoppingBag className="w-5 h-5" />}
                      {activity.type === 'USER' && <Users className="w-5 h-5" />}
                    </div>
                    {idx !== activities.length - 1 && (
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-gray-100"></div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                      {activity.user}
                    </p>
                    <p className="text-xs font-medium text-gray-400 truncate">{activity.action}</p>
                    <p className="text-[10px] font-black uppercase tracking-tighter text-gray-300 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-8 py-4 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all rounded-2xl text-sm font-bold text-gray-500 flex items-center justify-center gap-2">
              See All Activity
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
