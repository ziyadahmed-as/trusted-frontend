"use client";

import React from "react";
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
}: StatCardProps) {
  return (
    <div className="rounded-sm border border-[#e2e8f0] bg-white px-7.5 py-6 shadow-sm">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#eff4fb]">
        <Icon className="w-6 h-6 text-[#3c50e0]" />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black">{value}</h4>
          <span className="text-sm font-medium text-[#64748b]">{title}</span>
        </div>

        {trend && (
          <span
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend === "up" ? "text-[#10b981]" : "text-[#d34053]",
            )}
          >
            {trendValue}
            {trend === "up" ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}
