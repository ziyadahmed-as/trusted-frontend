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
  
  // KYC Modal States
  const [selectedKyc, setSelectedKyc] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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
    setActionLoading(true);
    try {
      if (action === 'approve') {
        await apiClient.approveKYC(id, 'Verified by Admin Dashboard');
      } else {
        if (!rejectReason.trim()) {
          alert('Rejection reason is required.');
          setActionLoading(false);
          return;
        }
        await apiClient.rejectKYC(id, rejectReason, 'Rejected from Admin Dashboard');
      }
      setSelectedKyc(null);
      setShowRejectInput(false);
      setRejectReason('');
      fetchKYCs(); // Refresh list
    } catch (err) {
      alert('Error performing action. Check console.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-lg shadow-amber-100">
              <FileCheck className="w-6 h-6" />
            </div>
            <span className="text-sm font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-lg">Moderation</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
            KYC <span className="text-gray-400">Moderation</span>
          </h1>
          <p className="text-gray-500 font-bold tracking-tight">Validate identities and ensure compliance across TrestBiyyo.</p>
        </div>
      </section>
      
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
                        <button 
                          onClick={() => { setSelectedKyc(kyc); setShowRejectInput(false); setRejectReason(''); }}
                          title="View Details" 
                          className="p-2.5 bg-gray-50 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-gray-100 group/btn"
                        >
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
            <button title="Previous Page" disabled className="p-3 bg-white border border-gray-100 rounded-xl text-gray-300 transition-all">
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
            <button title="Next Page" className="p-3 bg-white border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* KYC Details Modal */}
      <AnimatePresence>
        {selectedKyc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-gray-900">KYC Review</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: KYC-{selectedKyc.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedKyc(null)}
                  aria-label="Close Review"
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">User / Role</p>
                    <p className="text-sm font-bold text-gray-900">{selectedKyc.user_email || 'Unknown User'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                      statusStyles[selectedKyc.status as keyof typeof statusStyles] || statusStyles.pending
                    )}>
                      {selectedKyc.status?.replace('_', ' ') || 'PENDING'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Document Type</p>
                    <p className="text-sm font-bold text-gray-900">{selectedKyc.document_type_name || selectedKyc.kyc_type || 'ID'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Document Number</p>
                    <p className="text-sm font-bold text-gray-900">{selectedKyc.document_number || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedKyc.document_file && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Document File</p>
                      <div className="bg-gray-100 rounded-2xl aspect-video overflow-hidden relative">
                         <img 
                           src={selectedKyc.document_file} 
                           alt="Document" 
                           className="w-full h-full object-cover hover:object-contain transition-all"
                         />
                      </div>
                    </div>
                  )}
                  {selectedKyc.LIVE_PHOTO && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Live Photo</p>
                      <div className="bg-gray-100 rounded-2xl aspect-video overflow-hidden relative">
                         <img 
                           src={selectedKyc.LIVE_PHOTO} 
                           alt="Live Photo" 
                           className="w-full h-full object-cover hover:object-contain transition-all"
                         />
                      </div>
                    </div>
                  )}
                </div>
                
                {showRejectInput && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-3"
                  >
                    <label className="text-xs font-black text-rose-600 uppercase tracking-widest">Rejection Reason</label>
                    <textarea 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Enter the reason for rejecting this document..."
                      className="w-full bg-white border border-rose-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      rows={3}
                    />
                  </motion.div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                {selectedKyc.status === 'pending' || selectedKyc.status === 'under_review' ? (
                  <>
                    {!showRejectInput ? (
                      <>
                        <button 
                          onClick={() => setShowRejectInput(true)}
                          className="px-6 py-2.5 rounded-xl bg-rose-100 text-rose-600 font-bold text-sm hover:bg-rose-200 transition-colors hover:scale-105 active:scale-95 transition-all"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleAction(selectedKyc.id, 'approve')}
                          disabled={actionLoading}
                          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                        >
                          {actionLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                          Approve KYC
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => setShowRejectInput(false)}
                          className="px-6 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleAction(selectedKyc.id, 'reject')}
                          disabled={actionLoading || !rejectReason.trim()}
                          className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 disabled:opacity-50 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                        >
                          {actionLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                          Confirm Rejection
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <button 
                    onClick={() => setSelectedKyc(null)}
                    className="px-6 py-2.5 rounded-xl bg-gray-200 text-gray-900 font-bold text-sm hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
