"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ایمیل یا رمز عبور اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-crimson rounded-xl flex items-center justify-center shadow-md">
              <BookOpen size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-navy">کتابخانه دیجیتال</span>
          </Link>
        </div>

        <div className="card shadow-md">
          <h1 className="text-xl font-bold text-navy mb-1">ورود به حساب</h1>
          <p className="text-navy-muted text-sm mb-6">خوش برگشتید!</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">ایمیل</label>
              <input
                type="email"
                className="input-field"
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">رمز عبور</label>
                <Link href="/auth/forgot-password" className="text-xs text-crimson hover:underline">
                  فراموشی رمز؟
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pl-10"
                  placeholder="رمز عبور خود را وارد کنید"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-muted hover:text-navy"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 accent-crimson" />
              <label htmlFor="remember" className="text-sm text-navy-muted cursor-pointer">
                مرا به خاطر بسپار
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={17} className="animate-spin" />در حال ورود...</>
              ) : (
                <><LogIn size={17} />ورود</>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border text-center text-sm text-navy-muted">
            حساب کاربری ندارید؟{" "}
            <Link href="/auth/signup" className="text-crimson font-medium hover:underline">
              ثبت‌نام کنید
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-navy-muted mt-6">
          <Link href="/" className="hover:text-crimson transition-colors">← بازگشت به صفحه اصلی</Link>
        </p>
      </div>
    </div>
  );
}
