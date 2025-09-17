"use client";

import React, { useState, useEffect, useCallback } from "react";
import StoresPageTemplate from "@/components/templates/StoresPageTemplate";
import {
  getStores,
  deleteStore,
  toggleStoreStatus,
  transformStoreData,
  Store,
} from "@/api/stores";
import { StoreResponse } from "@/types/store";
import { useToast } from "@/hooks/useToast";
import * as XLSX from 'xlsx'; // مكتبة لإنشاء ملفات Excel
import { getStoreOrdersStats } from "@/api/orders";

// واجهة الإحصائيات
interface Statistics {
  totalStores: number;
  activeStores: number;
  blockedStores: number;
  totalSiteRevenue: number;
}

// واجهة بيانات الطلب
interface OrderData {
  order_id: number;
  purchase_id: string;
  total_price: string;
  status: string;
  settlement_status: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  shipping_method: string;
  shipping_status: string;
  product_names: string;
  quantities: string;
  tracking_number?: string;
}

const StoresPage = () => {
  // استخدام نظام Toast المخصص
  const { showToast } = useToast();

  // حالات البيانات الأساسية
  const [stores, setStores] = useState<Store[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalStores: 0,
    activeStores: 0,
    blockedStores: 0,
    totalSiteRevenue: 0,
  });

  // حالات التحميل والأخطاء
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // دالة جلب البيانات من API
  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 جلب بيانات المتاجر...");

      const response: StoreResponse = await getStores();

      console.log("📦 البيانات المستلمة:", response);

      // تحويل البيانات للشكل المطلوب للواجهة
      const transformedStores = response.stores.map(transformStoreData);

      console.log("🔄 البيانات بعد التحويل:", transformedStores);

      // تحديث الحالات
      setStores(transformedStores);
      setStatistics(response.statistics);

      console.log("✅ تم تحديث البيانات بنجاح");
    } catch (error: any) {
      console.error("❌ خطأ في جلب المتاجر:", error);
      const errorMessage = error.message || "حدث خطأ في جلب البيانات";
      setError(errorMessage);
      showToast("فشل في تحميل بيانات المتاجر", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // تحميل البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // دالة إعادة تحميل البيانات
  const handleRefresh = async () => {
    console.log("🔄 إعادة تحميل البيانات...");
    await fetchStores();
    if (!error) {
      showToast("تم تحديث البيانات بنجاح", "success");
    }
  };

  // دالة عرض تفاصيل المتجر
  const handleView = (storeId: string) => {
    console.log("👁️ عرض تفاصيل المتجر:", storeId);
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      console.log("📋 بيانات المتجر:", store);
      // يتم التعامل مع فتح النافذة المنبثقة داخل Template
    }
  };

  // دالة تعديل المتجر
  const handleEdit = (storeId: string) => {
    console.log("✏️ تعديل المتجر:", storeId);
    const store = stores.find((s) => s.id === storeId);

    if (store) {
      // يمكن إضافة منطق فتح modal التعديل أو التنقل لصفحة التعديل
      showToast(`تعديل متجر "${store.name}" - ميزة قيد التطوير`, "info");
    }
  };

  // دالة حذف المتجر
  const handleDelete = async (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) {
      showToast("لم يتم العثور على المتجر", "error");
      return;
    }

    // تأكيد الحذف
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف متجر "${store.name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه وسيؤدي إلى حذف جميع بيانات المتجر نهائياً.`
    );

    if (!confirmed) return;

    try {
      console.log("🗑️ بدء حذف المتجر:", storeId);

      // تعيين حالة التحميل للمتجر المحدد
      setActionLoading(storeId);

      // استدعاء API لحذف المتجر
      await deleteStore(storeId);

      // إزالة المتجر من القائمة المحلية
      setStores((prevStores) => {
        const updatedStores = prevStores.filter((s) => s.id !== storeId);
        console.log("📊 المتاجر بعد الحذف:", updatedStores.length);
        return updatedStores;
      });

      // تحديث الإحصائيات
      setStatistics((prevStats) => ({
        ...prevStats,
        totalStores: prevStats.totalStores - 1,
        activeStores:
          store.status === "active"
            ? prevStats.activeStores - 1
            : prevStats.activeStores,
        blockedStores:
          store.status === "suspended"
            ? prevStats.blockedStores - 1
            : prevStats.blockedStores,
        totalSiteRevenue: prevStats.totalSiteRevenue - store.totalSales,
      }));

      console.log("✅ تم حذف المتجر بنجاح");
      showToast(`تم حذف متجر "${store.name}" بنجاح`, "success");
    } catch (error: any) {
      console.error("❌ خطأ في حذف المتجر:", error);
      const errorMessage = error.message || "فشل في حذف المتجر";
      showToast(errorMessage, "error");
    } finally {
      // إزالة حالة التحميل
      setActionLoading(null);
    }
  };

  // دالة حظر المتجر
  const handleBan = async (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) {
      showToast("لم يتم العثور على المتجر", "error");
      return;
    }

    // تأكيد الحظر
    const confirmed = window.confirm(
      `هل أنت متأكد من حظر متجر "${store.name}"؟\n\nسيتم منع المتجر من الوصول إلى النظام مؤقتاً.`
    );

    if (!confirmed) return;

    try {
      console.log("🚫 بدء حظر المتجر:", storeId);

      // تعيين حالة التحميل
      setActionLoading(storeId);

      // استدعاء API لتبديل حالة المتجر
      const updatedStore = await toggleStoreStatus(storeId);

      // تحديث حالة المتجر في القائمة المحلية
      setStores((prevStores) =>
        prevStores.map((s) =>
          s.id === storeId ? { ...s, status: "suspended" as const } : s
        )
      );

      // تحديث الإحصائيات
      setStatistics((prevStats) => ({
        ...prevStats,
        activeStores: prevStats.activeStores - 1,
        blockedStores: prevStats.blockedStores + 1,
      }));

      console.log("✅ تم حظر المتجر بنجاح");
      showToast(`تم حظر متجر "${store.name}" بنجاح`, "success");
    } catch (error: any) {
      console.error("❌ خطأ في حظر المتجر:", error);
      const errorMessage = error.message || "فشل في حظر المتجر";
      showToast(errorMessage, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // دالة إلغاء حظر المتجر
  const handleUnban = async (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) {
      showToast("لم يتم العثور على المتجر", "error");
      return;
    }

    // تأكيد إلغاء الحظر
    const confirmed = window.confirm(
      `هل أنت متأكد من إلغاء حظر متجر "${store.name}"؟\n\nسيتم السماح للمتجر بالوصول إلى النظام مرة أخرى.`
    );

    if (!confirmed) return;

    try {
      console.log("✅ بدء إلغاء حظر المتجر:", storeId);

      // تعيين حالة التحميل
      setActionLoading(storeId);

      // استدعاء API لتبديل حالة المتجر
      const updatedStore = await toggleStoreStatus(storeId);

      // تحديث حالة المتجر في القائمة المحلية
      setStores((prevStores) =>
        prevStores.map((s) =>
          s.id === storeId ? { ...s, status: "active" as const } : s
        )
      );

      // تحديث الإحصائيات
      setStatistics((prevStats) => ({
        ...prevStats,
        activeStores: prevStats.activeStores + 1,
        blockedStores: prevStats.blockedStores - 1,
      }));

      console.log("✅ تم إلغاء حظر المتجر بنجاح");
      showToast(`تم إلغاء حظر متجر "${store.name}" بنجاح`, "success");
    } catch (error: any) {
      console.error("❌ خطأ في إلغاء حظر المتجر:", error);
      const errorMessage = error.message || "فشل في إلغاء حظر المتجر";
      showToast(errorMessage, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // دالة تحويل بيانات الطلب للفاتورة المحسّنة
  const transformOrderForInvoice = (order: any): OrderData => {
    // جمع أسماء المنتجات والكميات
    const productNames = order.OrderItems?.map((item: any) => item.Product?.name || 'غير محدد').join(', ') || 'غير محدد';
    const quantities = order.OrderItems?.map((item: any) => item.quantity).join(', ') || '0';

    return {
      order_id: order.order_id,
      purchase_id: order.purchase_id,
      total_price: order.total_price,
      status: order.status,
      settlement_status: order.settlement_status,
      created_at: new Date(order.created_at).toLocaleString('ar-SA'),
      customer_name: order.Shipping?.customer_name || 'غير محدد',
      customer_phone: order.Shipping?.customer_phone || 'غير محدد',
      shipping_address: order.Shipping?.shipping_address || 'غير محدد',
      shipping_method: order.Shipping?.shipping_method || 'غير محدد',
      shipping_status: order.Shipping?.shipping_status || 'غير محدد',
      product_names: productNames,
      quantities: quantities,
      tracking_number: order.Shipping?.tracking_number || 'غير محدد',
    };
  };

  // دالة إنشاء فاتورة Excel محسّنة
  const handleCreateInvoice = async (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) {
      showToast("لم يتم العثور على المتجر", "error");
      return;
    }

    try {
      console.log("📄 بدء إنشاء فاتورة للمتجر:", storeId);
      
      // تعيين حالة التحميل
      setActionLoading(storeId);
      
      showToast("جاري تحضير الفاتورة...", "info");

      // جلب بيانات الطلبات والإحصائيات
      const storeOrdersData = await getStoreOrdersStats(parseInt(storeId));
      
      console.log("📊 بيانات طلبات المتجر:", storeOrdersData);

      // تصنيف الطلبات حسب settlement_status
      const settledOrders = storeOrdersData.allOrders.orders.filter((order: any) => order.settlement_status === 'settled');
      const settlementRequestedOrders = storeOrdersData.allOrders.orders.filter((order: any) => order.settlement_status === 'settlement_requested');
      const notSettledOrders = storeOrdersData.allOrders.orders.filter((order: any) => order.settlement_status === 'not_settled');

      // حساب الإحصائيات لكل تصنيف
      const settledRevenue = settledOrders.reduce((sum: number, order: any) => sum + parseFloat(order.total_price), 0);
      const settlementRequestedRevenue = settlementRequestedOrders.reduce((sum: number, order: any) => sum + parseFloat(order.total_price), 0);
      const notSettledRevenue = notSettledOrders.reduce((sum: number, order: any) => sum + parseFloat(order.total_price), 0);

      // إنشاء workbook جديد
      const wb = XLSX.utils.book_new();

      // إعداد معلومات أساسية عن المتجر مع الإحصائيات المحسّنة
      const storeInfo = [
        ['معلومات المتجر', ''],
        ['اسم المتجر', storeOrdersData.storeName],
        ['رقم المتجر', storeId],
        ['عنوان المتجر', store.address || 'غير محدد'],
        ['تاريخ إنشاء الفاتورة', new Date().toLocaleString('ar-SA')],
        ['', ''],
        ['الإحصائيات العامة', ''],
        ['إجمالي الطلبات', storeOrdersData.statistics.totalOrders],
        ['إجمالي الإيرادات', `${storeOrdersData.statistics.totalRevenue.toFixed(2)} ر.س`],
        ['متوسط قيمة الطلب', `${storeOrdersData.statistics.averageOrderValue.toFixed(2)} ر.س`],
        ['', ''],
        ['تصنيف الطلبات حسب حالة التسوية', ''],
        ['الطلبات المسوّاة (Settled)', settledOrders.length],
        ['إيرادات الطلبات المسوّاة', `${settledRevenue.toFixed(2)} ر.س`],
        ['الطلبات المطلوبة التسوية (Settlement Requested)', settlementRequestedOrders.length],
        ['إيرادات الطلبات المطلوبة التسوية', `${settlementRequestedRevenue.toFixed(2)} ر.س`],
        ['الطلبات غير المسوّاة (Not Settled)', notSettledOrders.length],
        ['إيرادات الطلبات غير المسوّاة', `${notSettledRevenue.toFixed(2)} ر.س`],
        ['', ''],
        ['تصنيف الطلبات حسب حالة الشحن', ''],
        ['الطلبات المشحونة', storeOrdersData.statistics.shippedCount],
        ['إيرادات الطلبات المشحونة', `${storeOrdersData.statistics.shippedRevenue.toFixed(2)} ر.س`],
        ['الطلبات غير المشحونة', storeOrdersData.statistics.unshippedCount],
        ['إيرادات الطلبات غير المشحونة', `${storeOrdersData.statistics.unshippedRevenue.toFixed(2)} ر.س`],
        ['الطلبات المرصودة', storeOrdersData.statistics.monitoredCount],
        ['إيرادات الطلبات المرصودة', `${storeOrdersData.statistics.monitoredRevenue.toFixed(2)} ر.س`],
      ];

      // إضافة sheet معلومات المتجر
      const storeInfoWS = XLSX.utils.aoa_to_sheet(storeInfo);
      XLSX.utils.book_append_sheet(wb, storeInfoWS, 'معلومات المتجر');

      // تعريف العناوين المحسّنة
      const enhancedHeaders = [
        'رقم الطلب',
        'معرف الشراء',
        'إجمالي المبلغ (ر.س)',
        'حالة الطلب',
        'حالة التسوية',
        'تاريخ الإنشاء',
        'اسم العميل',
        'هاتف العميل',
        'عنوان الشحن',
        'طريقة الشحن',
        'حالة الشحن',
        'رقم التتبع',
        'المنتجات',
        'الكميات',
        'نوع التصنيف'
      ];

      // دالة مساعدة لإنشاء sheet للطلبات مع تصنيف محسّن
      const createEnhancedOrdersSheet = (orders: any[], sheetName: string, classification: string) => {
        if (!orders || orders.length === 0) {
          const emptyData = [['لا توجد طلبات في هذا القسم']];
          return XLSX.utils.aoa_to_sheet(emptyData);
        }

        const transformedOrders = orders.map(transformOrderForInvoice);
        
        const data = [
          enhancedHeaders,
          ...transformedOrders.map(order => [
            order.order_id,
            order.purchase_id,
            `${parseFloat(order.total_price).toFixed(2)}`,
            order.status,
            order.settlement_status,
            order.created_at,
            order.customer_name,
            order.customer_phone,
            order.shipping_address,
            order.shipping_method,
            order.shipping_status,
            order.tracking_number,
            order.product_names,
            order.quantities,
            classification // إضافة تصنيف إضافي
          ])
        ];

        return XLSX.utils.aoa_to_sheet(data);
      };

      // إضافة sheets للطلبات حسب حالة التسوية
      const settledOrdersWS = createEnhancedOrdersSheet(settledOrders, 'الطلبات المسوّاة', 'مسوّاة');
      XLSX.utils.book_append_sheet(wb, settledOrdersWS, 'الطلبات المسوّاة');

      const settlementRequestedOrdersWS = createEnhancedOrdersSheet(settlementRequestedOrders, 'الطلبات المطلوبة التسوية', 'مطلوبة التسوية');
      XLSX.utils.book_append_sheet(wb, settlementRequestedOrdersWS, 'الطلبات المطلوبة التسوية');

      const notSettledOrdersWS = createEnhancedOrdersSheet(notSettledOrders, 'الطلبات غير المسوّاة', 'غير مسوّاة');
      XLSX.utils.book_append_sheet(wb, notSettledOrdersWS, 'الطلبات غير المسوّاة');

      // إضافة sheets للطلبات حسب حالة الشحن (الطرق الأصلية)
      const shippedOrdersWS = createEnhancedOrdersSheet(storeOrdersData.shippedOrders.orders, 'الطلبات المشحونة', 'مشحونة');
      XLSX.utils.book_append_sheet(wb, shippedOrdersWS, 'الطلبات المشحونة');

      const unshippedOrdersWS = createEnhancedOrdersSheet(storeOrdersData.unshippedOrders.orders, 'الطلبات غير المشحونة', 'غير مشحونة');
      XLSX.utils.book_append_sheet(wb, unshippedOrdersWS, 'الطلبات غير المشحونة');

      const monitoredOrdersWS = createEnhancedOrdersSheet(storeOrdersData.monitoredOrders.orders, 'الطلبات المرصودة', 'مرصودة');
      XLSX.utils.book_append_sheet(wb, monitoredOrdersWS, 'الطلبات المرصودة');

      // إضافة sheet موحد لجميع الطلبات مع تصنيف شامل
      const createUnifiedOrdersSheet = () => {
        const allOrdersWithClassification = storeOrdersData.allOrders.orders.map((order: any) => ({
          ...transformOrderForInvoice(order),
          settlement_classification: order.settlement_status === 'settled' ? 'مسوّاة' : 
                                     order.settlement_status === 'settlement_requested' ? 'مطلوبة التسوية' : 'غير مسوّاة',
          shipping_classification: order.status === 'shipped' ? 'مشحونة' : 
                                  order.status === 'pending' ? 'غير مشحونة' : 'مرصودة'
        }));

        const unifiedHeaders = [
          ...enhancedHeaders,
          'تصنيف التسوية',
          'تصنيف الشحن'
        ];

        const data = [
          unifiedHeaders,
          ...allOrdersWithClassification.map((order:any) => [
            order.order_id,
            order.purchase_id,
            `${parseFloat(order.total_price).toFixed(2)}`,
            order.status,
            order.settlement_status,
            order.created_at,
            order.customer_name,
            order.customer_phone,
            order.shipping_address,
            order.shipping_method,
            order.shipping_status,
            order.tracking_number,
            order.product_names,
            order.quantities,
            'شامل', // التصنيف العام
            order.settlement_classification,
            order.shipping_classification
          ])
        ];

        return XLSX.utils.aoa_to_sheet(data);
      };

      const unifiedOrdersWS = createUnifiedOrdersSheet();
      XLSX.utils.book_append_sheet(wb, unifiedOrdersWS, 'التقرير الشامل');

      // تنسيق اسم الملف
      const fileName = `فاتورة_شاملة_${storeOrdersData.storeName.replace(/[^\w\s]/gi, '')}_${new Date().toISOString().split('T')[0]}.xlsx`;

      // تحميل الملف
      XLSX.writeFile(wb, fileName);

      console.log("✅ تم إنشاء الفاتورة المحسّنة بنجاح");
      showToast(`تم إنشاء فاتورة شاملة لمتجر "${store.name}" وتحميلها بنجاح`, "success");

    } catch (error: any) {
      console.error("❌ خطأ في إنشاء الفاتورة:", error);
      const errorMessage = error.message || "فشل في إنشاء الفاتورة";
      showToast(errorMessage, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // معالجة حالة الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          {/* أيقونة الخطأ */}
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>

          {/* رسالة الخطأ */}
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              خطأ في تحميل البيانات
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>

            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                إعادة المحاولة
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200"
              >
                إعادة تحميل الصفحة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // عرض الصفحة الرئيسية
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <StoresPageTemplate
          stores={stores}
          statistics={statistics}
          loading={loading}
          actionLoading={actionLoading}
          onRefresh={handleRefresh}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBan={handleBan}
          onUnban={handleUnban}
          onCreateInvoice={handleCreateInvoice}
        />
      </div>
    </div>
  );
};

export default StoresPage;