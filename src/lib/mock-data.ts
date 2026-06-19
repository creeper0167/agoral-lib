import { Book, Category } from "@/types";

export const categories: Category[] = [
  { id: 1, name: "ادبیات فارسی", slug: "persian-literature", count: 142 },
  { id: 2, name: "تاریخ و فرهنگ", slug: "history", count: 98 },
  { id: 3, name: "علوم و فناوری", slug: "science", count: 74 },
  { id: 4, name: "فلسفه و عرفان", slug: "philosophy", count: 61 },
  { id: 5, name: "رمان ترجمه", slug: "translated-novel", count: 113 },
  { id: 6, name: "کودک و نوجوان", slug: "children", count: 55 },
];

export const books: Book[] = [
  {
    id: 1,
    title: "بوف کور",
    author: "صادق هدایت",
    category: "ادبیات فارسی",
    available: true,
    totalCopies: 5,
    availableCopies: 3,
    publishYear: 1315,
    isbn: "978-964-000-001-1",
    description:
      "بوف کور رمانی است از صادق هدایت که در سال ۱۳۱۵ نوشته شده و یکی از مهم‌ترین آثار ادبیات معاصر ایران به شمار می‌رود.",
  },
  {
    id: 2,
    title: "شازده کوچولو",
    author: "آنتوان دو سنت اگزوپری",
    category: "رمان ترجمه",
    available: true,
    totalCopies: 8,
    availableCopies: 5,
    publishYear: 1943,
    isbn: "978-964-000-002-2",
    description:
      "شازده کوچولو داستانی است درباره یک شاهزاده کوچک که از سیاره‌ای دیگر به زمین آمده است.",
  },
  {
    id: 3,
    title: "کیمیاگر",
    author: "پائولو کوئلیو",
    category: "رمان ترجمه",
    available: false,
    totalCopies: 6,
    availableCopies: 0,
    publishYear: 1988,
    isbn: "978-964-000-003-3",
    description:
      "کیمیاگر داستان سفر چوپانی اسپانیایی به مصر در جستجوی گنج است.",
  },
  {
    id: 4,
    title: "تاریخ ایران باستان",
    author: "حسن پیرنیا",
    category: "تاریخ و فرهنگ",
    available: true,
    totalCopies: 4,
    availableCopies: 2,
    publishYear: 1311,
    isbn: "978-964-000-004-4",
    description:
      "اثری جامع درباره تاریخ ایران از ابتدا تا پایان دوره هخامنشیان.",
  },
  {
    id: 5,
    title: "فیزیک هالیدی",
    author: "دیوید هالیدی",
    category: "علوم و فناوری",
    available: true,
    totalCopies: 10,
    availableCopies: 7,
    publishYear: 2013,
    isbn: "978-964-000-005-5",
    description:
      "کتاب درسی فیزیک عمومی برای دانشجویان رشته‌های مهندسی و علوم پایه.",
  },
  {
    id: 6,
    title: "مثنوی معنوی",
    author: "جلال‌الدین محمد بلخی",
    category: "فلسفه و عرفان",
    available: true,
    totalCopies: 7,
    availableCopies: 4,
    publishYear: 1258,
    isbn: "978-964-000-006-6",
    description:
      "مثنوی معنوی مجموعه‌ای از اشعار عرفانی مولانا جلال‌الدین رومی است.",
  },
];
