'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingBag, 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  Truck,
  ChevronRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api-client';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Sync local cart to backend
      await apiClient.syncCart(items);
      
      // 2. Trigger checkout
      const result = await apiClient.checkoutOrder({
        currency: 'USD',
        payment_gateway: 'STRIPE'
      });
      
      // 3. Clear local cart
      clearCart();
      
      // 4. Redirect to order history
      router.push('/orders?confirmed=true');
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.detail || err.errors?.error || 'Failed to place order. Please check your delivery information.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] border border-gray-100 text-center shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 italic">Empty Cart</h1>
          <p className="text-gray-400 font-bold mb-10 leading-relaxed">You don't have any items to checkout yet.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="h-64 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group w-fit">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Continue Shopping</span>
          </Link>
          <h1 className="text-5xl font-black text-white tracking-tighter italic">
            Check<span className="text-gray-500">out</span> Summary
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content: Order Summary */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-indigo-600" />
                  Review Your Order
                </h2>
              </div>
              <div className="p-10 divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex gap-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-10 h-10 text-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-gray-900 italic tracking-tight truncate max-w-[200px]">{item.name}</h3>
                        <p className="text-lg font-black text-gray-900 tracking-tighter">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 space-y-8">
               <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <Truck className="w-6 h-6 text-indigo-600" />
                  Delivery & Identity
                </h2>
                {user ? (
                   <div className="flex items-center justify-between p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-sm">
                         {user.username?.[0] || 'U'}
                       </div>
                       <div>
                         <p className="text-sm font-black text-indigo-900 italic tracking-tight">{user.username}</p>
                         <p className="text-xs font-bold text-indigo-400">{user.email}</p>
                       </div>
                     </div>
                     <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black text-indigo-600 uppercase border border-indigo-100">Authenticated</span>
                   </div>
                ) : (
                   <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
                     <p className="text-sm font-bold text-amber-900">Please sign in to complete your checkout profile.</p>
                     <Link href="/login" className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">Sign In</Link>
                   </div>
                )}

                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold uppercase tracking-tight">
                    {error}
                  </div>
                )}
            </div>
          </div>

          {/* Sidebar: Totals & Action */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 sticky top-24">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-10 italic">Order Summary</h3>
              
              <div className="space-y-6 mb-10 pb-10 border-b border-gray-50">
                <div className="flex justify-between items-center text-sm font-bold text-gray-500 italic">
                  <span>Cart Subtotal</span>
                  <span className="text-gray-900 font-black text-base tracking-tighter">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-500 italic">
                  <span>Estimated Shipping</span>
                  <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">Wait for Quote</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-10">
                <span className="text-lg font-black text-gray-900 italic tracking-tighter">Total Amount</span>
                <span className="text-3xl font-black text-gray-900 tracking-tighter italic">${cartTotal.toFixed(2)}</span>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={!user || loading}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-200 hover:bg-gray-900 hover:shadow-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Place Order Now
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4 text-center">
                 <div className="space-y-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto" />
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Safe Payment</p>
                 </div>
                 <div className="space-y-2">
                    <CreditCard className="w-5 h-5 text-indigo-500 mx-auto" />
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Data Encrypted</p>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
