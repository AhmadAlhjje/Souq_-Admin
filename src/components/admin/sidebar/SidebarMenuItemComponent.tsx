"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import useTheme from "@/hooks/useTheme";
import { SidebarMenuItem } from "@/types/admin";
import SidebarMenuContent from "./SidebarMenuContent";

interface SidebarMenuItemProps {
  item: SidebarMenuItem;
  level?: number;
  isOpen: boolean;
  expandedItems: string[];
  onToggleExpanded: (itemId: string) => void;
  onItemClick: (itemId: string, href?: string) => void; // تم تعديل التوقيع
}

const SidebarMenuItemComponent: React.FC<SidebarMenuItemProps> = ({
  item,
  level = 0,
  isOpen,
  expandedItems,
  onToggleExpanded,
  onItemClick,
}) => {
  const { isDark } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const isActiveRoute = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isActive = item.href ? isActiveRoute(item.href) : false;
  const isExpanded = expandedItems.includes(item.id);
  const hasChildren = Boolean(item.children && item.children.length > 0);

  const handleClick = () => {
    // استدعاء دالة النقر من المكون الأب مع تمرير معلومات العنصر
    onItemClick(item.id, item.href);

    // إذا لم يكن عنصر تسجيل الخروج ولديه رابط، انتقل إليه
    if (item.id !== "logout" && item.href && !hasChildren) {
      router.push(item.href);
    }

    // إذا كان لديه عناصر فرعية، فقم بتوسيعه/طيه
    if (hasChildren) {
      onToggleExpanded(item.id);
    }
  };

  const handleChildClick = (child: SidebarMenuItem) => {
    // استدعاء دالة النقر للعنصر الفرعي
    onItemClick(child.id, child.href);

    // الانتقال إلى رابط العنصر الفرعي إذا لم يكن تسجيل خروج
    if (child.id !== "logout" && child.href) {
      router.push(child.href);
    }
  };
  
  return (
    <div className="w-full">
      <div
        className={`
          flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
          ${level > 0 ? "mr-4" : ""}
          ${
            isActive
              ? item.id === "dashboard"
                ? isDark
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-[#004D5A] text-white shadow-lg"
                : "bg-teal-500 text-white shadow-lg"
              : isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-[#004D5A] hover:bg-[#CFF7EE] hover:text-[#004D5A]"
          }
          ${item.id === "logout" ? "hover:bg-red-100 hover:text-red-600" : ""} // تنسيق خاص لزر تسجيل الخروج
        `}
        onClick={handleClick}
      >
        <SidebarMenuContent
          item={item}
          isActive={isActive}
          isExpanded={isExpanded}
          isOpen={isOpen}
          hasChildren={hasChildren}
          onToggleExpanded={onToggleExpanded}
          onItemClick={() => handleClick()} // تمرير دالة النقر
        />
      </div>

      {/* Sub Menu */}
      <AnimatePresence>
        {hasChildren && isExpanded && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-1">
              {item.children?.map((child) => (
                <SidebarMenuItemComponent
                  key={child.id}
                  item={child}
                  level={level + 1}
                  isOpen={isOpen}
                  expandedItems={expandedItems}
                  onToggleExpanded={onToggleExpanded}
                  onItemClick={onItemClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarMenuItemComponent;