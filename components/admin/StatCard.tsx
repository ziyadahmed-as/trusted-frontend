"use client";

import React from "react";
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  color?: "indigo" | "emerald" | "amber" | "rose" | "blue";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "indigo",
}: StatCardProps) {
  const colorMap = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col gap-6 group transition-all"
    >
      <div className="flex items-center justify-between">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:rotate-6",
          colorMap[color]
        )}>
          <Icon className="w-7 h-7" />
        </div>
        {trend && (
          <div className={cn(
            "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1",
            trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trend === "up" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-3xl font-black text-gray-900 tracking-tighter italic">
          {value}
        </h4>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          {title}
        </p>
      </div>

      <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "70%" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            color === "indigo" ? "bg-indigo-600" : 
            color === "emerald" ? "bg-emerald-600" :
            color === "amber" ? "bg-amber-600" :
            "bg-rose-600"
          )}
        />
      </div>
    </motion.div>
  );
}
