import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { termsSections, termsLastUpdated } from "@/lib/terms-content";

export const metadata = {
  title: "قوانین و مقررات — کتابخانه دیجیتال",
};

export default function TermsPage() {
  return (
    <>
      <PublicHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-navy-muted mb-8">
          <Link href="/" className="hover:text-crimson transition-colors">خانه</Link>
          <ArrowRight size={14} />
          <span className="text-navy">قوانین و مقررات</span>
        </div>

        {/* Hero */}
        <div className="flex items-start gap-5 mb-10 p-6 bg-parchment rounded-2xl border border-border">
          <div className="w-14 h-14 bg-crimson rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <FileText size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy mb-1">قوانین و مقررات کتابخانه دیجیتال</h1>
            <p className="text-navy-muted text-sm">آخرین بروزرسانی: {termsLastUpdated}</p>
            <p className="text-navy-muted text-sm mt-2 leading-relaxed">
              با استفاده از خدمات کتابخانه دیجیتال، شما با تمامی موارد زیر موافقت می‌کنید.
              لطفاً این متن را با دقت مطالعه فرمایید.
            </p>
          </div>
        </div>

        {/* Quick nav */}
        <div className="card mb-8">
          <p className="text-xs font-semibold text-navy-muted uppercase tracking-wider mb-3">فهرست مطالب</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {termsSections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 text-sm text-navy-muted hover:text-crimson hover:bg-crimson-light px-3 py-1.5 rounded-lg transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-parchment border border-border text-navy text-xs flex items-center justify-center shrink-0 font-bold">
                  {i + 1}
                </span>
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {termsSections.map((section, i) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-crimson text-white text-sm flex items-center justify-center shrink-0 font-bold">
                  {i + 1}
                </span>
                <h2 className="text-lg font-bold text-navy">{section.title}</h2>
              </div>
              <div className="border-r-2 border-border pr-4 mr-3">
                <p className="text-navy-muted leading-8 text-sm">{section.content}</p>
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-6 bg-parchment rounded-2xl border border-border text-center">
          <p className="text-navy-muted text-sm mb-4">
            با سؤال یا ابهامی درباره این قوانین؟ با ما تماس بگیرید.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/about" className="btn-secondary text-sm">تماس با ما</Link>
            <Link href="/auth/signup" className="btn-primary text-sm">ثبت‌نام</Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
