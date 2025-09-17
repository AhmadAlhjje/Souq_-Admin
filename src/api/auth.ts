// src/api/auth.ts
import { api } from "./api";
import { saveTokens, clearTokens, getAccessToken } from "./api";

export interface RegisterData {
  username: string;
  password: string;
  whatsapp_number: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface VerifyWhatsappData {
  user_id: number;
  verification_code: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ResendVerificationData {
  user_id: number;
}

export interface Order {
  order_id: number;
  store_id: number;
  purchase_id: string;
  customer_session_id: string;
  total_price: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "monitored";
  is_programmatic: boolean;
  settlement_status: string;
  settlement_requested_at: string | null;
  settled_at: string | null;
  created_at: string;
  Store: {
    store_name: string;
    logo_image: string | null;
  };
  OrderItems: Array<{
    order_item_id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price_at_time: string;
    Product: {
      product_id: number;
      store_id: number;
      name: string;
      description: string;
      price: string;
      discount_percentage: string | null;
      stock_quantity: number;
      images: string;
      created_at: string;
    };
  }>;
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    users: {
      total: number;
      merchants: number;
      admins: number;
      newThisMonth: number;
      withStores: number;
    };
    stores: {
      total: number;
    };
    orders: {
      total: number;
      completed: number;
      pending: number;
      cancelled: number;
    };
    revenue: {
      total: string;
      monthly: string;
      averageOrderValue: number;
    };
    products: {
      total: number;
      newThisMonth: number;
      lowStock: number;
      outOfStock: number;
    };
    customers: {
      total: number;
      newThisMonth: number;
      averageOrdersPerCustomer: number;
    };
    settlements: {
      pending: number;
      completed: number;
    };
    reviews: {
      total: number;
      verified: number;
      pending: number;
    };
    summary: {
      totalSiteRevenue: string;
      totalSiteOrders: number;
      totalSiteProducts: number;
      totalSiteCustomers: number;
      monthlyGrowth: {
        newUsers: number;
        newProducts: number;
        newCustomers: number;
        revenue: string;
      };
    };
  };
  timestamp: string;
}

export interface OrdersResponse {
  success: boolean;
  message?: string;
  data: Order[];
}

// تسجيل مستخدم جديد
export const registerUser = async (userData: RegisterData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

// تسجيل دخول المستخدم وتخزين التوكن في الكوكيز
export const loginUser = async (loginData: LoginData) => {
  const response = await api.post("/users/login", loginData);
  saveTokens(response.data.access_token, response.data.refresh_token);
  return response.data;
};

// تسجيل الخروج (حذف التوكن من الكوكيز)
export const logoutUser = () => {
  clearTokens();
};

// التحقق إذا كان المستخدم مسجّل دخول
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// التحقق من رقم الواتساب
export const verifyWhatsapp = async (verificationData: VerifyWhatsappData) => {
  const response = await api.post("/users/verify-whatsapp", verificationData);
  return response.data;
};

// إعادة إرسال رمز التحقق
export const resendVerification = async (
  resendData: ResendVerificationData
) => {
  const response = await api.post("/users/resend-verification", resendData);
  return response.data;
};

// إضافة هذه الدالة في نهاية الملف
export const changePassword = async (passwordData: ChangePasswordData) => {
  const response = await api.put("/users/change-password", passwordData);
  return response.data;
};

// جلب إحصائيات لوحة التحكم
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await api.get("/users/admin/stats");
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await api.get("/orders");
  // API returns array directly
  return response.data;
};

// جلب طلبات محددة مع إمكانية التصفية والبحث
export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  store_id?: number;
  search?: string;
}): Promise<OrdersResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.store_id)
    queryParams.append("store_id", params.store_id.toString());
  if (params?.search) queryParams.append("search", params.search);

  const query = queryParams.toString();
  const url = query ? `/orders?${query}` : "/orders";

  const response = await api.get(url);
  return response.data;
};
