import {
  LayoutDashboard,
  Store,
  HelpCircle,
  LogOut,
  User,
  Receipt,
  AlertTriangle,
  Building2,
  Package,
} from "lucide-react";
import { SidebarConfig } from "@/types/admin";

// Admin Dashboard Sidebar Configuration
export const getAdminSidebarConfig = (t: any): SidebarConfig => ({
  header: {
    title: t("sidebar.header.title"),
    subtitle: t("sidebar.header.subtitle"),
    icon: Store,
  },
  mainMenuItems: [
    {
      id: "dashboard",
      label: t("sidebar.dashboard"), // "لوحة التحكم"
      icon: LayoutDashboard,
      href: "/superAdmin/dashboard",
    },
    {
      id: "stores",
      label: t("sidebar.stores"), // "عرض المتاجر"
      icon: Building2, // بدلاً من Storefront
      href: "/superAdmin/dashboard/StoresPage",
    },
    {
      id: "invoices",
      label: t("sidebar.invoices"), // "كشف الفواتير"
      icon: Receipt, // أو FileText
      href: "/superAdmin/dashboard/invoices",
    },
    {
      id: "orders",
      label: t("sidebar.orders.main"), // "الطلبات"
      icon: Package,
      href: "/superAdmin/dashboard/orders",
    },
    {
      id: "zero-notifications",
      label: t("sidebar.zeroNotifications"), // "عرض اشعارات التصفير"
      icon: AlertTriangle, // أو Bell
      href: "/superAdmin/dashboard/zero-notifications",
      // badge: 5, // يمكن إضافة عدد الإشعارات
    },
    {
      id: "profile",
      label: t("sidebar.profile"),
      icon: User,
      href: "/superAdmin/dashboard/profile",
    },
  ],
  bottomMenuItems: [
    // {
    //   id: "help",
    //   label: t("sidebar.bottom.help"),
    //   icon: HelpCircle,
    //   href: "/superAdmin/help",
    // },
    {
      id: "logout",
      label: t("sidebar.bottom.logout"),
      icon: LogOut,
      href: "/logout",
    },
  ],
});