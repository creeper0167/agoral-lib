"use client";

import { useState, useEffect } from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import BookCard from "@/components/public/BookCard";
import { CategoryCardSkeleton, BookGridSkeleton } from "@/components/ui/Skeleton";
import { categoriesApi, booksApi, CategoryDto, BookDto } from "@/lib/api";

const catColors = [
  "bg-amber-50 border-amber-100 text-amber-700",
  "bg-purple-50 border-purple-100 text-purple-700",
  "bg-blue-50 border-blue-100 text-blue-700",
  "bg-emerald-50 border-emerald-100 text-emerald-700",
  "bg-indigo-50 border-indigo-100 text-indigo-700",
  "bg-orange-50 border-orange-100 text-orange-700",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [catBooks,   setCatBooks]   = useState<BookDto[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [catLoading, setCatLoading] = useState(false);

  useEffect(() => {
    categoriesApi.getAll()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (cat: CategoryDto) => {
    if (selectedId === cat.id) {
      setSelectedId(null);
      setCatBooks([]);
      return;
    }
    setSelectedId(cat.id);
    setCatLoading(true);
    try {
      // Send categoryId (FK int) — not category name string
      const res = await booksApi.getAll({ categoryId: cat.id, pageSize: 20 });
      setCatBooks(res.items);
    } catch (e) { console.error(e); }
    finally { setCatLoading(false); }
  };

  const selectedCat = categories.find(c => c.id === selectedId);

  return (
    <>
      <PublicHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="page-title mb-1">دسته‌بندی‌ها</h1>
          <p className="text-navy-muted text-sm">{categories.length} دسته‌بندی</p>
        </div>

        {/* Category grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {Array.from({ length: 6 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat)}
                className={`card text-right hover:shadow-md transition-all border-2 ${
                  selectedId === cat.id ? "border-crimson bg-crimson-light" : "border-border hover:border-crimson/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`badge mb-3 ${catColors[i % catColors.length]} border`}>{cat.count} کتاب</div>
                    <h3 className="text-base font-bold text-navy">{cat.name}</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${catColors[i % catColors.length]} border`}>
                    <BookOpen size={22} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-crimson text-sm font-medium">
                  مشاهده کتاب‌ها <ArrowLeft size={14} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Books for selected category */}
        {selectedId !== null && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">{selectedCat?.name}</h2>
              <button
                onClick={() => { setSelectedId(null); setCatBooks([]); }}
                className="text-sm text-navy-muted hover:text-crimson"
              >بستن</button>
            </div>
            {catLoading ? (
              <BookGridSkeleton count={8} />
            ) : catBooks.length === 0 ? (
              <p className="text-navy-muted text-center py-10">کتابی در این دسته‌بندی یافت نشد</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {catBooks.map((book) => <BookCard key={book.id} book={book} />)}
              </div>
            )}
          </section>
        )}
      </main>
      <PublicFooter />
    </>
  );
}
