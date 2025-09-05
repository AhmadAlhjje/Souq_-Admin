"use client";

import React from "react";
import useTheme from "@/hooks/useTheme";
import Pagination from "../organisms/Pagination";
import { GenericTableProps, TableColumn } from "@/types/table";



const GenericTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyState,
  actions,
  rowKey,
  onRowClick,
  className = "",
  size = "md",
  pagination,
}: GenericTableProps<T>) => {
  const { isDark } = useTheme();

  // التصميمات المشروطة
  const tableContainerClasses = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-[#96EDD9]";

  const tableHeaderClasses = isDark ? "bg-gray-700" : "bg-[#CFF7EE]";

  const headerTextClasses = isDark ? "text-gray-200" : "text-[#004D5A]";

  const rowHoverClasses = isDark 
    ? "hover:bg-gray-700 cursor-pointer" 
    : "hover:bg-gray-50 cursor-pointer";

  const textClasses = isDark ? "text-gray-200" : "text-[#004D5A]";

  const skeletonClasses = isDark ? "bg-gray-700" : "bg-gray-200";

  const emptyStateClasses = {
    container: isDark
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-[#96EDD9]",
    icon: isDark ? "text-gray-500" : "text-gray-400",
    title: isDark ? "text-gray-300" : "text-gray-600",
    description: isDark ? "text-gray-400" : "text-gray-500",
  };

  // أحجام الجدول
  const sizeClasses = {
    sm: "py-2 px-3 text-sm",
    md: "py-4 px-4",
    lg: "py-6 px-6 text-lg",
  };

  // الحصول على قيمة المفتاح للصف
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  // الحصول على قيمة العمود
  const getCellValue = (record: T, column: TableColumn<T>): any => {
    const keys = column.key.split('.');
    let value = record;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value;
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div
        className={`${tableContainerClasses} rounded-lg border shadow-sm overflow-hidden transition-colors duration-200 ${className}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${tableHeaderClasses} transition-colors duration-200`}>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`${sizeClasses[size]} text-${column.align || "right"} ${headerTextClasses} font-semibold transition-colors duration-200`}
                    style={{ width: column.width }}
                  >
                    {column.title}
                  </th>
                ))}
                {actions && actions.length > 0 && (
                  <th
                    className={`${sizeClasses[size]} text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
                  >
                    الإجراءات
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 animate-pulse transition-colors duration-200"
                >
                  {columns.map((column) => (
                    <td key={column.key} className={sizeClasses[size]}>
                      <div
                        className={`h-4 ${skeletonClasses} rounded w-3/4 ${
                          column.align === "center" ? "mx-auto" : ""
                        }`}
                      />
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className={sizeClasses[size]}>
                      <div className="flex items-center justify-center gap-1">
                        {actions.map((_, actionIndex) => (
                          <div
                            key={actionIndex}
                            className={`w-7 h-7 ${skeletonClasses} rounded`}
                          />
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // عرض حالة فارغة
  if (data.length === 0) {
    const defaultEmptyState = {
      icon: (
        <div
          className={`w-16 h-16 ${emptyStateClasses.icon} mx-auto mb-4 transition-colors duration-200 flex items-center justify-center border-2 border-dashed rounded-lg`}
        >
          📊
        </div>
      ),
      title: "لا توجد بيانات",
      description: "لا توجد بيانات متاحة للعرض حالياً",
    };

    const currentEmptyState = emptyState || defaultEmptyState;

    return (
      <div
        className={`${emptyStateClasses.container} rounded-lg border shadow-sm transition-colors duration-200 ${className}`}
      >
        <div className="p-12 text-center">
          {currentEmptyState.icon}
          <h3
            className={`text-lg font-semibold ${emptyStateClasses.title} mb-2 transition-colors duration-200`}
          >
            {currentEmptyState.title}
          </h3>
          <p
            className={`${emptyStateClasses.description} transition-colors duration-200`}
          >
            {currentEmptyState.description}
          </p>
        </div>
      </div>
    );
  }

  // عرض الجدول الفعلي
  return (
    <div
      className={`rounded-lg border overflow-hidden ${tableContainerClasses} transition-colors duration-200 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${tableHeaderClasses} transition-colors duration-200`}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${sizeClasses[size]} text-${column.align || "right"} ${headerTextClasses} font-semibold transition-colors duration-200`}
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th
                  className={`${sizeClasses[size]} text-center ${headerTextClasses} font-semibold transition-colors duration-200`}
                >
                  الإجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDark ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            {data.map((record, index) => (
              <tr
                key={getRowKey(record, index)}
                className={`${onRowClick ? rowHoverClasses : ""} transition-colors duration-200`}
                onClick={() => onRowClick?.(record)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`${sizeClasses[size]} text-${column.align || "right"}`}
                  >
                    <div className={`${textClasses} transition-colors duration-200`}>
                      {column.render
                        ? column.render(getCellValue(record, column), record, index)
                        : getCellValue(record, column)}
                    </div>
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className={`${sizeClasses[size]} text-center`}>
                    <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {actions.map((action) => (
                        <div key={action.key}>
                          {action.render(record)}
                        </div>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Component */}
      {pagination && pagination.enabled && pagination.onPageChange && pagination.onItemsPerPageChange && (
        <Pagination
          currentPage={pagination.currentPage || 1}
          totalPages={pagination.totalPages || 1}
          totalItems={pagination.totalItems || 0}
          itemsPerPage={pagination.itemsPerPage || 10}
          startIndex={pagination.startIndex || 0}
          endIndex={pagination.endIndex || 0}
          searchTerm={pagination.searchTerm}
          totalData={pagination.totalData || 0}
          onPageChange={pagination.onPageChange}
          onItemsPerPageChange={pagination.onItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default GenericTable;