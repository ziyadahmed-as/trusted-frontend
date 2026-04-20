'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  FileCheck,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
        fetchStats();
    }
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#3c50e0] animate-spin" />
        <p className="text-sm font-medium text-[#64748b]">Loading dashboard analytics...</p>
      </div>
    );
  }

  const activities = stats?.recent_activities || [];
  const kycStats = stats?.kyc_stats || { pending: 0, total: 0 };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black md:text-3xl">Dashboard Overview</h2>
          <p className="text-sm font-medium text-[#64748b]">Detailed platform performance metrics</p>
        </div>
      </div>

      {notification && (
        <div className={cn(
            "p-4 rounded-sm border flex items-center gap-3 transition-all",
            notification.type === 'success' ? "bg-[#10b981]/5 border-[#10b981]/20 text-[#10b981]" : "bg-[#d34053]/5 border-[#d34053]/20 text-[#d34053]"
        )}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <StatCard 
          title="Total Revenue" 
          value={`$${(stats?.total_revenue || 0).toLocaleString()}`}
          icon={Eye} 
          trend="up" 
          trendValue="12.4%" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.total_orders?.toString() || "0"} 
          icon={ShoppingBag} 
          trend="up" 
          trendValue="8.1%" 
        />
        <StatCard 
          title="Active Vendors" 
          value={stats?.total_vendors?.toString() || "0"} 
          icon={Users} 
          trend="up" 
          trendValue="5.2%" 
        />
        <StatCard 
          title="KYC Pending" 
          value={kycStats.pending?.toString() || "0"} 
          icon={FileCheck} 
          trend={kycStats.pending > 10 ? "down" : "up"} 
          trendValue={kycStats.pending > 10 ? "High" : "Low"} 
        />
      </div>

      {/* CHARTS & RECENT ACTIVITY GRID */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12 2xl:gap-7.5">
        
        {/* Market Intel / Chart Placeholder */}
        <div className="col-span-1 lg:col-span-8">
          <div className="rounded-sm border border-[#e2e8f0] bg-white px-5 pt-7.5 pb-5 shadow-sm sm:px-7.5">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
              <div className="flex w-full flex-wrap gap-3 sm:gap-5">
                <div className="flex min-w-47.5">
                  <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#3c50e0]">
                    <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#3c50e0]"></span>
                  </span>
                  <div className="w-full">
                    <p className="font-semibold text-[#3c50e0]">Total Revenue</p>
                    <p className="text-sm font-medium text-[#64748b]">Current Period</p>
                  </div>
                </div>
                <div className="flex min-w-47.5">
                  <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#10b981]">
                    <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#10b981]"></span>
                  </span>
                  <div className="w-full">
                    <p className="font-semibold text-[#10b981]">Total Sales</p>
                    <p className="text-sm font-medium text-[#64748b]">Current Period</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full max-w-45 justify-end">
                <div className="inline-flex items-center rounded-md bg-[#f7f9fc] p-1.5">
                  <button className="rounded bg-white px-3 py-1 text-xs font-medium text-black shadow-sm h-hover:shadow-card">Day</button>
                  <button className="rounded px-3 py-1 text-xs font-medium text-black h-hover:bg-white h-hover:shadow-card">Week</button>
                  <button className="rounded px-3 py-1 text-xs font-medium text-black h-hover:bg-white h-hover:shadow-card">Month</button>
                </div>
              </div>
            </div>

            <div className="mt-8 h-[350px] w-full flex items-center justify-center bg-[#f9fafb] rounded border border-dashed border-[#e2e8f0]">
                <div className="text-center">
                    <Activity className="w-10 h-10 text-[#3c50e0]/20 mx-auto mb-2" />
                    <p className="text-sm font-medium text-[#64748b]">Growth analytics chart placeholder</p>
                    <p className="text-[10px] text-[#8a99af] uppercase tracking-wider">ApexCharts would render here</p>
                </div>
            </div>
          </div>
        </div>

        {/* Recent Activity / Feed */}
        <div className="col-span-1 lg:col-span-4">
          <div className="rounded-sm border border-[#e2e8f0] bg-white px-7.5 py-6 shadow-sm">
            <h4 className="mb-6 text-xl font-bold text-black">Recent Activity</h4>

            <div className="flex flex-col gap-5">
              {activities.length > 0 ? activities.map((activity: any, idx: number) => (
                <div key={activity.id} className="flex items-center gap-4 border-b border-[#e2e8f0] pb-4 last:border-0 last:pb-0">
                  <div className="h-10 w-10 min-w-[40px] rounded-full bg-[#3c50e0]/5 flex items-center justify-center text-[#3c50e0]">
                    {activity.type === 'KYC' ? <FileCheck className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h5 className="text-sm font-bold text-black truncate">{activity.user}</h5>
                    <p className="text-xs text-[#64748b] truncate">{activity.action}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="text-[10px] font-medium text-[#8a99af]">{activity.time}</p>
                    <span className={cn(
                        "text-[10px] font-bold uppercase",
                        activity.status === 'APPROVED' ? "text-[#10b981]" : "text-[#f59e0b]"
                    )}>
                        {activity.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center">
                    <p className="text-sm text-[#64748b]">No recent activity found.</p>
                </div>
              )}
            </div>
            
            <button className="mt-6 w-full rounded-md border border-[#3c50e0] py-2 text-sm font-medium text-[#3c50e0] hover:bg-[#3c50e0] hover:text-white transition-all">
                View All Activity
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
