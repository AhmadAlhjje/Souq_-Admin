"use client";

import React from "react";
import { Building2, ExternalLink, Star, Mail, Phone } from "lucide-react";
import {
  DeleteButton,
  ViewButton,
  BanButton,
  UnbanButton,
  CreateInvoiceButton,
} from "@/components/common/ActionButtons";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import GenericTable from "@/components/common/GenericTable";
import { TableAction, TableColumn } from "@/types/table";
import { StoreEntity, StoresTableProps } from "@/types/store";

const StoresTable: React.FC<StoresTableProps> = ({
  stores,
  loading,
  formatCurrency,
  onView,
  onEdit,
  onDelete,
  onBan,
  onUnban,
  onCreateInvoice,
}) => {
  // Helper functions
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getStatusVariant = (status: StoreEntity["status"]) => {
    switch (status) {
      case "active":
        return "new";
      case "suspended":
        return "sale";
      default:
        return "default";
    }
  };

  const getStatusText = (status: StoreEntity["status"]) => {
    switch (status) {
      case "active":
        return "نشط";
      case "suspended":
        return "محظور";
      default:
        return "غير محدد";
    }
  };

  // تعريف الأعمدة
  const columns: TableColumn<StoreEntity>[] = [
    {
      key: "name",
      title: "المتجر",
      align: "right",
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.owner.avatar}
            alt={record.name}
            size="md"
            initials={
              !record.owner.avatar ? getInitials(record.name) : undefined
            }
          />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {record.category}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{record.rating}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "owner.name",
      title: "التاجر",
      align: "right",
      render: (value, record) => (
        <div>
          <div className="font-medium mb-1">{record.owner.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1 mb-1">
              <Mail className="w-3 h-3" />
              <span>{record.owner.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{record.owner.phone}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "website",
      title: "الموقع الإلكتروني",
      align: "center",
      render: (value, record) =>
        record.website ? (
          <a
            href={record.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">زيارة الموقع</span>
          </a>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            غير متوفر
          </span>
        ),
    },
    {
      key: "totalSales",
      title: "إجمالي المبيعات",
      align: "center",
      render: (value, record) => (
        <div>
          <div className="font-semibold text-lg">
            {formatCurrency(record.totalSales)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            طلب {record.totalOrders}
          </div>
        </div>
      ),
    },
    {
      key: "monthlySales",
      title: "مبيعات الشهر",
      align: "center",
      render: (value, record) => (
        <div>
          <div className="font-semibold">
            {formatCurrency(record.monthlySales)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            هذا الشهر
          </div>
        </div>
      ),
    },
    {
      key: "status",
      title: "الحالة",
      align: "center",
      render: (value, record) => (
        <Badge
          variant={getStatusVariant(record.status)}
          text={getStatusText(record.status)}
        />
      ),
    },
  ];

  // تعريف الإجراءات
  const actions: TableAction<StoreEntity>[] = [
    {
      key: "view",
      render: (record) => (
        <ViewButton
          size="sm"
          onClick={() => onView(record.id)}
          tooltip="عرض تفاصيل المتجر"
        />
      ),
    },
    {
      key: "ban-unban",
      render: (record) =>
        record.status === "active" ? (
          <BanButton
            size="sm"
            onClick={() => onBan(record.id)}
            tooltip="حظر المتجر"
          />
        ) : (
          <UnbanButton
            size="sm"
            onClick={() => onUnban(record.id)}
            tooltip="إلغاء حظر المتجر"
          />
        ),
    },
    {
      key: "invoice",
      render: (record) => (
        <CreateInvoiceButton
          size="sm"
          onClick={() => onCreateInvoice(record.id)}
          tooltip="إنشاء فاتورة"
        />
      ),
    },
    {
      key: "delete",
      render: (record) => (
        <DeleteButton
          size="sm"
          onClick={() => onDelete(record.id)}
          tooltip="حذف المتجر"
        />
      ),
    },
  ];

  // حالة فارغة مخصصة
  const emptyState = {
    icon: (
      <Building2 className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
    ),
    title: "لا توجد متاجر",
    description: "لا توجد متاجر مطابقة للبحث والفلاتر المحددة",
  };

  return (
    <GenericTable<StoreEntity>
      columns={columns}
      data={stores}
      loading={loading}
      emptyState={emptyState}
      actions={actions}
      rowKey="id"
      onRowClick={(store) => onView(store.id)}
      size="md"
    />
  );
};

export default StoresTable;
