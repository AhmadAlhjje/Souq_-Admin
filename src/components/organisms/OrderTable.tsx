"use client";
import React from "react";
import GenericTable from "@/components/common/GenericTable";
import { TableAction, TableColumn } from "@/types/table";
import { ViewButton } from "@/components/common/ActionButtons";
import { OrderHeader } from "@/components/molecules/OrderHeader";
import { CustomerInfoDisplay } from "@/components/molecules/CustomerInfoDisplay";
import { OrderStatusBadge } from "@/components/molecules/OrderStatusBadge";
import Text from "@/components/atoms/Text";
import { Package } from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  productImage: string;
  status: "active" | "pending";
  orderNumber: string;
  price: number;
  quantity: number;
  category: string;
  orderDate: string;
  customerPhone: string;
  customerAddress: string;
  products: any[];
}

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  onViewOrder: (order: Order) => void;
  pagination?: any;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  loading,
  onViewOrder,
  pagination,
}) => {
  const columns: TableColumn<Order>[] = [
    {
      key: "orderNumber",
      title: "رقم الطلب",
      width: "150px",
      align: "right",
      render: (value, record) => (
        <OrderHeader 
          orderNumber={record.orderNumber} 
          orderDate={record.orderDate} 
        />
      ),
    },
    {
      key: "customerName",
      title: "العميل",
      width: "200px",
      align: "right",
      render: (value, record) => (
        <CustomerInfoDisplay 
          name={record.customerName} 
          phone={record.customerPhone} 
        />
      ),
    },
    {
      key: "category",
      title: "الحالة",
      width: "150px",
      align: "center",
      render: (value) => <OrderStatusBadge status={value} />,
    },
    {
      key: "quantity",
      title: "الكمية",
      width: "100px",
      align: "center",
    },
    {
      key: "price",
      title: "المبلغ",
      width: "120px",
      align: "center",
      render: (value) => (
        <Text text={`${value.toFixed(2)} ر.س`} variant="subtitle" className="font-medium text-gray-900" />
      ),
    },
  ];

  const actions: TableAction<Order>[] = [
    {
      key: "view",
      render: (record) => (
        <ViewButton
          onClick={() => onViewOrder(record)}
          text="التفاصيل"
          tooltip="عرض تفاصيل الطلب"
        />
      ),
    },
  ];

  const emptyState = {
    icon: <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
    title: "لا توجد طلبات",
    description: "لا توجد طلبات تطابق البحث أو الفلتر المحدد",
  };

  return (
    <GenericTable<Order>
      columns={columns}
      data={orders}
      loading={loading}
      emptyState={emptyState}
      actions={actions}
      rowKey="id"
      onRowClick={onViewOrder}
      size="md"
      className="mt-6"
      pagination={pagination}
    />
  );
};