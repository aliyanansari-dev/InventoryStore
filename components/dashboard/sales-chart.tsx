"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ChartItem {
  date: string;
  day: string;
  sales: number;
  orders: number;
}

interface SalesChartProps {
  data: ChartItem[];
}

export function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-500 text-sm">
        No sales data available for the past 7 days.
      </div>
    );
  }

  return (
    <div className="h-80 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as ChartItem;
                return (
                  <div className="rounded-xl border border-white/10 bg-[#131B2E] p-3 shadow-xl text-xs">
                    <p className="font-semibold text-white mb-1.5 flex items-center justify-between gap-4">
                      <span>{item.day}</span>
                      <span className="text-slate-400 font-mono">{item.date}</span>
                    </p>
                    <div className="space-y-1">
                      <p className="text-emerald-400 font-mono font-medium flex items-center justify-between gap-3">
                        <span className="text-slate-400 font-sans">Revenue:</span>
                        <span>{formatCurrency(item.sales)}</span>
                      </p>
                      <p className="text-blue-400 font-mono font-medium flex items-center justify-between gap-3">
                        <span className="text-slate-400 font-sans">Orders:</span>
                        <span>{item.orders} txns</span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#10B981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#emeraldGradient)"
            activeDot={{ r: 6, fill: "#10B981", stroke: "#0A0F1C", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
