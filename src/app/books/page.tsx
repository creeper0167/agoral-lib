"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import BookCard from "@/components/public/BookCard";
import { books, categories } from "@/lib/mock-data";

export default function BooksPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filtered = books.filter((b) => {
    const matchQuery = !query || b.title.includes(query) || b.author.includes(query);
    const matchCat = !selectedCategory || b.category === selectedCategory;
    const matchAvail = !onlyAvailable || b.available;
    return matchQuery && matchCat && matchAvail;
  });

  return (
    <>
      <PublicHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="page-title mb-1">همه کتاب‌ها</h1>
          <p className="text-navy-muted text-sm">{filtered.length} عنوان</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-56 shrink-0">
            <div className="card sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal size={15} className="text-crimson" />
                <span className="font-semibold text-navy text-sm">فیلترها</span>
              </div>

              {/* Search */}
              <div className="mb-5">
                <label className="label text-xs">جستجو</label>
                <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
                  <Search size={13} className="text-navy-muted shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="عنوان یا نویسنده..."
                    className="bg-transparent text-xs text-navy placeholder-navy-muted/50 focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-5">
                <label className="label text-xs">دسته‌بندی</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-right text-sm px-2 py-1.5 rounded-lg transition-colors ${!selectedCategory ? "bg-crimson-light text-crimson font-medium" : "text-navy-muted hover:bg-parchment"}`}
                  >
                    همه
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-right text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center justify-between ${selectedCategory === cat.name ? "bg-crimson-light text-crimson font-medium" : "text-navy-muted hover:bg-parchment"}`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="label text-xs">وضعیت</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="avail"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="w-4 h-4 accent-crimson"
                  />
                  <label htmlFor="avail" className="text-sm text-navy cursor-pointer">فقط موجود</label>
                </div>
              </div>

              {/* Reset */}
              {(query || selectedCategory || onlyAvailable) && (
                <button
                  onClick={() => { setQuery(""); setSelectedCategory(null); setOnlyAvailable(false); }}
                  className="mt-5 w-full btn-ghost text-sm text-crimson hover:bg-crimson-light"
                >
                  پاک کردن فیلترها
                </button>
              )}
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-navy-muted text-lg">کتابی با این مشخصات یافت نشد</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
