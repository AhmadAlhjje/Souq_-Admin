"use client";

import React from 'react';
import { Building2, Star, MapPin, Phone } from 'lucide-react';
import { DeleteButton, ViewButton, BanButton, UnbanButton, CreateInvoiceButton } from '@/components/common/ActionButtons';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import useTheme from '@/hooks/useTheme';

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

interface StoresGridProps {
  stores: Store[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
  onCreateInvoice: (id: string) => void;
}

const StoresGrid: React.FC<StoresGridProps> = ({ 
  stores, 
  loading, 
  formatCurrency, 
  onView, 
  onEdit, 
  onDelete,
  onBan,
  onUnban,
  onCreateInvoice
}) => {
  const { isDark } = useTheme();

  const tableContainerClasses = isDark
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-[#96EDD9]';

  const skeletonClasses = isDark ? 'bg-gray-700' : 'bg-gray-200';
  const textClasses = isDark ? 'text-gray-200' : 'text-[#004D5A]';
  const secondaryTextClasses = isDark ? 'text-gray-400' : 'text-gray-500';

  const emptyStateClasses = {
    container: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#96EDD9]',
    icon: isDark ? 'text-gray-500' : 'text-gray-400',
    title: isDark ? 'text-gray-300' : 'text-gray-600',
    description: isDark ? 'text-gray-400' : 'text-gray-500'
  };

  const getStatusVariant = (status: Store['status']) => {
    switch (status) {
      case 'active':
        return 'new';
      case 'suspended':
        return 'sale';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: Store['status']) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'suspended': return 'محظور';
      default: return 'غير محدد';
    }
  };

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`${tableContainerClasses} p-6 rounded-lg border shadow-sm animate-pulse`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 ${skeletonClasses} rounded-lg`} />
              <div className="flex-1">
                <div className={`h-4 ${skeletonClasses} rounded w-32 mb-2`} />
                <div className={`h-3 ${skeletonClasses} rounded w-20`} />
              </div>
            </div>
            <div className="space-y-3">
              <div className={`h-3 ${skeletonClasses} rounded w-full`} />
              <div className={`h-3 ${skeletonClasses} rounded w-3/4`} />
              <div className={`h-8 ${skeletonClasses} rounded w-20`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className={`${emptyStateClasses.container} rounded-lg border shadow-sm p-12 text-center transition-colors duration-200`}>
        <Building2 className={`w-16 h-16 ${emptyStateClasses.icon} mx-auto mb-4 transition-colors duration-200`} />
        <h3 className={`text-lg font-semibold ${emptyStateClasses.title} mb-2 transition-colors duration-200`}>
          لا توجد متاجر
        </h3>
        <p className={`${emptyStateClasses.description} transition-colors duration-200`}>
          لا توجد متاجر مطابقة للبحث والفلاتر المحددة
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <div
          key={store.id}
          className={`${tableContainerClasses} p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200`}
        >
          {/* Store Header */}
          <div className="flex items-center gap-4 mb-4">
            <Avatar
              src={store.owner.avatar}
              alt={store.name}
              size="lg"
              initials={!store.owner.avatar ? getInitials(store.name) : undefined}
            />
            <div className="flex-1">
              <h3 className={`font-semibold text-lg ${textClasses} mb-1`}>
                {store.name}
              </h3>
              <p className={`text-sm ${secondaryTextClasses}`}>
                {store.category}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{store.rating.toFixed(1)}</span>
                <span className={`text-xs ${secondaryTextClasses}`}>
                  ({store.reviewsCount})
                </span>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="space-y-3 mb-4">
            <div>
              <p className={`font-medium ${textClasses} mb-2`}>
                {store.owner.name}
              </p>
              <div className={`text-sm ${secondaryTextClasses} space-y-1`}>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  <span>{store.owner.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{store.address}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {store.description && (
              <div>
                <p className={`text-sm ${secondaryTextClasses} line-clamp-2`}>
                  {store.description}
                </p>
              </div>
            )}

            {/* Sales Info */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div>
                <p className={`text-sm ${secondaryTextClasses}`}>إجمالي المبيعات</p>
                <p className={`font-semibold ${textClasses}`}>
                  {formatCurrency(store.totalSales)}
                </p>
              </div>
              <div>
                <p className={`text-sm ${secondaryTextClasses}`}>هذا الشهر</p>
                <p className={`font-semibold ${textClasses}`}>
                  {formatCurrency(store.monthlySales)}
                </p>
              </div>
            </div>

            {/* Orders Info */}
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className={`text-sm ${secondaryTextClasses}`}>إجمالي الطلبات:</span>
                <span className={`text-sm font-medium ${textClasses}`}>
                  {store.totalOrders.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center justify-between mb-4">
            <Badge
              variant={getStatusVariant(store.status)}
              text={getStatusText(store.status)}
            />
          </div>

          {/* Actions Row - منظمة في صفين لتوفير مساحة */}
          <div className="space-y-2">
            {/* الصف الأول: الأزرار الأساسية */}
            <div className="flex items-center justify-center gap-2">
              <ViewButton 
                size="sm"
                onClick={() => onView(store.id)}
                tooltip="عرض تفاصيل المتجر"
              />
              <CreateInvoiceButton 
                size="sm"
                onClick={() => onCreateInvoice(store.id)}
                tooltip="إنشاء فاتورة"
              />
            </div>

            {/* الصف الثاني: أزرار الحالة والحذف */}
            <div className="flex items-center justify-center gap-2">
              {store.status === 'active' ? (
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
              <DeleteButton 
                size="sm"
                onClick={() => onDelete(store.id)}
                tooltip="حذف المتجر"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoresGrid;