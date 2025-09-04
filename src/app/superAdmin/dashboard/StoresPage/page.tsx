"use client";

import React, { useState, useEffect } from 'react';
import StoresPageTemplate from '@/components/templates/StoresPageTemplate';

// بيانات وهمية للمتاجر (يمكن نقلها لملف منفصل)
const mockStores = [
  {
    id: '1',
    name: 'متجر النخبة',
    category: 'إلكترونيات',
    owner: {
      name: 'أحمد محمد العلي',
      email: 'ahmed@elitestore.sa',
      phone: '+966 50 123 4567'
    },
    website: 'https://elitestore.sa',
    rating: 4.8,
    totalSales: 245800,
    monthlySales: 48200,
    totalOrders: 342,
    status: 'active' as const,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'متجر النخبة',
    category: 'إلكترونيات',
    owner: {
      name: 'أحمد محمد العلي',
      email: 'ahmed@elitestore.sa',
      phone: '+966 50 123 4567'
    },
    website: 'https://elitestore.sa',
    rating: 4.8,
    totalSales: 245800,
    monthlySales: 48200,
    totalOrders: 342,
    status: 'active' as const,
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    name: 'متجر النخبة',
    category: 'إلكترونيات',
    owner: {
      name: 'أحمد محمد العلي',
      email: 'ahmed@elitestore.sa',
      phone: '+966 50 123 4567'
    },
    website: 'https://elitestore.sa',
    rating: 4.8,
    totalSales: 245800,
    monthlySales: 48200,
    totalOrders: 342,
    status: 'active' as const,
    createdAt: '2024-01-15'
  },
  {
    id: '4',
    name: 'متجر النخبة',
    category: 'إلكترونيات',
    owner: {
      name: 'أحمد محمد العلي',
      email: 'ahmed@elitestore.sa',
      phone: '+966 50 123 4567'
    },
    website: 'https://elitestore.sa',
    rating: 4.8,
    totalSales: 245800,
    monthlySales: 48200,
    totalOrders: 342,
    status: 'active' as const,
    createdAt: '2024-01-15'
  },
  {
    id: '5',
    name: 'متجر النخبة',
    category: 'إلكترونيات',
    owner: {
      name: 'أحمد محمد العلي',
      email: 'ahmed@elitestore.sa',
      phone: '+966 50 123 4567'
    },
    website: 'https://elitestore.sa',
    rating: 4.8,
    totalSales: 245800,
    monthlySales: 48200,
    totalOrders: 342,
    status: 'active' as const,
    createdAt: '2024-01-15'
  },
  {
    id: '6',
    name: 'متجر النخبة',
    category: 'إلكترونيات',
    owner: {
      name: 'أحمد محمد العلي',
      email: 'ahmed@elitestore.sa',
      phone: '+966 50 123 4567'
    },
    website: 'https://elitestore.sa',
    rating: 4.8,
    totalSales: 245800,
    monthlySales: 48200,
    totalOrders: 342,
    status: 'active' as const,
    createdAt: '2024-01-15'
  },
  {
    id: '7',
    name: 'متجر النخبة',
    category: 'إلكترونيات',
    owner: {
      name: 'أحمد محمد العلي',
      email: 'ahmed@elitestore.sa',
      phone: '+966 50 123 4567'
    },
    website: 'https://elitestore.sa',
    rating: 4.8,
    totalSales: 245800,
    monthlySales: 48200,
    totalOrders: 342,
    status: 'active' as const,
    createdAt: '2024-01-15'
  },
  {
    id: '8',
    name: 'متجر النخبة',
    category: 'إلكترونيات',
    owner: {
      name: 'أحمد محمد العلي',
      email: 'ahmed@elitestore.sa',
      phone: '+966 50 123 4567'
    },
    website: 'https://elitestore.sa',
    rating: 4.8,
    totalSales: 245800,
    monthlySales: 48200,
    totalOrders: 342,
    status: 'active' as const,
    createdAt: '2024-01-15'
  },
  {
    id: '9',
    name: 'متجر النخبة',
    category: 'إلكترونيات',
    owner: {
      name: 'أحمد محمد العلي',
      email: 'ahmed@elitestore.sa',
      phone: '+966 50 123 4567'
    },
    website: 'https://elitestore.sa',
    rating: 4.8,
    totalSales: 245800,
    monthlySales: 48200,
    totalOrders: 342,
    status: 'active' as const,
    createdAt: '2024-01-15'
  },
];

const StoresPage = () => {
  const [stores, setStores] = useState(mockStores);
  const [loading, setLoading] = useState(false);

  return (
    <StoresPageTemplate 
      stores={stores} 
      loading={loading}
      // onUpdateStores={setStores}
    />
  );
};

export default StoresPage;