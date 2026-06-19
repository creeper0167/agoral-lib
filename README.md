# کتابخانه دیجیتال — Frontend Template

Next.js 14 · TypeScript · Tailwind CSS · RTL · فونت وزیر

---

## ساختار پروژه

```
src/
├── app/
│   ├── page.tsx                    ← صفحه اصلی (جستجوی کتاب)
│   ├── books/page.tsx              ← لیست همه کتاب‌ها + فیلتر
│   ├── book/[id]/page.tsx          ← صفحه جزئیات کتاب
│   ├── reserve/page.tsx            ← رزروهای کاربر
│   ├── auth/
│   │   ├── login/page.tsx          ← ورود
│   │   └── signup/page.tsx         ← ثبت‌نام
│   └── admin/
│       ├── layout.tsx              ← لایه ادمین (سایدبار)
│       ├── dashboard/page.tsx      ← داشبورد آمار
│       ├── books/page.tsx          ← CRUD کتاب‌ها
│       ├── reservations/page.tsx   ← مدیریت رزروها
│       └── users/page.tsx          ← مدیریت کاربران
├── components/
│   ├── layout/
│   │   ├── PublicHeader.tsx
│   │   ├── PublicFooter.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── AdminHeader.tsx
│   └── public/
│       └── BookCard.tsx
├── lib/
│   └── mock-data.ts                ← داده‌های نمونه
└── types/
    └── index.ts                    ← TypeScript types
```

## نصب و اجرا

```bash
npm install
npm run dev
```

## صفحات

| مسیر | توضیح |
|------|-------|
| `/` | صفحه اصلی با جستجو |
| `/books` | لیست کتاب‌ها با فیلتر |
| `/book/[id]` | جزئیات کتاب |
| `/auth/login` | ورود |
| `/auth/signup` | ثبت‌نام |
| `/reserve` | رزروهای کاربر |
| `/admin/dashboard` | داشبورد مدیریت |
| `/admin/books` | CRUD کتاب‌ها |
| `/admin/reservations` | مدیریت رزروها |
| `/admin/users` | مدیریت کاربران |

## اتصال به بک‌اند

همه جاهایی که نیاز به API دارند با `// TODO: POST/GET /api/...` مشخص شده‌اند.

بک‌اند: .NET Core  
دیتابیس: PostgreSQL

## رنگ‌بندی

| نام | مقدار |
|-----|-------|
| Crimson (اصلی) | `#C0392B` |
| Navy (متن) | `#1A1A2E` |
| Parchment (پس‌زمینه) | `#F8F5F0` |
| Border | `#E8DDD0` |
