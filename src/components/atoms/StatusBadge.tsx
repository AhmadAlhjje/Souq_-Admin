"use client";

import React from 'react';
import useTheme from '@/hooks/useTheme';

interface StatusBadgeProps {
  status: 'active' | 'suspended';
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { isDark } = useTheme();

  const getStatusClasses = (status: StatusBadgeProps['status']) => {
    const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';
    
    if (isDark) {
      switch (status) {
        case "active":
          return `${sizeClasses} bg-green-900/30 text-green-400 border-green-800`;
        case "suspended":
          return `${sizeClasses} bg-yellow-900/30 text-yellow-400 border-yellow-800`;
        default:
          return `${sizeClasses} bg-gray-800 text-gray-300 border-gray-700`;
      }
    } else {
      switch (status) {
        case "active":
          return `${sizeClasses} bg-green-100 text-green-800 border-green-200`;
        case "suspended":
          return `${sizeClasses} bg-yellow-100 text-yellow-800 border-yellow-200`;
        default:
          return `${sizeClasses} bg-gray-100 text-gray-800 border-gray-200`;
      }
    }
  };

  const getStatusText = (status: StatusBadgeProps['status']) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'suspended': return 'محظور';
      default: return 'غير محدد';
    }
  };

  return (
    <span className={`rounded-full font-medium border ${getStatusClasses(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;