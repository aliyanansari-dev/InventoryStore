"use server";

import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export interface DashboardMetrics {
  totalRevenueToday: number;
  totalProducts: number;
  lowStockCount: number;
  totalSalesToday: number;
  revenueChangePercent?: number;
  salesChangePercent?: number;
  chartData: {
    date: string;
    day: string;
    sales: number;
    orders: number;
  }[];
  recentOrders: any[];
}

export async function getDashboardMetrics(): Promise<{
  success: boolean;
  data?: DashboardMetrics;
  error?: string;
}> {
  try {
    await connectToDatabase();
    void User;
    void Product;

    // Start of Today in local time
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 1. Total Products
    const totalProducts = await Product.countDocuments({});

    // 2. Low Stock Alerts (stock <= lowStockThreshold)
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    });

    // 3. Orders Today
    const todayOrders = await Order.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
      status: "completed",
    }).lean();

    const totalSalesToday = todayOrders.length;
    const totalRevenueToday = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    // 4. 7-day Sales Chart Data
    const chartData = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const dayOrders = await Order.find({
        createdAt: { $gte: dayStart, $lte: dayEnd },
        status: "completed",
      }).lean();

      const daySales = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

      const dayFormatted = `${d.getMonth() + 1}/${d.getDate()}`;
      const dayName = daysOfWeek[d.getDay()];

      chartData.push({
        date: dayFormatted,
        day: dayName,
        sales: Math.round(daySales * 100) / 100,
        orders: dayOrders.length,
      });
    }

    // 5. Recent Transactions (last 5)
    const recentOrders = await Order.find({ status: "completed" })
      .populate("cashierId", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return {
      success: true,
      data: {
        totalRevenueToday: Math.round(totalRevenueToday * 100) / 100,
        totalProducts,
        lowStockCount,
        totalSalesToday,
        chartData,
        recentOrders: JSON.parse(JSON.stringify(recentOrders)),
      },
    };
  } catch (error: any) {
    console.error("Error fetching dashboard metrics:", error);
    return { success: false, error: error.message || "Failed to load dashboard metrics" };
  }
}
