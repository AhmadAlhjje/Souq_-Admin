import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Store,
  BarChart3,
  Bell,
  Tag,
  Truck,
  CreditCard,
  HelpCircle,
  LogOut,
  FileText,
  DollarSign,
  Plus,
  User,
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
      label: t("sidebar.dashboard"),
      icon: LayoutDashboard,
      href: "/superAdmin/dashboard",
    },
    {
      id: "products",
      label: t("sidebar.products.main"),
      icon: Package,
      children: [
        {
          id: "all-products",
          label: t("sidebar.products.all"),
          icon: Package,
          href: "/superAdmin/dashboard/products",
        },
        {
          id: "add-product",
          label: t("sidebar.products.add"),
          icon: Plus,
          href: "/superAdmin/dashboard/addproducts",
        },
      ],
    },
    {
      id: "orders",
      label: t("sidebar.orders.main"),
      icon: ShoppingCart,
      // badge: 12,
      children: [
        {
          id: "all-orders",
          label: t("sidebar.orders.all"),
          icon: ShoppingCart,
          href: "/adsuperAdminmin/dashboard/orders",
        },
        
      ],
    },
    {
      id: "profile",
      label: t("sidebar.profile"),
      icon: User, // أو User2, UserCircle, Settings
      href: "/superAdmin/dashboard/profile",
    },
    {
      id: "create-store",
      label: t("sidebar.createStore"),
      icon: Store,
      href: "/superAdmin/dashboard/creatingStore",
    },
  ],
  bottomMenuItems: [
    {
      id: "help",
      label: t("sidebar.bottom.help"),
      icon: HelpCircle,
      href: "/superAdmin/help",
    },
    {
      id: "logout",
      label: t("sidebar.bottom.logout"),
      icon: LogOut,
      href: "/logout",
    },
  ],
});

// Customer Dashboard Sidebar Configuration
export const getCustomerSidebarConfig = (t: any): SidebarConfig => ({
  header: {
    title: t("customer.sidebar.header.title"),
    subtitle: t("customer.sidebar.header.subtitle"),
    icon: Users,
  },
  mainMenuItems: [
    {
      id: "dashboard",
      label: t("customer.sidebar.dashboard"),
      icon: LayoutDashboard,
      href: "/customer/dashboard",
    },
    {
      id: "orders",
      label: t("customer.sidebar.orders"),
      icon: ShoppingCart,
      href: "/customer/orders",
      // badge: 3,
    },
    {
      id: "profile",
      label: t("customer.sidebar.profile"),
      icon: Users,
      href: "/customer/profile",
    },
  ],
  bottomMenuItems: [
    {
      id: "help",
      label: t("customer.sidebar.help"),
      icon: HelpCircle,
      href: "/customer/help",
    },
    {
      id: "logout",
      label: t("customer.sidebar.logout"),
      icon: LogOut,
      href: "/logout",
    },
  ],
});
