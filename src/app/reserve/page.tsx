"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { books } from "@/lib/mock-data";

type Status = "pending" | "active" | "returned" | "cancelled";

const mockReservations = [
  { id: 1, bookId: 1, status: "active" as Status, reservedAt: "۱۴۰۳/۰۴/۰۱", dueDate: "۱۴۰۳/۰۴/۱۵" },
  { id: 2, bookId: 2, status: "returned" as Status, reservedAt: "۱۴۰۳/۰۳/۱۰", dueDate: "۱۴۰۳/۰۳/۲۵" },
  { id: 3, bookId: 4, status: "pending" as Status, reservedAt: "۱۴۰۳/۰۴/۰۵", dueDate: "۱۴۰۳/۰۴/۲۰" },
];

const statusConfig: Record<Status, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending: { label: "در انتظار تأیید", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  active: { label: "فعال", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  returned: { label: "بازگردانده شده", icon: RotateCcw, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  cancelled: { label: "لغو شده", icon: XCircle, color: "text-red-500", bg: "bg-red-50 border-red-100" },
};

export default function ReservePage() {
  const [activeTab, setActiveTab] = useState<"all" | Status>("all");

  const filtered = activeTab === "all"
    ? mockReservations
    : mockReservations.filter((r) => r.status === activeTab);

  return (
    <>
      <PublicHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">رزروهای من</h1>
            <p className="text-navy-muted text-sm mt-1">مدیریت کتاب‌های رزرو شده شما</p>
          </div>
          <Link href="/" className="btn-primary text-sm flex items-center gap-2">
            <BookOpen size={15} />
            رزرو جدید
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-parchment rounded-lg p-1 mb-6 w-fit">
          {[
            { key: "all", label: "همه" },
            { key: "active", label: "فعال" },
            { key: "pending", label: "در انتظار" },
            { key: "returned", label: "بازگشتی" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === key
                  ? "bg-white text-navy shadow-sm"
                  : "text-navy-muted hover:text-navy"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <BookOpen size={44} className="text-border mx-auto mb-4" />
              <p className="text-navy-muted">رزروی در این دسته وجود ندارد</p>
            </div>
          )}
          {filtered.map((res) => {
            const book = books.find((b) => b.id === res.bookId);
            if (!book) return null;
            const { label, icon: Icon, color, bg } = statusConfig[res.status];
            return (
              <div key={res.id} className="card flex items-center gap-5">
                {/* Cover */}
                <div className="w-14 h-20 bg-parchment rounded-lg border border-border flex items-center justify-center shrink-0">
                  <BookOpen size={22} className="text-border" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/book/${book.id}`} className="font-bold text-navy hover:text-crimson transition-colors line-clamp-1">
                    {book.title}
                  </Link>
                  <p className="text-navy-muted text-sm">{book.author}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-navy-muted">
                    <span>رزرو: {res.reservedAt}</span>
                    <span>مهلت: {res.dueDate}</span>
                  </div>
                </div>

                {/* Status */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium ${bg} ${color}`}>
                  <Icon size={14} />
                  {label}
                </div>

                {/* Cancel if pending */}
                {res.status === "pending" && (
                  <button className="btn-ghost text-sm text-red-500 hover:bg-red-50">
                    لغو
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
