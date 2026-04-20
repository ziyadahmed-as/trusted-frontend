'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  History,
  Plus,
  Banknote,
  CreditCard,
  Loader2,
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-[#10b981] animate-spin" />
        </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black md:text-3xl">Finance Center</h2>
          <p className="text-sm font-medium text-[#64748b]">Manage your earnings, payouts, and payment methods.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-sm border border-[#e2e8f0] bg-[#10b981] py-6 px-7.5 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
             <div>
               <h4 className="text-2xl font-bold text-white mb-1">${summary.available_balance.toFixed(2)}</h4>
               <span className="text-sm font-medium text-white/80">Available to Withdraw</span>
             </div>
             <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-white/20">
               <Wallet className="w-6 h-6 text-white" />
             </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-white bg-white/20 px-3 py-1 rounded inline-block">Safe to Disburse</span>
          </div>
        </div>

        <div className="rounded-sm border border-[#e2e8f0] bg-white py-6 px-7.5 shadow-sm">
          <div className="flex justify-between items-start">
             <div>
               <h4 className="text-2xl font-bold text-black mb-1">${summary.pending_balance.toFixed(2)}</h4>
               <span className="text-sm font-medium text-[#64748b]">Pending in Escrow</span>
             </div>
             <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc]">
               <Clock className="w-6 h-6 text-[#f59e0b]" />
             </div>
          </div>
          <p className="mt-4 text-xs font-medium text-[#f59e0b] flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Released once orders are Delivered
          </p>
        </div>

        <div className="rounded-sm border border-[#e2e8f0] bg-[#1c2434] py-6 px-7.5 shadow-sm text-white flex flex-col justify-between">
            <h4 className="text-sm font-medium text-white/80 mb-2">Request Payout</h4>
            <form onSubmit={handleWithdraw} className="mt-auto">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full bg-white/10 border-transparent focus:bg-white/20 text-white outline-none rounded py-2 px-3 text-sm font-medium transition-all focus:ring-2 focus:ring-[#10b981]"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={summary.available_balance}
                />
                <button
                  type="submit"
                  disabled={requesting || !withdrawAmount || summary.available_balance <= 0}
                  className="bg-[#10b981] hover:bg-opacity-90 disabled:opacity-50 transition-all rounded py-2 px-4 shadow-sm text-sm font-medium"
                >
                  {requesting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Withdraw'}
                </button>
              </div>
            </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        
        {/* Left tables */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="rounded-sm border border-[#e2e8f0] bg-white px-5 pt-6 pb-2.5 shadow-sm sm:px-7.5 xl:pb-1">
              <h3 className="mb-4 text-xl font-bold text-black flex items-center gap-2">
                 <History className="w-5 h-5 text-[#3c50e0]" /> Revenue History
              </h3>
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                   <thead>
                      <tr className="bg-[#f7f9fc] text-left">
                         <th className="py-4 px-4 font-medium text-black">Order Ref</th>
                         <th className="py-4 px-4 font-medium text-black">Net Earned</th>
                         <th className="py-4 px-4 font-medium text-black">Status</th>
                         <th className="py-4 px-4 font-medium text-black">Date</th>
                      </tr>
                   </thead>
                   <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="py-8 text-center text-[#64748b]">No transactions found yet.</td>
                        </tr>
                      ) : (
                         transactions.map((tx) => (
                           <tr key={tx.id} className="border-b border-[#e2e8f0] last:border-b-0">
                              <td className="py-5 px-4 font-medium text-black">#{tx.order}</td>
                              <td className="py-5 px-4 font-medium text-[#10b981]">+${tx.vendor_payout_amount}</td>
                              <td className="py-5 px-4">
                                <span className={cn("inline-flex rounded-full px-3 py-1 text-sm font-medium", tx.is_in_escrow ? "bg-[#f59e0b]/10 text-[#f59e0b]" : "bg-[#10b981]/10 text-[#10b981]")}>
                                  {tx.is_in_escrow ? 'In Escrow' : 'Available'}
                                </span>
                              </td>
                              <td className="py-5 px-4 text-sm text-[#64748b]">
                                {tx.escrow_release_date ? new Date(tx.escrow_release_date).toLocaleDateString() : 'Pending'}
                              </td>
                           </tr>
                         ))
                      )}
                   </tbody>
                </table>
              </div>
           </div>

           <div className="rounded-sm border border-[#e2e8f0] bg-white px-5 pt-6 pb-2.5 shadow-sm sm:px-7.5 xl:pb-1">
              <h3 className="mb-4 text-xl font-bold text-black flex items-center gap-2">
                 <Banknote className="w-5 h-5 text-[#f59e0b]" /> Payout Tracking
              </h3>
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                   <thead>
                      <tr className="bg-[#f7f9fc] text-left">
                         <th className="py-4 px-4 font-medium text-black">Ref ID</th>
                         <th className="py-4 px-4 font-medium text-black">Amount</th>
                         <th className="py-4 px-4 font-medium text-black">Status</th>
                         <th className="py-4 px-4 font-medium text-black">Processed</th>
                      </tr>
                   </thead>
                   <tbody>
                      {payouts.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="py-8 text-center text-[#64748b]">No payouts found.</td>
                        </tr>
                      ) : (
                         payouts.map((po) => (
                           <tr key={po.id} className="border-b border-[#e2e8f0] last:border-b-0">
                              <td className="py-5 px-4 font-medium text-black">{po.reference_id}</td>
                              <td className="py-5 px-4 font-medium text-black">${po.amount}</td>
                              <td className="py-5 px-4">
                                <span className={cn("text-sm font-medium", po.status === 'PAID' ? "text-[#10b981]" : "text-[#f59e0b]")}>
                                  {po.status}
                                </span>
                              </td>
                              <td className="py-5 px-4 text-sm text-[#64748b]">
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

        {/* Right side (Methods) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="rounded-sm border border-[#e2e8f0] bg-white px-5 py-6 shadow-sm sm:px-7.5">
              <div className="mb-6 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-black">Payout Methods</h3>
                 <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7f9fc] text-[#3c50e0] hover:bg-[#3c50e0] hover:text-white transition">
                    <Plus className="w-4 h-4" />
                 </button>
              </div>

              <div className="space-y-4">
                {methods.length === 0 ? (
                  <div className="rounded-sm border border-dashed border-[#e2e8f0] bg-[#f7f9fc] py-8 text-center">
                    <CreditCard className="mx-auto mb-3 h-8 w-8 text-[#64748b]" />
                    <p className="text-sm font-medium text-[#64748b]">No connected methods</p>
                  </div>
                ) : (
                  methods.map((m) => (
                    <div key={m.id} className="rounded-sm border border-[#e2e8f0] p-4 relative group">
                      {m.is_primary && <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#10b981] text-white text-[10px] font-bold rounded shadow-sm">Primary</div>}
                      <div className="flex items-center gap-3 mb-2">
                        {m.method_type === 'BANK' ? <Banknote className="w-5 h-5 text-[#3c50e0]" /> : <Wallet className="w-5 h-5 text-[#f59e0b]" />}
                        <h4 className="font-semibold text-black">{m.bank_name || 'Mobile Wallet'}</h4>
                      </div>
                      <p className="text-sm text-[#64748b] mb-1">{m.account_holder_name}</p>
                      <p className="font-mono text-sm font-medium text-black">**** {m.account_number.slice(-4)}</p>
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
