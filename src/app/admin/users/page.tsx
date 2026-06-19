"use client";

import { useState } from "react";
import { Search, Trash2, Shield, User } from "lucide-react";
import AdminHeader from "@/components/layout/AdminHeader";

type Role = "user" | "admin";

const initialUsers = [
  { id: 1, name: "مدیر سیستم", email: "admin@library.ir", role: "admin" as Role, joinedAt: "۱۴۰۲/۰۱/۰۱", reservations: 0 },
  { id: 2, name: "علی محمدی", email: "ali@email.com", role: "user" as Role, joinedAt: "۱۴۰۲/۰۵/۱۲", reservations: 8 },
  { id: 3, name: "مریم احمدی", email: "maryam@email.com", role: "user" as Role, joinedAt: "۱۴۰۲/۰۷/۰۳", reservations: 14 },
  { id: 4, name: "حسن رضایی", email: "hasan@email.com", role: "user" as Role, joinedAt: "۱۴۰۲/۰۹/۲۰", reservations: 5 },
  { id: 5, name: "زهرا کریمی", email: "zahra@email.com", role: "user" as Role, joinedAt: "۱۴۰۳/۰۱/۰۸", reservations: 3 },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");

  const filtered = users.filter(
    (u) => u.name.includes(query) || u.email.includes(query)
  );

  const toggleRole = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u)
    );
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <>
      <AdminHeader title="مدیریت کاربران" subtitle={`${users.length} کاربر ثبت‌نام شده`} />
      <main className="flex-1 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 w-64">
            <Search size={15} className="text-navy-muted shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی کاربر..."
              className="bg-transparent text-sm text-navy placeholder-navy-muted/50 focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-parchment border-b border-border">
                <tr className="text-navy-muted text-right">
                  <th className="px-5 py-3.5 font-medium">کاربر</th>
                  <th className="px-5 py-3.5 font-medium">تاریخ عضویت</th>
                  <th className="px-5 py-3.5 font-medium">رزروها</th>
                  <th className="px-5 py-3.5 font-medium">نقش</th>
                  <th className="px-5 py-3.5 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-parchment/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-crimson-light border border-crimson/20 flex items-center justify-center text-crimson text-sm font-bold shrink-0">
                          {u.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-navy">{u.name}</div>
                          <div className="text-xs text-navy-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-navy-muted">{u.joinedAt}</td>
                    <td className="px-5 py-3.5 text-navy font-medium">{u.reservations}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${u.role === "admin" ? "bg-crimson-light text-crimson" : "bg-parchment text-navy-muted"}`}>
                        {u.role === "admin" ? (
                          <span className="flex items-center gap-1"><Shield size={11} />ادمین</span>
                        ) : (
                          <span className="flex items-center gap-1"><User size={11} />کاربر</span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {u.id !== 1 && (
                          <>
                            <button
                              onClick={() => toggleRole(u.id)}
                              className="p-1.5 rounded-lg text-navy-muted hover:text-crimson hover:bg-crimson-light transition-colors"
                              title={u.role === "admin" ? "تبدیل به کاربر" : "تبدیل به ادمین"}
                            >
                              <Shield size={15} />
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-1.5 rounded-lg text-navy-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="حذف"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                        {u.id === 1 && <span className="text-xs text-navy-muted">—</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
