"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  RefreshCw,
  Download,
  Calendar,
  ChevronRight,
  Loader2,
  AlertCircle,
  Wallet,
  BarChart3,
  Activity,
  Zap,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function MiniSparkline({
  data,
  color = "#6366f1",
}: {
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 120,
    h = 40,
    pad = 4;
  const pts = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="overflow-visible"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
      {data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        return i === data.length - 1 ? (
          <circle key={i} cx={x} cy={y} r={4} fill={color} />
        ) : null;
      })}
    </svg>
  );
}

export default function RevenueAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [activeRange, setActiveRange] = useState("Monthly");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [statsData, txData, payoutData] = await Promise.allSettled([
        apiClient.getAdminStats(),
        apiClient.getTransactions(),
        apiClient.getPayouts(),
      ]);
      if (statsData.status === "fulfilled") setStats(statsData.value);
      if (txData.status === "fulfilled") {
        const raw = txData.value;
        setTransactions(Array.isArray(raw) ? raw : raw.results || []);
      }
      if (payoutData.status === "fulfilled") {
        const raw = payoutData.value;
        setPayouts(Array.isArray(raw) ? raw : raw.results || []);
      }
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load revenue data.");
    } finally {
      setLoading(false);
      setTxLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Simulated monthly revenue data
  const revenueData = stats?.growth_data || [
    28000, 34000, 29000, 41000, 38000, 52000, 46000, 61000, 55000, 72000, 68000,
    89000,
  ];
  const maxRev = Math.max(...revenueData);

  const totalRevenue =
    stats?.total_revenue ??
    revenueData.reduce((a: number, b: number) => a + b, 0);
  const platformFees = Math.round(totalRevenue * 0.05);
  const vendorPayouts = Math.round(totalRevenue * 0.88);
  const pendingPayouts = payouts.filter(
    (p: any) => p.status === "PENDING",
  ).length;

  const kpiCards = [
    {
      label: "Gross Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      sub: "All-time platform volume",
      trend: "+18.4%",
      up: true,
      icon: DollarSign,
      color: "indigo",
      sparkData: revenueData.slice(-6),
    },
    {
      label: "Platform Fees (5%)",
      value: `$${platformFees.toLocaleString()}`,
      sub: "Commission earned",
      trend: "+12.1%",
      up: true,
      icon: CreditCard,
      color: "emerald",
      sparkData: revenueData.slice(-6).map((v: number) => v * 0.05),
    },
    {
      label: "Vendor Payouts",
      value: `$${vendorPayouts.toLocaleString()}`,
      sub: "Distributed to vendors",
      trend: "+16.7%",
      up: true,
      icon: Wallet,
      color: "violet",
      sparkData: revenueData.slice(-6).map((v: number) => v * 0.88),
    },
    {
      label: "Pending Payouts",
      value: `${pendingPayouts}`,
      sub: "Awaiting disbursement",
      trend: pendingPayouts > 5 ? "Review" : "On Track",
      up: pendingPayouts <= 5,
      icon: Activity,
      color: pendingPayouts > 5 ? "amber" : "emerald",
      sparkData: [1, 3, 2, pendingPayouts, pendingPayouts, pendingPayouts],
    },
  ];

  const colorMap: Record<
    string,
    { bg: string; text: string; glow: string; spark: string }
  > = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      glow: "shadow-indigo-100",
      spark: "#6366f1",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      glow: "shadow-emerald-100",
      spark: "#10b981",
    },
    violet: {
      bg: "bg-violet-50",
      text: "text-violet-600",
      glow: "shadow-violet-100",
      spark: "#8b5cf6",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      glow: "shadow-amber-100",
      spark: "#f59e0b",
    },
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
          <Zap className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] animate-pulse">
          Loading Revenue Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
              Financial Intelligence
            </span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
            Revenue <span className="text-gray-300">Analytics</span>
          </h1>
          <p className="text-gray-500 font-bold tracking-tight max-w-xl mt-2">
            Real-time financial performance across the entire TrestBiyyo
            marketplace ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-100 rounded-2xl">
            {["Daily", "Weekly", "Monthly", "Annual"].map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeRange === r
                    ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="w-11 h-11 flex items-center justify-center bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
            title="Refresh revenue analysis"
            aria-label="Refresh revenue analysis"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </section>

      {error && (
        <div className="p-5 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-3 text-rose-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-bold">{error}</p>
        </div>
      )}

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => {
          const colors = colorMap[card.color];
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                "bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500 group relative overflow-hidden",
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg",
                    colors.bg,
                    colors.glow,
                  )}
                >
                  <card.icon className={cn("w-5 h-5", colors.text)} />
                </div>
                <MiniSparkline data={card.sparkData} color={colors.spark} />
              </div>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">
                {card.value}
              </p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 mb-3">
                {card.label}
              </p>
              <div className="flex items-center gap-2">
                {card.up ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span
                  className={cn(
                    "text-[10px] font-black",
                    card.up ? "text-emerald-500" : "text-amber-500",
                  )}
                >
                  {card.trend}
                </span>
                <span className="text-[10px] font-bold text-gray-300">
                  {card.sub}
                </span>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Main Chart + Top Earners */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
                Revenue Flow
              </h3>
              <p className="text-gray-400 font-bold text-sm">
                Monthly gross revenue — {new Date().getFullYear()}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {activeRange} Peak
            </div>
          </div>
          <div className="flex items-end gap-2 h-56 mb-6 px-2">
            {revenueData.map((val: number, i: number) => {
              const h = Math.max((val / maxRev) * 100, 4);
              const isLast = i === revenueData.length - 1;
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="flex-1 group relative flex flex-col justify-end"
                >
                  <div
                    className={cn(
                      "w-full rounded-t-2xl transition-all duration-300 h-full",
                      isLast
                        ? "bg-indigo-600 shadow-lg shadow-indigo-100"
                        : "bg-gray-100 group-hover:bg-indigo-200",
                    )}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    ${val.toLocaleString()}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            {MONTHS.map((m) => (
              <span
                key={m}
                className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex-1 text-center"
              >
                {m}
              </span>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                Gross Revenue
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-100 rounded-full" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Past Months
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="xl:col-span-4 bg-gray-900 p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 flex flex-col">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-white tracking-tighter">
              Financial Breakdown
            </h3>
            <p className="text-gray-400 text-sm font-bold mt-1">
              Platform commission summary
            </p>
          </div>
          <div className="space-y-4 flex-1">
            {[
              {
                label: "Gross Volume",
                val: `$${totalRevenue.toLocaleString()}`,
                pct: 100,
                color: "bg-indigo-500",
              },
              {
                label: "Platform Fees",
                val: `$${platformFees.toLocaleString()}`,
                pct: 5,
                color: "bg-emerald-500",
              },
              {
                label: "Vendor Share",
                val: `$${vendorPayouts.toLocaleString()}`,
                pct: 88,
                color: "bg-violet-500",
              },
              {
                label: "Ops Reserve",
                val: `$${Math.round(totalRevenue * 0.07).toLocaleString()}`,
                pct: 7,
                color: "bg-amber-500",
              },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white">{item.val}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                    className={cn("h-full rounded-full", item.color)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Export Financial Report
            </button>
          </div>
        </div>
      </section>

      {/* Transaction Ledger */}
      <section className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
              Transaction Ledger
            </h3>
            <p className="text-sm font-bold text-gray-400 mt-1">
              Recent financial activity across the platform
            </p>
          </div>
          <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">
            {transactions.length} Records
          </span>
        </div>
        <div className="overflow-x-auto">
          {txLoading ? (
            <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-black uppercase tracking-widest">
                Loading transactions...
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                No transactions recorded yet
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Transaction
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Type
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Amount
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {transactions.slice(0, 10).map((tx: any, i: number) => (
                    <motion.tr
                      key={tx.id || i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                          TXN-{String(tx.id || i + 1).padStart(6, "0")}
                        </p>
                        <p className="text-[11px] font-bold text-gray-400">
                          {tx.description || "Platform Transaction"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {tx.transaction_type || tx.type || "SALE"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-black text-gray-900">
                          ${parseFloat(tx.amount || 0).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                            tx.status === "COMPLETED" ||
                              tx.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : tx.status === "PENDING"
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-gray-50 text-gray-500 border-gray-100",
                          )}
                        >
                          {tx.status || "Processed"}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <p className="text-[11px] font-bold text-gray-400">
                          {tx.created_at
                            ? new Date(tx.created_at).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
