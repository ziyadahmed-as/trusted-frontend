'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { KYCUploadCard } from '@/components/kyc/KYCUploadCard';

export default function KYCVerificationPage() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [reqs, stats, me] = await Promise.all([
        apiClient.getKYCRequirements(),
        apiClient.getKYCStatus(),
        apiClient.getMe()
      ]);
      setRequirements(reqs);
      setStatus(stats);
      setUser(me);
    } catch (err) {
      console.error('Failed to fetch KYC data:', err);
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
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Dynamic Background Header */}
      <div className="h-80 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <Link href="/dashboard" className="flex items-center gap-2 text-indigo-100 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                Identity & Compliance
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                Verification <span className="text-indigo-200">Center</span>
              </h1>
              <p className="text-lg text-indigo-100 font-bold max-w-xl">
                Secure your TrestBiyyo account by completing the mandatory Know Your Customer (KYC) requirements.
              </p>
            </div>
            {isVerified && (
              <div className="bg-emerald-500 text-white px-8 py-4 rounded-[2rem] flex items-center gap-3 shadow-2xl shadow-emerald-500/20 border border-white/20 animate-enter">
                <ShieldCheck className="w-6 h-6" />
                <span className="font-black text-sm uppercase tracking-widest italic">Fully Verified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {requirements.map((req) => (
              <KYCUploadCard 
                key={req.document_type.code}
                documentType={req.document_type}
                currentStatus={status?.documents[req.document_type.code]}
                onSuccess={fetchData}
              />
            ))}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Progress Card */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 italic">Verification Progress</h4>
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="transparent"
                    stroke="#f3f4f6"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="transparent"
                    stroke="#4f46e5"
                    strokeWidth="12"
                    strokeDasharray={440}
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: 440 - (440 * completionPercent) / 100 }}
                    strokeLinecap="round"
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-gray-900 tracking-tighter italic">{Math.round(completionPercent)}%</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase">Complete</span>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-400">Required Documents</span>
                  <span className="text-gray-900">{status?.required_documents || 0}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-400">Approved</span>
                  <span className="text-emerald-600">{status?.approved_required || 0}</span>
                </div>
              </div>
            </div>

            {/* Why Verify? */}
            <div className="bg-gray-900 p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-50 transition-all group-hover:blur-[100px]" />
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest italic relative z-10">Why Verify?</h4>
              <p className="text-sm font-medium text-gray-400 leading-relaxed relative z-10">
                Verification unlocks full platform access, higher payout limits, and builds trust with your customers.
              </p>
              <ul className="space-y-3 relative z-10">
                {[
                  "Unlock Payouts",
                  "Verified Badge",
                  "Priority Support",
                  "Custom Branding"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
