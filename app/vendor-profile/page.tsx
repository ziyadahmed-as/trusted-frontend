"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Package,
  ShoppingCart,
  DollarSign,
  User,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
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
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">
          Loading Store...
        </p>
      </div>
    );
  }

  const salesHistory =
    stats.sales_history && stats.sales_history.length > 0
      ? stats.sales_history
      : [40, 65, 45, 80, 55, 95, 70, 85, 60, 100, 75, 90];

  return (
    <div className="space-y-8 pb-20 max-w-[1400px] mx-auto px-4 mt-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-gray-200 pb-6">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                Seller Center
              </h2>
              <div className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-bold border border-yellow-200 flex items-center gap-1">
                 <Sparkles className="w-3 h-3" />
                 {profile.subscription_tier} Tier
              </div>
           </div>
          <p className="text-sm text-gray-500 font-semibold">
            Store Name: {profile.store_name || "Merchant"}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
           <Link href="/vendor-profile/products" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
              Manage Products
           </Link>
           <Link href="/vendor-profile/orders" className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-bold hover:bg-red-700 transition-colors shadow-sm">
              Manage Orders
           </Link>
        </div>
      </div>

      {stats.pending_count > 0 && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
               <p className="font-bold text-red-800">Action Required</p>
               <p className="text-sm">You have {stats.pending_count} pending orders waiting to be fulfilled.</p>
            </div>
          </div>
          <Link
            href="/vendor-profile/orders"
            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-md text-sm font-bold hover:bg-red-50 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            Fulfill Orders
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue"
          value={`$${parseFloat(stats.total_sales.toString()).toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="15%"
          color="emerald"
        />
        <StatCard
          title="Orders"
          value={stats.order_count.toString()}
          icon={ShoppingCart}
          trend="up"
          trendValue="8%"
          color="indigo"
        />
        <StatCard
          title="Pending Fulfillment"
          value={stats.pending_count.toString()}
          icon={Package}
          trend={stats.pending_count > 5 ? "down" : "up"}
          trendValue={stats.pending_count > 5 ? "High" : "Low"}
          color="rose"
        />
        <StatCard
          title="Store Tier"
          value={profile.subscription_tier}
          icon={User}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Analytics Chart */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm h-full">
            <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">Store Performance</h3>
            </div>
            <div className="h-[300px]">
              <RevenueChart
                data={salesHistory}
                dataKey1="sales"
                color1="#ef4444"
                height="100%"
              />
            </div>
          </div>
        </div>

        {/* Store Settings form */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
               <Settings className="w-5 h-5 text-gray-600" />
               <h4 className="text-lg font-bold text-gray-900">Store Settings</h4>
            </div>

            <form onSubmit={handleSave} className="space-y-5 flex-1">
              <div>
                <label
                  htmlFor="store_name"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Store Name
                </label>
                <input
                  id="store_name"
                  type="text"
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-900 transition-all"
                  placeholder="e.g. Premium Store"
                  value={profile.store_name}
                  onChange={(e) =>
                    setProfile({ ...profile, store_name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Store Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-900 transition-all resize-none"
                  placeholder="Describe your store..."
                  value={profile.description}
                  onChange={(e) =>
                    setProfile({ ...profile, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600 py-2 font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Saved Successfully
                    </>
                  ) : (
                    "Save Changes"
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
