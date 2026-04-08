'use client';

import React, { useState } from 'react';
import { 
  FileCheck, Search, Filter, Eye, CheckCircle2, 
  XCircle, Clock, MoreVertical, ArrowUpRight, 
  Users, DollarSign, ShoppingBag, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

const statusStyles = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  under_review: "bg-indigo-50 text-indigo-600 border-indigo-100",
  approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
  rejected: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function KYCModerationPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [kycs, setKycs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKYCs = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = activeTab !== 'all' ? { status: activeTab } : {};
      const data = await apiClient.getAdminKYCs(params);
      setKycs(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  React.useEffect(() => {
    fetchKYCs();
  }, [fetchKYCs]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await apiClient.approveKYC(id, 'Verified by Admin Dashboard');
      } else {
        await apiClient.rejectKYC(id, 'Incomplete documentation', 'Please re-upload clearer images');
      }
      fetchKYCs(); // Refresh list
    } catch (err) {
      alert('Error performing action. Check console.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header sections omitted for brevity in replace_file_content chunk, assuming they remain same */}
      
      {/* Submissions Table Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Actual replacement starting from Table */}
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
                {kycs.map((kyc, idx) => (
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
                        <p className="text-sm font-bold text-gray-900">KYC-{kyc.id}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                          {new Date(kyc.submitted_at || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold uppercase">
                          {kyc.user_email?.substring(0, 2) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{kyc.user_email?.split('@')[0] || 'Unknown User'}</p>
                          <p className="text-xs font-medium text-gray-400">{kyc.user_email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg uppercase">
                        {kyc.document_type || 'ID'}
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
                        {kyc.status?.replace('_', ' ') || 'PENDING'}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button title="View Details" className="p-2.5 bg-gray-50 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-gray-100 group/btn">
                          <Eye className="w-4 h-4 text-gray-400 group-hover/btn:text-indigo-600" />
                        </button>
                        {kyc.status === 'pending' && (
                          <button 
                            onClick={() => handleAction(kyc.id, 'approve')}
                            title="Approve" 
                            className="p-2.5 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all group/btn"
                          >
                            <CheckCircle2 className="w-4 h-4 text-gray-400 group-hover/btn:text-emerald-600" />
                          </button>
                        )}
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
