// src/api/stores.ts
import { StoreResponse } from "@/types/store";
import { api } from "./api";

export interface StoreData {
  name: string;
  location: string;
  description: string;
  coverImage?: File | null;
  logoImage?: File | null;
}

export interface StoreUser {
  username: string;
  whatsapp_number: string;
}

// واجهة المتجر المستخدمة في الواجهة
export interface Store {
  id: string;
  name: string;
  category: string;
  owner: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  address: string;
  description: string;
  images: string[];
  website?: string;
  rating: number;
  totalSales: number;
  monthlySales: number;
  totalOrders: number;
  reviewsCount: number;
  status: "active" | "suspended";
  createdAt: string;
}

export interface ApiProduct {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  images: string;
  created_at: string;
}

// نوع للمتجر من الـ API
export interface APIStore {
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
  Products?: ApiProduct[]; // اختياري للمتاجر مع المنتجات
}

// إنشاء متجر جديد
export const createStore = async (storeData: StoreData) => {
  const formData = new FormData();

  formData.append("store_name", storeData.name);
  formData.append("store_address", storeData.location);
  formData.append("description", storeData.description);

  if (storeData.coverImage) {
    formData.append("images", storeData.coverImage);
  }

  if (storeData.logoImage) {
    formData.append("logo_image", storeData.logoImage);
  }

  const response = await api.post("/stores", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// جلب المتجر بالـ ID
export const getStoreById = async (id: number) => {
  const response = await api.get(`/stores/${id}`);
  return response.data;
};

// تحديث بيانات المتجر
export const updateStore = async (id: number, storeData: StoreData) => {
  const formData = new FormData();

  formData.append("store_name", storeData.name);
  formData.append("store_address", storeData.location);
  formData.append("description", storeData.description);

  if (storeData.coverImage) {
    formData.append("images", storeData.coverImage);
  }

  if (storeData.logoImage) {
    formData.append("logo_image", storeData.logoImage);
  }

  const response = await api.put(`/stores/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// حذف متجر
export const deleteStore = async (storeId: string): Promise<void> => {
  try {
    console.log(`🗑️ حذف متجر برقم ${storeId}...`);
    
    const response = await api.delete(`/stores/${storeId}`);
    
    console.log("✅ تم حذف المتجر بنجاح:", response.data);
    
    return response.data;
  } catch (error: any) {
    console.error("❌ خطأ في حذف المتجر:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || 'حدث خطأ أثناء حذف المتجر';
      throw new Error(errorMessage);
    }
    
    throw new Error('فشل في الاتصال بالخادم');
  }
};

// تبديل حالة المتجر (حظر/إلغاء حظر)
export const toggleStoreStatus = async (storeId: string): Promise<APIStore> => {
  try {
    console.log(`🔄 تبديل حالة متجر برقم ${storeId}...`);
    const response = await api.put(`/stores/toggle-status/${storeId}`);
    
    
    console.log("✅ تم تبديل حالة المتجر بنجاح:", response.data);
    
    return response.data;
  } catch (error: any) {
    console.error("❌ خطأ في تبديل حالة المتجر:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || 'حدث خطأ أثناء تبديل حالة المتجر';
      throw new Error(errorMessage);
    }
    
    throw new Error('فشل في الاتصال بالخادم');
  }
};

// حظر متجر (تابع مساعد)
export const banStore = async (storeId: string): Promise<APIStore> => {
  try {
    console.log(`🚫 حظر متجر برقم ${storeId}...`);
    
    // التحقق من الحالة الحالية قبل التبديل
    const storeResponse = await getStoreById(parseInt(storeId));
    
    if (storeResponse.is_blocked === 1) {
      throw new Error('المتجر محظور بالفعل');
    }
    
    return await toggleStoreStatus(storeId);
  } catch (error: any) {
    console.error("❌ خطأ في حظر المتجر:", error);
    throw error;
  }
};

// إلغاء حظر متجر (تابع مساعد)
export const unbanStore = async (storeId: string): Promise<APIStore> => {
  try {
    console.log(`✅ إلغاء حظر متجر برقم ${storeId}...`);
    
    // التحقق من الحالة الحالية قبل التبديل
    const storeResponse = await getStoreById(parseInt(storeId));
    
    if (storeResponse.is_blocked === 0) {
      throw new Error('المتجر غير محظور');
    }
    
    return await toggleStoreStatus(storeId);
  } catch (error: any) {
    console.error("❌ خطأ في إلغاء حظر المتجر:", error);
    throw error;
  }
};

// جلب جميع المتاجر
export const getStores = async (): Promise<StoreResponse> => {
  try {
    console.log("🔄 بدء طلب جلب جميع المتاجر...");
    console.log(
      "🌐 URL المستخدم:",
      `${process.env.NEXT_PUBLIC_BASE_URL}/stores/`
    );

    const response = await api.get("/stores/");

    console.log("✅ تم جلب البيانات بنجاح");
    console.log("📦 البيانات المستلمة:", response.data);
    console.log("📊 عدد المتاجر:", response.data?.stores?.length || 0);

    // التأكد من أن البيانات في الشكل الصحيح
    if (response.data && response.data.stores && response.data.statistics) {
      return {
        stores: response.data.stores,
        statistics: response.data.statistics,
      };
    }

    // إذا كانت البيانات في شكل مختلف، نحولها
    return {
      stores: Array.isArray(response.data) ? response.data : [],
      statistics: {
        totalStores: Array.isArray(response.data) ? response.data.length : 0,
        activeStores: Array.isArray(response.data)
          ? response.data.filter((store: APIStore) => store.is_blocked === 0)
              .length
          : 0,
        blockedStores: Array.isArray(response.data)
          ? response.data.filter((store: APIStore) => store.is_blocked === 1)
              .length
          : 0,
        totalSiteRevenue: Array.isArray(response.data)
          ? response.data.reduce(
              (sum: number, store: APIStore) => sum + store.totalRevenue,
              0
            )
          : 0,
      },
    };
  } catch (error: any) {
    console.error("❌ خطأ في جلب المتاجر:", error);

    if (error.response) {
      console.error("📡 Status:", error.response.status);
      console.error("📡 Data:", error.response.data);
      console.error("📡 Headers:", error.response.headers);
    } else if (error.request) {
      console.error("📨 لم يتم استلام رد من الخادم:", error.request);
    } else {
      console.error("⚙️ خطأ في الإعدادات:", error.message);
    }

    throw error;
  }
};

// جلب متجر واحد بمنتجاته
export const getStore = async (storeId: number): Promise<APIStore> => {
  try {
    console.log(`🔄 جلب متجر برقم ${storeId}...`);

    const response = await api.get<APIStore>(`/stores/${storeId}`);

    console.log("✅ تم جلب المتجر بنجاح:", response.data);

    // التحقق من وجود البيانات
    if (!response.data) {
      throw new Error("لم يتم العثور على بيانات المتجر");
    }

    // التحقق من وجود المنتجات
    if (!response.data.Products) {
      console.warn("⚠️ المتجر لا يحتوي على منتجات");
      response.data.Products = [];
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ خطأ في جلب المتجر:", error);
    throw error;
  }
};

// جلب منتج واحد بتفاصيله
export const getProduct = async (productId: number): Promise<ApiProduct> => {
  try {
    console.log(`🔄 جلب منتج برقم ${productId}...`);

    const response = await api.get<ApiProduct>(`/products/${productId}`);

    console.log("✅ تم جلب المنتج بنجاح:", response.data);

    // التحقق من وجود البيانات
    if (!response.data) {
      throw new Error("لم يتم العثور على المنتج");
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ خطأ في جلب المنتج:", error);
    throw error;
  }
};

// مساعد لتحليل الصور من JSON بدون صورة افتراضية
export const parseImages = (imagesString: string): string[] => {
  try {
    const parsed = JSON.parse(imagesString);
    return Array.isArray(parsed) ? parsed : [imagesString];
  } catch (error) {
    console.error("خطأ في تحليل الصور:", error);
    return []; // مصفوفة فارغة إذا فشل التحليل
  }
};

// دالة تحويل بيانات API إلى واجهة Store
export const transformStoreData = (apiStore: APIStore): Store => {
  let imagesArray: string[] = [];
  try {
    imagesArray = JSON.parse(apiStore.images || '[]');
  } catch (e) {
    imagesArray = [];
  }

  return {
    id: apiStore.store_id.toString(),
    name: apiStore.store_name,
    category: 'عام', // يمكن تحديث API ليشمل الفئة
    owner: {
      name: apiStore.User.username,
      email: `${apiStore.User.username.replace(/\s+/g, '')}@store.local`,
      phone: apiStore.User.whatsapp_number,
      avatar: apiStore.logo_image ? `${process.env.NEXT_PUBLIC_BASE_URL}${apiStore.logo_image}` : undefined
    },
    address: apiStore.store_address,
    description: apiStore.description,
    images: imagesArray.map((img: string) => 
      img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_BASE_URL}${img}`
    ),
    website: undefined,
    rating: apiStore.averageRating || 0,
    totalSales: apiStore.totalRevenue || 0,
    monthlySales: apiStore.thisMonthRevenue || 0,
    totalOrders: apiStore.totalOrders || 0,
    reviewsCount: apiStore.reviewsCount || 0,
    status: apiStore.is_blocked === 0 ? 'active' as const : 'suspended' as const,
    createdAt: apiStore.created_at
  };
};