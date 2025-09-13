"use client";

import React, { useState, useEffect } from 'react';
import StoresPageTemplate from '@/components/templates/StoresPageTemplate';
import { 
  getStores, 
  deleteStore, 
  toggleStoreStatus,
  transformStoreData, 
  Store, 
} from '@/api/stores';
import { StoreResponse } from '@/types/store';
import { useToast } from '@/hooks/useToast';

// واجهة الإحصائيات
interface Statistics {
  totalStores: number;
  activeStores: number;
  blockedStores: number;
  totalSiteRevenue: number;
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
    totalSiteRevenue: 0
  });
  
  // حالات التحميل والأخطاء
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // دالة جلب البيانات من API
  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 جلب بيانات المتاجر...');
      
      const response: StoreResponse = await getStores();
      
      console.log('📦 البيانات المستلمة:', response);
      
      // تحويل البيانات للشكل المطلوب للواجهة
      const transformedStores = response.stores.map(transformStoreData);
      
      console.log('🔄 البيانات بعد التحويل:', transformedStores);
      
      // تحديث الحالات
      setStores(transformedStores);
      setStatistics(response.statistics);
      
      console.log('✅ تم تحديث البيانات بنجاح');
      
    } catch (error: any) {
      console.error('❌ خطأ في جلب المتاجر:', error);
      const errorMessage = error.message || 'حدث خطأ في جلب البيانات';
      setError(errorMessage);
      showToast('فشل في تحميل بيانات المتاجر', 'error');
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchStores();
  }, []);

  // دالة إعادة تحميل البيانات
  const handleRefresh = async () => {
    console.log('🔄 إعادة تحميل البيانات...');
    await fetchStores();
    if (!error) {
      showToast('تم تحديث البيانات بنجاح', 'success');
    }
  };

  // دالة عرض تفاصيل المتجر
  const handleView = (storeId: string) => {
    console.log('👁️ عرض تفاصيل المتجر:', storeId);
    const store = stores.find(s => s.id === storeId);
    if (store) {
      console.log('📋 بيانات المتجر:', store);
      // يتم التعامل مع فتح النافذة المنبثقة داخل Template
    }
  };

  // دالة تعديل المتجر
  const handleEdit = (storeId: string) => {
    console.log('✏️ تعديل المتجر:', storeId);
    const store = stores.find(s => s.id === storeId);
    
    if (store) {
      // يمكن إضافة منطق فتح modal التعديل أو التنقل لصفحة التعديل
      showToast(`تعديل متجر "${store.name}" - ميزة قيد التطوير`, 'info');
    }
  };

  // دالة حذف المتجر
  const handleDelete = async (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (!store) {
      showToast('لم يتم العثور على المتجر', 'error');
      return;
    }

    // تأكيد الحذف
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف متجر "${store.name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه وسيؤدي إلى حذف جميع بيانات المتجر نهائياً.`
    );

    if (!confirmed) return;

    try {
      console.log('🗑️ بدء حذف المتجر:', storeId);
      
      // تعيين حالة التحميل للمتجر المحدد
      setActionLoading(storeId);
      
      // استدعاء API لحذف المتجر
      await deleteStore(storeId);
      
      // إزالة المتجر من القائمة المحلية
      setStores(prevStores => {
        const updatedStores = prevStores.filter(s => s.id !== storeId);
        console.log('📊 المتاجر بعد الحذف:', updatedStores.length);
        return updatedStores;
      });
      
      // تحديث الإحصائيات
      setStatistics(prevStats => ({
        ...prevStats,
        totalStores: prevStats.totalStores - 1,
        activeStores: store.status === 'active' ? prevStats.activeStores - 1 : prevStats.activeStores,
        blockedStores: store.status === 'suspended' ? prevStats.blockedStores - 1 : prevStats.blockedStores,
        totalSiteRevenue: prevStats.totalSiteRevenue - store.totalSales
      }));
      
      console.log('✅ تم حذف المتجر بنجاح');
      showToast(`تم حذف متجر "${store.name}" بنجاح`, 'success');
      
    } catch (error: any) {
      console.error('❌ خطأ في حذف المتجر:', error);
      const errorMessage = error.message || 'فشل في حذف المتجر';
      showToast(errorMessage, 'error');
    } finally {
      // إزالة حالة التحميل
      setActionLoading(null);
    }
  };

  // دالة حظر المتجر
  const handleBan = async (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (!store) {
      showToast('لم يتم العثور على المتجر', 'error');
      return;
    }

    // تأكيد الحظر
    const confirmed = window.confirm(
      `هل أنت متأكد من حظر متجر "${store.name}"؟\n\nسيتم منع المتجر من الوصول إلى النظام مؤقتاً.`
    );

    if (!confirmed) return;

    try {
      console.log('🚫 بدء حظر المتجر:', storeId);
      
      // تعيين حالة التحميل
      setActionLoading(storeId);
      
      // استدعاء API لتبديل حالة المتجر
      const updatedStore = await toggleStoreStatus(storeId);
      
      // تحديث حالة المتجر في القائمة المحلية
      setStores(prevStores => 
        prevStores.map(s => 
          s.id === storeId 
            ? { ...s, status: 'suspended' as const }
            : s
        )
      );
      
      // تحديث الإحصائيات
      setStatistics(prevStats => ({
        ...prevStats,
        activeStores: prevStats.activeStores - 1,
        blockedStores: prevStats.blockedStores + 1
      }));
      
      console.log('✅ تم حظر المتجر بنجاح');
      showToast(`تم حظر متجر "${store.name}" بنجاح`, 'success');
      
    } catch (error: any) {
      console.error('❌ خطأ في حظر المتجر:', error);
      const errorMessage = error.message || 'فشل في حظر المتجر';
      showToast(errorMessage, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // دالة إلغاء حظر المتجر
  const handleUnban = async (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (!store) {
      showToast('لم يتم العثور على المتجر', 'error');
      return;
    }

    // تأكيد إلغاء الحظر
    const confirmed = window.confirm(
      `هل أنت متأكد من إلغاء حظر متجر "${store.name}"؟\n\nسيتم السماح للمتجر بالوصول إلى النظام مرة أخرى.`
    );

    if (!confirmed) return;

    try {
      console.log('✅ بدء إلغاء حظر المتجر:', storeId);
      
      // تعيين حالة التحميل
      setActionLoading(storeId);
      
      // استدعاء API لتبديل حالة المتجر
      const updatedStore = await toggleStoreStatus(storeId);
      
      // تحديث حالة المتجر في القائمة المحلية
      setStores(prevStores => 
        prevStores.map(s => 
          s.id === storeId 
            ? { ...s, status: 'active' as const }
            : s
        )
      );
      
      // تحديث الإحصائيات
      setStatistics(prevStats => ({
        ...prevStats,
        activeStores: prevStats.activeStores + 1,
        blockedStores: prevStats.blockedStores - 1
      }));
      
      console.log('✅ تم إلغاء حظر المتجر بنجاح');
      showToast(`تم إلغاء حظر متجر "${store.name}" بنجاح`, 'success');
      
    } catch (error: any) {
      console.error('❌ خطأ في إلغاء حظر المتجر:', error);
      const errorMessage = error.message || 'فشل في إلغاء حظر المتجر';
      showToast(errorMessage, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // دالة إنشاء فاتورة
  const handleCreateInvoice = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (!store) {
      showToast('لم يتم العثور على المتجر', 'error');
      return;
    }
    
    console.log('📄 إنشاء فاتورة للمتجر:', storeId);
    
    // يمكن إضافة منطق إنشاء الفاتورة هنا
    showToast(`إنشاء فاتورة لمتجر "${store.name}" - ميزة قيد التطوير`, 'info');
  };

  // معالجة حالة الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          {/* أيقونة الخطأ */}
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          
          {/* رسالة الخطأ */}
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              خطأ في تحميل البيانات
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            
            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
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