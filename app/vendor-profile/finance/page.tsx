'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Wallet, 
  ArrowUpRight, 
  History, 
  Plus, 
  Banknote, 
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

export default function VendorFinancePage() {
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [summary, setSummary] = useState({
    available_balance: 0,
    pending_balance: 0,
    total_earnings: 0,
    total_withdrawn: 0
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [methods, setMethods] = useState<any[]>([]);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const [sumData, transData, payData, methData] = await Promise.all([
        apiClient.getWalletSummary(),
        apiClient.getTransactions(),
        apiClient.getPayouts(),
        apiClient.getPayoutMethods()
      ]);
      setSummary(sumData);
      setTransactions(transData.results || transData);
      setPayouts(payData.results || payData);
      setMethods(methData.results || methData);
    } catch (err) {
      console.error('Failed to fetch finance data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || isNaN(parseFloat(withdrawAmount))) return;
    
    setRequesting(true);
    try {
      await apiClient.requestPayout(parseFloat(withdrawAmount));
      alert('Withdrawal request submitted successfully!');
      setWithdrawAmount('');
      fetchFinanceData();
    } catch (err: any) {
      alert(err.errors?.error || 'Failed to submit withdrawal request.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <Link href="/vendor-profile" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Vendor Hub</span>
          </Link>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight italic">Fi<span className="text-indigo-600">nan</span>ce center</h1>
          <p className="text-gray-500 mt-2 font-medium italic">Manage your earnings and liquid capital.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Wallet Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <Wallet className="w-12 h-12" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Available to Withdraw</h3>
              <p className="text-5xl font-black tracking-tighter italic">${summary.available_balance.toFixed(2)}</p>
              <div className="mt-8 flex gap-3">
                <div className="px-4 py-2 bg-white/20 rounded-xl text-[10px] font-bold">Safe to Disburse</div>
              </div>
            </div>

            <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 text-gray-100">
                <Clock className="w-12 h-12" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pending in Escrow</h3>
              <p className="text-5xl font-black text-gray-900 tracking-tighter italic">${summary.pending_balance.toFixed(2)}</p>
              <p className="mt-4 text-[10px] font-bold text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Released once orders are Delivered
              </p>
            </div>
          </div>

          {/* Rapid Withdraw */}
          <div className="lg:col-span-4 bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl text-white">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Withdraw Funds</h3>
            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-600">$</span>
                <input 
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-white/10 border-transparent focus:bg-white/20 focus:ring-2 focus:ring-indigo-500 outline-none rounded-2xl py-6 pl-12 pr-6 text-2xl font-black tracking-tighter text-white"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={summary.available_balance}
                />
              </div>
              <button 
                type="submit"
                disabled={requesting || !withdrawAmount || summary.available_balance <= 0}
                className="w-full py-5 bg-indigo-600 hover:bg-white hover:text-indigo-600 transition-all rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-900/20"
              >
                {requesting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Request Payout <ArrowUpRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* History Panels */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <History className="w-5 h-5 text-indigo-600" /> Revenue <span className="text-indigo-600">History</span>
                </h2>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent 50</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Order Ref</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Net Earning</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Status</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Release Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium italic">No transactions found. Start selling to earn!</td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-4 font-bold text-gray-900">#{tx.order}</td>
                          <td className="px-8 py-4 font-black text-indigo-600 italic">+${tx.vendor_payout_amount}</td>
                          <td className="px-8 py-4">
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                              tx.is_in_escrow ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                              {tx.is_in_escrow ? 'In Escrow' : 'Available'}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-xs font-medium text-gray-500">
                            {tx.escrow_release_date ? new Date(tx.escrow_release_date).toLocaleDateString() : 'Pending Delivery'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden text-gray-400">
               <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-indigo-600" /> Payout <span className="text-indigo-600">Tracking</span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Ref ID</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Status</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Processed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payouts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium italic">No payouts requested yet.</td>
                      </tr>
                    ) : (
                      payouts.map((po) => (
                        <tr key={po.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-4 font-bold text-gray-900">{po.reference_id}</td>
                          <td className="px-8 py-4 font-black tracking-tighter text-gray-700 italic">${po.amount}</td>
                          <td className="px-8 py-4">
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest",
                              po.status === 'PAID' ? "text-emerald-500" : "text-amber-500"
                            )}>
                              {po.status}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-xs font-semibold text-gray-400">
                            {po.processed_at ? new Date(po.processed_at).toLocaleDateString() : 'In Queue'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payout Methods Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payout Destinations</h3>
                 <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                    <Plus className="w-4 h-4" />
                 </button>
               </div>
               
               <div className="space-y-4">
                 {methods.length === 0 ? (
                    <div className="py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                       <CreditCard className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6">No payout methods linked</p>
                    </div>
                 ) : (
                    methods.map((m) => (
                       <div key={m.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 relative group">
                          {m.is_primary && <div className="absolute -top-2 -right-2 px-3 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-tighter rounded-full shadow-lg">Primary</div>}
                          <div className="flex items-center gap-4 mb-3">
                             {m.method_type === 'BANK' ? <Banknote className="w-6 h-6 text-indigo-600" /> : <Wallet className="w-6 h-6 text-emerald-500" />}
                             <h4 className="font-black text-gray-900 italic tracking-tight">{m.bank_name || 'Mobile Wallet'}</h4>
                          </div>
                          <p className="text-sm font-bold text-gray-500 mb-1">{m.account_holder_name}</p>
                          <p className="font-mono text-xs font-bold text-gray-900 tracking-widest">**** {m.account_number.slice(-4)}</p>
                       </div>
                    ))
                 )}
               </div>

               <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                  <div className="flex gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-widest italic">
                      Payouts are released weekly. Ensure your primary method is verified.
                    </p>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 group relative overflow-hidden">
               <TrendingUp className="w-32 h-32 absolute -bottom-10 -right-10 text-indigo-100 group-hover:rotate-12 transition-transform duration-700" />
               <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">Earnings Velocity</h3>
               <p className="text-sm font-bold text-indigo-900 leading-relaxed italic mb-6">Your store earnings have increased by <span className="text-indigo-600">22%</span> this month. Keep it up!</p>
               <Link href="/vendor-profile" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:gap-3 transition-all relative z-10">
                  View Analytics <ArrowUpRight className="w-3 h-3" />
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
