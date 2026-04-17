'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: LucideIcon;
  trend: 'up' | 'down';
  trendValue: string;
  color: 'indigo' | 'emerald' | 'amber' | 'rose';
}

const colorMap = {
  indigo: 'bg-indigo-50/80 text-indigo-600 shadow-indigo-100/50 border-indigo-100/50',
  emerald: 'bg-emerald-50/80 text-emerald-600 shadow-emerald-100/50 border-emerald-100/50',
  amber: 'bg-amber-50/80 text-amber-600 shadow-amber-100/50 border-amber-100/50',
  rose: 'bg-rose-50/80 text-rose-600 shadow-rose-100/50 border-rose-100/50',
};

export function StatCard({ title, value, subValue, icon: Icon, trend, trendValue, color }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white p-8 rounded-[3rem] border border-gray-100/80 shadow-[0_15px_45px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={cn(
          "w-16 h-16 rounded-[1.75rem] border flex items-center justify-center transition-all duration-700 group-hover:rotate-[10deg] shadow-lg", 
          colorMap[color]
        )}>
          <Icon className="w-8 h-8" />
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {trendValue}
        </div>
      </div>
      
      <div className="space-y-2 relative z-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
        <div className="flex items-baseline gap-2">
           <h3 className="text-5xl font-black text-gray-900 tracking-tighter tabular-nums drop-shadow-sm">{value}</h3>
        </div>
        <p className="text-xs font-bold text-gray-400 tracking-tight">{subValue}</p>
      </div>

      {/* Modern ambient glow background */}
      <div className={cn(
        "absolute -right-12 -bottom-12 w-56 h-56 rounded-full blur-[80px] opacity-20 transition-opacity duration-700 group-hover:opacity-40",
        color === 'indigo' && "bg-indigo-300",
        color === 'emerald' && "bg-emerald-300",
        color === 'amber' && "bg-amber-300",
        color === 'rose' && "bg-rose-300",
      )}></div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700 bg-grid-dot"></div>
    </motion.div>
  );
}
