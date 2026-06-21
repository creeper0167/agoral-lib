"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle, XCircle, RotateCcw, Loader2 } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { ReservationRowSkeleton } from "@/components/ui/Skeleton";
import { reservationsApi, booksApi, ReservationDto } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

type Status = ReservationDto["status"];

const statusConfig: Record<Status, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending:   { label: "در انتظار تأیید",  icon: Clock,       color: "text-amber-600",  bg: "bg-amber-50 border-amber-100"    },
  active:    { label: "فعال",             icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100"},
  returned:  { label: "بازگردانده شده",   icon: RotateCcw,   color: "text-blue-600",   bg: "bg-blue-50 border-blue-100"      },
  cancelled: { label: "لغو شده",          icon: XCircle,     color: "text-red-500",    bg: "bg-red-50 border-red-100"        },
};

export default function ReservePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState<"all" | Status>("all");
  const [cancelling,   setCancelling]   = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/auth/login?redirect=/reserve");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    reservationsApi.getMine()
      .then(setReservations)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleCancel = async (id: number) => {
    setCancelling(id);
    try {
      const updated = await reservationsApi.updateStatus(id, "cancelled");
      setReservations((prev) => prev.map((r) => r.id === id ? updated : r));
    } catch (e) { console.error(e); }
    finally { setCancelling(null); }
  };

  const filtered = activeTab === "all"
    ? reservations
    : reservations.filter((r) => r.status === activeTab);

  return (
    <>
      <PublicHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">رزروهای من</h1>
            <p className="text-navy-muted text-sm mt-1">{reservations.length} رزرو</p>
          </div>
          <Link href="/" className="btn-primary text-sm flex items-center gap-2">
            <BookOpen size={15} />رزرو جدید
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-parchment rounded-lg p-1 mb-6 w-fit">
          {(["all", "active", "pending", "returned", "cancelled"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? "bg-white text-navy shadow-sm" : "text-navy-muted hover:text-navy"}`}>
              {tab === "all" ? "همه" : statusConfig[tab].label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {authLoading || loading ? (
            Array.from({ length: 4 }).map((_, i) => <ReservationRowSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={44} className="text-border mx-auto mb-4" />
              <p className="text-navy-muted">رزروی در این دسته وجود ندارد</p>
            </div>
          ) : (
            filtered.map((res) => {
              const { label, icon: Icon, color, bg } = statusConfig[res.status];
              const coverUrl = booksApi.coverUrl(res.book?.cover);
              return (
                <div key={res.id} className="card flex items-center gap-5">
                  <div className="w-14 h-20 rounded-lg border border-border overflow-hidden bg-parchment shrink-0 flex items-center justify-center">
                    {coverUrl
                      ? <img src={coverUrl} alt={res.book?.title} className="w-full h-full object-cover" />
                      : <BookOpen size={22} className="text-border" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/book/${res.bookId}`} className="font-bold text-navy hover:text-crimson transition-colors line-clamp-1">
                      {res.book?.title ?? `کتاب #${res.bookId}`}
                    </Link>
                    <p className="text-navy-muted text-sm">{res.book?.author}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-navy-muted">
                      <span>رزرو: {res.reservedAt}</span>
                      <span>مهلت: {res.dueDate}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium shrink-0 ${bg} ${color}`}>
                    <Icon size={14} />{label}
                  </div>
                  {res.status === "pending" && (
                    <button onClick={() => handleCancel(res.id)} disabled={cancelling === res.id}
                      className="btn-ghost text-sm text-red-500 hover:bg-red-50 shrink-0 disabled:opacity-50">
                      {cancelling === res.id ? <Loader2 size={14} className="animate-spin" /> : "لغو"}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
