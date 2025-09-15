// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // حماية صفحات الـ admin
  if (pathname.startsWith("/superAdmin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/LoginPage", request.url));
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // التحقق من انتهاء صلاحية التوكن
      if (payload.exp && payload.exp < Date.now() / 1000) {
        const response = NextResponse.redirect(new URL("/LoginPage", request.url));
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }

      // التحقق من أن المستخدم لديه دور admin
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/LoginPage", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // في حالة خطأ في فك تشفير التوكن
      const response = NextResponse.redirect(new URL("/LoginPage", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  // إعادة التوجيه من صفحة تسجيل الدخول إذا كان المستخدم admin مسجل دخول
  if (pathname === "/LoginPage" && token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // التحقق من صحة التوكن وأن المستخدم admin
      if (
        payload.exp &&
        payload.exp >= Date.now() / 1000 &&
        payload.role === "admin"
      ) {
          return NextResponse.redirect(new URL("/superAdmin/dashboard/StoresPage", request.url));
      }
    } catch {
      // في حالة خطأ في فك تشفير التوكن، امسح الكوكيز
      const response = NextResponse.next();
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  // إعادة التوجيه من الصفحة الرئيسية إذا كان المستخدم admin
  if (pathname === "/" && token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (
        payload.exp &&
        payload.exp >= Date.now() / 1000 &&
        payload.role === "admin"
      ) {
          return NextResponse.redirect(new URL("/superAdmin/dashboard/StoresPage", request.url));
      }
    } catch {
      const response = NextResponse.next();
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};