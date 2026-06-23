"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, UserPlus, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import TermsModal from "@/components/public/TermsModal";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form,         setForm]         = useState({ name: "", email: "", password: "", confirm: "" });
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  // Terms state
  const [termsAccepted,  setTermsAccepted]  = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const { login } = useAuth();
  const router    = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("برای ادامه باید قوانین و مقررات را بپذیرید");
      return;
    }
    if (form.password !== form.confirm) {
      setError("رمزهای عبور مطابقت ندارند");
      return;
    }
    setError("");
    setLoading(true);
    try {
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
          <h1 className="text-xl font-bold text-navy mb-1">ایجاد حساب کاربری</h1>
          <p className="text-navy-muted text-sm mb-6">به کتابخانه ما بپیوندید</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label">نام و نام خانوادگی</label>
              <input
                type="text" className="input-field"
                placeholder="مثلاً علی محمدی"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">ایمیل</label>
              <input
                type="email" className="input-field"
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">رمز عبور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pl-10"
                  placeholder="حداقل ۸ کاراکتر"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  minLength={8} required disabled={loading}
                />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-muted hover:text-navy">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">تکرار رمز عبور</label>
              <input
                type="password" className="input-field"
                placeholder="رمز عبور را دوباره وارد کنید"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required disabled={loading}
              />
            </div>

            {/* ─── Terms section ─────────────────────────────────── */}
            <div className={`rounded-xl border-2 p-4 transition-all ${
              termsAccepted
                ? "border-emerald-200 bg-emerald-50"
                : "border-border bg-parchment/50"
            }`}>
              {termsAccepted ? (
                /* Accepted state */
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={20} className="text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-emerald-700">قوانین و مقررات پذیرفته شد</p>
                      <p className="text-xs text-emerald-600 mt-0.5">با موفقیت مطالعه و تأیید شد</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTermsAccepted(false)}
                    className="text-xs text-emerald-600 hover:text-emerald-800 underline"
                  >
                    لغو
                  </button>
                </div>
              ) : (
                /* Not accepted state */
                <div>
                  <p className="text-sm text-navy font-medium mb-1">پذیرش قوانین و مقررات</p>
                  <p className="text-xs text-navy-muted mb-3 leading-relaxed">
                    برای ثبت‌نام باید قوانین استفاده از کتابخانه را مطالعه و تأیید کنید.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="flex-1 bg-white border border-border hover:border-crimson/40 hover:bg-crimson-light text-navy text-sm font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={15} className="text-crimson" />
                      مطالعه و پذیرش قوانین
                    </button>
                    <Link
                      href="/terms"
                      target="_blank"
                      className="p-2 rounded-lg border border-border hover:bg-parchment text-navy-muted hover:text-navy transition-colors"
                      title="مشاهده در صفحه جدید"
                    >
                      <ExternalLink size={15} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !termsAccepted}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Loader2 size={17} className="animate-spin" />در حال ثبت‌نام...</>
                : <><UserPlus size={17} />ثبت‌نام</>}
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

      {/* Terms Modal */}
      {showTermsModal && (
        <TermsModal
          onAccept={() => { setTermsAccepted(true); setShowTermsModal(false); setError(""); }}
          onDecline={() => setShowTermsModal(false)}
        />
      )}
    </div>
  );
}
