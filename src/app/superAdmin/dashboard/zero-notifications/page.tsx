"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Check,
  Store,
  User,
  Calendar,
  DollarSign,
  Package,
  X,
} from "lucide-react";
import { getPendingSettlements, approveSettlement } from "@/api/orders";
import { PendingSettlementsResponse, PendingStore } from "@/types/settlements";
import { useToast } from "@/hooks/useToast";

const PendingSettlementsPage: React.FC = () => {
  const [data, setData] = useState<PendingSettlementsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<PendingStore | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState<number | null>(null);
  const { showToast } = useToast();

  const loadPendingSettlements = useCallback(async () => {
  try {
    setLoading(true);
    const response = await getPendingSettlements();
    setData(response);
  } catch (error: any) {
    console.error("Error loading pending settlements:", error);
    const errorMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "حدث خطأ أثناء تحميل البيانات";
    showToast(errorMessage, "error");
  } finally {
    setLoading(false);
  }
}, [showToast]); 

// تحميل البيانات
useEffect(() => {
  loadPendingSettlements();
}, [loadPendingSettlements]);

  // عرض التفاصيل
  const handleViewDetails = (store: PendingStore) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  // الموافقة على التصفير
  const handleApproveSettlement = async (storeId: number) => {
    try {
      setApproveLoading(storeId);
      const response = await approveSettlement(storeId);

      if (response?.data?.message) {
        showToast(response.data.message, "success");
      } else if (response?.message) {
        showToast(response.message, "success");
      } else {
        showToast("تم قبول التصفير بنجاح", "success");
      }

      // إعادة تحميل البيانات
      await loadPendingSettlements();
    } catch (error: any) {
      console.error("Error approving settlement:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "حدث خطأ أثناء قبول التصفير";
      showToast(errorMessage, "error");
    } finally {
      setApproveLoading(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.success || data.data.stores.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد تصفيات معلقة
            </h3>
            <p className="text-gray-600">جميع التصفيات تم معالجتها</p>
          </div>
        </div>
      </div>
    );
  }

  const { stores, summary, metadata } = data.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* العنوان والإحصائيات العامة */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            التصفيات المعلقة
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Store className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-blue-600">إجمالي المتاجر</p>
                  <p className="text-xl font-bold text-blue-800">
                    {summary.total_stores}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Package className="text-green-600" size={24} />
                <div>
                  <p className="text-sm text-green-600">إجمالي الطلبات</p>
                  <p className="text-xl font-bold text-green-800">
                    {summary.total_orders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="text-orange-600" size={24} />
                <div>
                  <p className="text-sm text-orange-600">إجمالي المبلغ</p>
                  <p className="text-xl font-bold text-orange-800">
                    {summary.total_amount} {metadata.currency}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-purple-600" size={24} />
                <div>
                  <p className="text-sm text-purple-600">متوسط لكل متجر</p>
                  <p className="text-xl font-bold text-purple-800">
                    {summary.average_amount_per_store} {metadata.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* جدول المتاجر */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    اسم المتجر
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    صاحب المتجر
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    عدد الطلبات
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    إجمالي المبلغ
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    تاريخ الطلب
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stores.map((store) => (
                  <tr
                    key={store.store_info.store_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Store className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {store.store_info.store_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {store.store_info.store_address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="text-gray-400" size={16} />
                        <div>
                          <p className="text-gray-900">
                            {store.store_info.owner.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {store.store_info.owner.whatsapp_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {store.summary.orders_count} طلب
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-semibold text-green-600">
                        {store.summary.total_amount} {metadata.currency}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(store.summary.oldest_request_date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(store)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Eye size={16} />
                          عرض التفاصيل
                        </button>
                        <button
                          onClick={() =>
                            handleApproveSettlement(store.store_info.store_id)
                          }
                          disabled={
                            approveLoading === store.store_info.store_id
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {approveLoading === store.store_info.store_id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Check size={16} />
                          )}
                          قبول التصفير
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal التفاصيل */}
      {isModalOpen && selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  تفاصيل تصفية متجر {selectedStore.store_info.store_name}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* معلومات المتجر */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-3">
                  معلومات المتجر
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-600">اسم المتجر</p>
                    <p className="font-medium">
                      {selectedStore.store_info.store_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">العنوان</p>
                    <p className="font-medium">
                      {selectedStore.store_info.store_address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">اسم المالك</p>
                    <p className="font-medium">
                      {selectedStore.store_info.owner.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">رقم الواتساب</p>
                    <p className="font-medium">
                      {selectedStore.store_info.owner.whatsapp_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* الملخص */}
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold text-green-900 mb-3">
                  ملخص التصفية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-green-600">عدد الطلبات</p>
                    <p className="text-xl font-bold text-green-800">
                      {selectedStore.summary.orders_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">إجمالي المبلغ</p>
                    <p className="text-xl font-bold text-green-800">
                      {selectedStore.summary.total_amount} {metadata.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">متوسط قيمة الطلب</p>
                    <p className="text-xl font-bold text-green-800">
                      {selectedStore.summary.average_order_value}{" "}
                      {metadata.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* تفاصيل الطلبات */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  تفاصيل الطلبات
                </h3>
                <div className="space-y-3">
                  {selectedStore.orders.map((order) => (
                    <div
                      key={order.order_id}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">رقم الطلب</p>
                          <p className="font-medium">#{order.order_id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">قيمة الطلب</p>
                          <p className="font-medium text-green-600">
                            {order.total_price} {metadata.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">تاريخ الإنشاء</p>
                          <p className="font-medium">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            تاريخ طلب التصفية
                          </p>
                          <p className="font-medium">
                            {formatDate(order.settlement_requested_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingSettlementsPage;
