"use client";

import React, { useState, useEffect } from 'react';
import StoresPageTemplate from '@/components/templates/StoresPageTemplate';
import { getStores, transformStoreData, Store, APIStore } from '@/api/stores';

// واجهة الإحصائيات
interface Statistics {
  totalStores: number;
  activeStores: number;
  blockedStores: number;
  totalSiteRevenue: number;
}

// واجهة استجابة API
interface StoreResponse {
  stores: APIStore[];
  statistics: Statistics;
}

const StoresPage = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalStores: 0,
    activeStores: 0,
    blockedStores: 0,
    totalSiteRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // دالة جلب البيانات
  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 جلب بيانات المتاجر...');
      const response: StoreResponse = await getStores();
      
      console.log('📦 البيانات المستلمة:', response);
      
      // تحويل البيانات للشكل المطلوب
      const transformedStores = response.stores.map(transformStoreData);
      
      console.log('🔄 البيانات بعد التحويل:', transformedStores);
      
      setStores(transformedStores);
      setStatistics(response.statistics);
      
    } catch (error: any) {
      console.error('❌ خطأ في جلب المتاجر:', error);
      setError(error.message || 'حدث خطأ في جلب البيانات');
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
    await fetchStores();
  };

  // معالجة حالة الخطأ
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-lg font-medium">
          خطأ في تحميل البيانات
        </div>
        <div className="text-gray-600 text-sm text-center max-w-md">
          {error}
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <StoresPageTemplate 
        stores={stores} 
        statistics={statistics}
        loading={loading}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default StoresPage;