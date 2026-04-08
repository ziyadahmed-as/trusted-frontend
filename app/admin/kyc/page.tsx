'use client';

import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock data for KYC submissions
const mockKYCs = [
  { id: 'KYC-8821', user: 'Global Logistics Inc.', email: 'admin@global-log.com', type: 'Business License', submitted: '2 hours ago', status: 'pending' },
  { id: 'KYC-8822', user: 'Sarah Jenkins', email: 'sarah.j@example.com', type: 'National ID', submitted: '5 hours ago', status: 'under_review' },
  { id: 'KYC-8823', user: 'Vertex Solutions', email: 'legal@vertex.is', type: 'Tax Document', submitted: '1 day ago', status: 'pending' },
  { id: 'KYC-8824', user: 'Michael Chen', email: 'm.chen@tech.cn', type: 'Passport', submitted: '1 day ago', status: 'approved' },
  { id: 'KYC-8825', user: 'Nordic Tradings', email: 'contact@nordic.no', type: 'VAT Registration', submitted: '2 days ago', status: 'rejected' },
  { id: 'KYC-8826', user: 'Elena Rodriguez', email: 'elena@estudio.es', type: 'National ID', submitted: '2 days ago', status: 'pending' },
];

const statusStyles = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  under_review: "bg-indigo-50 text-indigo-600 border-indigo-100",
  approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
  rejected: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function KYCModerationPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-lg shadow-amber-100">
              <FileCheck className="w-6 h-6" />
            </div>
            <span className="text-sm font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-lg">Administrative</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
            KYC <span className="text-gray-400">Moderation</span>
          </h1>
          <p className="text-gray-500 font-bold tracking-tight">Review and verify user identity documents for platform security.</p>
        </div>
      </section>

      {/* Filters & Actions */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {['all', 'pending', 'under_review', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 flex items-center gap-2 whitespace-nowrap",
                activeTab === tab 
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-100" 
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {tab.replace('_', ' ')}
              {tab === 'pending' && <span className="w-5 h-5 bg-amber-100 text-amber-700 text-[10px] flex items-center justify-center rounded-full">12</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Name" 
              className="w-full bg-gray-50 border-none rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>
          <button className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-400 hover:text-gray-900 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Submissions Table */}
      <section className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Submission</th>
                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode='popLayout'>
                {mockKYCs.map((kyc, idx) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={kyc.id} 
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-10 py-6">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{kyc.id}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{kyc.submitted}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold">
                          {kyc.user.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{kyc.user}</p>
                          <p className="text-xs font-medium text-gray-400">{kyc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                        {kyc.type}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                        statusStyles[kyc.status as keyof typeof statusStyles]
                      )}>
                        {kyc.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {kyc.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {kyc.status === 'pending' && <Clock className="w-3 h-3" />}
                        {kyc.status === 'under_review' && <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />}
                        {kyc.status.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button title="View Details" className="p-2.5 bg-gray-50 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-gray-100 group/btn">
                          <Eye className="w-4 h-4 text-gray-400 group-hover/btn:text-indigo-600" />
                        </button>
                        <button title="Approve" className="p-2.5 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all group/btn">
                          <CheckCircle2 className="w-4 h-4 text-gray-400 group-hover/btn:text-emerald-600" />
                        </button>
                        <button title="Options" className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group/btn">
                          <MoreVertical className="w-4 h-4 text-gray-400 group-hover/btn:text-gray-900" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-10 py-8 bg-gray-50/30 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-gray-400 italic">Showing 6 of 1,280 submissions</p>
          <div className="flex items-center gap-2">
            <button disabled className="p-3 bg-white border border-gray-100 rounded-xl text-gray-300 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, '...', 12].map((p, i) => (
                <button 
                  key={i} 
                  className={cn(
                    "w-10 h-10 rounded-xl text-sm font-black transition-all",
                    p === 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-400 hover:text-gray-900 hover:bg-white"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
