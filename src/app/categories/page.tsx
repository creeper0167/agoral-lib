"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { categories, books } from "@/lib/mock-data";

const catColors = [
  "bg-amber-50 border-amber-100 text-amber-700",
  "bg-purple-50 border-purple-100 text-purple-700",
  "bg-blue-50 border-blue-100 text-blue-700",
  "bg-emerald-50 border-emerald-100 text-emerald-700",
  "bg-indigo-50 border-indigo-100 text-indigo-700",
  "bg-orange-50 border-orange-100 text-orange-700",
];

export default function CategoriesPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const filteredBooks = selected
    ? books.filter((b) => b.category === selected)
    : [];

  return (
    <>
      <PublicHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="page-title mb-1">دسته‌بندی‌ها</h1>
          <p className="text-navy-muted text-sm">
            {categories.length} دسته‌بندی — {books.length} عنوان کتاب
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setSelected(selected === cat.name ? null : cat.name)}
              className={`card text-right hover:shadow-md transition-all border-2 ${
                selected === cat.name
                  ? "border-crimson bg-crimson-light"
                  : "border-border hover:border-crimson/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`badge mb-3 ${catColors[i % catColors.length]} border`}
                  >
                    {cat.count} کتاب
                  </div>
                  <h3 className="text-base font-bold text-navy">{cat.name}</h3>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${catColors[i % catColors.length]} border`}
                >
                  <BookOpen size={22} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-crimson text-sm font-medium">
                مشاهده کتاب‌ها <ArrowLeft size={14} />
              </div>
            </button>
          ))}
        </div>

        {/* Books for selected category */}
        {selected && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">{selected}</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-sm text-navy-muted hover:text-crimson"
              >
                بستن
              </button>
            </div>
            {filteredBooks.length === 0 ? (
              <p className="text-navy-muted text-center py-10">
                کتابی در این دسته‌بندی یافت نشد
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className="card hover:shadow-md hover:border-crimson/20 transition-all group"
                  >
                    <div className="w-full h-36 bg-parchment rounded-lg mb-3 flex items-center justify-center border border-border group-hover:bg-crimson/5 transition-colors">
                      <BookOpen size={28} className="text-border group-hover:text-crimson/40 transition-colors" />
                    </div>
                    <h3 className="font-bold text-navy text-sm mb-0.5 group-hover:text-crimson transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-navy-muted text-xs">{book.author}</p>
                    <div className="mt-2">
                      {book.available ? (
                        <span className="text-xs text-emerald-600 font-medium">موجود</span>
                      ) : (
                        <span className="text-xs text-red-400 font-medium">ناموجود</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      <PublicFooter />
    </>
  );
}
