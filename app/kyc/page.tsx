"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { KYCUploadCard } from "@/components/kyc/KYCUploadCard";

export default function KYCVerificationPage() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  const fetchData = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isVerified = status?.is_complete;
  const completionPercent = status?.completion_percentage || 0;

  return (
    <div className="min-h-screen bg-[#f2f2f2] pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors mb-4 font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Verification Center
            </h1>
            <p className="text-sm text-gray-600 max-w-xl">
              Complete the KYC requirements to unlock premium seller or driver capabilities.
            </p>
          </div>

          {isVerified && (
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md flex items-center gap-2 border border-green-200 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold text-sm">
                Fully Verified
              </span>
            </div>
          )}
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Progress Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-500 mb-1">
                Progress
              </h4>
              <p className="text-3xl font-black text-gray-900">
                {Math.round(completionPercent)}%
              </p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeDasharray={226}
                  initial={{ strokeDashoffset: 226 }}
                  animate={{ strokeDashoffset: 226 - (226 * completionPercent) / 100 }}
                  strokeLinecap="round"
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              {isVerified && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-red-500" />
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
            <h4 className="text-sm font-bold text-gray-500 mb-4">
              Submission Stats
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Required
                </span>
                <span className="text-gray-900 font-bold">
                  {status?.required_documents || 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> Approved
                </span>
                <span className="text-green-600 font-bold">
                  {status?.approved_required || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Why Verify Card */}
          <div className="bg-gray-900 p-6 rounded-lg text-white shadow-sm flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-2xl"></div>
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1 relative z-10">
              Platform Benefits
            </h4>
            <h3 className="text-lg font-bold text-white relative z-10 mb-2">
              Unlock your potential
            </h3>
            <p className="text-xs text-gray-400 mb-4 relative z-10">
              Verified users get access to payouts, priority support, and trust badges.
            </p>
            <div className="grid grid-cols-2 gap-2 relative z-10">
              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400" /> Trust Badge
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400" /> Payouts
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Stack */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
            Required Documents
          </h2>
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
