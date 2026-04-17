'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileCheck, Search, Filter, Eye, CheckCircle2, 
  XCircle, Clock, MoreVertical, ArrowUpRight, 
  Users, Shield, Landmark, MapPin, ExternalLink,
  ChevronLeft, ChevronRight, AlertCircle, Info, Navigation,
  UserCheck, UserX, Activity, Camera, ArrowRight, Upload,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
  UNDER_REVIEW: "bg-indigo-50 text-indigo-600 border-indigo-100",
  APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function KYCManagementPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  // KYC Detail States
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Record Moderation States
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // High-Detail Preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Auth Guard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiClient.getAdminStats();
      setStats(data || {}); 
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
      // Construct a very helpful error message for the user
      const targetUrl = apiClient.getCurrentApiUrl();
      setError(`CRITICAL: Failed to reach backend at ${targetUrl}. Please ensure your Django server is running and accessible.`);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (activeTab !== 'ALL') params.role = activeTab;
      if (searchQuery) params.search = searchQuery;
      
      const data = await apiClient.getAdminUserList(params);
      setUsers(data.results || data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user list:', err);
      setError('Failed to sync with identity database.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchUsers]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, [fetchUsers, fetchStats]);

  const fetchUserProfile = async (userId: string) => {
    setProfileLoading(true);
    try {
      const data = await apiClient.getAdminUserKYCDetail(userId);
      setUserProfile(data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleOpenProfile = (user: any) => {
    setSelectedUser(user);
    fetchUserProfile(user.id);
  };

  const handleGlobalVerification = async (userId: string, isVerified: boolean) => {
    setActionLoading(true);
    try {
      await apiClient.verifyUserIdentity(userId, isVerified);
      alert(`User identity status ${isVerified ? 'VERIFIED' : 'INVALIDATED'} successfully.`);
      fetchUsers();
      fetchUserProfile(userId);
    } catch (err) {
      console.error(err);
      alert('Failed to update global identity status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDocumentAction = async (recordId: string, action: 'approve' | 'reject' | 'pending' | 'review') => {
    setActionLoading(true);
    try {
      if (action === 'approve') {
        await apiClient.approveKYC(recordId, 'Approved via Management Profile View');
      } else if (action === 'pending') {
        await apiClient.resetKYCRecordStatus(recordId);
      } else if (action === 'review') {
        await apiClient.setRecordUnderReview(recordId);
      } else {
        if (!rejectReason.trim()) {
          alert('Please provide a rejection reason.');
          setActionLoading(false);
          return;
        }
        await apiClient.rejectKYC(recordId, rejectReason, 'Rejected via Management Profile View');
      }
      
      // Refresh user profile after action
      if (selectedUser) fetchUserProfile(selectedUser.id);
      setRejectId(null);
      setRejectReason('');
      fetchStats();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-gray-200">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
              Identity Control
            </span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
            KYC <span className="text-gray-400">Management</span>
          </h1>
          <p className="text-gray-500 font-bold tracking-tight max-w-xl">
            Centralized identity verification. Grouping submissions by user for efficient auditing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-900 shadow-sm hover:shadow-md transition-all active:scale-95">
            <Filter className="w-4 h-4 text-indigo-600" /> Export Audit
          </button>
          <button 
            onClick={() => { fetchStats(); fetchUsers(); }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 rounded-2xl text-sm font-black text-white shadow-lg shadow-gray-200 hover:bg-black transition-all active:scale-95"
          >
            Refresh Database
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Vendors', value: stats.total_vendors || 0, icon: Shield, color: 'emerald' },
          { label: 'Total Buyers', value: stats.total_buyers || 0, icon: Users, color: 'indigo' },
          { label: 'Pending Audit', value: stats.kyc_stats?.pending || 0, icon: Clock, color: 'amber' },
          { label: 'System Revenue', value: stats.total_revenue || 0, icon: Activity, color: 'gray' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] group hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                stat.color === 'amber' && "bg-amber-50 text-amber-600",
                stat.color === 'indigo' && "bg-indigo-50 text-indigo-600",
                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                stat.color === 'gray' && "bg-gray-50 text-gray-600",
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
            </div>
            <p className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Primary Management Table */}
      <section className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 pb-0 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
           <div className="flex items-center gap-2 p-1 bg-gray-50 border border-gray-100 rounded-2xl w-fit">
            {['ALL', 'VENDOR', 'DRIVER', 'BUYER'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab 
                    ? "bg-white text-gray-900 shadow-sm border border-gray-100" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab}S
              </button>
            ))}
          </div>
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by email or ID..."
              className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-3 pl-12 pr-6 text-sm font-medium focus:ring-4 focus:ring-gray-50 focus:border-gray-900 outline-none transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 text-rose-600">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-black uppercase tracking-widest">{error}</p>
            </div>
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:scale-105 transition-all"
            >
              Sign In Now
            </Link>
          </div>
        )}

        <div className="overflow-x-auto mt-6">
          <title>KYC Management | TrestBiyyo Admin</title>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subscriber Identity</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification Status</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">KYC Progress</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Auth Role</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-4">
                      <Users className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching identities found</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {users.map((user, i) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={user.id} 
                      className="group hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm">
                            {user.email.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">{user.full_name || user.username}</p>
                            <p className="text-[11px] font-bold text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {user.is_verified ? (
                           <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Fully Verified
                           </div>
                        ) : (
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-transparent shadow-sm",
                            user.kyc_summary?.pending_docs > 0 ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
                          )}>
                            {user.kyc_summary?.pending_docs > 0 ? "Pending Audit" : "Compliance Reqd"}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                             <span className="text-gray-400">{user.kyc_summary?.submitted_docs}/{user.kyc_summary?.total_docs} Records</span>
                             <span className="text-gray-900">{Math.round(user.kyc_summary?.percentage)}%</span>
                          </div>
                          <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-indigo-600 transition-all duration-500 dynamic-progress" 
                               style={{ '--progress-width': `${user.kyc_summary?.percentage}%` } as React.CSSProperties}
                             />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                          user.role === 'VENDOR' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-blue-50 text-blue-700 border-blue-100"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => handleOpenProfile(user)}
                          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2 ml-auto"
                        >
                          Detail Audit <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* User Identity Profile Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center sm:justify-end p-0 sm:p-5">
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md w-full h-full cursor-default"
              aria-label="Close modal"
              title="Close modal"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl h-full bg-white sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white">
                      <Users className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tighter">User Identity Profile</h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">System UID: {selectedUser.id}</p>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  title="Close Profile"
                  aria-label="Close Profile"
                  className="w-12 h-12 bg-white border border-gray-100 hover:bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 transition-all active:scale-75"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Global Verification Control Center (STATION) */}
              <div className="px-8 py-5 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className={cn(
                       "w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm",
                       selectedUser.is_verified ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    )}>
                       {selectedUser.is_verified ? <Shield className="w-5 h-5" /> : <Shield className="w-5 h-5 opacity-40" />}
                    </div>
                    <div>
                       <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Global Identity Status</h4>
                       <p className={cn("text-[10px] font-bold", selectedUser.is_verified ? "text-emerald-500" : "text-rose-500")}>
                          {selectedUser.is_verified ? "SECURE & VERIFIED" : "IDENTITY AUDIT REQUIRED"}
                       </p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    {selectedUser.is_verified ? (
                       <button 
                         onClick={() => handleGlobalVerification(selectedUser.id, false)}
                         disabled={actionLoading}
                         className="px-4 py-2 bg-white border border-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all disabled:opacity-50"
                       >
                         Invalidate Access
                       </button>
                    ) : (
                       <button 
                         onClick={() => handleGlobalVerification(selectedUser.id, true)}
                         disabled={actionLoading}
                         className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
                       >
                         Trust & Verify Now
                       </button>
                    )}
                 </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Profile Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subscriber</p>
                      <p className="text-sm font-black text-gray-900 truncate">{selectedUser.email}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Platform Role</p>
                      <p className="text-sm font-black text-indigo-600">{selectedUser.role}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Records</p>
                      <p className="text-sm font-black text-gray-900">{selectedUser.kyc_summary?.submitted_docs}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Global Status</p>
                      <p className={cn("text-sm font-black", selectedUser.is_verified ? "text-emerald-600" : "text-rose-600")}>
                        {selectedUser.is_verified ? "VERIFIED" : "UNVERIFIED"}
                      </p>
                    </div>
                </div>
                
                {/* Manual Upload Section for Admin */}
                <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                         <Upload className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-gray-900 tracking-tight">Assisted Manual Upload</h4>
                         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Submit documents on behalf of {selectedUser.username}</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => {
                       const element = document.getElementById('requirements-section');
                       element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100"
                   >
                     Initiate Upload
                   </button>
                </div>

                {/* Documents List */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h4 className="text-lg font-black text-gray-900 tracking-tight">Identity Documents</h4>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit one-by-one</span>
                  </div>

                  {profileLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                       <div className="w-10 h-10 border-4 border-gray-100 border-t-indigo-600 rounded-full animate-spin" />
                       <p className="text-xs font-black uppercase tracking-widest">Syncing Identity Data...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userProfile?.kyc_records.map((record: any) => (
                        <motion.div 
                          key={record.id}
                          className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="flex flex-col xl:flex-row gap-8">
                            {/* Record Info */}
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
                                    <FileCheck className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h5 className="text-sm font-black text-gray-900">{record.document_type_name}</h5>
                                    <p className="text-[10px] font-bold text-gray-400">SN: {record.document_number || 'N/A'}</p>
                                  </div>
                                </div>
                                <div className={cn(
                                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                  statusStyles[record.status as keyof typeof statusStyles]
                                )}>
                                  {record.status}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Submitted</p>
                                   <p className="text-[11px] font-bold text-gray-900">
                                      {new Date(record.submitted_at).toLocaleDateString()}
                                   </p>
                                </div>
                                {record.extracted_data?.location && (
                                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                     <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">GPS Evidence</p>
                                     <a 
                                      href={`https://www.google.com/maps?q=${record.extracted_data.location.latitude},${record.extracted_data.location.longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                                     >
                                        View Pin <ExternalLink className="w-3 h-3" />
                                     </a>
                                  </div>
                                )}
                              </div>

                               {/* Document Previews */}
                              <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Main File</p>
                                  <button 
                                    onClick={() => record.document_file && setPreviewImage(record.document_file)}
                                    className="w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 cursor-zoom-in hover:border-indigo-400 transition-colors"
                                    title="View full-resolution main file"
                                    aria-label="View full-resolution main file"
                                  >
                                    {record.document_file ? (
                                      <img src={record.document_file} alt={`Main document for ${record.document_type_name}`} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300"><Info className="w-6 h-6"/></div>
                                    )}
                                  </button>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Identity Proof (Live)</p>
                                  <button 
                                    onClick={() => record.LIVE_PHOTO && setPreviewImage(record.LIVE_PHOTO)}
                                    className="w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 cursor-zoom-in hover:border-indigo-400 transition-colors"
                                    title="View full-resolution live proof"
                                    aria-label="View full-resolution live proof"
                                  >
                                    {record.LIVE_PHOTO ? (
                                      <img src={record.LIVE_PHOTO} alt={`Live identity proof for ${record.document_type_name}`} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300"><Camera className="w-6 h-6"/></div>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Record Actions */}
                            <div className="xl:w-64 border-l border-gray-100 xl:pl-8 flex flex-col justify-center gap-3">
                               {record.status === 'PENDING' || record.status === 'UNDER_REVIEW' ? (
                                 <>
                                   {rejectId === record.id ? (
                                     <div className="space-y-3">
                                        <textarea 
                                          value={rejectReason}
                                          onChange={(e) => setRejectReason(e.target.value)}
                                          placeholder="Rejection reason..."
                                          aria-label="Rejection reason"
                                          className="w-full text-[11px] font-medium border border-rose-200 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-rose-50 bg-rose-50/20"
                                          rows={3}
                                        />
                                        <div className="flex items-center gap-2">
                                           <button 
                                              onClick={() => setRejectId(null)}
                                              className="flex-1 py-2 text-[10px] font-black uppercase text-gray-400 hover:text-gray-900"
                                           >
                                              Cancel
                                           </button>
                                           <button 
                                              onClick={() => handleDocumentAction(record.id, 'reject')}
                                              disabled={actionLoading || !rejectReason.trim()}
                                              className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-rose-100 disabled:opacity-50"
                                           >
                                              Reject
                                           </button>
                                        </div>
                                     </div>
                                   ) : (
                                     <>
                                       <button 
                                         onClick={() => handleDocumentAction(record.id, 'approve')}
                                         disabled={actionLoading}
                                         className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                       >
                                         <CheckCircle2 className="w-4 h-4" /> Approve Document
                                       </button>
                                       
                                       <div className="flex gap-2">
                                         <button 
                                           onClick={() => handleDocumentAction(record.id, 'review')}
                                           disabled={actionLoading || record.status === 'UNDER_REVIEW'}
                                           className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                                           title="Mark as Under Review"
                                         >
                                           <Clock className="w-3 h-3" /> Review
                                         </button>
                                         <button 
                                           onClick={() => setRejectId(record.id)}
                                           disabled={actionLoading}
                                           className="flex-1 py-3 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                                         >
                                           <UserX className="w-3 h-3" /> Reject
                                         </button>
                                       </div>
                                     </>
                                   )}
                                 </>
                               ) : (
                                 <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100 border-dashed space-y-3">
                                    <div>
                                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audited & {record.status}</p>
                                       <p className="text-[9px] font-bold text-gray-400 mt-1 italic">
                                         {new Date(record.updated_at).toLocaleString()}
                                       </p>
                                    </div>
                                    <button 
                                      onClick={() => handleDocumentAction(record.id, 'pending')}
                                      disabled={actionLoading}
                                      className="w-full py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-sm"
                                    >
                                      Reset to Pending
                                    </button>
                                 </div>
                               )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Admin-Only Missing Requirements Fulfiller */}
                <div id="requirements-section" className="space-y-6 pb-12">
                   <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <h4 className="text-lg font-black text-gray-900 tracking-tight">Required Document Checklist</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fulfill missing data</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProfile?.required_documents.map((req: any) => {
                        const existingRecord = userProfile.kyc_records.find((r: any) => r.kyc_type === req.document_type.code);
                        return (
                          <div key={req.document_type.code} className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className={cn(
                                   "w-10 h-10 rounded-xl flex items-center justify-center",
                                   existingRecord ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
                                )}>
                                   {existingRecord ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div>
                                   <p className="text-sm font-black text-gray-900">{req.document_type.name}</p>
                                   <p className={cn(
                                      "text-[9px] font-black uppercase tracking-widest",
                                      existingRecord ? "text-emerald-500" : "text-gray-400"
                                   )}>
                                      {existingRecord ? existingRecord.status : "Missing Submission"}
                                   </p>
                                </div>
                             </div>
                             
                             {!existingRecord && (
                               <div className="flex flex-col gap-2">
                                  <input 
                                    type="file" 
                                    id={`upload-${req.document_type.code}`}
                                    className="hidden" 
                                    aria-label={`Upload ${req.document_type.name}`}
                                    title={`Upload ${req.document_type.name}`}
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      
                                      const docNumber = prompt(`Please enter the ${req.document_type.name} identification number:`);
                                      if (!docNumber) return;

                                      setActionLoading(true);
                                      try {
                                        const formData = new FormData();
                                        formData.append('document_file', file);
                                        formData.append('document_number', docNumber);
                                        formData.append('kyc_type', req.document_type.code);
                                        
                                        // Specific Admin Upload API call
                                        const response = await fetch(`${apiClient.getCurrentApiUrl()}/kyc/admin/${selectedUser.id}/upload/`, {
                                          method: 'POST',
                                          headers: { 
                                            'Authorization': `Bearer ${localStorage.getItem('token')}` 
                                          },
                                          body: formData
                                        });

                                        if (!response.ok) throw new Error('Upload failed');
                                        
                                        alert('Document uploaded successfully for the user.');
                                        fetchUserProfile(selectedUser.id);
                                        fetchUsers();
                                      } catch (err) {
                                        console.error(err);
                                        alert('Failed to upload document on behalf of user.');
                                      } finally {
                                        setActionLoading(false);
                                      }
                                    }}
                                  />
                                  <button 
                                    onClick={() => document.getElementById(`upload-${req.document_type.code}`)?.click()}
                                    className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2"
                                  >
                                    <Upload className="w-3 h-3" /> Upload for User
                                  </button>
                               </div>
                             )}
                          </div>
                        );
                      })}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ID Inspector Modal */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-20">
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewImage(null)}
              className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl w-full h-full cursor-zoom-out"
              title="Close Inspector"
              aria-label="Close Inspector"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl max-h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <img src={previewImage} className="w-full h-auto object-contain max-h-[90vh]" alt="Full size identity evidence" />
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-xl hover:scale-110 active:scale-95 transition-all"
                title="Close Inspector"
                aria-label="Close Inspector"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
