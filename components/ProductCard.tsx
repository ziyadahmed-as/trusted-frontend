'use client';

import React from 'react';
import { ShoppingBag, Star, Tag, ChevronRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    category_name?: string;
    average_rating?: number;
    total_reviews?: number;
  };
  variant?: 'compact' | 'featured' | 'standard';
}

export function ProductCard({ product, variant = 'standard' }: ProductCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group relative flex flex-col bg-white border border-gray-100 transition-all duration-500",
        isFeatured ? "rounded-[3.5rem] p-4" : "rounded-[2.5rem]",
        "hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] hover:border-indigo-100"
      )}
    >
      <div className={cn(
        "relative overflow-hidden bg-gray-50",
        isFeatured ? "rounded-[3rem] aspect-[4/3]" : "rounded-[2rem] aspect-square"
      )}>
        {/* Abstract Product Background Decor */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="absolute inset-0 flex items-center justify-center text-gray-200 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700 ease-out">
          <ShoppingBag className={cn(
            "opacity-10",
            isFeatured ? "w-40 h-40" : "w-24 h-24"
          )} />
        </div>

        {/* Labels */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {product.average_rating && parseFloat(product.average_rating.toString()) >= 4.5 && (
            <div className="px-4 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2 shadow-2xl shadow-black/20">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>Top Rated</span>
            </div>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="px-4 py-1.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-rose-200">
              Only {product.stock} left
            </div>
          )}
        </div>

        <button 
          aria-label="Add to wishlist"
          className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-xl shadow-black/5 z-10 border border-white"
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* Quick Add Button Overlay */}
        <div className="absolute inset-x-6 bottom-6 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 z-10">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                id: product.id.toString(),
                name: product.name,
                price: parseFloat(product.price),
                quantity: 1,
                stock: product.stock,
              });
            }}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-2xl"
          >
            Quick Add
          </button>
        </div>
      </div>

      <div className={cn(
        "flex flex-col flex-1",
        isFeatured ? "p-8" : "p-6"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-600">
            {product.category_name || 'Essentials'}
          </span>
          {product.average_rating && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{parseFloat(product.average_rating.toString()).toFixed(1)}</span>
            </div>
          )}
        </div>

        <h3 className={cn(
          "font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2",
          isFeatured ? "text-2xl" : "text-lg"
        )}>
          {product.name}
        </h3>
        
        {!isCompact && (
          <p className="text-sm font-medium text-gray-400 line-clamp-2 mb-6">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Market Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900 tracking-tighter italic">
                ${parseFloat(product.price).toFixed(2)}
              </span>
            </div>
          </div>
          
          <Link href={`/product/${product.id}`} className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:rotate-12 transition-all group/btn">
            <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
