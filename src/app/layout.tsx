import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "کتابخانه دیجیتال",
  description: "جستجو، رزرو و مدیریت کتاب‌های کتابخانه",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-vazir antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
