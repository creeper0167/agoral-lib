"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowRight, User, Calendar, Hash, CheckCircle, XCircle, Clock } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ReserveModal from "@/components/public/ReserveModal";
import { BookDetailSkeleton } from "@/components/ui/Skeleton";
import { booksApi, reservationsApi, BookDto } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function BookDetailPage() {
  const { id }                    = useParams();
  const { isAuthenticated }       = useAuth();
  const [book,      setBook]      = useState<BookDto | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    booksApi.getById(Number(id))
      .then(setBook)
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReserve = async (bookId: number) => {
    await reservationsApi.create(bookId);
    const updated = await booksApi.getById(bookId);
    setBook(updated);
  };

  if (loading) return (
    <>
      <PublicHeader />
      <BookDetailSkeleton />
      <PublicFooter />
    </>
  );

  if (!book) return (
    <>
      <PublicHeader />
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <BookOpen size={48} className="text-border mx-auto mb-4" />
        <p className="text-navy text-lg font-semibold">کتاب پیدا نشد</p>
        <Link href="/" className="btn-primary mt-5 inline-block text-sm">بازگشت</Link>
      </div>
      <PublicFooter />
    </>
  );

  const coverUrl = booksApi.coverUrl(book.cover);

  return (
    <>
      <PublicHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-navy-muted mb-8">
          <Link href="/" className="hover:text-crimson transition-colors">خانه</Link>
          <ArrowRight size={14} />
          <Link href="/books" className="hover:text-crimson transition-colors">کتاب‌ها</Link>
          <ArrowRight size={14} />
          <span className="text-navy">{book.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cover */}
          <div className="md:col-span-1">
            <div className="w-full aspect-[3/4] rounded-xl border border-border overflow-hidden shadow-sm bg-parchment flex items-center justify-center">
              {coverUrl
                ? <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
                : <BookOpen size={56} className="text-border" />}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <span className="badge bg-crimson-light text-crimson mb-3 inline-flex">{book.category}</span>
            <h1 className="text-3xl font-bold text-navy mb-2">{book.title}</h1>
            <p className="text-navy-muted text-lg mb-6">{book.author}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: User,     label: "نویسنده",    value: book.author },
                { icon: Calendar, label: "سال انتشار", value: String(book.publishYear) },
                { icon: Hash,     label: "شابک",       value: book.isbn },
                { icon: BookOpen, label: "موجودی",     value: `${book.availableCopies} از ${book.totalCopies} نسخه` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="w-8 h-8 bg-parchment rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} className="text-crimson" />
                  </div>
                  <div>
                    <div className="text-xs text-navy-muted">{label}</div>
                    <div className="text-sm font-medium text-navy">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {book.available ? (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5 mb-6 w-fit">
                <CheckCircle size={16} /><span className="text-sm font-medium">کتاب موجود است</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 mb-6 w-fit">
                <XCircle size={16} /><span className="text-sm font-medium">در حال حاضر موجود نیست</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              {book.available ? (
                isAuthenticated
                  ? <button onClick={() => setShowModal(true)} className="btn-primary">رزرو کتاب</button>
                  : <Link href={`/auth/login?redirect=/book/${book.id}`} className="btn-primary">برای رزرو وارد شوید</Link>
              ) : (
                <button disabled className="btn-primary opacity-50 cursor-not-allowed flex items-center gap-2">
                  <Clock size={16} />ناموجود
                </button>
              )}
              <Link href="/books" className="btn-secondary">بازگشت به لیست</Link>
            </div>
          </div>
        </div>

        {book.description && (
          <div className="mt-10 card">
            <h2 className="section-title mb-4">درباره کتاب</h2>
            <p className="text-navy-muted leading-relaxed">{book.description}</p>
          </div>
        )}
      </main>

      {showModal && (
        <ReserveModal
          book={{ ...book, cover: coverUrl }}
          onClose={() => setShowModal(false)}
          onConfirm={handleReserve}
        />
      )}
      <PublicFooter />
    </>
  );
}
