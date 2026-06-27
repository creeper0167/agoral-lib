"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Menu, X, User, LogIn, LogOut, ClipboardList } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
    setMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-crimson rounded-lg flex items-center justify-center shadow-sm">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-navy">آگورا</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="btn-ghost text-sm">صفحه اصلی</Link>
            <Link href="/books" className="btn-ghost text-sm">همه کتاب‌ها</Link>
            <Link href="/categories" className="btn-ghost text-sm">دسته‌بندی‌ها</Link>
            <Link href="/about" className="btn-ghost text-sm">درباره ما</Link>
            {isAdmin && (
              <Link href="/admin/dashboard" className="btn-ghost text-sm text-crimson font-medium">
                پنل مدیریت
              </Link>
            )}
          </nav>

          {/* Auth — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/reserve"
                  className="btn-ghost text-sm flex items-center gap-1.5"
                >
                  <ClipboardList size={16} />
                  رزروهای من
                </Link>
                <div className="flex items-center gap-2 bg-parchment border border-border rounded-lg px-3 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-crimson-light border border-crimson/20 flex items-center justify-center text-crimson text-xs font-bold">
                    {user?.name?.[0]}
                  </div>
                  <span className="text-sm text-navy font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-ghost text-sm flex items-center gap-1.5 text-navy-muted"
                >
                  <LogOut size={16} />
                  خروج
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="btn-secondary text-sm flex items-center gap-1.5">
                  <LogIn size={16} />
                  ورود
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm">
                  ثبت‌نام
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-parchment transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="منو"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-parchment text-sm text-navy">صفحه اصلی</Link>
          <Link href="/books" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-parchment text-sm text-navy">همه کتاب‌ها</Link>
          <Link href="/categories" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-parchment text-sm text-navy">دسته‌بندی‌ها</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-parchment text-sm text-navy">درباره ما</Link>
          {isAdmin && (
            <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-parchment text-sm text-crimson font-medium">پنل مدیریت</Link>
          )}
          {isAuthenticated ? (
            <div className="pt-2 border-t border-border space-y-1">
              <Link href="/reserve" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-parchment text-sm text-navy flex items-center gap-2">
                <ClipboardList size={15} /> رزروهای من
              </Link>
              <button onClick={handleLogout} className="w-full text-right py-2.5 px-3 rounded-lg hover:bg-red-50 text-sm text-red-500 flex items-center gap-2">
                <LogOut size={15} /> خروج از حساب
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-border flex gap-2">
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm flex-1 text-center">ورود</Link>
              <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-sm flex-1 text-center">ثبت‌نام</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
