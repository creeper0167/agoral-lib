"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, CheckCircle, ChevronDown, FileText } from "lucide-react";
import { termsSections, termsLastUpdated } from "@/lib/terms-content";

interface TermsModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function TermsModal({ onAccept, onDecline }: TermsModalProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [accepted,         setAccepted]         = useState(false);
  const [activeSection,    setActiveSection]     = useState(0);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Track scroll progress
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    if (atBottom) setScrolledToBottom(true);

    // Highlight active section in sidebar
    const containerTop = el.getBoundingClientRect().top;
    let current = 0;
    sectionRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const top = ref.getBoundingClientRect().top - containerTop;
      if (top <= 60) current = i;
    });
    setActiveSection(current);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToSection = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToBottomHint = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  const progress = scrolledToBottom
    ? 100
    : Math.round(
        ((scrollRef.current?.scrollTop ?? 0) /
          Math.max(1, (scrollRef.current?.scrollHeight ?? 1) - (scrollRef.current?.clientHeight ?? 1))) *
          100
      );

  return (
    <div className="fixed inset-0 bg-navy/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onDecline()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-crimson-light rounded-lg flex items-center justify-center">
              <FileText size={18} className="text-crimson" />
            </div>
            <div>
              <h2 className="font-bold text-navy text-base">قوانین و مقررات کتابخانه دیجیتال</h2>
              <p className="text-xs text-navy-muted">آخرین بروزرسانی: {termsLastUpdated}</p>
            </div>
          </div>
          <button onClick={onDecline} className="p-1.5 rounded-lg hover:bg-parchment transition-colors text-navy-muted hover:text-navy">
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-border shrink-0">
          <div
            className="h-full bg-crimson transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Body: sidebar + content */}
        <div className="flex flex-1 min-h-0">

          {/* Sidebar TOC — hidden on mobile */}
          <nav className="hidden md:flex flex-col w-44 shrink-0 border-l border-border bg-parchment/40 py-4 overflow-y-auto">
            <p className="text-[10px] font-semibold text-navy-muted/60 uppercase tracking-wider px-4 mb-2">فهرست</p>
            {termsSections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(i)}
                className={`text-right text-xs px-4 py-2 transition-colors leading-snug ${
                  activeSection === i
                    ? "text-crimson font-semibold bg-crimson-light/60"
                    : "text-navy-muted hover:text-navy hover:bg-parchment"
                }`}
              >
                {s.title}
              </button>
            ))}
          </nav>

          {/* Scrollable content */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-right"
          >
            {termsSections.map((section, i) => (
              <section
                key={section.id}
                ref={(el) => { sectionRefs.current[i] = el; }}
                className="scroll-mt-4"
              >
                <h3 className="font-bold text-navy text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-crimson text-white text-xs flex items-center justify-center shrink-0 font-bold">
                    {i + 1}
                  </span>
                  {section.title}
                </h3>
                <p className="text-navy-muted text-sm leading-7">{section.content}</p>
              </section>
            ))}

            {/* Bottom sentinel */}
            <div className="h-4" />
          </div>
        </div>

        {/* Scroll hint */}
        {!scrolledToBottom && (
          <div className="px-6 py-2 bg-amber-50 border-t border-amber-100 flex items-center justify-between shrink-0">
            <span className="text-xs text-amber-700 font-medium">
              برای فعال شدن دکمه تأیید، لطفاً متن را تا انتها مطالعه کنید
            </span>
            <button onClick={scrollToBottomHint} className="flex items-center gap-1 text-xs text-amber-700 font-medium hover:text-amber-900 transition-colors">
              رفتن به انتها <ChevronDown size={14} />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-white shrink-0">
          {/* Checkbox — only shown after reading */}
          {scrolledToBottom && (
            <label className="flex items-start gap-3 mb-4 cursor-pointer group">
              <div
                onClick={() => setAccepted(!accepted)}
                className={`mt-0.5 w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-all ${
                  accepted
                    ? "bg-crimson border-crimson"
                    : "border-border group-hover:border-crimson/50"
                }`}
              >
                {accepted && <CheckCircle size={13} className="text-white" />}
              </div>
              <span className="text-sm text-navy leading-relaxed">
                تمامی قوانین و مقررات فوق را مطالعه کرده و با آن‌ها موافقم. متعهد می‌شوم در استفاده از خدمات کتابخانه دیجیتال این قوانین را رعایت کنم.
              </span>
            </label>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onAccept}
              disabled={!scrolledToBottom || !accepted}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                scrolledToBottom && accepted
                  ? "bg-crimson text-white hover:bg-crimson-dark"
                  : "bg-parchment text-navy-muted cursor-not-allowed"
              }`}
            >
              {scrolledToBottom && accepted
                ? <><CheckCircle size={16} />موافقم و ادامه می‌دهم</>
                : scrolledToBottom
                ? "تیک موافقت را بزنید"
                : "ابتدا متن را تا انتها بخوانید"}
            </button>
            <button
              onClick={onDecline}
              className="px-5 py-2.5 rounded-lg border border-border text-navy-muted hover:bg-parchment text-sm font-medium transition-colors"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
