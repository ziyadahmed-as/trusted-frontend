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
  indigo: 'bg-indigo-50 text-indigo-600 shadow-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-600 shadow-emerald-100',
  amber: 'bg-amber-50 text-amber-600 shadow-amber-100',
  rose: 'bg-rose-50 text-rose-600 shadow-rose-100',
};

export function StatCard({ title, value, subValue, icon: Icon, trend, trendValue, color }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110", colorMap[color])}>
          <Icon className="w-7 h-7" />
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-tight",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trendValue}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{value}</h3>
        <p className="text-xs font-semibold text-gray-400">{subValue}</p>
      </div>

      {/* Decorative gradient background element */}
      <div className={cn(
        "absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-10 transition-opacity duration-500 group-hover:opacity-20",
        color === 'indigo' && "bg-indigo-400",
        color === 'emerald' && "bg-emerald-400",
        color === 'amber' && "bg-amber-400",
        color === 'rose' && "bg-rose-400",
      )}></div>
    </motion.div>
  );
}
