'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Save, Loader2, CheckCircle2, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

export default function VendorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [stats, setStats] = useState({
    total_sales: 0,
    order_count: 0,
    pending_count: 0
  });
  const [profile, setProfile] = useState({
    store_name: '',
    description: '',
    subscription_tier: 'BRONZE'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileData, statsData] = await Promise.all([
          apiClient.getVendorProfile(),
          apiClient.getVendorStats()
        ]);
        setProfile(profileData);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
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
        description: profile.description
      });
      setProfile(result);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight italic">Ven<span className="text-indigo-600">dor</span> Hub</h1>
            <p className="text-gray-500 mt-2 font-medium italic">Grow your commerce empire with TrestBiyyo.</p>
          </div>
          <Link href="/" className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200">Back to Shop</Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Sidebar: Stats */}
           <div className="lg:col-span-4 space-y-8">
             {/* Verification Alert */}
             <div className="p-8 bg-white border border-indigo-100 rounded-[2.5rem] shadow-xl shadow-indigo-100/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6">
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 inline-block px-4 py-1.5 bg-indigo-50 rounded-xl">Account Identity</h3>
               <p className="text-base font-bold text-gray-900 mb-6 leading-relaxed">Complete your KYC verification to enable secure payouts.</p>
               <Link href="/kyc" className="flex items-center justify-between group/link">
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover/link:translate-x-1 transition-transform">Start Verification</span>
                 <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover/link:scale-110 transition-all">
                   <ChevronRight className="w-5 h-5" />
                 </div>
               </Link>
             </div>

             {/* Dynamic Stats Cards */}
             <div className="p-8 bg-indigo-600 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
               <TrendingUp className="w-10 h-10 mb-6 opacity-30" />
               <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Lifetime Revenue</h3>
               <p className="text-5xl font-black tracking-tighter italic">${parseFloat(stats.total_sales.toString()).toFixed(2)}</p>
               <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
                  <div className="text-xs font-bold text-white/60">Tier: {profile.subscription_tier}</div>
                  <button className="text-[10px] font-black uppercase tracking-widest bg-white/20 hover:bg-white text-white hover:text-indigo-600 px-4 py-2 rounded-xl transition-all">Upgrade</button>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
                  <Package className="w-6 h-6 text-gray-400 mb-4" />
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Orders</h3>
                  <p className="text-2xl font-black text-gray-900 tracking-tighter">{stats.order_count}</p>
                </div>
                <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                  {stats.pending_count > 0 && <div className="absolute top-4 right-4"><AlertCircle className="w-4 h-4 text-amber-500 animate-bounce" /></div>}
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Pending</h3>
                  <p className="text-2xl font-black text-gray-900 tracking-tighter">{stats.pending_count}</p>
                </div>
             </div>

             <div className="p-8 bg-gray-900 rounded-[2.5rem] shadow-xl text-white">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Operations Hub</h3>
               <div className="space-y-4">
                 <Link href="/vendor-profile/orders" className="w-full flex items-center justify-between py-4 px-6 bg-white/10 hover:bg-indigo-600 rounded-2xl group transition-all">
                    <span className="text-xs font-black uppercase tracking-widest">Order Fulfillment</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link href="/vendor-profile/products" className="w-full flex items-center justify-between py-4 px-6 bg-white/10 hover:bg-indigo-600 rounded-2xl group transition-all">
                    <span className="text-xs font-black uppercase tracking-widest">Manage Inventory</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </Link>
               </div>
             </div>
           </div>

        {/* Main Content: Profile Form */}
        <div className="lg:col-span-8 p-12 bg-white border border-gray-100 rounded-[3.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight italic flex items-center gap-3">
              Store <span className="text-indigo-600">Configuration</span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-8">
              <div className="space-y-4">
                <label htmlFor="store_name" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">Official Store Name</label>
                <input
                 id="store_name"
                 type="text"
                 className="w-full px-8 py-6 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-[1.8rem] text-gray-700 font-bold text-lg italic shadow-inner"
                 placeholder="The Premium Collective"
                 value={profile.store_name}
                 onChange={(e) => setProfile({ ...profile, store_name: e.target.value })}
                 required
                />
              </div>
              
              <div className="space-y-4">
                <label htmlFor="description" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">Brand Narrative (Bio)</label>
                <textarea
                 id="description"
                 rows={6}
                 className="w-full px-8 py-6 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-[2rem] text-gray-700 font-medium leading-relaxed italic resize-none shadow-inner"
                 placeholder="Tell your customers about your brand story..."
                 value={profile.description}
                 onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                 required
                />
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={saving}
                  className={cn(
                    "w-full py-6 text-white text-xs font-black uppercase tracking-[0.3em] rounded-[2rem] transition-all shadow-2xl flex items-center justify-center gap-3",
                    saveSuccess ? "bg-emerald-500 shadow-emerald-200" : "bg-gray-900 shadow-gray-200 hover:bg-indigo-600 hover:shadow-indigo-100"
                  )}
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 " />
                      Profile Updated Successfully
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Global Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
