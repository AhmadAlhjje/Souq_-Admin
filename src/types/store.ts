import { APIStore } from "@/api/stores";

// types/store.ts
export interface Store {
  store_id: number;
  user_id: number;
  store_name: string;
  store_address: string;
  description: string;
  images: string; // JSON string array
  logo_image: string;
  is_blocked: number; // 0 or 1
  created_at: string;
  User: {
    username: string;
    whatsapp_number: string;
  };
  averageRating: number;
  reviewsCount: number;
  totalRevenue: number;
  totalOrders: number;
  thisMonthRevenue: number;
}

export interface StoreResponse {
  stores: APIStore[];
  statistics: {
    totalStores: number;
    activeStores: number;
    blockedStores: number;
    totalSiteRevenue: number;
  };
}
