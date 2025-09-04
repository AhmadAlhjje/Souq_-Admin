"use client";

import React, { useState, useMemo } from 'react';
import { Building2, Check, AlertCircle } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';

// Components
import StatsCard from '@/components/organisms/StoreCard'; // تصحيح الاستيراد
import StoresGrid from '@/components/organisms/StoresGrid';
import StoresTable from '@/components/organisms/StoresTable';
import StoresFilters from '@/components/organisms/StoresFilters';
import Pagination from '@/components/organisms/Pagination';
import StoreDetailsPopup from '@/components/organisms/StoreDetailsPopup';

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
  status: 'active' | 'suspended';
  createdAt: string;
}

interface StoresPageTemplateProps {
  stores: Store[];
  loading?: boolean;
}

const StoresPageTemplate: React.FC<StoresPageTemplateProps> = ({ 
  stores: initialStores, 
  loading = false 
}) => {
  const { isDark } = useThemeContext();
  
  // إدارة حالة المتاجر محلياً
  const [stores, setStores] = useState<Store[]>(initialStores);
  
  // حالة الفلاتر والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // حالة النوافذ المنبثقة
  const [detailsPopup, setDetailsPopup] = useState<{isOpen: boolean, store: Store | null}>({
    isOpen: false,
    store: null
  });
  const [editPopup, setEditPopup] = useState<{isOpen: boolean, store: Store | null}>({
    isOpen: false,
    store: null
  });

  // تحديث البيانات عند تغيير البروب
  React.useEffect(() => {
    setStores(initialStores);
  }, [initialStores]);

  // فلترة البيانات
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || store.category === selectedCategory;
      const matchesStatus = !selectedStatus || store.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [stores, searchTerm, selectedCategory, selectedStatus]);

  // حسابات الصفحات
  const totalItems = filteredStores.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredStores.slice(startIndex, endIndex);

  // إحصائيات
  const stats = useMemo(() => {
    const totalStores = stores.length;
    const activeStores = stores.filter(s => s.status === 'active').length;
    const suspendedStores = stores.filter(s => s.status === 'suspended').length;
    
    return { totalStores, activeStores, suspendedStores };
  }, [stores]);

  // دالة تنسيق العملة
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // معالجات الأحداث المحدثة
  const handleView = (id: string) => {
    const store = stores.find(s => s.id === id);
    if (store) {
      setDetailsPopup({ isOpen: true, store });
    }
  };

  const handleEdit = (id: string) => {
    const store = stores.find(s => s.id === id);
    if (store) {
      setEditPopup({ isOpen: true, store });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المتجر؟')) {
      setStores(prev => prev.filter(s => s.id !== id));
    }
  };

  // معالجات الأحداث الجديدة
  const handleBan = (id: string) => {
    if (confirm('هل أنت متأكد من حظر هذا المتجر؟')) {
      setStores(prev => prev.map(s => 
        s.id === id ? { ...s, status: 'suspended' as const } : s
      ));
    }
  };

  const handleUnban = (id: string) => {
    if (confirm('هل أنت متأكد من إلغاء حظر هذا المتجر؟')) {
      setStores(prev => prev.map(s => 
        s.id === id ? { ...s, status: 'active' as const } : s
      ));
    }
  };

  const handleCreateInvoice = (id: string) => {
    const store = stores.find(s => s.id === id);
    alert(`إنشاء فاتورة للمتجر: ${store?.name} - هذه الميزة قيد التطوير`);
  };

  const handleSaveStore = (updatedStore: Store) => {
    setStores(prev => prev.map(s => 
      s.id === updatedStore.id ? updatedStore : s
    ));
    setEditPopup({ isOpen: false, store: null });
  };

  // معالجات الفلاتر
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (field: string, value: string) => {
    if (field === 'category') setSelectedCategory(value);
    if (field === 'status') setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            جميع المتاجر والتجار
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            إدارة ومراقبة جميع المتاجر المسجلة في المنصة
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="إجمالي المتاجر"
          value={stats.totalStores}
          icon={Building2}
          color="blue"
          loading={loading}
        />
        <StatsCard
          title="المتاجر النشطة"
          value={stats.activeStores}
          icon={Check}
          color="green"
          loading={loading}
        />
        <StatsCard
          title="المتاجر المحظورة"
          value={stats.suspendedStores}
          icon={AlertCircle}
          color="yellow"
          loading={loading}
        />
      </div>

      {/* Filters */}
      <StoresFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        viewMode={viewMode}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onViewModeChange={setViewMode}
        loading={loading}
      />

      {/* Content */}
      <div className="space-y-4">
        {viewMode === 'grid' ? (
          <StoresGrid
            stores={currentData}
            loading={loading}
            formatCurrency={formatCurrency}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBan={handleBan}
            onUnban={handleUnban}
            onCreateInvoice={handleCreateInvoice}
          />
        ) : (
          <StoresTable
            stores={currentData}
            loading={loading}
            formatCurrency={formatCurrency}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBan={handleBan}
            onUnban={handleUnban}
            onCreateInvoice={handleCreateInvoice}
          />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          endIndex={endIndex}
          searchTerm={searchTerm}
          totalData={stores.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Store Details Popup */}
      <StoreDetailsPopup
        store={detailsPopup.store}
        isOpen={detailsPopup.isOpen}
        onClose={() => setDetailsPopup({ isOpen: false, store: null })}
        formatCurrency={formatCurrency}
      />

    </div>
  );
};

export default StoresPageTemplate;