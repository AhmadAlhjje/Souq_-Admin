"use client";

import React from 'react';
import { X, Star, Mail, Phone, ExternalLink, Calendar, Building2, MapPin, CreditCard, TrendingUp, Package, Users } from 'lucide-react';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
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
  website?: string;
  rating: number;
  totalSales: number;
  monthlySales: number;
  totalOrders: number;
  status: 'active' | 'suspended';
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
  formatCurrency
}) => {
  const { isDark } = useTheme();

  if (!isOpen || !store) return null;

  const getStatusVariant = (status: Store['status']) => {
    switch (status) {
      case 'active': return 'new';
      case 'suspended': return 'sale';
      default: return 'default';
    }
  };

  const getStatusText = (status: Store['status']) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'suspended': return 'محظور';
      default: return 'غير محدد';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // حساب إحصائيات إضافية
  const averageOrderValue = store.totalSales / store.totalOrders;
  const monthlyGrowth = ((store.monthlySales / (store.totalSales - store.monthlySales)) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full max-w-4xl rounded-lg shadow-xl transition-all ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              تفاصيل المتجر
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
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
                  src={store.owner.avatar}
                  alt={store.name}
                  size="xl"
                  initials={!store.owner.avatar ? getInitials(store.name) : undefined}
                />
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <h3 className={`text-3xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {store.name}
                      </h3>
                      <p className={`text-xl mb-3 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {store.category}
                      </p>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-6 h-6 text-yellow-400 fill-current" />
                          <span className="text-xl font-bold">{store.rating}</span>
                          <span className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            ({store.totalOrders} تقييم)
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
              <div className={`p-4 rounded-lg border text-center ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#CFF7EE]'
              }`} style={{ backgroundColor: isDark ? '#1f2937' : '#CFF7EE' }}>
                <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: '#004D5A' }} />
                <div className="text-2xl font-bold mb-1" style={{ color: '#004D5A' }}>
                  {formatCurrency(store.totalSales)}
                </div>
                <div className="text-sm" style={{ color: '#004D5A' }}>
                  إجمالي المبيعات
                </div>
              </div>

              <div className={`p-4 rounded-lg border text-center ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#CFF7EE]'
              }`} style={{ backgroundColor: isDark ? '#1f2937' : '#CFF7EE' }}>
                <Package className="w-8 h-8 mx-auto mb-2" style={{ color: '#004D5A' }} />
                <div className="text-2xl font-bold mb-1" style={{ color: '#004D5A' }}>
                  {store.totalOrders.toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: '#004D5A' }}>
                  إجمالي الطلبات
                </div>
              </div>

              <div className={`p-4 rounded-lg border text-center ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#CFF7EE]'
              }`} style={{ backgroundColor: isDark ? '#1f2937' : '#CFF7EE' }}>
                <CreditCard className="w-8 h-8 mx-auto mb-2" style={{ color: '#004D5A' }} />
                <div className="text-2xl font-bold mb-1" style={{ color: '#004D5A' }}>
                  {formatCurrency(averageOrderValue)}
                </div>
                <div className="text-sm" style={{ color: '#004D5A' }}>
                  متوسط قيمة الطلب
                </div>
              </div>

              <div className={`p-4 rounded-lg border text-center ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#CFF7EE]'
              }`} style={{ backgroundColor: isDark ? '#1f2937' : '#CFF7EE' }}>
                <Users className="w-8 h-8 mx-auto mb-2" style={{ color: '#004D5A' }} />
                <div className="text-2xl font-bold mb-1" style={{ color: '#004D5A' }}>
                  {formatCurrency(store.monthlySales)}
                </div>
                <div className="text-sm" style={{ color: '#004D5A' }}>
                  مبيعات هذا الشهر
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className={`p-6 rounded-lg border mb-6 ${
              isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <h4 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <Building2 className="w-5 h-5" />
                معلومات التاجر
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className={`w-5 h-5 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        اسم التاجر
                      </p>
                      <p className={`font-medium ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {store.owner.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className={`w-5 h-5 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        البريد الإلكتروني
                      </p>
                      <a 
                        href={`mailto:${store.owner.email}`}
                        className="text-teal-600 hover:text-teal-700 transition-colors font-medium"
                      >
                        {store.owner.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className={`w-5 h-5 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        رقم الهاتف
                      </p>
                      <a 
                        href={`tel:${store.owner.phone}`}
                        className="text-teal-600 hover:text-teal-700 transition-colors font-medium"
                      >
                        {store.owner.phone}
                      </a>
                    </div>
                  </div>

                  {store.website && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className={`w-5 h-5 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <div>
                        <p className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          الموقع الإلكتروني
                        </p>
                        <a 
                          href={store.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 transition-colors font-medium"
                        >
                          زيارة الموقع
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-lg border ${
                isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  <Calendar className="w-5 h-5" />
                  معلومات إضافية
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      تاريخ الانضمام:
                    </span>
                    <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {formatDate(store.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      معرف المتجر:
                    </span>
                    <span className={`font-mono text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {store.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      النمو الشهري:
                    </span>
                    <span className={`font-medium ${
                      monthlyGrowth > 0 
                        ? 'text-green-600' 
                        : monthlyGrowth < 0 
                        ? 'text-red-600' 
                        : isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {monthlyGrowth > 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              
            </div>
          </div>

          {/* Footer */}
          <div className={`flex justify-end gap-3 p-6 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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