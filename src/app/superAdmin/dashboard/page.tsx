"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
} from "lucide-react";
import useTheme from "@/hooks/useTheme";

// Atomic Design Components
import AdminButton from "@/components/atoms/admin/AdminButton";
import AdminSkeleton from "@/components/atoms/admin/AdminSkeleton";
import AdminDashboardStats from "@/components/organisms/admin/AdminDashboardStats";
import AdminRecentOrderItem from "@/components/molecules/admin/AdminRecentOrderItem";

// Types
import { DashboardStats } from "@/types/admin";
import { getDashboardStats, getRecentOrders } from "@/api/auth";
import SalesChart from "@/components/molecules/admin/SalesChart";

// Add interface for order type
interface RecentOrder {
  id: number;
  timeAgo: string;
  amount: number;
  status:
    | "pending"
    | "completed"
    | "cancelled"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "monitored";
  storeName: string;
}

const AdminDashboardPage = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]); // إضافة state للطلبات الكاملة
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats
        const statsResponse = await getDashboardStats();
        const statsData = statsResponse.data;

        // Fetch recent orders
        const ordersResponse = await getRecentOrders();
        // The API returns array directly, not in data property
        const ordersData = Array.isArray(ordersResponse)
          ? ordersResponse
          : (ordersResponse.data || []);

        // حفظ جميع الطلبات للمخطط
        setAllOrders(ordersData);

        // Transform stats data to match component structure
        setStats({
          totalRevenue: parseFloat(statsData.revenue.total),
          totalOrders: statsData.orders.total,
          totalProducts: statsData.products.total,
          totalCustomers: statsData.customers.total,
          revenueChange: parseFloat(statsData.revenue.monthly) > 0 ? 12.5 : 0,
          ordersChange:
            statsData.orders.pending > statsData.orders.cancelled ? 8.2 : -2.1,
          productsChange: statsData.products.lowStock > 0 ? -2.1 : 5.3,
          customersChange: statsData.customers.newThisMonth > 0 ? 15.3 : 0,
          topProducts: [],
          recentOrders: [],
          salesData: [],
        });

        // Transform orders data with proper typing - فقط أول 4 للعرض
        const formattedOrders: RecentOrder[] = ordersData.slice(0, 4).map((order: any) => ({
          id: order.order_id,
          timeAgo: formatTimeAgo(order.created_at),
          amount: parseFloat(order.total_price),
          status: order.status,
          storeName: order.Store?.store_name || "متجر غير معروف",
        }));

        setRecentOrders(formattedOrders);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        setError("حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "منذ أقل من ساعة";
    if (diffInHours === 1) return "منذ ساعة";
    if (diffInHours < 24) return `منذ ${diffInHours} ساعات`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "منذ يوم";
    return `منذ ${diffInDays} أيام`;
  };

  const handleOrderClick = (orderId: number) => {
    console.log(`Navigate to order ${orderId}`);
    // Add navigation logic here
  };

  const handleQuickAction = (href: string) => {
    console.log(`Navigate to ${href}`);
    // Add navigation logic here
  };

  const handleRetry = () => {
    setError(null);
    // Re-trigger useEffect
    window.location.reload();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div
          className={`text-center p-6 rounded-lg ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-red-200"
          } border`}
        >
          <p
            className={`text-lg mb-4 ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            {error}
          </p>
          <AdminButton onClick={handleRetry} variant="primary" size="md">
            إعادة المحاولة
          </AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-[#004D5A]"
            }`}
          >
            لوحة التحكم
          </h1>
          <p className={`mt-1 ${isDark ? "text-gray-400" : "text-[#666666]"}`}>
            مرحباً بك في لوحة تحكم متجرك
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AdminDashboardStats stats={stats} loading={loading} />
      </motion.div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`
            lg:col-span-2 p-6 rounded-xl border
            ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-[#96EDD9]"
            }
          `}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-[#004D5A]"
              }`}
            >
              تطور المبيعات
            </h3>
          </div>

          {/* تمرير جميع الطلبات للمخطط وليس فقط 4 طلبات */}
          <SalesChart
            ordersStats={{ allOrders: { orders: allOrders } }}
            loading={loading}
          />
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`
            p-6 rounded-xl border
            ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-[#96EDD9]"
            }
          `}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-[#004D5A]"
              }`}
            >
              أحدث الطلبات
            </h3>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }, (_, i) => (
                <AdminSkeleton key={i} variant="rectangle" height={60} />
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <AdminRecentOrderItem
                  key={order.id}
                  orderNumber={`طلب #${order.id}`}
                  timeAgo={order.timeAgo}
                  amount={order.amount}
                  status={order.status}
                  storeName={order.storeName}
                  onClick={() => handleOrderClick(order.id)}
                />
              ))
            ) : (
              <div
                className={`text-center py-8 ${
                  isDark ? "text-gray-400" : "text-[#666666]"
                }`}
              >
                <p>لا توجد طلبات حديثة</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;