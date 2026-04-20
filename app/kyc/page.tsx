"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { KYCUploadCard } from "@/components/kyc/KYCUploadCard";

export default function KYCVerificationPage() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  const fetchData = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const [reqs, stats, me] = await Promise.all([
        apiClient.getKYCRequirements(),
        apiClient.getKYCStatus(),
        apiClient.getMe(),
      ]);
      setRequirements(reqs);
      setStatus(stats);
      setUser(me);
    } catch (err: any) {
      console.error("Failed to fetch KYC data:", err);
      // If error is 401 or token expired/invalid, redirect to login
      if (
        err.message &&
        (err.message.includes("Failed to fetch requirements") ||
          err.message.includes("401"))
      ) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isVerified = status?.is_complete;
  const completionPercent = status?.completion_percentage || 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors mb-2 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Back to Dashboard
              </span>
            </Link>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-gray-600 text-[10px] font-black uppercase tracking-widest mb-3">
                Identity & Compliance
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                Verification{" "}
                <span className="text-indigo-600 italic">Center</span>
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-2 max-w-xl">
                Secure your TrestBiyyo account by completing the mandatory Know
                Your Customer (KYC) requirements.
              </p>
            </div>
          </div>

          {isVerified && (
            <div className="bg-emerald-50 text-emerald-600 px-6 py-3.5 rounded-2xl flex items-center gap-2.5 border border-emerald-100 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-black text-xs uppercase tracking-widest">
                Fully Verified
              </span>
            </div>
          )}
        </div>
        {/* Horizontal Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Progress Card */}
          <div className="md:col-span-4 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:shadow-xl transition-all">
            <div>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 italic">
                Verification Progress
              </h4>
              <p className="text-5xl font-black text-gray-900 tracking-tighter italic">
                {Math.round(completionPercent)}%
              </p>
            </div>

            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="transparent"
                  stroke="#f3f4f6"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="transparent"
                  stroke="#4f46e5"
                  strokeWidth="12"
                  strokeDasharray={301}
                  initial={{ strokeDashoffset: 301 }}
                  animate={{
                    strokeDashoffset: 301 - (301 * completionPercent) / 100,
                  }}
                  strokeLinecap="round"
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              {isVerified && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-indigo-600" />
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="md:col-span-4 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col justify-center group hover:shadow-xl transition-all">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 italic">
              Submission Stats
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-300" /> Total Required
                </span>
                <span className="text-gray-900 bg-gray-50 px-4 py-1.5 rounded-xl font-black">
                  {status?.required_documents || 0} docs
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Approved
                </span>
                <span className="text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-xl font-black">
                  {status?.approved_required || 0} docs
                </span>
              </div>
            </div>
          </div>

          {/* Why Verify Card */}
          <div className="md:col-span-4 bg-[#0a0c10] p-8 rounded-[3rem] text-white relative overflow-hidden group flex flex-col justify-center border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-indigo-500/10 transition-all">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent)] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] transition-all group-hover:scale-110" />

            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] relative z-10 mb-3 ml-1">
              Platform Privileges
            </h4>
            <h3 className="text-xl font-black text-white relative z-10 mb-3 tracking-tight">
              Accelerate Your{" "}
              <span className="text-indigo-400 italic">Enterprise Growth</span>
            </h3>
            <p className="text-[11px] font-bold text-gray-400 mb-8 relative z-10 leading-relaxed max-w-[240px]">
              Secure your account to unlock premium vendor capabilities and
              industry-leading financial infrastructure.
            </p>

            <ul className="grid grid-cols-2 gap-y-5 gap-x-4 relative z-10">
              {[
                { label: "Verified Badge", icon: "Trust Seal" },
                { label: "Unlock Payouts", icon: "Fast Settlements" },
                { label: "Custom Brands", icon: "IP Protection" },
                { label: "Priority Support", icon: "Expert Concierge" },
              ].map((item, i) => (
                <li key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[11px] font-black tracking-wide text-gray-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </span>
                    {item.label}
                  </div>
                  <span className="text-[9px] font-bold text-gray-600 ml-7 uppercase tracking-widest">
                    {item.icon}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Requirements Stack */}
        <div className="flex flex-col gap-4 mb-20 bg-white p-6 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          {requirements.map((req) => (
            <KYCUploadCard
              key={req.document_type.code}
              documentType={req.document_type}
              currentStatus={status?.documents[req.document_type.code]}
              onSuccess={fetchData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
