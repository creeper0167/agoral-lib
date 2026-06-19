"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("رمزهای عبور مطابقت ندارند");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Register then auto-login
      await authApi.register({ name: form.name, email: form.email, password: form.password });
      await login(form.email, form.password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت‌نام، لطفاً دوباره امتحان کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-crimson rounded-xl flex items-center justify-center shadow-md">
              <BookOpen size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-navy">کتابخانه دیجیتال</span>
          </Link>
        </div>

        <div className="card shadow-md">
          <h1 className="text-xl font-bold text-navy mb-1">ایجاد حساب کاربری</h1>
          <p className="text-navy-muted text-sm mb-6">به کتابخانه ما بپیوندید</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">نام و نام خانوادگی</label>
              <input
                type="text"
                className="input-field"
                placeholder="مثلاً علی محمدی"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>

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
              <label className="label">رمز عبور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pl-10"
                  placeholder="حداقل ۸ کاراکتر"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  minLength={8}
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

            <div>
              <label className="label">تکرار رمز عبور</label>
              <input
                type="password"
                className="input-field"
                placeholder="رمز عبور را دوباره وارد کنید"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" id="terms" className="w-4 h-4 accent-crimson mt-0.5" required />
              <label htmlFor="terms" className="text-sm text-navy-muted cursor-pointer leading-relaxed">
                با{" "}
                <a href="/terms" className="text-crimson hover:underline">قوانین و مقررات</a>
                {" "}سایت موافقم
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={17} className="animate-spin" />در حال ثبت‌نام...</>
              ) : (
                <><UserPlus size={17} />ثبت‌نام</>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border text-center text-sm text-navy-muted">
            حساب کاربری دارید؟{" "}
            <Link href="/auth/login" className="text-crimson font-medium hover:underline">
              وارد شوید
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
