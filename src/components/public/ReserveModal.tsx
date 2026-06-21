"use client";

import { useState } from "react";
import { X, BookOpen, CheckCircle, Loader2 } from "lucide-react";

interface ReserveModalProps {
  book: {
    id: number;
    title: string;
    author: string;
    category: string;
    cover?: string;      // resolved absolute URL or undefined
    available: boolean;
  };
  onClose: () => void;
  onConfirm: (bookId: number) => Promise<void>;
}

export default function ReserveModal({ book, onClose, onConfirm }: ReserveModalProps) {
  const [state,    setState]    = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleConfirm = async () => {
    setState("loading");
    try {
      await onConfirm(book.id);
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "خطا در ثبت رزرو");
      setState("error");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-navy/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-navy text-lg">رزرو کتاب</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-parchment transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {state !== "success" ? (
            <>
              {/* Book info */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-20 rounded-lg border border-border overflow-hidden bg-parchment flex items-center justify-center shrink-0">
                  {book.cover
                    ? <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                    : <BookOpen size={24} className="text-border" />}
                </div>
                <div>
                  <p className="font-bold text-navy leading-tight">{book.title}</p>
                  <p className="text-navy-muted text-sm mt-0.5">{book.author}</p>
                  <p className="text-xs text-navy-muted mt-1">{book.category}</p>
                </div>
              </div>

              <div className="bg-parchment border border-border rounded-lg p-3 text-sm text-navy-muted mb-5 space-y-1">
                <p>• مهلت بازگشت: ۱۴ روز پس از تحویل</p>
                <p>• تحویل از شعبه اصلی کتابخانه</p>
                <p>• امکان تمدید یک‌بار تا ۷ روز</p>
              </div>

              {state === "error" && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg p-3 mb-4">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={state === "loading"}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {state === "loading"
                    ? <><Loader2 size={16} className="animate-spin" />در حال ثبت...</>
                    : "تأیید رزرو"}
                </button>
                <button onClick={onClose} disabled={state === "loading"} className="btn-secondary flex-1">
                  انصراف
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-navy text-lg mb-2">رزرو ثبت شد!</h3>
              <p className="text-navy-muted text-sm leading-relaxed mb-5">
                کتاب <span className="font-semibold text-navy">«{book.title}»</span> با موفقیت رزرو شد. منتظر تأیید ادمین باشید.
              </p>
              <button onClick={onClose} className="btn-primary w-full">متوجه شدم</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
