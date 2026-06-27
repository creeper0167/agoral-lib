"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Loader2, LogIn, X } from "lucide-react";
import Link from "next/link";
import { ratingsApi, BookRatingSummaryDto } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface BookRatingWidgetProps {
  bookId: number;
  onRatingChange?: (average: number | undefined, total: number) => void;
}

// ─── Distribution bar row ─────────────────────────────────────────────────────

function DistributionBar({
  star,
  count,
  total,
  highlight,
}: {
  star: number;
  count: number;
  total: number;
  highlight: boolean;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs group">
      <span className={`w-3 text-left font-medium shrink-0 ${highlight ? "text-amber-500" : "text-navy-muted"}`}>
        {star}
      </span>
      <Star
        size={11}
        className={`shrink-0 ${highlight ? "fill-amber-400 text-amber-400" : "fill-border text-border"}`}
      />
      <div className="flex-1 h-2 bg-parchment rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${highlight ? "bg-amber-400" : "bg-border"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-5 text-left text-navy-muted shrink-0">{count}</span>
    </div>
  );
}

// ─── Interactive star row for rating ─────────────────────────────────────────

function InteractiveStars({
  selected,
  onRate,
  disabled,
}: {
  selected: number;
  onRate: (v: number) => void;
  disabled: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  const labels: Record<number, string> = {
    1: "ضعیف", 2: "متوسط", 3: "خوب", 4: "خیلی خوب", 5: "عالی",
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = (hovered || selected) >= star;
          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onRate(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-125 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              aria-label={`${star} ستاره`}
            >
              <Star
                size={28}
                className={`transition-colors duration-100 ${
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-border hover:text-amber-300"
                }`}
              />
            </button>
          );
        })}
      </div>
      <span className="text-xs text-navy-muted h-4 transition-all">
        {hovered > 0 ? labels[hovered] : selected > 0 ? labels[selected] : ""}
      </span>
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export default function BookRatingWidget({ bookId, onRatingChange }: BookRatingWidgetProps) {
  const { isAuthenticated } = useAuth();
  const [summary,  setSummary]  = useState<BookRatingSummaryDto | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  const loadSummary = useCallback(async () => {
    try {
      const data = await ratingsApi.getSummary(bookId);
      setSummary(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => { loadSummary(); }, [loadSummary]);

  const handleRate = async (value: number) => {
    if (!isAuthenticated || saving) return;
    // Optimistic update
    setSummary(prev => prev ? { ...prev, userRating: value } : prev);
    setSaving(true);
    setError("");
    try {
      const updated = await ratingsApi.rate(bookId, value);
      setSummary(updated);
      onRatingChange?.(updated.average, updated.totalRatings);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در ثبت امتیاز");
      await loadSummary(); // revert
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated || saving) return;
    const prev = summary;
    setSummary(s => s ? { ...s, userRating: undefined } : s);
    setSaving(true);
    try {
      const updated = await ratingsApi.deleteRating(bookId);
      setSummary(updated);
      onRatingChange?.(updated.average, updated.totalRatings);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در حذف امتیاز");
      setSummary(prev);
    } finally {
      setSaving(false);
    }
  };

  // ── Skeleton ──
  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex gap-6">
          <div className="space-y-2">
            <div className="h-14 w-20 bg-parchment rounded-lg" />
            <div className="h-4 w-16 bg-parchment rounded" />
          </div>
          <div className="flex-1 space-y-2 pt-1">
            {[5, 4, 3, 2, 1].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className="h-3 w-3 bg-parchment rounded" />
                <div className="flex-1 h-2 bg-parchment rounded-full" />
                <div className="h-3 w-4 bg-parchment rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const total = summary?.totalRatings ?? 0;
  const avg   = summary?.average;
  const dist  = summary?.distribution ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <div className="card">
      <h3 className="font-bold text-navy mb-5 flex items-center gap-2">
        <Star size={16} className="fill-amber-400 text-amber-400" />
        امتیاز کاربران
      </h3>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* ── Left: big average score ── */}
        <div className="flex flex-col items-center justify-center shrink-0 sm:w-32">
          {avg ? (
            <>
              <span className="text-5xl font-black text-navy leading-none">{avg}</span>
              <span className="text-xs text-navy-muted mt-1">از ۵</span>
              {/* Read-only stars showing average */}
              <div className="flex items-center gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map(s => {
                  const filled   = avg >= s;
                  const halfFill = !filled && avg >= s - 0.5;
                  return (
                    <div key={s} className="relative w-4 h-4">
                      <Star size={16} className="absolute fill-border text-border" />
                      {(filled || halfFill) && (
                        <div
                          className="absolute overflow-hidden"
                          style={{ width: filled ? "100%" : "50%" }}
                        >
                          <Star size={16} className="fill-amber-400 text-amber-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-xs text-navy-muted mt-1.5">{total} رأی</span>
            </>
          ) : (
            <div className="text-center">
              <Star size={32} className="text-border mx-auto mb-1" />
              <span className="text-xs text-navy-muted">بدون امتیاز</span>
            </div>
          )}
        </div>

        {/* ── Right: distribution bars ── */}
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map(star => (
            <DistributionBar
              key={star}
              star={star}
              count={dist[star] ?? 0}
              total={total}
              highlight={summary?.userRating === star}
            />
          ))}
        </div>
      </div>

      {/* ── User rating section ── */}
      <div className="mt-6 pt-5 border-t border-border">
        {isAuthenticated ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium text-navy">
              {summary?.userRating ? "امتیاز شما" : "امتیاز بدهید"}
            </p>
            <div className="relative">
              <InteractiveStars
                selected={summary?.userRating ?? 0}
                onRate={handleRate}
                disabled={saving}
              />
              {saving && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded">
                  <Loader2 size={18} className="animate-spin text-crimson" />
                </div>
              )}
            </div>
            {summary?.userRating && (
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-1 text-xs text-navy-muted hover:text-red-500 transition-colors disabled:opacity-40"
              >
                <X size={12} /> حذف امتیاز من
              </button>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-navy">می‌خواهید امتیاز بدهید؟</p>
              <p className="text-xs text-navy-muted mt-0.5">برای ثبت امتیاز وارد حساب شوید</p>
            </div>
            <Link
              href={`/auth/login?redirect=/book/${bookId}`}
              className="btn-primary text-sm flex items-center gap-1.5 shrink-0"
            >
              <LogIn size={14} />ورود
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
