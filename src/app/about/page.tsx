import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { BookOpen, Clock, Users, Shield } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "گنجینه‌ای از دانش",
    desc: "بیش از ۵۰۰ عنوان کتاب در دسته‌بندی‌های متنوع از ادبیات فارسی تا علوم و فناوری.",
  },
  {
    icon: Clock,
    title: "رزرو آسان",
    desc: "در چند ثانیه کتاب مورد نظر خود را رزرو کنید و در زمان مناسب تحویل بگیرید.",
  },
  {
    icon: Users,
    title: "جامعه کتابخوانان",
    desc: "بیش از ۱۲۰۰ عضو فعال که هر روز از خدمات کتابخانه بهره می‌برند.",
  },
  {
    icon: Shield,
    title: "امنیت و اعتماد",
    desc: "اطلاعات شما در امنیت کامل نگهداری می‌شود و حریم خصوصی‌تان محترم شمرده می‌شود.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-parchment to-white border-b border-border py-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <div className="w-16 h-16 bg-crimson rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <BookOpen size={30} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-navy mb-4">
              درباره کتابخانه دیجیتال
            </h1>
            <p className="text-navy-muted text-lg leading-relaxed">
              ما با هدف دسترسی آسان‌تر به دنیای کتاب این سامانه را طراحی کرده‌ایم.
              باور داریم که هر کتابی می‌تواند زندگی یک نفر را تغییر دهد.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title text-center mb-10">چرا کتابخانه ما؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card flex gap-4">
                <div className="w-12 h-12 bg-crimson-light rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-crimson" />
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">{title}</h3>
                  <p className="text-navy-muted text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team / Mission */}
        <section className="bg-navy text-white py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">مأموریت ما</h2>
            <p className="text-white/70 text-lg leading-relaxed">
              ایجاد فضایی امن، آسان و الهام‌بخش برای تمام کسانی که دوست‌دار مطالعه هستند.
              کتابخانه ما متعلق به شماست — از شما ساخته شده و برای شما.
            </p>
            <a
              href="/books"
              className="mt-8 inline-block bg-crimson text-white px-6 py-3 rounded-lg font-medium hover:bg-crimson-dark transition-colors"
            >
              مطالعه کتاب‌ها را شروع کنید
            </a>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
