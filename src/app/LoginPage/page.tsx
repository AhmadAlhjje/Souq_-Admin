// pages/login/LoginPage.tsx
"use client";
import React, { useState } from "react";
import LoginTemplate from "../../components/templates/LoginTemplate";
import SignInForm from "../../components/organisms/SignInForm";
import { loginUser } from "../../api/auth";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { getStoreIdFromToken, saveTokens } from "@/api/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useStore } from "@/contexts/StoreContext";

const LoginPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { setStoreId } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  // بيانات تسجيل الدخول
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  /** تغيير قيم حقول نموذج تسجيل الدخول */
  const handleSignInChange = (field: string, value: string) => {
    setSignInData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /** إرسال بيانات تسجيل الدخول إلى الـ API */
  const handleSignInSubmit = async () => {
    if (!signInData.username || !signInData.password) {
      showToast("يرجى إدخال اسم المستخدم وكلمة المرور", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const loginData = {
        username: signInData.username,
        password: signInData.password,
      };

      const result = await loginUser(loginData);

      if (result.message && result.token) {
        // حفظ التوكن في الكوكيز أو localStorage
        saveTokens(result.token, result.token);

        // فك التوكن للحصول على store_id
        const storeIdFromToken = getStoreIdFromToken();
        setStoreId(storeIdFromToken); // تخزينه في الـ Context و localStorage

        showToast(result.message, "success");

        setTimeout(() => {
            router.push("/superAdmin/dashboard/StoresPage"); 
        }, 1500);

        // إعادة تعيين بيانات تسجيل الدخول
        setSignInData({ username: "", password: "" });
      } else {
        showToast(result.message || "فشل في تسجيل الدخول", "error");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast("حدث خطأ غير متوقع", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginTemplate showSlider={false}>
      {isLoading && (
        <LoadingSpinner
          size="lg"
          color="green"
          pulse
          dots
          overlay
          message="جارٍ تسجيل الدخول..."
        />
      )}

      <SignInForm
        formData={signInData}
        handleInputChange={handleSignInChange}
        onSubmit={handleSignInSubmit}
        isLoading={isLoading}
      />
    </LoginTemplate>
  );
};

export default LoginPage;