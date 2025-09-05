"use client";
import React from "react";
import { Package, Truck, Clock } from "lucide-react";
import StatsCard from "@/components/molecules/StatsCard";

interface OrderStats {
  totalOrders: number;
  shippedOrders: number;
  unshippedOrders: number;
  totalShippedPrice: number;
  totalUnshippedPrice: number;
}

interface OrdersStatsProps {
  stats: OrderStats;
  loading?: boolean;
}

export const OrdersStats: React.FC<OrdersStatsProps> = ({
  stats,
  loading = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="إجمالي الطلبات"
        value={stats.totalOrders}
        icon={Package}
        color="blue"
        loading={loading}
      />
      <StatsCard
        title="الطلبات المشحونة"
        value={stats.shippedOrders}
        icon={Truck}
        color="green"
        loading={loading}
      />
      <StatsCard
        title="الطلبات غير المشحونة"
        value={stats.unshippedOrders}
        icon={Clock}
        color="red"
        loading={loading}
      />
    </div>
  );
};