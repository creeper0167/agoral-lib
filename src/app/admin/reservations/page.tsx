"use client";

import { useState } from "react";
import { Search, Check, X } from "lucide-react";
import AdminHeader from "@/components/layout/AdminHeader";

type Status = "pending" | "active" | "returned" | "cancelled";

const initialReservations = [
  { id: 1, user: "علی محمدی", email: "ali@email.com", book: "بوف کور", reservedAt: "۱۴۰۳/۰۴/۰۱", dueDate: "۱۴۰۳/۰۴/۱۵", status: "active" as Status },
  { id: 2, user: "مریم احمدی", email: "maryam@email.com", book: "شازده کوچولو", reservedAt: "۱۴۰۳/۰۴/۰۲", dueDate: "۱۴۰۳/۰۴/۱۶", status: "pending" as Status },
  { id: 3, user: "حسن رضایی", email: "hasan@email.com", book: "فیزیک هالیدی", reservedAt: "۱۴۰۳/۰۳/۲۰", dueDate: "۱۴۰۳/۰۴/۰۴", status: "returned" as Status },
  { id: 4, user: "زهرا کریمی", email: "zahra@email.com", book: "مثنوی معنوی", reservedAt: "۱۴۰۳/۰۴/۰۳", dueDate: "۱۴۰۳/۰۴/۱۷", status: "active" as Status },
  { id: 5, user: "رضا نجفی", email: "reza@email.com", book: "کیمیاگر", reservedAt: "۱۴۰۳/۰۳/۲۵", dueDate: "۱۴۰۳/۰۴/۰۸", status: "cancelled" as Status },
];

const statusStyle: Record<Status, string> = {
  active: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  returned: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-500",
};
const statusLabel: Record<Status, string> = {
  active: "فعال", pending: "در انتظار", returned: "بازگشتی", cancelled: "لغو شده",
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState(initialReservations);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Status>("all");

  const filtered = reservations.filter((r) => {
    const matchQuery = r.user.includes(query) || r.book.includes(query);
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchQuery && matchStatus;
  });

  const updateStatus = (id: number, status: Status) => {
    setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  return (
    <>
      <AdminHeader title="مدیریت رزروها" subtitle={`${reservations.length} رزرو`} />
      <main className="flex-1 p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 w-64">
            <Search size={15} className="text-navy-muted shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی کاربر یا کتاب..."
              className="bg-transparent text-sm text-navy placeholder-navy-muted/50 focus:outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-1 bg-parchment rounded-lg p-1">
            {(["all", "active", "pending", "returned", "cancelled"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filterStatus === s ? "bg-white text-navy shadow-sm" : "text-navy-muted hover:text-navy"
                }`}
              >
                {s === "all" ? "همه" : statusLabel[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-parchment border-b border-border">
                <tr className="text-navy-muted text-right">
                  <th className="px-5 py-3.5 font-medium">کاربر</th>
                  <th className="px-5 py-3.5 font-medium">کتاب</th>
                  <th className="px-5 py-3.5 font-medium">تاریخ رزرو</th>
                  <th className="px-5 py-3.5 font-medium">مهلت بازگشت</th>
                  <th className="px-5 py-3.5 font-medium">وضعیت</th>
                  <th className="px-5 py-3.5 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center text-navy-muted">موردی یافت نشد</td></tr>
                )}
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-parchment/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-navy">{r.user}</div>
                      <div className="text-xs text-navy-muted">{r.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-navy">{r.book}</td>
                    <td className="px-5 py-3.5 text-navy-muted">{r.reservedAt}</td>
                    <td className="px-5 py-3.5 text-navy-muted">{r.dueDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${statusStyle[r.status]}`}>{statusLabel[r.status]}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {r.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(r.id, "active")}
                              className="p-1.5 rounded-lg text-navy-muted hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="تأیید"
                            >
                              <Check size={15} />
                            </button>
                            <button
                              onClick={() => updateStatus(r.id, "cancelled")}
                              className="p-1.5 rounded-lg text-navy-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="رد"
                            >
                              <X size={15} />
                            </button>
                          </>
                        )}
                        {r.status === "active" && (
                          <button
                            onClick={() => updateStatus(r.id, "returned")}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            ثبت بازگشت
                          </button>
                        )}
                        {(r.status === "returned" || r.status === "cancelled") && (
                          <span className="text-xs text-navy-muted">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
