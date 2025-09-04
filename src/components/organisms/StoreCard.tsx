"use client";

import React from 'react';
import useTheme from '@/hooks/useTheme';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'red' | 'yellow';
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  loading = false 
}) => {
  const { isDark } = useTheme();

  const colorClasses = {
    blue: isDark 
      ? 'bg-blue-900/20 text-blue-400' 
      : 'bg-[#CFF7EE] text-[#004D5A]',
    green: isDark 
      ? 'bg-green-900/20 text-green-400' 
      : 'bg-green-100 text-green-600',
    red: isDark 
      ? 'bg-red-900/20 text-red-400' 
      : 'bg-red-100 text-red-600',
    yellow: isDark 
      ? 'bg-yellow-900/20 text-yellow-400' 
      : 'bg-yellow-100 text-yellow-600',
  };

  const textColorClasses = {
    blue: isDark ? 'text-blue-400' : 'text-[#004D5A]',
    green: isDark ? 'text-green-400' : 'text-green-600',
    red: isDark ? 'text-red-400' : 'text-red-600',
    yellow: isDark ? 'text-yellow-400' : 'text-yellow-600',
  };

  const cardBgClass = isDark 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-[#96EDD9]';

  if (loading) {
    return (
      <div className={`${cardBgClass} p-4 rounded-lg border shadow-sm animate-pulse`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gray-300 dark:bg-gray-600 w-12 h-12" />
          <div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-24" />
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardBgClass} p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${textColorClasses[color]}`}>
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;