"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";

// Import components
import ThemeToggle from "./header/ThemeToggle";
import LanguageToggle from "./header/LanguageToggle";
import NotificationDropdown from "./header/NotificationDropdown";
import UserMenu from "./header/UserMenu";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  title,
}) => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();

  const language = i18n.language || "ar";
  const isRTL = language === "ar";
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      className={`h-16 transition-colors duration-200 ${
        isDark
          ? "bg-gray-900 border-b border-gray-700"
          : "bg-white shadow-sm border-b border-gray-100"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Menu Button */}
        <div className="flex items-center gap-4 order-0">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg transition-colors lg:hidden ${
              isDark
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-50 text-gray-600"
            }`}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2 order-1">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className={`w-10 h-10 rounded-full transition-colors flex items-center justify-center md:hidden ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            <Menu size={18} />
          </button>

          <ThemeToggle />
          <LanguageToggle />
          
          <UserMenu
            showUserMenu={showUserMenu}
            setShowUserMenu={setShowUserMenu}
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;