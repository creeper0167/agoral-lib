"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users, ClipboardList, TrendingUp, ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdminHeader from "@/components/layout/AdminHeader";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { adminApi, booksApi, DashboardStatsDto } from "@/lib/api";

const statusStyle: Record<string, string> = {
  active:    "bg-emerald-50 text-emerald-700",
  pending:   "bg-amber-50 text-amber-700",
  returned:  "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-500",
};
const statusLabel: Record<string, string> = {
  active: "فعال", pending: "در انتظار", returned: "بازگشتی", cancelled: "لغو شده",
};

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<DashboardStatsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <>
      <AdminHeader title="داشبورد" subtitle="خلاصه‌ای از وضعیت کتابخانه" />
      <DashboardSkeleton />
    </>
  );

  if (!stats) return null;

  const statCards = [
    { label: "کل کتاب‌ها",      value: stats.totalBooks.toLocaleString("fa"),         icon: BookOpen,      color: "bg-crimson-light text-crimson" },
    { label: "کاربران فعال",    value: stats.activeUsers.toLocaleString("fa"),         icon: Users,         color: "bg-blue-50 text-blue-600"      },
    { label: "رزروهای فعال",    value: stats.activeReservations.toLocaleString("fa"),  icon: ClipboardList, color: "bg-emerald-50 text-emerald-600" },
    { label: "رزروهای این ماه", value: stats.monthlyReservations.toLocaleString("fa"), icon: TrendingUp,    color: "bg-amber-50 text-amber-600"    },
  ];

  return (
    <>
      <AdminHeader title="داشبورد" subtitle="خلاصه‌ای از وضعیت کتابخانه" />
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-navy-muted">{label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-navy">{value}</span>
                  <ArrowUpRight size={14} className="text-emerald-600" />
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
                  {stats.recentReservations.length === 0 ? (
                    <tr><td colSpan={4} className="py-6 text-center text-navy-muted text-sm">هنوز رزروی ثبت نشده</td></tr>
                  ) : stats.recentReservations.map((r) => (
                    <tr key={r.id} className="hover:bg-parchment/50 transition-colors">
                      <td className="py-3 font-medium text-navy">{r.user?.name ?? "—"}</td>
                      <td className="py-3 text-navy-muted">{r.book?.title ?? `#${r.bookId}`}</td>
                      <td className="py-3 text-navy-muted">{r.reservedAt}</td>
                      <td className="py-3">
                        <span className={`badge ${statusStyle[r.status]}`}>{statusLabel[r.status]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-navy text-base">موجودی کم</h2>
              <Link href="/admin/books" className="text-crimson text-sm flex items-center gap-1 hover:gap-2 transition-all">
                مدیریت <ArrowLeft size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {stats.lowStockBooks.length === 0 ? (
                <p className="text-center text-navy-muted text-sm py-4">موجودی همه کتاب‌ها خوب است</p>
              ) : stats.lowStockBooks.map((book) => {
                const cover = booksApi.coverUrl(book.cover);
                return (
                  <div key={book.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg border border-border overflow-hidden bg-parchment shrink-0 flex items-center justify-center">
                      {cover ? <img src={cover} alt={book.title} className="w-full h-full object-cover" /> : <BookOpen size={15} className="text-border" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy line-clamp-1">{book.title}</p>
                      <p className="text-xs text-navy-muted">{book.author}</p>
                    </div>
                    <span className={`badge font-semibold shrink-0 ${book.availableCopies === 0 ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-700"}`}>
                      {book.availableCopies} نسخه
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
