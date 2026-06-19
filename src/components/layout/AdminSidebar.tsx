"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Users,
  ClipboardList,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { label: "داشبورد", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "مدیریت کتاب‌ها", href: "/admin/books", icon: Library },
  { label: "رزروها", href: "/admin/reservations", icon: ClipboardList },
  { label: "کاربران", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="w-60 bg-navy min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-crimson rounded-lg flex items-center justify-center">
            <BookOpen size={17} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">کتابخانه</div>
            <div className="text-[10px] text-white/40 leading-tight">پنل مدیریت</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-white/30 text-[10px] font-medium px-3 pb-2 pt-1 uppercase tracking-wider">
          منو اصلی
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                isActive
                  ? "bg-crimson text-white"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon size={17} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronLeft size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 rounded-full bg-crimson/20 border border-crimson/30 flex items-center justify-center text-crimson text-xs font-bold shrink-0">
            {user?.name?.[0] ?? "م"}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-medium truncate">
              {user?.name ?? "مدیر سیستم"}
            </div>
            <div className="text-white/40 text-[10px] truncate">
              {user?.email ?? "admin@library.ir"}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 text-sm transition-colors"
        >
          <LogOut size={16} />
          خروج از سیستم
        </button>
      </div>
    </aside>
  );
}
