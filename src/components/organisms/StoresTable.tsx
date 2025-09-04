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
import useTheme from "@/hooks/useTheme";

interface Store {
  id: string;
  name: string;
  category: string;
  owner: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  website?: string;
  rating: number;
  totalSales: number;
  monthlySales: number;
  totalOrders: number;
  status: "active" | "suspended";
  createdAt: string;
}

interface StoresTableProps {
  stores: Store[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  // المعالجات الجديدة
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
  onCreateInvoice: (id: string) => void;
}

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
  const { isDark } = useTheme();

  const tableContainerClasses = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-[#96EDD9]";

  const tableHeaderClasses = isDark ? "bg-gray-700" : "bg-[#CFF7EE]";

  const headerTextClasses = isDark ? "text-gray-200" : "text-[#004D5A]";

  const rowHoverClasses = isDark ? "hover:bg-gray-700" : "hover:bg-gray-50";

  const textClasses = isDark ? "text-gray-200" : "text-[#004D5A]";

  const secondaryTextClasses = isDark ? "text-gray-400" : "text-gray-500";

  const skeletonClasses = isDark ? "bg-gray-700" : "bg-gray-200";

  const emptyStateClasses = {
    container: isDark
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-[#96EDD9]",
    icon: isDark ? "text-gray-500" : "text-gray-400",
    title: isDark ? "text-gray-300" : "text-gray-600",
    description: isDark ? "text-gray-400" : "text-gray-500",
  };

  const getStatusVariant = (status: Store["status"]) => {
    switch (status) {
      case "active":
        return "new";
      case "suspended":
        return "sale";
      default:
        return "default";
    }
  };

  const getStatusText = (status: Store["status"]) => {
    switch (status) {
      case "active":
        return "نشط";
      case "suspended":
        return "محظور";
      default:
        return "غير محدد";
    }
  };

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div
        className={`${tableContainerClasses} rounded-lg border shadow-sm overflow-hidden transition-colors duration-200`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={`${tableHeaderClasses} transition-colors duration-200`}
            >
              <tr>
                <th
                  className={`py-4 px-4 text-right ${headerTextClasses} font-semibold transition-colors duration-200`}
                >
                  المتجر
                </th>
                <th
                  className={`py-4 px-4 text-right ${headerTextClasses} font-semibold transition-colors duration-200`}
                >
                  التاجر
                </th>
                <th
                  className={`py-4 px-4 text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
                >
                  الموقع الإلكتروني
                </th>
                <th
                  className={`py-4 px-4 text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
                >
                  إجمالي المبيعات
                </th>
                <th
                  className={`py-4 px-4 text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
                >
                  مبيعات الشهر
                </th>
                <th
                  className={`py-4 px-4 text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
                >
                  الحالة
                </th>
                <th
                  className={`py-4 px-4 text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 animate-pulse transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 ${skeletonClasses} rounded-lg`}
                      />
                      <div>
                        <div
                          className={`h-4 ${skeletonClasses} rounded w-32 mb-2`}
                        />
                        <div
                          className={`h-3 ${skeletonClasses} rounded w-20`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className={`h-4 ${skeletonClasses} rounded w-24 mb-2`}
                    />
                    <div className={`h-3 ${skeletonClasses} rounded w-32`} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div
                      className={`h-4 ${skeletonClasses} rounded w-20 mx-auto`}
                    />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div
                      className={`h-4 ${skeletonClasses} rounded w-16 mx-auto`}
                    />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div
                      className={`h-4 ${skeletonClasses} rounded w-16 mx-auto`}
                    />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div
                      className={`h-6 ${skeletonClasses} rounded w-20 mx-auto`}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-7 h-7 ${skeletonClasses} rounded`}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div
        className={`${emptyStateClasses.container} rounded-lg border shadow-sm p-12 text-center transition-colors duration-200`}
      >
        <Building2
          className={`w-16 h-16 ${emptyStateClasses.icon} mx-auto mb-4 transition-colors duration-200`}
        />
        <h3
          className={`text-lg font-semibold ${emptyStateClasses.title} mb-2 transition-colors duration-200`}
        >
          لا توجد متاجر
        </h3>
        <p
          className={`${emptyStateClasses.description} transition-colors duration-200`}
        >
          لا توجد متاجر مطابقة للبحث والفلاتر المحددة
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border overflow-hidden ${tableContainerClasses} transition-colors duration-200`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className={`${tableHeaderClasses} transition-colors duration-200`}
          >
            <tr>
              <th
                className={`py-4 px-4 text-right ${headerTextClasses} font-semibold transition-colors duration-200`}
              >
                المتجر
              </th>
              <th
                className={`py-4 px-4 text-right ${headerTextClasses} font-semibold transition-colors duration-200`}
              >
                التاجر
              </th>
              <th
                className={`py-4 px-4 text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
              >
                الموقع الإلكتروني
              </th>
              <th
                className={`py-4 px-4 text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
              >
                إجمالي المبيعات
              </th>
              <th
                className={`py-4 px-4 text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
              >
                مبيعات الشهر
              </th>
              <th
                className={`py-4 px-4 text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
              >
                الحالة
              </th>
              <th
                className={`py-4 px-4 text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
              >
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDark ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            {stores.map((store) => (
              <tr
                key={store.id}
                className={`${rowHoverClasses} transition-colors duration-200`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={store.owner.avatar}
                      alt={store.name}
                      size="md"
                      initials={
                        !store.owner.avatar
                          ? getInitials(store.name)
                          : undefined
                      }
                    />
                    <div>
                      <div
                        className={`font-medium ${textClasses} transition-colors duration-200`}
                      >
                        {store.name}
                      </div>
                      <div
                        className={`text-sm ${secondaryTextClasses} transition-colors duration-200`}
                      >
                        {store.category}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">
                          {store.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div
                      className={`font-medium mb-1 ${textClasses} transition-colors duration-200`}
                    >
                      {store.owner.name}
                    </div>
                    <div
                      className={`text-sm ${secondaryTextClasses} transition-colors duration-200`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Mail className="w-3 h-3" />
                        <span>{store.owner.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{store.owner.phone}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  {store.website ? (
                    <a
                      href={store.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">زيارة الموقع</span>
                    </a>
                  ) : (
                    <span
                      className={`text-sm ${secondaryTextClasses} transition-colors duration-200`}
                    >
                      غير متوفر
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-center">
                  <div>
                    <div
                      className={`font-semibold text-lg ${textClasses} transition-colors duration-200`}
                    >
                      {formatCurrency(store.totalSales)}
                    </div>
                    <div
                      className={`text-sm ${secondaryTextClasses} transition-colors duration-200`}
                    >
                      طلب {store.totalOrders}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div>
                    <div
                      className={`font-semibold ${textClasses} transition-colors duration-200`}
                    >
                      {formatCurrency(store.monthlySales)}
                    </div>
                    <div
                      className={`text-sm ${secondaryTextClasses} transition-colors duration-200`}
                    >
                      هذا الشهر
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <Badge
                    variant={getStatusVariant(store.status)}
                    text={getStatusText(store.status)}
                  />
                </td>
                <td className="py-4 px-4">
                  {/* الأزرار محدثة مع المعالجات الجديدة */}
                  <div className="flex items-center justify-center gap-1">
                    {/* أزرار العرض والتعديل */}
                    <ViewButton
                      size="sm"
                      onClick={() => onView(store.id)}
                      tooltip="عرض تفاصيل المتجر"
                    />

                    {/* زر الحظر/إلغاء الحظر حسب الحالة */}
                    {store.status === "active" ? (
                      <BanButton
                        size="sm"
                        onClick={() => onBan(store.id)}
                        tooltip="حظر المتجر"
                      />
                    ) : (
                      <UnbanButton
                        size="sm"
                        onClick={() => onUnban(store.id)}
                        tooltip="إلغاء حظر المتجر"
                      />
                    )}

                    {/* زر إنشاء فاتورة */}
                    <CreateInvoiceButton
                      size="sm"
                      onClick={() => onCreateInvoice(store.id)}
                      tooltip="إنشاء فاتورة"
                    />

                    {/* زر الحذف */}
                    <DeleteButton
                      size="sm"
                      onClick={() => onDelete(store.id)}
                      tooltip="حذف المتجر"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoresTable;
