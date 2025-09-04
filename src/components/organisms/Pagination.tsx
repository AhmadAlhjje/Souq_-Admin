"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useTheme from '@/hooks/useTheme';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  searchTerm?: string;
  totalData: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
  searchTerm,
  totalData,
  onPageChange,
  onItemsPerPageChange
}) => {
  const { isDark } = useTheme();
  const itemsPerPageOptions = [5, 10, 25, 50];

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((page, index, array) => array.indexOf(page) === index);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;
  
  return (
    <div className={`px-4 py-3 border-t rounded-b-lg ${
      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Results Information */}
        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          عرض {startIndex + 1} إلى {Math.min(endIndex, totalItems)} من {totalItems} نتيجة
          {searchTerm && (
            <span className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              (مفلتر من {totalData} إجمالي)
            </span>
          )}
        </div>
        
        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'border-gray-600 hover:bg-gray-600 disabled:hover:bg-transparent text-gray-300' 
                : 'border-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent text-gray-700'
            }`}
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && goToPage(page)}
              disabled={typeof page !== 'number'}
              className={`px-3 py-1 rounded border text-sm transition-colors ${
                page === currentPage
                  ? 'bg-teal-500 text-white border-teal-500 hover:bg-teal-600'
                  : typeof page === 'number'
                  ? isDark
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  : 'cursor-default border-transparent text-gray-400'
              }`}
            >
              {page}
            </button>
          ))}
          
          {/* Next Button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'border-gray-600 hover:bg-gray-600 disabled:hover:bg-transparent text-gray-300' 
                : 'border-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent text-gray-700'
            }`}
            aria-label="الصفحة التالية"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Items Per Page Selector */}
        <div className={`flex items-center gap-2 text-sm ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <span>عرض</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className={`border rounded px-2 py-1 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:bg-gray-600' 
                : 'bg-white border-gray-300 text-gray-900 focus:bg-gray-50'
            }`}
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>عنصر</span>
        </div>
      </div>
    </div>
  );
};

export default Pagination;