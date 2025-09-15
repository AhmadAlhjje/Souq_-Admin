// hooks/useLogout.ts
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { logoutUser } from "@/api/auth";
import { useStore } from "@/contexts/StoreContext";
import { useToast } from "@/hooks/useToast";

export const useLogout = () => {
  const router = useRouter();
  const { setStoreId } = useStore();
  const { showToast } = useToast();

  const logout = useCallback(async () => {
    try {
      // مسح التوكن من الكوكيز
      logoutUser();
      
      // مسح بيانات المتجر من الـ Context
      setStoreId(null);
      
      // إظهار رسالة تأكيد (اختياري)
      showToast("تم تسجيل الخروج بنجاح", "success");
      
      // الانتقال إلى صفحة تسجيل الدخول
      router.push("/LoginPage");
    } catch (error) {
      console.error("Logout error:", error);
      showToast("حدث خطأ أثناء تسجيل الخروج", "error");
    }
  }, [router, setStoreId, showToast]);

  return { logout };
};