"use client";
import React, { useState, useMemo } from "react";
import { Package, CheckCircle, Clock } from "lucide-react";
import { OrdersPageTemplate } from "@/components/templates/OrdersPageTemplate";
import { OrderDetailsModal } from "@/components/organisms/OrderDetailsModal";
import { Order, OrderStats, TabType } from "@/types/orders";


// Mock data generator
const generateTodayOrders = (): Order[] => {
  const today = new Intl.DateTimeFormat("ar-SA").format(new Date());

  return [
    {
      id: "1",
      customerName: "أحمد محمد",
      productImage: "📦",
      status: "pending",
      orderNumber: "#1001",
      price: 250.0,
      quantity: 2,
      category: "غير مشحون",
      orderDate: today,
      customerPhone: "+966501234567",
      customerAddress: "الرياض، حي النرجس، شارع الملك عبدالعزيز",
      products: [
        {
          id: "1",
          name: "جهاز لابتوب Dell",
          image: "💻",
          quantity: 1,
          price: 200.0,
          totalPrice: 200.0,
        },
        {
          id: "2",
          name: "ماوس لاسلكي",
          image: "🖱️",
          quantity: 1,
          price: 50.0,
          totalPrice: 50.0,
        },
      ],
    },
    {
      id: "2",
      customerName: "فاطمة السعد",
      productImage: "📦",
      status: "active",
      orderNumber: "#1002",
      price: 180.5,
      quantity: 3,
      category: "مشحون",
      orderDate: today,
      customerPhone: "+966507654321",
      customerAddress: "جدة، حي الزهراء، طريق الملك فهد",
      products: [
        {
          id: "3",
          name: "كتاب تعلم البرمجة",
          image: "📚",
          quantity: 3,
          price: 60.17,
          totalPrice: 180.5,
        },
      ],
    },
    // يمكنك إضافة المزيد من البيانات هنا...
  ];
};

const OrdersPage: React.FC = () => {
  const [orders] = useState<Order[]>(generateTodayOrders());
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const today = new Intl.DateTimeFormat("ar-SA-u-ca-gregory").format(new Date());

  // Calculate statistics
  const stats: OrderStats = useMemo(() => {
    return {
      totalOrders: orders.length,
      shippedOrders: orders.filter((order: Order) => order.category === "مشحون").length,
      unshippedOrders: orders.filter((order: Order) => order.category === "غير مشحون").length,
      totalShippedPrice: orders
        .filter((order: Order) => order.category === "مشحون")
        .reduce((sum: number, order: Order) => sum + order.price, 0),
      totalUnshippedPrice: orders
        .filter((order: Order) => order.category === "غير مشحون")
        .reduce((sum: number, order: Order) => sum + order.price, 0),
    };
  }, [orders]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Filter orders based on active tab
  const filteredOrders = useMemo(() => {
    return orders.filter((order: Order) => {
      switch (activeTab) {
        case "shipped":
          return order.category === "مشحون";
        case "unshipped":
          return order.category === "غير مشحون";
        default:
          return true;
      }
    });
  }, [orders, activeTab]);

  // Apply pagination
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Pagination info
  const paginationInfo = useMemo(() => {
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      totalData: orders.length,
    };
  }, [filteredOrders.length, currentPage, itemsPerPage, orders.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleViewOrder = (order: Order): void => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Custom tabs configuration
  const customTabs = [
    {
      id: "all" as TabType,
      label: "كل الطلبات",
      icon: Package,
      count: stats.totalOrders,
    },
    {
      id: "shipped" as TabType,
      label: "الطلبات المشحونة",
      icon: CheckCircle,
      count: stats.shippedOrders,
    },
    {
      id: "unshipped" as TabType,
      label: "الطلبات غير المشحونة",
      icon: Clock,
      count: stats.unshippedOrders,
    },
  ];

  const pagination = {
    enabled: true,
    currentPage,
    totalPages: paginationInfo.totalPages,
    totalItems: paginationInfo.totalItems,
    itemsPerPage,
    startIndex: paginationInfo.startIndex,
    endIndex: paginationInfo.endIndex,
    totalData: paginationInfo.totalData,
    onPageChange: handlePageChange,
    onItemsPerPageChange: handleItemsPerPageChange,
  };

  return (
    <>
      <OrdersPageTemplate
        stats={stats}
        orders={paginatedOrders}
        loading={loading}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onViewOrder={handleViewOrder}
        pagination={pagination}
        customTabs={customTabs}
        today={today}
      />

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default OrdersPage;