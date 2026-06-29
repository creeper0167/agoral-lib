"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import BookCard from "@/components/public/BookCard";
import Pagination from "@/components/ui/Pagination";
import { BookGridSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { booksApi, categoriesApi, BookDto, CategoryDto } from "@/lib/api";

const PAGE_SIZE = 12;

export default function BooksPage() {
  const [query,            setQuery]            = useState("");
  const [debouncedQuery,   setDebouncedQuery]   = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [onlyAvailable,    setOnlyAvailable]    = useState(false);
  const [page,             setPage]             = useState(1);
  const [books,            setBooks]            = useState<BookDto[]>([]);
  const [totalCount,       setTotalCount]       = useState(0);
  const [categories,       setCategories]       = useState<CategoryDto[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [catLoading,       setCatLoading]       = useState(true);

  useEffect(() => {
    categoriesApi.getAll()
      .then(setCategories)
      .finally(() => setCatLoading(false));
  }, []);

  // Debounce query text
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQuery(query); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch books whenever any filter changes — all deps explicit, no useCallback closure
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    booksApi.getAll({
      searchQuery:      debouncedQuery || undefined,
      categoryId: selectedCategory ?? undefined,
      available:  onlyAvailable || undefined,
      page,
      pageSize:   PAGE_SIZE,
    })
      .then((res) => {
        if (!cancelled) {
          setBooks(res.items);
          setTotalCount(res.totalCount);
        }
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [debouncedQuery, selectedCategory, onlyAvailable, page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasFilters = !!query || selectedCategory !== null || onlyAvailable;
  const clearAll   = () => { setQuery(""); setSelectedCategory(null); setOnlyAvailable(false); setPage(1); };

  return (
    <>
      <PublicHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="page-title mb-1">همه کتاب‌ها</h1>
          {loading ? <Skeleton className="h-4 w-24 mt-1" /> : <p className="text-navy-muted text-sm">{totalCount} عنوان</p>}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0">
            <div className="card sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-crimson" />
                  <span className="font-semibold text-navy text-sm">فیلترها</span>
                </div>
                {hasFilters && (
                  <button onClick={clearAll} className="text-xs text-crimson hover:underline flex items-center gap-0.5">
                    <X size={12} /> پاک
                  </button>
                )}
              </div>

              {/* Text search */}
              <div className="mb-5">
                <label className="label text-xs">جستجو</label>
                <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
                  <Search size={13} className="text-navy-muted shrink-0" />
                  <input
                    type="text" value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="عنوان یا نویسنده..."
                    className="bg-transparent text-xs text-navy placeholder-navy-muted/50 focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Category filter — uses id */}
              <div className="mb-5">
                <label className="label text-xs">دسته‌بندی</label>
                {catLoading ? (
                  <div className="space-y-2 mt-1">
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <button
                      onClick={() => { setSelectedCategory(null); setPage(1); }}
                      className={`w-full text-right text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        selectedCategory === null ? "bg-crimson-light text-crimson font-medium" : "text-navy-muted hover:bg-parchment"
                      }`}
                    >همه</button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                        className={`w-full text-right text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                          selectedCategory === cat.id ? "bg-crimson-light text-crimson font-medium" : "text-navy-muted hover:bg-parchment"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs">{cat.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability */}
              <div>
                <label className="label text-xs">وضعیت</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox" id="avail" checked={onlyAvailable}
                    onChange={(e) => { setOnlyAvailable(e.target.checked); setPage(1); }}
                    className="w-4 h-4 accent-crimson"
                  />
                  <label htmlFor="avail" className="text-sm text-navy cursor-pointer">فقط موجود</label>
                </div>
              </div>
            </div>
          </aside>

          {/* Book grid */}
          <div className="flex-1">
            {loading ? (
              <BookGridSkeleton count={PAGE_SIZE} />
            ) : books.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-navy-muted text-lg font-medium">کتابی یافت نشد</p>
                {hasFilters && <button onClick={clearAll} className="btn-primary mt-5 text-sm">پاک کردن فیلترها</button>}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {books.map((book) => <BookCard key={book.id} book={book} />)}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
