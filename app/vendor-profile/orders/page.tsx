'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Search,
  ArrowLeft,
  AlertCircle,
  MoreVertical,
  Loader2,
  ExternalLink
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

const statusFlow = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await apiClient.getVendorOrders();
      setOrders(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to fetch vendor orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) return;
    
    const nextStatus = statusFlow[currentIndex + 1];
    setUpdatingId(orderId);
    try {
      await apiClient.updateOrderStatus(orderId, nextStatus);
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/vendor-profile" className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <h1 className="text-xl font-black text-gray-900 tracking-tight italic">Order <span className="text-indigo-600">Fulfillment</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by Order ID..."
                className="pl-10 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-bold transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white border border-gray-100 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-[2.5rem] flex items-center justify-center text-gray-300 mb-8">
              <Package className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic mb-4">No Orders Found</h3>
            <p className="text-gray-400 font-bold max-w-sm mb-10 leading-relaxed">Incoming orders will appear here. Encourage your customers to keep shopping!</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Legend / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl shadow-indigo-100">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Incoming</p>
                      <p className="text-4xl font-black tracking-tighter italic">{orders.filter(o => o.status === 'PENDING').length}</p>
                   </div>
                   <Clock className="w-10 h-10 opacity-20" />
                </div>
                <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] flex justify-between items-center shadow-sm">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">In Processing</p>
                      <p className="text-4xl font-black text-gray-900 tracking-tighter italic">{orders.filter(o => o.status === 'PROCESSING').length}</p>
                   </div>
                   <Loader2 className="w-10 h-10 text-indigo-500 opacity-20" />
                </div>
                <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] flex justify-between items-center shadow-sm">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Dispatched</p>
                      <p className="text-4xl font-black text-gray-900 tracking-tighter italic">{orders.filter(o => o.status === 'SHIPPED').length}</p>
                   </div>
                   <Truck className="w-10 h-10 text-indigo-500 opacity-20" />
                </div>
            </div>

            {/* Tablet/Desktop Table View */}
            <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Order & Customer</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Products</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Revenue</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Current Status</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="group hover:bg-gray-50/30 transition-colors">
                        <td className="px-10 py-10">
                           <div className="flex flex-col">
                              <span className="text-xs font-black text-gray-900 italic tracking-tight mb-1">#TR-{order.id.toString().padStart(6, '0')}</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</span>
                           </div>
                        </td>
                        <td className="px-10 py-10">
                           <div className="flex flex-col gap-1">
                              {order.items?.slice(0, 2).map((item: any) => (
                                <span key={item.id} className="text-xs font-bold text-gray-600 italic truncate max-w-[150px]">• {item.product_name} x{item.quantity}</span>
                              ))}
                              {order.items?.length > 2 && <span className="text-[9px] font-black text-indigo-400 uppercase">+{order.items.length - 2} more items</span>}
                           </div>
                        </td>
                        <td className="px-10 py-10">
                           <span className="text-lg font-black text-gray-900 tracking-tighter italic">${parseFloat(order.total_amount).toFixed(2)}</span>
                        </td>
                        <td className="px-10 py-10">
                           <div className={cn(
                             "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                             statusStyles[order.status as keyof typeof statusStyles] || statusStyles.PENDING
                           )}>
                              {order.status}
                           </div>
                        </td>
                        <td className="px-10 py-10 text-right">
                           <div className="flex items-center justify-end gap-3">
                              {statusFlow.indexOf(order.status) < statusFlow.length - 1 && (
                                <button 
                                  onClick={() => handleStatusUpdate(order.id, order.status)}
                                  disabled={updatingId === order.id}
                                  className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50"
                                >
                                  {updatingId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <>Advance Status <ArrowLeft className="w-3 h-3 rotate-180" /></>}
                                </button>
                              )}
                              <button 
                                aria-label="More options"
                                className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors"
                              >
                                 <MoreVertical className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
