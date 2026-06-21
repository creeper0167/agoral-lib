"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ArrowLeft, BookOpen, Users, Star } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import BookCard from "@/components/public/BookCard";
import { BookGridSkeleton } from "@/components/ui/Skeleton";
import { booksApi, categoriesApi, BookDto, CategoryDto } from "@/lib/api";

export default function HomePage() {
  const [query,     setQuery]     = useState("");
  const [books,     setBooks]     = useState<BookDto[]>([]);
  const [categories,setCategories]= useState<CategoryDto[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(console.error);
  }, []);

  const loadBooks = useCallback(async (q: string) => {
    setSearching(true);
    try {
      const res = await booksApi.getAll({ query: q || undefined, pageSize: 12 });
      setBooks(res.items);
    } catch (e) { console.error(e); }
    finally { setSearching(false); setLoading(false); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadBooks(query), query ? 400 : 0);
    return () => clearTimeout(t);
  }, [query, loadBooks]);

  return (
    <>
      <PublicHeader />

      {/* Hero */}
      <section className="bg-gradient-to-b from-parchment to-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="badge bg-crimson-light text-crimson mb-5 inline-flex">کتابخانه دیجیتال</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-navy mb-4 leading-tight">کتابخانه‌ای در دسترس شما</h1>
          <p className="text-navy-muted text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            جستجو کنید، رزرو کنید و لذت مطالعه را تجربه کنید.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white border-2 border-border rounded-xl px-4 py-3 shadow-sm focus-within:border-crimson transition-colors">
              <Search size={20} className={`shrink-0 transition-colors ${searching ? "text-crimson" : "text-navy-muted"}`} />
              <input
                type="text" value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="عنوان کتاب، نویسنده یا دسته‌بندی..."
                className="flex-1 bg-transparent text-navy placeholder-navy-muted/50 text-base focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-navy-muted hover:text-navy text-sm">پاک کردن</button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-10 mt-12">
            {[
              { icon: BookOpen, value: "۵۴۳+",   label: "عنوان کتاب" },
              { icon: Users,    value: "۱٬۲۰۰+", label: "عضو فعال" },
              { icon: Star,     value: "۹۸٪",    label: "رضایت کاربران" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon size={16} className="text-crimson" />
                  <span className="text-xl font-bold text-navy">{value}</span>
                </div>
                <span className="text-xs text-navy-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        {!query && categories.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">دسته‌بندی‌ها</h2>
              <a href="/categories" className="text-crimson text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                مشاهده همه <ArrowLeft size={14} />
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setQuery(cat.name)}
                  className="card text-center hover:border-crimson/30 hover:bg-crimson-light cursor-pointer transition-all group">
                  <BookOpen size={22} className="text-crimson mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-semibold text-navy leading-tight mb-1">{cat.name}</div>
                  <div className="text-xs text-navy-muted">{cat.count} کتاب</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Books */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">
              {query ? `نتایج جستجو برای «${query}»` : "کتاب‌های پیشنهادی"}
            </h2>
            {query && <span className="text-sm text-navy-muted">{books.length} نتیجه</span>}
            {!query && (
              <a href="/books" className="text-crimson text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                مشاهده همه <ArrowLeft size={14} />
              </a>
            )}
          </div>

          {loading || searching ? (
            <BookGridSkeleton count={12} />
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {books.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-border mx-auto mb-4" />
              <p className="text-navy-muted text-lg font-medium">کتابی یافت نشد</p>
              <button onClick={() => setQuery("")} className="btn-primary mt-5 text-sm">پاک کردن جستجو</button>
            </div>
          )}
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
