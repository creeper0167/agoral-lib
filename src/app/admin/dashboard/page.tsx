"use client";

import { BookOpen, Users, ClipboardList, TrendingUp, ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdminHeader from "@/components/layout/AdminHeader";
import { books } from "@/lib/mock-data";

const stats = [
  { label: "کل کتاب‌ها", value: "۵۴۳", change: "+۱۲", icon: BookOpen, color: "bg-crimson-light text-crimson" },
  { label: "کاربران فعال", value: "۱٬۲۴۸", change: "+۵۶", icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "رزروهای فعال", value: "۸۹", change: "+۸", icon: ClipboardList, color: "bg-emerald-50 text-emerald-600" },
  { label: "رزروهای این ماه", value: "۳۲۴", change: "+۱۲٪", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
];

const recentReservations = [
  { id: 1, user: "علی محمدی", book: "بوف کور", date: "۱۴۰۳/۰۴/۰۵", status: "active" },
  { id: 2, user: "مریم احمدی", book: "شازده کوچولو", date: "۱۴۰۳/۰۴/۰۴", status: "pending" },
  { id: 3, user: "حسن رضایی", book: "فیزیک هالیدی", date: "۱۴۰۳/۰۴/۰۳", status: "returned" },
  { id: 4, user: "زهرا کریمی", book: "مثنوی معنوی", date: "۱۴۰۳/۰۴/۰۲", status: "active" },
  { id: 5, user: "رضا نجفی", book: "کیمیاگر", date: "۱۴۰۳/۰۴/۰۱", status: "cancelled" },
];

const statusStyle: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  returned: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-500",
};
const statusLabel: Record<string, string> = {
  active: "فعال",
  pending: "در انتظار",
  returned: "بازگشتی",
  cancelled: "لغو شده",
};

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader title="داشبورد" subtitle="خلاصه‌ای از وضعیت کتابخانه" />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, change, icon: Icon, color }) => (
            <div key={label} className="card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-navy-muted">{label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-navy">{value}</span>
                  <span className="text-xs text-emerald-600 flex items-center gap-0.5 font-medium">
                    <ArrowUpRight size={11} />
                    {change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Reservations */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-navy text-base">رزروهای اخیر</h2>
              <Link href="/admin/reservations" className="text-crimson text-sm flex items-center gap-1 hover:gap-2 transition-all">
                مشاهده همه <ArrowLeft size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-navy-muted text-right">
                    <th className="pb-3 font-medium">کاربر</th>
                    <th className="pb-3 font-medium">کتاب</th>
                    <th className="pb-3 font-medium">تاریخ</th>
                    <th className="pb-3 font-medium">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentReservations.map((r) => (
                    <tr key={r.id} className="hover:bg-parchment/50 transition-colors">
                      <td className="py-3 font-medium text-navy">{r.user}</td>
                      <td className="py-3 text-navy-muted">{r.book}</td>
                      <td className="py-3 text-navy-muted">{r.date}</td>
                      <td className="py-3">
                        <span className={`badge ${statusStyle[r.status]}`}>
                          {statusLabel[r.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low stock books */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-navy text-base">موجودی کم</h2>
              <Link href="/admin/books" className="text-crimson text-sm flex items-center gap-1 hover:gap-2 transition-all">
                مدیریت <ArrowLeft size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {books.filter((b) => b.availableCopies <= 2).map((book) => (
                <div key={book.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-parchment rounded-lg border border-border flex items-center justify-center shrink-0">
                    <BookOpen size={15} className="text-border" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy line-clamp-1">{book.title}</p>
                    <p className="text-xs text-navy-muted">{book.author}</p>
                  </div>
                  <span className={`badge font-semibold ${book.availableCopies === 0 ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-700"}`}>
                    {book.availableCopies} نسخه
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
