'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function VendorProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    store_name: '',
    description: '',
    subscription_tier: 'BRONZE'
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Vendor Dashboard</h1>
            <p className="text-gray-500 mt-2 font-medium italic">Grow your business with Trest.</p>
          </div>
          <Link href="/" className="px-6 py-2 bg-white border border-gray-100 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50">Back Home</Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Sidebar: Stats */}
           <div className="md:col-span-1 space-y-6">
             <div className="p-8 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
               <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Current Tier</h3>
               <p className="text-3xl font-black">{profile.subscription_tier}</p>
               <button className="mt-4 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">Upgrade</button>
             </div>
             
             <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
               <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Sales</h3>
               <p className="text-3xl font-black text-gray-900">$0.00</p>
             </div>
           </div>

           {/* Main Content: Profile Form */}
           <div className="md:col-span-2 p-10 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
             <h2 className="text-2xl font-bold mb-8">Store Information</h2>
             <form className="space-y-6">
               <div>
                 <label htmlFor="store_name" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Store Name</label>
                 <input
                  id="store_name"
                  type="text"
                  className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                  placeholder="The Premium Collective"
                  value={profile.store_name}
                  onChange={(e) => setProfile({ ...profile, store_name: e.target.value })}
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
                 />
               </div>

               <button type="button" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                 Save Profile
               </button>
             </form>
           </div>
        </div>
      </div>
    </div>
  );
}
