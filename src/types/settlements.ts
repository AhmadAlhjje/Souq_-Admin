// types/settlements.ts
export interface Owner {
  user_id: number;
  username: string;
  whatsapp_number: string;
}

export interface StoreInfo {
  store_id: number;
  store_name: string;
  store_address: string;
  owner: Owner;
}

export interface PendingOrder {
  order_id: number;
  purchase_id: string;
  total_price: number;
  status: string;
  settlement_requested_at: string;
  created_at: string;
  days_since_request: number;
}

export interface StoreSummary {
  orders_count: number;
  total_amount: string;
  oldest_request_date: string;
  newest_request_date: string;
  average_order_value: string;
}

export interface PendingStore {
  store_info: StoreInfo;
  orders: PendingOrder[];
  summary: StoreSummary;
  rank: number;
  percentage_of_total: string;
}

export interface GlobalSummary {
  total_stores: number;
  total_orders: number;
  total_amount: string;
  average_amount_per_store: string;
  average_orders_per_store: number;
}

export interface Metadata {
  generated_at: string;
  currency: string;
  settlement_status: string;
}

export interface PendingSettlementsResponse {
  success: boolean;
  message: string;
  data: {
    stores: PendingStore[];
    summary: GlobalSummary;
    metadata: Metadata;
  };
}