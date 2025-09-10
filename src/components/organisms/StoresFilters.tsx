"use client";

import React from 'react';
import { Grid, List } from 'lucide-react';
import SearchBox from '@/components/molecules/admin/products/SearchBox';
import FilterDropdown from '@/components/molecules/admin/products/FilterDropdown';
import useTheme from '@/hooks/useTheme';

interface StoresFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
  viewMode: 'grid' | 'table';
  onSearchChange: (value: string) => void;
  onFilterChange: (field: string, value: string) => void;
  onViewModeChange: (mode: 'grid' | 'table') => void;
  loading?: boolean;
}

const StoresFilters: React.FC<StoresFiltersProps> = ({
  searchTerm,
  selectedCategory,
  selectedStatus,
  viewMode,
  onSearchChange,
  onFilterChange,
  onViewModeChange,
  loading = false
}) => {
  const { isDark } = useTheme();

  const statusOptions = [
    { value: 'active', label: 'نشط' },
    { value: 'suspended', label: 'محظور' }
  ];

  const categoryOptions = [
    { value: 'إلكترونيات', label: 'إلكترونيات' },
    { value: 'ملابس', label: 'ملابس' },
    { value: 'كتب', label: 'كتب' },
    { value: 'تجميل', label: 'تجميل' },
    { value: 'رياضة', label: 'رياضة' },
    { value: 'عام', label: 'عام' }
  ];

  const viewModeToggleClasses = isDark ? 'bg-gray-700' : 'bg-gray-100';

  const getViewModeButtonClasses = (mode: 'grid' | 'table') => {
    const baseClasses = "p-2 rounded-md transition-colors";
    const loadingClasses = loading ? "opacity-50 cursor-not-allowed" : "";

    if (viewMode === mode) {
      return `${baseClasses} ${
        isDark ? "bg-blue-600 text-white" : "bg-[#004D5A] text-white"
      } ${loadingClasses}`;
    }

    return `${baseClasses} ${
      isDark
        ? "text-gray-300 hover:bg-gray-600"
        : "text-gray-600 hover:bg-gray-200"
    } ${loadingClasses}`;
  };

  return (
    <div className={`p-4 rounded-lg border ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#96EDD9]'
    } transition-colors duration-200`}>
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <SearchBox
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="ابحث عن متجر أو تاجر..."
            className="flex-1"
            disabled={loading}
          />
        
          <FilterDropdown
            options={statusOptions}
            value={selectedStatus}
            onChange={(value) => onFilterChange('status', value)}
            placeholder="حالة المتجر"
            className="w-full sm:w-48"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 ${viewModeToggleClasses} p-1 rounded-lg transition-colors duration-200`}
          >
            <button
              onClick={() => onViewModeChange("grid")}
              disabled={loading}
              className={getViewModeButtonClasses("grid")}
              aria-label="عرض البطاقات"
              title="عرض البطاقات"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              disabled={loading}
              className={getViewModeButtonClasses("table")}
              aria-label="عرض الجدول"
              title="عرض الجدول"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoresFilters;