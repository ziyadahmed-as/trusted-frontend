'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface BuyBoxProps {
  product: {
    id: string;
    name: string;
    price: string;
    stock: number;
    images?: Array<{ image: string }>;
  };
}

export function BuyBox({ product }: BuyBoxProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = parseFloat(product.price);
  const inStock = product.stock > 0;
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: price,
      quantity: quantity,
      stock: product.stock,
      image: product.images?.[0]?.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="bg-white border-2 border-gray-100 rounded-[3rem] p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] sticky top-28">
      <div className="space-y-6">
        {/* Price & Stock */}
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-black text-gray-900 tracking-tighter italic">${price.toFixed(2)}</span>
            <span className="text-sm font-bold text-gray-400">USD</span>
          </div>
          <div className="flex items-center gap-2">
            {inStock ? (
              <div className="flex items-center gap-1.5 text-emerald-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest">In Stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-rose-600">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-black uppercase tracking-widest">Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Quantity Selector */}
        {inStock && (
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Quantity</label>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-2xl border border-gray-100">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-900 shadow-sm hover:bg-gray-100 active:scale-90 transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-black italic">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-900 shadow-sm hover:bg-gray-100 active:scale-90 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="space-y-3 pt-2">
          <button 
            onClick={handleAddToCart}
            disabled={!inStock}
            className={cn(
              "w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all relative overflow-hidden",
              added 
                ? "bg-emerald-500 text-white" 
                : "bg-gray-900 text-white hover:bg-indigo-600 active:scale-[0.98] shadow-2xl shadow-gray-200"
            )}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.div 
                  key="added"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Added to Cart</span>
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          
          <button disabled={!inStock} className="w-full py-5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50">
            <Zap className="w-5 h-5 fill-indigo-600" />
            Buy Now
          </button>
        </div>

        {/* Benefits */}
        <div className="space-y-4 pt-6 border-t border-gray-50">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 uppercase tracking-tight italic">Fast Delivery</p>
              <p className="text-[10px] font-bold text-gray-400">Free shipping on orders over $150</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 uppercase tracking-tight italic">30-Day Returns</p>
              <p className="text-[10px] font-bold text-gray-400">Hassle-free exchange policy</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 uppercase tracking-tight italic">Secured Checkout</p>
              <p className="text-[10px] font-bold text-gray-400">Bank-level encryption protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
