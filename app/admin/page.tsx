"use client";

import React, { useState, useEffect } from "react";
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
  Activity,
  ArrowRight,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchStats = async () => {
    try {
      const data = await apiClient.getAdminStats();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to fetch admin stats:", err);
      setError(err.message || "Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      fetchStats();
    }
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">
          Synchronizing Platform Data...
        </p>
      </div>
    );
  }

  const activities = stats?.recent_activities || [];
  const kycStats = stats?.kyc_stats || { pending: 0, total: 0 };

  return (
    <div className="space-y-12 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-gray-100 pb-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">
            Platform <span className="text-gray-300">Intelligence.</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
              <Activity className="w-3 h-3" />
              System Healthy
           </div>
        </div>
      </div>

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-[2rem] border flex items-center justify-between transition-all",
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
              : "bg-rose-50 border-rose-100 text-rose-700",
          )}
        >
          <div className="flex items-center gap-4">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <span className="text-sm font-bold italic">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100">Dismiss</button>
        </motion.div>
      )}

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${(stats?.total_revenue || 0).toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="12.4%"
          color="indigo"
        />
        <StatCard
          title="Total Orders"
          value={stats?.total_orders?.toString() || "0"}
          icon={ShoppingBag}
          trend="up"
          trendValue="8.1%"
          color="emerald"
        />
        <StatCard
          title="Active Vendors"
          value={stats?.total_vendors?.toString() || "0"}
          icon={Users}
          trend="up"
          trendValue="5.2%"
          color="amber"
        />
        <Link href="/admin/kyc">
          <StatCard
            title="KYC Pending"
            value={kycStats.pending?.toString() || "0"}
            icon={FileCheck}
            trend={kycStats.pending > 10 ? "down" : "up"}
            trendValue={kycStats.pending > 10 ? "Critical" : "Steady"}
            color="rose"
          />
        </Link>
      </div>

      {/* CHARTS & RECENT ACTIVITY GRID */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Revenue Analytics */}
        <div className="col-span-1 lg:col-span-8">
          <div className="rounded-[3rem] border border-gray-100 bg-white p-10 shadow-2xl shadow-gray-200/50">
            <div className="flex flex-wrap items-start justify-between gap-6 mb-12">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">Growth Analytics</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue vs Sales Performance</p>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                {["Day", "Week", "Month"].map((period) => (
                  <button key={period} className={cn(
                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    period === "Week" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-900"
                  )}>
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[400px]">
              <RevenueChart
                data={stats?.growth_data || []}
                dataKey1="revenue"
                dataKey2="sales"
                color1="#4f46e5"
                color2="#10b981"
                height="100%"
              />
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="col-span-1 lg:col-span-4">
          <div className="rounded-[3rem] border border-gray-100 bg-white p-10 shadow-2xl shadow-gray-200/50 flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
              <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic">Activity</h4>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                 <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
              {activities.length > 0 ? (
                activities.map((activity: any, idx: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={activity.id}
                    className="flex items-center gap-5 group cursor-pointer"
                  >
                    <div className="h-14 w-14 min-w-[56px] rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all group-hover:rotate-6">
                      {activity.type === "KYC" ? (
                        <FileCheck className="w-6 h-6" />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h5 className="text-sm font-black text-gray-900 tracking-tight italic">
                        {activity.user}
                      </h5>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                        {activity.action}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                         <span className="text-[9px] font-black text-gray-300">{activity.time}</span>
                         <span className={cn(
                            "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md",
                            activity.status === "APPROVED" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                         )}>
                           {activity.status}
                         </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30">
                  <Activity className="w-12 h-12" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No Recent activity</p>
                </div>
              )}
            </div>

            <Link href="/admin/users" className="mt-10 flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all group">
              Audit Logs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
  );
}
