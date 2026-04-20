"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RevenueChartProps {
  data: any[];
  dataKey1: string;
  dataKey2?: string;
  color1?: string;
  color2?: string;
  height?: string;
}

export function RevenueChart({
  data,
  dataKey1,
  dataKey2,
  color1 = "#3c50e0",
  color2 = "#10b981",
  height = "310px",
}: RevenueChartProps) {
  return (
    <div
      id="revenue-chart"
      className="w-full min-h-[310px] h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id={`color-${dataKey1}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color1} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color1} stopOpacity={0} />
            </linearGradient>
            {dataKey2 && (
              <linearGradient
                id={`color-${dataKey2}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color2} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color2} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey1}
            stroke={color1}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#color-${dataKey1})`}
            name={dataKey1}
          />
          {dataKey2 && (
            <Area
              type="monotone"
              dataKey={dataKey2}
              stroke={color2}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color-${dataKey2})`}
              name={dataKey2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
