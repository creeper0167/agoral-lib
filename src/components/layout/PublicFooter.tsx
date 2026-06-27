import Link from "next/link";
import { BookOpen, Phone, Mail, MapPin } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-crimson rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold">کتابخانه آگورا</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              کتابخانه‌ای نوین برای جستجو، مطالعه و رزرو کتاب‌های مختلف در تمام دسته‌بندی‌ها.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">دسترسی سریع</h4>
            <ul className="space-y-2.5">
              {[
                { label: "صفحه اصلی", href: "/" },
                { label: "همه کتاب‌ها", href: "/books" },
                { label: "دسته‌بندی‌ها", href: "/categories" },
                { label: "ورود / ثبت‌نام", href: "/auth/login" },
                { label: "قوانین و مقررات", href: "/terms" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">ارتباط با ما</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-white/60 text-sm">
                <Phone size={15} className="text-crimson shrink-0" />
                09331283198
              </li>
              <li className="flex items-center gap-2.5 text-white/60 text-sm">
                <Mail size={15} className="text-crimson shrink-0" />
                m.amin.arjang@gmail.com
              </li>
              <li className="flex items-center gap-2.5 text-white/60 text-sm">
                <MapPin size={15} className="text-crimson shrink-0" />
                بندرعباس، بلوارم امام حسین، خیابان لاوان
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/40 text-xs">
          © ۱۴۰۳ کتابخانه دیجیتال — تمامی حقوق محفوظ است
        </div>
      </div>
    </footer>
  );
}
