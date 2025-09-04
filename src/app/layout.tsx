/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// استيراد الـ Providers
import Providers from "@/components/providers/Providers";
import ConditionalHeader from "@/components/ConditionalHeader";
import { ToastProvider } from "@/hooks/useToast";
import { StoreProvider } from "@/contexts/StoreContext";
import SessionManager from "@/utils/SessionManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "سوق - متجرك الإلكتروني",
  description: "منصة التجارة الإلكترونية الرائدة في المنطقة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-cairo`}
        style={{ fontFamily: "Cairo, sans-serif" }}
        suppressHydrationWarning
      >
        <Providers>
          <ConditionalHeader />
          <ToastProvider>
            <StoreProvider>
              <SessionManager />
              <main>{children}</main>
            </StoreProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}