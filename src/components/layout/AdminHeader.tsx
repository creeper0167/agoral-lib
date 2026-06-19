"use client";

import { Bell, Search } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-base font-bold text-navy leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs text-navy-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-parchment border border-border rounded-lg px-3 py-2 w-52">
          <Search size={15} className="text-navy-muted shrink-0" />
          <input
            type="text"
            placeholder="جستجو..."
            className="bg-transparent text-sm text-navy placeholder-navy-muted/50 focus:outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-parchment transition-colors">
          <Bell size={19} className="text-navy-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-crimson rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
