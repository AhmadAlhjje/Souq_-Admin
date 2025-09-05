"use client";
import React from "react";
import { Calendar } from "lucide-react";
import Text from "@/components/atoms/Text";
import { OrdersStats } from "@/components/organisms/OrdersStats";
import { OrderTable } from "@/components/organisms/OrderTable";
import TabsGroup from "@/components/molecules/TabsGroup";

// تعريف TabType محلياً لتجنب التضارب
type TabType = "all" | "shipped" | "unshipped";

interface OrdersPageTemplateProps {
  stats: any;
  orders: any[];
  loading: boolean;
  activeTab: TabType; // تغيير النوع
  onTabChange: (tab: TabType) => void; // تغيير النوع
  onViewOrder: (order: any) => void;
  pagination: any;
  customTabs: any[];
  today: string;
}

export const OrdersPageTemplate: React.FC<OrdersPageTemplateProps> = ({
  stats,
  orders,
  loading,
  activeTab,
  onTabChange,
  onViewOrder,
  pagination,
  customTabs,
  today,
}) => {
  // تحويل النوع عند تمرير activeTab إلى TabsGroup
  const handleTabChange = (tab: any) => {
    onTabChange(tab as TabType);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Text text="إدارة الطلبات" variant="hero" className="text-3xl font-bold text-gray-900 mb-2" />
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 ml-2" />
                <Text text={`طلبات اليوم - ${today}`} variant="subtitle" className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <OrdersStats stats={stats} loading={loading} />

        {/* Tabs */}
        <TabsGroup
          activeTab={activeTab as any} // تحويل النوع مؤقتاً
          onTabChange={handleTabChange} // استخدام الدالة المحولة
          stats={stats}
          isDark={false}
          tabs={customTabs}
        />

        {/* Table */}
        <OrderTable
          orders={orders}
          loading={loading}
          onViewOrder={onViewOrder}
          pagination={pagination}
        />
      </div>
    </div>
  );
};