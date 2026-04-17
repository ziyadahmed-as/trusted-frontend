'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  FileCheck,
  ArrowUpRight,
  Clock,
  ExternalLink,
  Zap,
  Shield,
  Activity,
  ChevronRight,
  ArrowRight,
  UserCheck,
  Package,
  Heart,
  TrendingUp,
  Tag,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatCard } from '@/components/admin/StatCard';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Action states
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchStats = async () => {
    try {
        const data = await apiClient.getAdminStats();
        setStats(data);
    } catch (err: any) {
        console.error('Failed to fetch admin stats:', err);
        setError(err.message || 'Failed to connect to backend');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we are on the client and potentially have a token
    // (AdminGuard handles the hard redirect, this is just a safety measure)
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
        fetchStats();
    }
  }, []);

  const handleQuickAction = async (action: 'audit' | 'sync' | 'health') => {
    setRunningAction(action);
    setNotification(null);
    try {
        let result;
        if (action === 'audit') result = await apiClient.auditKYC();
        else if (action === 'sync') result = await apiClient.syncInventory();
        else result = await apiClient.getPlatformHealth();
        
        setNotification({ 
            type: 'success', 
            message: result.message || result.status === 'operational' ? 'Platform status: Operational' : 'Action completed successfully' 
        });
        
        // Refresh stats if it might have changed something
        if (action !== 'health') await fetchStats();

    } catch (err: any) {
        setNotification({ type: 'error', message: err.message || 'Operation failed' });
    } finally {
        setRunningAction(null);
        // Clear notification after 5 seconds
        setTimeout(() => setNotification(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
            <Zap className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] animate-pulse">Initializing Command Center...</p>
      </div>
    );
  }

  const activities = stats?.recent_activities || [];
  const kycStats = stats?.kyc_stats || { pending: 0, total: 0 };
  const growthData = stats?.growth_data || [40, 65, 45, 80, 55, 95, 70, 85, 60, 100, 75, 90];
  const maxGrowth = Math.max(...growthData);

  return (
    <div className="space-y-12 pb-20 relative">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
                "fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border font-bold text-sm",
                notification.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-rose-500/10 border-rose-500/20 text-rose-600"
            )}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Hero Header */}
      <section className="relative p-12 bg-gray-900 rounded-[3.5rem] overflow-hidden shadow-2xl shadow-indigo-100/20">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-500/30 backdrop-blur-md">Platform Live</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
             </div>
             <h1 className="text-6xl font-black text-white tracking-tighter leading-tight italic">
               System <span className="text-indigo-400">Overview</span>
             </h1>
             <p className="text-gray-400 font-bold max-w-xl text-lg tracking-tight">
               Real-time diagnostic metrics and administrative controls for the TrestBiyyo marketplace ecosystem.
             </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/admin/revenue" className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-sm border border-gray-100">
               View Revenue
               <TrendingUp className="w-4 h-4 text-indigo-600" />
            </Link>
            <Link href="/admin/kyc" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40 flex items-center gap-3">
               KYC Queue
               <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center text-[10px]">
                 {kycStats.pending}
               </div>
            </Link>
          </div>
        </div>

        {/* Abstract Background Design */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-pattern-abstract"></div>
      </section>

      {/* Primary Analytics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Global Revenue" 
          value={`$${(stats?.total_revenue || 0).toLocaleString()}`}
          subValue="Gross platform volume"
          icon={DollarSign} 
          trend="up" 
          trendValue="+12.4%" 
          color="indigo" 
        />
        <StatCard 
          title="Active Vendors" 
          value={stats?.total_vendors?.toString() || "0"} 
          subValue="Verified business accounts"
          icon={Shield} 
          trend="up" 
          trendValue="+5.2%" 
          color="emerald" 
        />
        <StatCard 
          title="KYC Backlog" 
          value={kycStats.pending?.toString() || "0"} 
          subValue="Identity records awaiting review"
          icon={FileCheck} 
          trend={kycStats.pending > 10 ? "up" : "down"} 
          trendValue={kycStats.pending > 10 ? "Critical" : "Stable"} 
          color="amber" 
        />
        <StatCard 
          title="Order Intake" 
          value={stats?.total_orders?.toString() || "0"} 
          subValue="Successfully processed sales"
          icon={ShoppingBag} 
          trend="up" 
          trendValue="+8.1%" 
          color="rose" 
        />
      </section>

      {/* Intelligence & Actions Row */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Visualization & Activity Feed */}
        <div className="xl:col-span-8 space-y-10">
          
          {/* Growth Intelligence Component */}
          <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-12">
               <div className="space-y-2">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Market Intelligence</h3>
                  <p className="text-gray-400 font-bold text-sm tracking-tight italic">Consolidated growth analytics for the last period.</p>
               </div>
               <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl">
                  {['Daily', 'Weekly', 'Monthly'].map((t) => (
                    <button 
                      key={t}
                      className={cn(
                        "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        t === 'Monthly' ? "bg-white text-indigo-600 shadow-md" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      {t}
                    </button>
                  ))}
               </div>
            </div>

            {/* Premium Simulated Chart */}
            <div className="h-64 flex items-end justify-between gap-4 px-2 mb-8 relative">
                {growthData.map((val: number, i: number) => {
                  const h = (val / maxGrowth) * 100;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, duration: 1 }}
                      className="flex-1 min-w-[12px] group relative"
                    >
                      <div className={cn(
                        "w-full h-full rounded-full transition-all duration-500",
                        i === growthData.length - 1 ? "bg-indigo-600 shadow-lg shadow-indigo-100" : "bg-indigo-50 group-hover:bg-indigo-100"
                      )}></div>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {val} Units
                      </div>
                    </motion.div>
                  )
                })}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-50">
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"></div>
                     <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Revenue Forecast</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-indigo-100 rounded-full"></div>
                     <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Base Target</p>
                  </div>
               </div>
               <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:gap-3 transition-all group">
                  Detailed Insights
                  <ArrowRight className="w-3.5 h-3.5" />
               </button>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* KYC Audit */}
            <button 
                onClick={() => handleQuickAction('audit')}
                disabled={!!runningAction}
                className={cn(
                    "p-8 text-white rounded-[2.5rem] flex flex-col items-start group hover:-translate-y-2 transition-all duration-500 shadow-2xl ",
                    runningAction === 'audit' ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 shadow-indigo-100 active:scale-95"
                )}
            >
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform shadow-lg">
                  {runningAction === 'audit' ? <Loader2 className="w-7 h-7 animate-spin" /> : <UserCheck className="w-7 h-7" />}
               </div>
               <h4 className="text-sm font-black uppercase tracking-widest mb-1">Audit All KYC</h4>
               <p className="text-[10px] font-bold text-indigo-200">System-wide verification scan</p>
               <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-indigo-200 uppercase tracking-widest group-hover:gap-3 transition-all">
                 Run Now <ArrowRight className="w-3 h-3" />
               </div>
            </button>
            
            {/* Inventory */}
            <Link 
                href="/admin/inventory"
                className="p-8 bg-white border border-gray-100 rounded-[2.5rem] flex flex-col items-start group hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-gray-100/40 active:scale-95"
            >
               <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Package className="w-7 h-7" />
               </div>
               <h4 className="text-sm font-black uppercase tracking-widest mb-1 text-gray-900">Inventory Control</h4>
               <p className="text-[10px] font-bold text-gray-400">Monitor global catalog SKUs</p>
               <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-emerald-600 group-hover:gap-3 transition-all">
                 Open Module <ArrowRight className="w-3 h-3" />
               </div>
            </Link>

            {/* Category Hub */}
            <Link 
                href="/admin/categories"
                className="p-8 bg-white border border-gray-100 rounded-[2.5rem] flex flex-col items-start group hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-gray-100/40 active:scale-95"
            >
               <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Tag className="w-7 h-7" />
               </div>
               <h4 className="text-sm font-black uppercase tracking-widest mb-1 text-gray-900">Category Hub</h4>
               <p className="text-[10px] font-bold text-gray-400">Manage product taxonomy</p>
               <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-violet-600 group-hover:gap-3 transition-all">
                 Open Module <ArrowRight className="w-3 h-3" />
               </div>
            </Link>
          </div>
        </div>

        {/* Live Feed Column */}
        <div className="xl:col-span-4 h-full">
           <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] h-full flex flex-col">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-50">
                       <Activity className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                       <h3 className="text-xl font-black text-gray-900 tracking-tighter">Live Monitor</h3>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Stream</p>
                    </div>
                 </div>
                 <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>

              <div className="flex-1 space-y-8 relative">
                 {activities.length > 0 ? activities.map((activity: any, idx: number) => (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group flex gap-5 relative"
                    >
                      <div className="relative">
                        <div className={cn(
                          "w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg",
                          activity.type === 'KYC' ? "bg-amber-50 text-amber-600 shadow-amber-50" :
                          activity.type === 'SALE' ? "bg-emerald-50 text-emerald-600 shadow-emerald-50" :
                          "bg-indigo-50 text-indigo-600 shadow-indigo-50"
                        )}>
                          {activity.type === 'KYC' && <Shield className="w-6 h-6" />}
                          {activity.type === 'SALE' && <ShoppingBag className="w-6 h-6" />}
                          {activity.type === 'USER' && <Users className="w-6 h-6" />}
                        </div>
                        {idx !== activities.length - 1 && (
                          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-50"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between mb-1">
                           <p className="text-sm font-black text-gray-900 uppercase tracking-tighter truncate group-hover:text-indigo-600 transition-colors italic">
                             {activity.user}
                           </p>
                           <span className="text-[9px] font-black text-gray-300 uppercase shrink-0">{activity.time}</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 tracking-tight mb-2 truncate">
                           {activity.action}
                        </p>
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest shadow-sm",
                          activity.status === 'PENDING' ? "bg-amber-50 border-amber-100 text-amber-600" :
                          activity.status === 'APPROVED' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                          "bg-gray-50 border-gray-100 text-gray-400"
                        )}>
                           <div className={cn(
                             "w-1 h-1 rounded-full",
                             activity.status === 'PENDING' ? "bg-amber-500" :
                             activity.status === 'APPROVED' ? "bg-emerald-500" :
                             "bg-gray-400"
                           )}></div>
                           {activity.status}
                        </div>
                      </div>
                    </motion.div>
                 )) : (
                   <div className="h-full flex flex-col items-center justify-center text-center p-10">
                      <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-6 font-black italic">!</div>
                      <h4 className="text-lg font-black text-gray-900 tracking-tighter mb-2 italic">Radio Silence</h4>
                      <p className="text-xs font-bold text-gray-400">No activity recorded for the platform in this session.</p>
                   </div>
                 )}
              </div>

              <button className="w-full mt-10 py-5 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-gray-200">
                 Global Activity View
                 <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
           </div>
        </div>
      </section>
    </div>
  );
}
