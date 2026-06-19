"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ارسال ایمیل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
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
          {!sent ? (
            <>
              <h1 className="text-xl font-bold text-navy mb-1">فراموشی رمز عبور</h1>
              <p className="text-navy-muted text-sm mb-6">
                ایمیل خود را وارد کنید تا لینک بازیابی برایتان ارسال شود.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">ایمیل</label>
                  <div className="relative">
                    <input
                      type="email"
                      className="input-field pl-10"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-muted" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 size={17} className="animate-spin" />در حال ارسال...</>
                  ) : (
                    "ارسال لینک بازیابی"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <h2 className="font-bold text-navy text-lg mb-2">ایمیل ارسال شد</h2>
              <p className="text-navy-muted text-sm leading-relaxed">
                اگر حساب کاربری با این ایمیل وجود داشته باشد، لینک بازیابی رمز
                عبور برایتان ارسال خواهد شد.
              </p>
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-border text-center">
            <Link
              href="/auth/login"
              className="text-crimson text-sm font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all"
            >
              <ArrowRight size={14} />
              بازگشت به صفحه ورود
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
