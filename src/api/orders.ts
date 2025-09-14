import { api } from "./api";

// جلب إحصائيات وطلبات المتجر
export const getStoreOrdersStats = async (storeId: number) => {
  const response = await api.get(`/orders/store/${storeId}/stats`);
  return response.data;
};

// تحديث حالة الطلب
export const updateOrderStatus = async (orderId: number, status: string) => {
  console.log(
    `📡 Updating order status | orderId=${orderId}, status=${status}`
  );
  const response = await api.put(`/orders/ship/${orderId}`, { status });
  console.log("✅ Update order response:", response.data);
  return response.data;
};

// ✅ تحديث حالة الطلب المرصود (Programmatic)
export const updateProgrammaticShipped = async (storeId: number) => {
  console.log(`📡 Updating programmatic shipped for store=${storeId}`);
  const response = await api.put(
    `/orders/store/${storeId}/programmatic/update-shipped`
  );
  console.log("✅ Programmatic update response:", response.data);
  return response.data;
};

// ✅ جلب التصفيات المعلقة
export const getPendingSettlements = async () => {
  console.log(`📡 Fetching pending settlements`);
  const response = await api.get("/orders/pending-settlements");
  console.log("✅ Pending settlements response:", response.data);
  return response.data;
};

// ✅ الموافقة على تصفية متجر
export const approveSettlement = async (storeId: number) => {
  console.log(`📡 Approving settlement for store=${storeId}`);
  const response = await api.post(
    `/orders/store/${storeId}/approve-settlement`
  );
  console.log("✅ Approve settlement response:", response.data);
  return response.data;
};
