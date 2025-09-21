"use client";

import React from "react";
import {
  X,
  Star,
  Phone,
  MapPin,
  Calendar,
  Building2,
  TrendingUp,
  Package,
  Users,
  MessageCircle,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import useTheme from "@/hooks/useTheme";

interface Store {
  id: string;
  name: string;
  category: string;
  owner: {
    name: string;
    phone: string;
    avatar?: string;
  };
  address: string;
  description: string;
  images: string[];
  logo?: string;
  rating: number;
  totalSales: number;
  monthlySales: number;
  totalOrders: number;
  reviewsCount: number;
  status: "active" | "suspended";
  createdAt: string;
}

interface StoreDetailsPopupProps {
  store: Store | null;
  isOpen: boolean;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
}

const StoreDetailsPopup: React.FC<StoreDetailsPopupProps> = ({
  store,
  isOpen,
  onClose,
  formatCurrency,
}) => {
  const { isDark } = useTheme();

  if (!isOpen || !store) return null;

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // حساب متوسط قيمة الطلب
  const averageOrderValue = store.totalOrders > 0 ? store.totalSales / store.totalOrders : 0;

  // حساب النمو الشهري
  const monthlyGrowthRate = store.totalSales > 0 
    ? ((store.monthlySales / (store.totalSales - store.monthlySales)) * 100) 
    : 0;

  // فتح رقم الواتساب
  const openWhatsApp = (phone: string) => {
    // إزالة الرموز غير المرغوب فيها من رقم الهاتف
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full max-w-5xl rounded-lg shadow-xl transition-all ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-6 border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              تفاصيل المتجر
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Store Header */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="flex items-start gap-4">
                <Avatar
                  src={store.logo || store.owner.avatar}
                  alt={store.name}
                  size="xl"
                  initials={!store.logo && !store.owner.avatar ? getInitials(store.name) : undefined}
                />
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <h3
                        className={`text-3xl font-bold mb-2 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {store.name}
                      </h3>
                      <p
                        className={`text-xl mb-3 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {store.category}
                      </p>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-6 h-6 text-yellow-400 fill-current" />
                          <span className="text-xl font-bold">
                            {store.rating.toFixed(1)}
                          </span>
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            ({store.reviewsCount} تقييم)
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={getStatusVariant(store.status)}
                      text={getStatusText(store.status)}
                      className="text-base px-4 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div
                className={`p-4 rounded-lg border text-center ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-[#CFF7EE]"
                }`}
                style={{ backgroundColor: isDark ? "#1f2937" : "#CFF7EE" }}
              >
                <TrendingUp
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "#004D5A" }}
                />
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#004D5A" }}
                >
                  {formatCurrency(store.totalSales)}
                </div>
                <div className="text-sm" style={{ color: "#004D5A" }}>
                  إجمالي المبيعات
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border text-center ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-[#CFF7EE]"
                }`}
                style={{ backgroundColor: isDark ? "#1f2937" : "#CFF7EE" }}
              >
                <Package
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "#004D5A" }}
                />
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#004D5A" }}
                >
                  {store.totalOrders.toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: "#004D5A" }}>
                  إجمالي الطلبات
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border text-center ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-[#CFF7EE]"
                }`}
                style={{ backgroundColor: isDark ? "#1f2937" : "#CFF7EE" }}
              >
                <Users
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "#004D5A" }}
                />
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#004D5A" }}
                >
                  {formatCurrency(store.monthlySales)}
                </div>
                <div className="text-sm" style={{ color: "#004D5A" }}>
                  مبيعات هذا الشهر
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border text-center ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-[#CFF7EE]"
                }`}
                style={{ backgroundColor: isDark ? "#1f2937" : "#CFF7EE" }}
              >
                <TrendingUp
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "#004D5A" }}
                />
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#004D5A" }}
                >
                  {formatCurrency(averageOrderValue)}
                </div>
                <div className="text-sm" style={{ color: "#004D5A" }}>
                  متوسط قيمة الطلب
                </div>
              </div>
            </div>

            {/* Store Description */}
            {store.description && (
              <div
                className={`p-6 rounded-lg border mb-6 ${
                  isDark
                    ? "bg-gray-700/50 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h4
                  className={`text-xl font-semibold mb-3 flex items-center gap-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  وصف المتجر
                </h4>
                <p
                  className={`text-lg leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {store.description}
                </p>
              </div>
            )}

            {/* Store Images */}
            {store.images && store.images.length > 0 && (
              <div
                className={`p-6 rounded-lg border mb-6 ${
                  isDark
                    ? "bg-gray-700/50 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h4
                  className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  صور المتجر ({store.images.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {store.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                        isDark ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${store.name} - صورة ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onClick={() => window.open(image, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Information */}
            <div
              className={`p-6 rounded-lg border mb-6 ${
                isDark
                  ? "bg-gray-700/50 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <h4
                className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <Users className="w-5 h-5" />
                معلومات التاجر
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2
                      className={`w-5 h-5 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        اسم التاجر
                      </p>
                      <p
                        className={`font-medium ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {store.owner.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin
                      className={`w-5 h-5 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        عنوان المتجر
                      </p>
                      <p
                        className={`font-medium ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {store.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone
                      className={`w-5 h-5 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        رقم الهاتف
                      </p>
                      <button
                        onClick={() => openWhatsApp(store.owner.phone)}
                        className="text-teal-600 hover:text-teal-700 transition-colors font-medium flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {store.owner.phone}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar
                      className={`w-5 h-5 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        تاريخ الانضمام
                      </p>
                      <p
                        className={`font-medium ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {formatDate(store.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className={`p-6 rounded-lg border ${
                  isDark
                    ? "bg-gray-700/50 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h4
                  className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  إحصائيات إضافية
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      معرف المتجر:
                    </span>
                    <span
                      className={`font-mono text-sm ${
                        isDark ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      #{store.id}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`p-6 rounded-lg border ${
                  isDark
                    ? "bg-gray-700/50 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h4
                  className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  نسب الأداء
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      التقييم من 5:
                    </span>
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {store.rating.toFixed(1)} ⭐
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`flex justify-end gap-3 p-6 border-t ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {/* <button
              onClick={() => openWhatsApp(store.owner.phone)}
              className={`px-6 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                isDark
                  ? "border-teal-600 text-teal-400 hover:bg-teal-600 hover:text-white"
                  : "border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              تواصل عبر واتساب
            </button> */}
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg border transition-colors ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsPopup;