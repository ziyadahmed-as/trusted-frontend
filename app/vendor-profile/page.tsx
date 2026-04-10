'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

export default function VendorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profile, setProfile] = useState({
    store_name: '',
    description: '',
    subscription_tier: 'BRONZE'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient.getVendorProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
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
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Vendor <span className="text-indigo-600">Dashboard</span></h1>
            <p className="text-gray-500 mt-2 font-medium italic">Grow your business with TrestBiyyo.</p>
          </div>
          <Link href="/" className="px-6 py-2 bg-white border border-gray-100 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all">Back Home</Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {/* Sidebar: Stats */}
           <div className="md:col-span-1 space-y-8">
             {/* Verification Alert */}
             <div className="p-8 bg-white border border-indigo-100 rounded-[2.5rem] shadow-xl shadow-indigo-100/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-4 inline-block px-3 py-1 bg-indigo-50 rounded-lg">Verification</h3>
               <p className="text-sm font-bold text-gray-900 mb-4 leading-relaxed">Complete your KYC to unlock full payout capabilities.</p>
               <Link href="/kyc" className="flex items-center justify-between group/link">
                 <span className="text-xs font-black uppercase tracking-widest text-indigo-600 group-hover/link:translate-x-1 transition-transform">Verify Now</span>
                 <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover/link:scale-110 transition-all">
                   <ChevronRight className="w-4 h-4" />
                 </div>
               </Link>
             </div>

             <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
               <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Current Tier</h3>
               <p className="text-3xl font-black tracking-tighter italic">{profile.subscription_tier}</p>
               <button className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl text-xs font-bold transition-all backdrop-blur-sm">Upgrade Plan</button>
             </div>
             
             <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
               <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Sales</h3>
               <p className="text-3xl font-black text-gray-900 tracking-tighter">$0.00</p>
             </div>

             <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
               <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Inventory</h3>
               <Link href="/vendor-profile/products" className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-indigo-50 rounded-2xl group transition-all">
                 <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600">Product Dashboard</span>
                 <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
               </Link>
             </div>
           </div>

        {/* Main Content: Profile Form */}
        <div className="md:col-span-2 p-10 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
          <h2 className="text-2xl font-bold mb-8">Store Information</h2>
          {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label htmlFor="store_name" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Store Name</label>
                <input
                 id="store_name"
                 type="text"
                 className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                 placeholder="The Premium Collective"
                 value={profile.store_name}
                 onChange={(e) => setProfile({ ...profile, store_name: e.target.value })}
                 required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Store Description</label>
                <textarea
                 id="description"
                 rows={4}
                 className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700 resize-none"
                 placeholder="Tell your customers about your brand..."
                 value={profile.description}
                 onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                 required
                />
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className={cn(
                  "w-full py-4 text-white font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2",
                  saveSuccess ? "bg-emerald-500 shadow-emerald-100" : "bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700"
                )}
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Changes Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Profile
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
