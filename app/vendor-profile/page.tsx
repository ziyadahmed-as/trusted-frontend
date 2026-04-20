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
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/charts/RevenueChart";
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
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#10b981] animate-spin" />
        <p className="text-sm font-medium text-[#64748b]">
          Loading your store metrics...
        </p>
      </div>
    );
  }

  const salesHistory =
    stats.sales_history && stats.sales_history.length > 0
      ? stats.sales_history
      : [40, 65, 45, 80, 55, 95, 70, 85, 60, 100, 75, 90];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black md:text-3xl">
            Vendor Dashboard
          </h2>
          <p className="text-sm font-medium text-[#64748b]">
            Manage your store: {profile.store_name || "Settings required"}
          </p>
        </div>
      </div>

      {stats.pending_count > 0 && (
        <div className="p-4 rounded-sm border bg-[#f59e0b]/5 border-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              You have {stats.pending_count} pending orders requiring
              fulfillment.
            </span>
          </div>
          <Link
            href="/vendor-profile/orders"
            className="text-sm font-bold underline"
          >
            View Orders
          </Link>
        </div>
      )}

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-[#e2e8f0] bg-white py-6 px-7.5 shadow-sm">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc]">
            <DollarSign className="w-6 h-6 text-[#10b981]" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold text-black">
                ${parseFloat(stats.total_sales.toString()).toFixed(2)}
              </h4>
              <span className="text-sm font-medium text-[#64748b]">
                Total Revenue
              </span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-[#10b981]">
              <TrendingUp className="w-4 h-4" /> 15%
            </span>
          </div>
        </div>

        <div className="rounded-sm border border-[#e2e8f0] bg-white py-6 px-7.5 shadow-sm">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc]">
            <ShoppingCart className="w-6 h-6 text-[#3c50e0]" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold text-black">
                {stats.order_count}
              </h4>
              <span className="text-sm font-medium text-[#64748b]">
                Total Orders
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-[#e2e8f0] bg-white py-6 px-7.5 shadow-sm">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc]">
            <Package className="w-6 h-6 text-[#d34053]" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold text-black">
                {stats.pending_count}
              </h4>
              <span className="text-sm font-medium text-[#64748b]">
                Pending Fulfillments
              </span>
            </div>
            {stats.pending_count > 0 && (
              <span className="flex items-center gap-1 text-sm font-medium text-[#d34053]">
                High Priority
              </span>
            )}
          </div>
        </div>

        <div className="rounded-sm border border-[#e2e8f0] bg-white py-6 px-7.5 shadow-sm">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc]">
            <User className="w-6 h-6 text-[#f59e0b]" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold text-black">
                {profile.subscription_tier}
              </h4>
              <span className="text-sm font-medium text-[#64748b]">
                Subscription Level
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12 2xl:gap-7.5">
        {/* Placeholder for Sales Analytics */}
        <div className="col-span-1 lg:col-span-7 xl:col-span-8">
          <div className="rounded-sm border border-[#e2e8f0] bg-white px-5 pt-7.5 pb-5 shadow-sm sm:px-7.5">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-black">Sales Analytics</h3>
            </div>
            <div className="mt-8">
              <RevenueChart
                data={salesHistory}
                dataKey1="sales"
                color1="#10b981"
                height="310px"
              />
            </div>
          </div>
        </div>

        {/* Global Store Settings form */}
        <div className="col-span-1 lg:col-span-5 xl:col-span-4">
          <div className="rounded-sm border border-[#e2e8f0] bg-white px-7.5 py-6 shadow-sm h-full">
            <h4 className="mb-6 text-xl font-bold text-black flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#64748b]" /> Store Settings
            </h4>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label
                  htmlFor="store_name"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Store Name
                </label>
                <input
                  id="store_name"
                  type="text"
                  className="w-full rounded border border-[#e2e8f0] bg-transparent py-3 px-4 outline-none transition focus:border-[#10b981] active:border-[#10b981]"
                  placeholder="Enter your store name"
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
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Brand Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full rounded border border-[#e2e8f0] bg-transparent py-3 px-4 outline-none transition focus:border-[#10b981] active:border-[#10b981] resize-none"
                  placeholder="Tell your customers about your brand..."
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
                  className="flex w-full justify-center rounded bg-[#10b981] p-3 font-medium text-white hover:bg-opacity-90 transition"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : saveSuccess ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Saved Successfully
                    </span>
                  ) : (
                    "Save Configuration"
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
