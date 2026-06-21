import Link from "next/link";
import { BookOpen } from "lucide-react";
import { BookDto, booksApi } from "@/lib/api";

interface BookCardProps {
  book: BookDto;
}

const categoryColors: Record<string, string> = {
  "ادبیات فارسی":  "bg-amber-100 text-amber-800",
  "رمان ترجمه":    "bg-purple-100 text-purple-800",
  "تاریخ و فرهنگ": "bg-blue-100 text-blue-800",
  "علوم و فناوری": "bg-green-100 text-green-800",
  "فلسفه و عرفان": "bg-indigo-100 text-indigo-800",
  "کودک و نوجوان": "bg-orange-100 text-orange-800",
};

export default function BookCard({ book }: BookCardProps) {
  const catColor = categoryColors[book.category] ?? "bg-gray-100 text-gray-700";
  const coverUrl = booksApi.coverUrl(book.cover);

  return (
    <Link href={`/book/${book.id}`} className="group block">
      <div className="card hover:shadow-md hover:border-crimson/20 transition-all duration-200 h-full flex flex-col">
        {/* Cover */}
        <div className="w-full h-44 rounded-lg mb-4 overflow-hidden border border-border bg-parchment flex items-center justify-center">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <BookOpen size={36} className="text-border group-hover:text-crimson/40 transition-colors" />
          )}
        </div>

        {/* Category */}
        <span className={`badge ${catColor} mb-2 self-start`}>{book.category}</span>

        {/* Title & Author */}
        <h3 className="font-bold text-navy text-base leading-snug mb-1 group-hover:text-crimson transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="text-navy-muted text-sm mb-3">{book.author}</p>

        {/* Availability */}
        <div className="mt-auto flex items-center justify-between">
          {book.available ? (
            <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              موجود ({book.availableCopies} نسخه)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
              ناموجود
            </span>
          )}
          <span className="text-xs text-navy-muted">{book.publishYear}</span>
        </div>
      </div>
    </Link>
  );
}
