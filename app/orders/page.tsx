'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { 
  ShoppingBag, 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Search,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
  PROCESSING: "bg-indigo-50 text-indigo-600 border-indigo-100",
  SHIPPED: "bg-blue-50 text-blue-600 border-blue-100",
  DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  CANCELLED: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const showConfirmed = searchParams.get('confirmed') === 'true';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiClient.getOrders();
        setOrders(data.results || data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <section className="bg-gray-900 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]" />
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="px-4 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30 backdrop-blur-md">
                    Order Center
                  </div>
                  {showConfirmed && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 backdrop-blur-md flex items-center gap-2"
                    >
                      <Sparkles className="w-3 h-3" />
                      Order Confirmed!
                    </motion.div>
                  )}
               </div>
               <h1 className="text-6xl font-black text-white tracking-tighter italic leading-tight">
                 Your <span className="text-gray-600">Purchase</span> <br /> History
               </h1>
            </div>

            <div className="w-full max-w-md">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Track an order or search by ID..."
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-6 text-white text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 transition-all placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-50 rounded-[3rem] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mb-8">
              <Package className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic mb-4">No Orders Yet</h3>
            <p className="text-gray-400 font-bold max-w-sm mb-10 leading-relaxed">It looks like you haven't started your shopping journey yet. Discover premium items in our store.</p>
            <Link href="/" className="px-10 py-4 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-600 transition-all flex items-center gap-3">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
               <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 group">
                  <TrendingUp className="w-8 h-8 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Total Purchases</p>
                  <p className="text-4xl font-black text-indigo-900 tracking-tighter italic">{orders.length}</p>
               </div>
               {/* Placeholders for other stats if needed */}
            </div>

            <div className="space-y-6">
              {orders.map((order, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={order.id}
                  className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group"
                >
                  <div className="p-10 flex flex-col md:flex-row gap-10">
                    {/* Order Meta */}
                    <div className="md:w-64 space-y-6 border-b md:border-b-0 md:border-r border-gray-50 pb-6 md:pb-0 md:pr-10">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Identifier</p>
                        <p className="text-lg font-black text-gray-900 tracking-tight italic">#TR-{order.id.toString().padStart(6, '0')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Purchase Date</p>
                        <p className="text-sm font-bold text-gray-600 uppercase italic">{new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        statusStyles[order.status as keyof typeof statusStyles] || statusStyles.PENDING
                      )}>
                        {order.status === 'DELIVERED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {order.status?.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Order Items & Preview */}
                    <div className="flex-1 space-y-8 flex flex-col justify-between">
                       <div className="flex items-center justify-between">
                          <div className="flex -space-x-4">
                             {order.items?.slice(0, 3).map((item: any) => (
                               <div key={item.id} className="w-16 h-16 rounded-2xl bg-gray-50 border-4 border-white flex items-center justify-center text-xs font-black shadow-sm group-hover:-translate-y-2 transition-transform duration-500">
                                  {item.product_name?.[0] || 'P'}
                               </div>
                             ))}
                             {order.items?.length > 3 && (
                               <div className="w-16 h-16 rounded-2xl bg-gray-900 border-4 border-white flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                                  +{order.items.length - 3}
                               </div>
                             )}
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
                             <p className="text-3xl font-black text-gray-900 tracking-tighter italic">${parseFloat(order.total_amount).toFixed(2)}</p>
                          </div>
                       </div>

                       <div className="flex flex-col sm:flex-row items-center gap-4">
                          <Link 
                            href={`/orders/${order.id}`}
                            className="w-full sm:w-auto px-8 h-14 bg-gray-50 hover:bg-indigo-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                          >
                             Track Order / Detailed Info
                             <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                          {order.status === 'DELIVERED' && (
                             <button className="w-full sm:w-auto px-8 h-14 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                                Leave Feedback
                             </button>
                          )}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
