"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Package,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Activity,
  User,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VendorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [stats, setStats] = useState({
    total_sales: 0,
    order_count: 0,
    pending_count: 0,
    low_stock_count: 0,
    sales_history: [] as number[],
  });

  const [profile, setProfile] = useState({
    store_name: "",
    description: "",
    subscription_tier: "BRONZE",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileData, statsData] = await Promise.all([
          apiClient.getVendorProfile(),
          apiClient.getVendorStats(),
        ]);
        setProfile(profileData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const result = await apiClient.updateVendorProfile({
        store_name: profile.store_name,
        description: profile.description,
      });
      setProfile(result);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">
          Loading Store Intelligence...
        </p>
      </div>
    );
  }

  const salesHistory =
    stats.sales_history && stats.sales_history.length > 0
      ? stats.sales_history
      : [40, 65, 45, 80, 55, 95, 70, 85, 60, 100, 75, 90];

  return (
    <div className="space-y-12 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-gray-100 pb-10">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">
                Store <span className="text-gray-300">Command.</span>
              </h2>
              <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2">
                 <Sparkles className="w-3 h-3" />
                 {profile.subscription_tier} Tier
              </div>
           </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Logged in as {profile.store_name || "Merchant"}
          </p>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/vendor-profile/products" className="px-6 py-3 bg-gray-50 text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm">
              Inventory
           </Link>
           <Link href="/vendor-profile/orders" className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg shadow-indigo-100">
              Orders
           </Link>
        </div>
      </div>

      {stats.pending_count > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-[2.5rem] bg-rose-50 border border-rose-100 text-rose-700 flex flex-col md:flex-row items-center justify-between gap-6 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
               <AlertCircle className="w-6 h-6" />
            </div>
            <div>
               <p className="text-lg font-black tracking-tight italic">Action Required</p>
               <p className="text-sm font-medium opacity-70">You have {stats.pending_count} pending orders requiring immediate fulfillment.</p>
            </div>
          </div>
          <Link
            href="/vendor-profile/orders"
            className="px-8 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center gap-2 group"
          >
            Resolve Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Gross Revenue"
          value={`$${parseFloat(stats.total_sales.toString()).toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="15%"
          color="emerald"
        />
        <StatCard
          title="Order Volume"
          value={stats.order_count.toString()}
          icon={ShoppingCart}
          trend="up"
          trendValue="8%"
          color="indigo"
        />
        <StatCard
          title="Fulfillment"
          value={stats.pending_count.toString()}
          icon={Package}
          trend={stats.pending_count > 5 ? "down" : "up"}
          trendValue={stats.pending_count > 5 ? "High" : "Low"}
          color="rose"
        />
        <StatCard
          title="Platform Tier"
          value={profile.subscription_tier}
          icon={User}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sales Analytics Chart */}
        <div className="col-span-1 lg:col-span-7 xl:col-span-8">
          <div className="rounded-[3rem] border border-gray-100 bg-white p-10 shadow-2xl shadow-gray-200/50">
            <div className="mb-10 space-y-1">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">Sales Analytics</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance over last 12 periods</p>
            </div>
            <div className="h-[350px]">
              <RevenueChart
                data={salesHistory}
                dataKey1="sales"
                color1="#10b981"
                height="100%"
              />
            </div>
          </div>
        </div>

        {/* Store Settings form */}
        <div className="col-span-1 lg:col-span-5 xl:col-span-4">
          <div className="rounded-[3rem] border border-gray-100 bg-white p-10 shadow-2xl shadow-gray-200/50 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-10">
               <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                  <Settings className="w-6 h-6" />
               </div>
               <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic">Configure</h4>
            </div>

            <form onSubmit={handleSave} className="space-y-8 flex-1">
              <div className="space-y-3">
                <label
                  htmlFor="store_name"
                  className="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                  Store Name
                </label>
                <input
                  id="store_name"
                  type="text"
                  className="w-full rounded-2xl border border-gray-50 bg-gray-50 py-4 px-6 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:border-emerald-600 font-bold italic shadow-inner"
                  placeholder="e.g. Premium Essentials"
                  value={profile.store_name}
                  onChange={(e) =>
                    setProfile({ ...profile, store_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="description"
                  className="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                  Brand Vision
                </label>
                <textarea
                  id="description"
                  rows={5}
                  className="w-full rounded-2xl border border-gray-50 bg-gray-50 py-4 px-6 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:border-emerald-600 font-medium italic shadow-inner resize-none"
                  placeholder="Tell your customers about your brand..."
                  value={profile.description}
                  onChange={(e) =>
                    setProfile({ ...profile, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 p-5 font-black uppercase tracking-[0.2em] text-white text-[10px] hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Success
                    </>
                  ) : (
                    "Save Identity"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
  );
}
