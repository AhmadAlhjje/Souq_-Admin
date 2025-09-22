"use client";

import React, { useState, useMemo } from 'react';
import { Building2, Check, AlertCircle, DollarSign, RefreshCw } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';

// Components
import StatsCard from '@/components/organisms/StoreCard'; 
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
  address: string;
  description: string;
  images: string[];
  website?: string;
  rating: number;
  totalSales: number;
  monthlySales: number;
  totalOrders: number;
  reviewsCount: number;
  status: 'active' | 'suspended';
  createdAt: string;
}

interface Statistics {
  totalStores: number;
  activeStores: number;
  blockedStores: number;
  totalSiteRevenue: number;
}

interface StoresPageTemplateProps {
  stores: Store[];
  statistics: Statistics;
  loading?: boolean;
  actionLoading?: string | null;
  onRefresh?: () => Promise<void>;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
  onCreateInvoice: (id: string) => void;
}

const StoresPageTemplate: React.FC<StoresPageTemplateProps> = ({ 
  stores: initialStores, 
  statistics,
  loading = false,
  actionLoading = null,
  onRefresh,
  onView,
  onEdit,
  onDelete,
  onBan,
  onUnban,
  onCreateInvoice
}) => {
  const { isDark } = useThemeContext();
  
  // إدارة حالة المتاجر محلياً للفلترة فقط
  const [stores] = useState<Store[]>(initialStores);
  
  // حالة الفلاتر والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [refreshing, setRefreshing] = useState(false);

  // حالة النوافذ المنبثقة
  const [detailsPopup, setDetailsPopup] = useState<{isOpen: boolean, store: Store | null}>({
    isOpen: false,
    store: null
  });

  // استخدام البيانات المرسلة من الصفحة الرئيسية
  const currentStores = initialStores;

  // فلترة البيانات
  const filteredStores = useMemo(() => {
    return currentStores.filter(store => {
      const matchesSearch = 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || store.category === selectedCategory;
      const matchesStatus = !selectedStatus || store.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [currentStores, searchTerm, selectedCategory, selectedStatus]);

  // حسابات الصفحات
  const totalItems = filteredStores.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredStores.slice(startIndex, endIndex);

  // دالة تنسيق العملة
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // معالجات الأحداث مع حالة التحميل
  const handleViewWithLoading = (id: string) => {
    if (actionLoading === id) return;
    const store = currentStores.find(s => s.id === id);
    if (store) {
      setDetailsPopup({ isOpen: true, store });
    }
  };

  const handleEditWithLoading = (id: string) => {
    if (actionLoading === id) return;
    onEdit(id);
  };

  const handleDeleteWithLoading = (id: string) => {
    if (actionLoading === id) return;
    onDelete(id);
  };

  const handleBanWithLoading = (id: string) => {
    if (actionLoading === id) return;
    onBan(id);
  };

  const handleUnbanWithLoading = (id: string) => {
    if (actionLoading === id) return;
    onUnban(id);
  };

  const handleCreateInvoiceWithLoading = (id: string) => {
    if (actionLoading === id) return;
    onCreateInvoice(id);
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

  // دالة إعادة التحميل
  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('خطأ في إعادة التحميل:', error);
      } finally {
        setRefreshing(false);
      }
    }
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
          value={statistics.totalStores}
          icon={Building2}
          color="blue"
          loading={loading}
        />
        <StatsCard
          title="المتاجر النشطة"
          value={statistics.activeStores}
          icon={Check}
          color="green"
          loading={loading}
        />
        <StatsCard
          title="المتاجر المحظورة"
          value={statistics.blockedStores}
          icon={AlertCircle}
          color="yellow"
          loading={loading}
        />
        <StatsCard
          title="إجمالي المبيعات"
          value={statistics.totalSiteRevenue}
          icon={DollarSign}
          color="blue"
          loading={loading}
          formatValue={formatCurrency}
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
            onView={handleViewWithLoading}
            onEdit={handleEditWithLoading}
            onDelete={handleDeleteWithLoading}
            onBan={handleBanWithLoading}
            onUnban={handleUnbanWithLoading}
            onCreateInvoice={handleCreateInvoiceWithLoading}
          />
        ) : (
          <StoresTable
            stores={currentData}
            loading={loading}
            formatCurrency={formatCurrency}
            onView={handleViewWithLoading}
            onEdit={handleEditWithLoading}
            onDelete={handleDeleteWithLoading}
            onBan={handleBanWithLoading}
            onUnban={handleUnbanWithLoading}
            onCreateInvoice={handleCreateInvoiceWithLoading}
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
          totalData={currentStores.length}
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

      {/* Loading Overlay for Actions */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg flex items-center gap-3`}>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>
              جاري تنفيذ العملية...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoresPageTemplate;