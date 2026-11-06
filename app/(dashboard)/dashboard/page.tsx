import React from "react";
import { getDashboardMetrics } from "@/lib/actions/dashboard";
import { Header } from "@/components/shared/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentSalesTable } from "@/components/dashboard/recent-sales-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  Package,
  AlertOctagon,
  ShoppingBag,
  TrendingUp,
  Receipt,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const result = await getDashboardMetrics();
  const metrics = result.data || {
    totalRevenueToday: 0,
    totalProducts: 0,
    lowStockCount: 0,
    totalSalesToday: 0,
    chartData: [],
    recentOrders: [],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Store Analytics & Overview"
        description="Real-time daily operations, sales performance, and inventory health"
      />

      <div className="p-8 space-y-8">
        {/* Bento-box 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Revenue (Today) */}
          <StatCard
            title="Total Revenue (Today)"
            value={formatCurrency(metrics.totalRevenueToday)}
            subtitle="Gross POS sales today"
            icon={DollarSign}
            trend="Live"
            trendType="positive"
            accentColor="emerald"
          />

          {/* Card 2: Total Products */}
          <StatCard
            title="Total Products"
            value={metrics.totalProducts}
            subtitle="Catalog inventory items"
            icon={Package}
            trend="Active"
            trendType="neutral"
            accentColor="blue"
          />

          {/* Card 3: Low Stock Alerts */}
          <StatCard
            title="Low Stock Alerts"
            value={metrics.lowStockCount}
            subtitle={
              metrics.lowStockCount > 0
                ? "Items require restocking"
                : "Healthy inventory levels"
            }
            icon={AlertOctagon}
            trend={metrics.lowStockCount > 0 ? "Alert (<10)" : "Good"}
            trendType={metrics.lowStockCount > 0 ? "danger" : "positive"}
            accentColor="red"
          />

          {/* Card 4: Total Sales (Today) */}
          <StatCard
            title="Total Sales (Today)"
            value={`${metrics.totalSalesToday} orders`}
            subtitle="Completed transactions"
            icon={ShoppingBag}
            trend="Today"
            trendType="positive"
            accentColor="purple"
          />
        </div>

        {/* Middle Section: 7-day Sales Chart & Quick POS Launcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sales Line Chart (8 cols) */}
          <Card className="lg:col-span-8 border-white/[0.08] bg-[#131B2E]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  7-Day Sales Trend
                </CardTitle>
                <CardDescription>
                  Revenue volume tracking across the last 7 calendar days
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  Daily Revenue
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <SalesChart data={metrics.chartData} />
            </CardContent>
          </Card>

          {/* POS Quick Launch & Health Card (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Card className="border-white/[0.08] bg-gradient-to-br from-[#16233d] to-[#131B2E] p-6 flex flex-col justify-between flex-1">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Receipt className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Point of Sale Terminal
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Start a new customer transaction, scan barcodes, auto-calculate tax, and generate instant printable receipts.
                </p>
              </div>

              <div className="pt-6">
                <Link href="/pos">
                  <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40">
                    <span>Open POS Terminal</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            <div className="p-4 rounded-xl bg-[#131B2E] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-medium text-slate-300">
                  Mongoose Database Connected
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">27017/minimart</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Transactions Table */}
        <Card className="border-white/[0.08] bg-[#131B2E]">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4 text-blue-400" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Last 5 completed sales processed through the terminal
              </CardDescription>
            </div>
            <Link href="/sales">
              <Button variant="outline" size="sm" className="text-xs border-white/10 hover:bg-white/5">
                View All Sales History
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <RecentSalesTable orders={metrics.recentOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
