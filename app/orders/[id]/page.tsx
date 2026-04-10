'use client';

import React, { useState, useEffect, use } from 'react';
import { apiClient } from '@/lib/api-client';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusSteps = [
  { id: 'PENDING', label: 'Order Confirmed', icon: CheckCircle2 },
  { id: 'PROCESSING', label: 'Processing', icon: Clock },
  { id: 'SHIPPED', label: 'Shipped', icon: Truck },
  { id: 'DELIVERED', label: 'Delivered', icon: Package },
];

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await apiClient.getOrder(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Could not retrieve order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] border border-gray-100 text-center shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 italic">Order Not Found</h1>
          <p className="text-gray-400 font-bold mb-10 leading-relaxed">{error}</p>
          <Link href="/orders" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.findIndex(s => s.id === order.status);
  const finalIndex = currentStatusIndex === -1 ? 0 : currentStatusIndex;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Dynamic Header */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-black text-gray-400 uppercase tracking-widest">
            <Link href="/orders" className="hover:text-indigo-600 transition-colors">Order Center</Link>
            <ChevronRight className="w-4 h-4 opacity-30" />
            <span className="text-gray-900 italic tracking-tighter text-sm">Order #TR-{order.id.toString().padStart(6, '0')}</span>
          </div>
          <button className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
            Support
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Tracking Status */}
            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                  <div>
                    <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-2 italic">Logistics Status</h2>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic">Tracking <span className="text-gray-400">Timeline</span></h3>
                  </div>
                  <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Estimated Arrival</p>
                      <p className="text-sm font-black text-gray-900 italic">{order.estimated_delivery_date ? new Date(order.estimated_delivery_date).toLocaleDateString() : 'TBD'}</p>
                    </div>
                  </div>
               </div>

               {/* Tracking Visual */}
               <div className="relative pt-12 pb-8">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-50 -translate-y-1/2 hidden md:block">
                    <div 
                      className={cn(
                        "h-full bg-indigo-600 transition-all duration-1000",
                        finalIndex === 0 && "w-0",
                        finalIndex === 1 && "w-1/3",
                        finalIndex === 2 && "w-2/3",
                        finalIndex === 3 && "w-full"
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-10 relative">
                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= finalIndex;
                      const isCurrent = idx === finalIndex;
                      
                      return (
                        <div key={step.id} className="flex flex-col items-center text-center space-y-4">
                           <div className={cn(
                             "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 relative z-10",
                             isCompleted ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 ring-8 ring-white" : "bg-gray-50 text-gray-300 ring-8 ring-white"
                           )}>
                             <step.icon className={cn("w-7 h-7", isCurrent && "animate-pulse")} />
                           </div>
                           <div>
                             <p className={cn(
                               "text-[10px] font-black uppercase tracking-widest",
                               isCompleted ? "text-indigo-600" : "text-gray-300"
                             )}>
                               {step.label}
                             </p>
                             {isCurrent && <p className="text-[9px] font-black text-emerald-500 uppercase mt-1 animate-bounce">Active</p>}
                           </div>
                        </div>
                      )
                    })}
                  </div>
               </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
               <div className="p-10 border-b border-gray-50 bg-gray-50/20">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">Package <span className="text-gray-400">Contents</span></h3>
               </div>
               <div className="p-10 divide-y divide-gray-50">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="py-8 first:pt-0 last:pb-0 flex gap-8 group">
                      <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-[2rem] flex items-center justify-center text-indigo-600 font-black italic shadow-inner group-hover:scale-105 transition-transform duration-500">
                        {item.product_name?.[0] || 'P'}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                           <h4 className="text-lg font-black text-gray-900 italic tracking-tight">{item.product_name}</h4>
                           <p className="text-xl font-black text-gray-900 tracking-tighter">${parseFloat(item.price_at_purchase).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                              Qty: {item.quantity}
                           </div>
                           <p className="text-xs font-bold text-gray-400">SKU: TR-PROD-{item.product}</p>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Purchase Summary */}
            <div className="bg-gray-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-100/20">
               <div className="space-y-4 mb-10 pb-10 border-b border-white/10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Financial Summary</p>
                  <div className="flex justify-between items-center text-lg italic">
                    <span className="text-gray-500 font-bold">Total Items</span>
                    <span className="font-black tracking-tighter">{order.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg italic">
                    <span className="text-gray-500 font-bold">Subtotal</span>
                    <span className="font-black tracking-tighter">${parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg italic">
                    <span className="text-gray-500 font-bold">Applied Gateway</span>
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-400">{order.payment_gateway}</span>
                  </div>
               </div>
               
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Paid</p>
                    <p className="text-4xl font-black italic tracking-tighter text-white">${parseFloat(order.total_amount).toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400">
                     <TrendingUp className="w-6 h-6" />
                  </div>
               </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                     <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-0.5 italic">Shipping To</h3>
                    <p className="text-sm font-black text-gray-900 italic">User Address Point</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-0.5 italic">Order Security</h3>
                    <p className="text-xs font-bold text-gray-400">Encrypted transaction verified via {order.payment_gateway}</p>
                  </div>
               </div>

               <div className="pt-8 border-t border-gray-50">
                  <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2 group">
                     <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                     Message Vendor
                  </button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
