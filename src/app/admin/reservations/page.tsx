"use client";

import { useState, useEffect } from "react";
import { Search, Check, X, Loader2 } from "lucide-react";
import AdminHeader from "@/components/layout/AdminHeader";
import { AdminTableSkeleton } from "@/components/ui/Skeleton";
import { reservationsApi, ReservationDto } from "@/lib/api";

type Status = ReservationDto["status"];

const statusStyle: Record<Status, string> = {
  active:    "bg-emerald-50 text-emerald-700",
  pending:   "bg-amber-50 text-amber-700",
  returned:  "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-500",
};
const statusLabel: Record<Status, string> = {
  active: "فعال", pending: "در انتظار", returned: "بازگشتی", cancelled: "لغو شده",
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [query,        setQuery]        = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Status>("all");
  const [updating,     setUpdating]     = useState<number | null>(null);

  useEffect(() => {
    reservationsApi.getAll()
      .then(setReservations)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: Status) => {
    setUpdating(id);
    try {
      const updated = await reservationsApi.updateStatus(id, status);
      setReservations((prev) => prev.map((r) => r.id === id ? updated : r));
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  const filtered = reservations.filter((r) => {
    const matchQ = !query || r.user?.name.includes(query) || r.book?.title.includes(query);
    const matchS = filterStatus === "all" || r.status === filterStatus;
    return matchQ && matchS;
  });

  return (
    <>
      <AdminHeader title="مدیریت رزروها" subtitle={`${reservations.length} رزرو`} />
      <main className="flex-1 p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 w-64">
            <Search size={15} className="text-navy-muted shrink-0" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی کاربر یا کتاب..."
              className="bg-transparent text-sm text-navy placeholder-navy-muted/50 focus:outline-none w-full" />
          </div>
          <div className="flex items-center gap-1 bg-parchment rounded-lg p-1">
            {(["all", "active", "pending", "returned", "cancelled"] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterStatus === s ? "bg-white text-navy shadow-sm" : "text-navy-muted hover:text-navy"}`}>
                {s === "all" ? "همه" : statusLabel[s]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <AdminTableSkeleton cols={6} rows={8} />
        ) : (
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
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-navy-muted">موردی یافت نشد</td></tr>
                  ) : filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-parchment/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-navy">{r.user?.name ?? "—"}</div>
                        <div className="text-xs text-navy-muted">{r.user?.email}</div>
                      </td>
                      <td className="px-5 py-3.5 text-navy">{r.book?.title ?? `#${r.bookId}`}</td>
                      <td className="px-5 py-3.5 text-navy-muted">{r.reservedAt}</td>
                      <td className="px-5 py-3.5 text-navy-muted">{r.dueDate}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${statusStyle[r.status]}`}>{statusLabel[r.status]}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {updating === r.id ? (
                          <Loader2 size={16} className="animate-spin text-crimson" />
                        ) : (
                          <div className="flex items-center gap-1">
                            {r.status === "pending" && (
                              <>
                                <button onClick={() => updateStatus(r.id, "active")}
                                  className="p-1.5 rounded-lg text-navy-muted hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="تأیید">
                                  <Check size={15} />
                                </button>
                                <button onClick={() => updateStatus(r.id, "cancelled")}
                                  className="p-1.5 rounded-lg text-navy-muted hover:text-red-500 hover:bg-red-50 transition-colors" title="رد">
                                  <X size={15} />
                                </button>
                              </>
                            )}
                            {r.status === "active" && (
                              <button onClick={() => updateStatus(r.id, "returned")}
                                className="text-xs text-blue-600 hover:underline font-medium">
                                ثبت بازگشت
                              </button>
                            )}
                            {(r.status === "returned" || r.status === "cancelled") && (
                              <span className="text-xs text-navy-muted">—</span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
