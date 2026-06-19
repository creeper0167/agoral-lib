import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-crimson-light rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen size={38} className="text-crimson" />
        </div>

        <h1 className="text-7xl font-bold text-navy mb-2">۴۰۴</h1>
        <h2 className="text-xl font-semibold text-navy mb-3">صفحه پیدا نشد</h2>
        <p className="text-navy-muted text-sm leading-relaxed mb-8">
          صفحه‌ای که دنبالش می‌گردید وجود ندارد یا جابه‌جا شده است.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <Home size={16} />
            صفحه اصلی
          </Link>
          <Link href="/books" className="btn-secondary flex items-center gap-2">
            <Search size={16} />
            جستجوی کتاب
          </Link>
        </div>
      </div>
    </div>
  );
}
