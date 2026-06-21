"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Shield, User, Loader2 } from "lucide-react";
import AdminHeader from "@/components/layout/AdminHeader";
import { AdminTableSkeleton } from "@/components/ui/Skeleton";
import { usersApi, UserResponseDto } from "@/lib/api";

export default function AdminUsersPage() {
  const [users,    setUsers]    = useState<UserResponseDto[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [query,    setQuery]    = useState("");
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    usersApi.getAll()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) => !query || u.name.includes(query) || u.email.includes(query)
  );

  const toggleRole = async (id: number, currentRole: string) => {
    setUpdating(id);
    try {
      const updated = await usersApi.updateRole(id, currentRole === "admin" ? "user" : "admin");
      setUsers((prev) => prev.map((u) => u.id === id ? updated : u));
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("آیا از حذف این کاربر مطمئن هستید؟")) return;
    setDeleting(id);
    try {
      await usersApi.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  return (
    <>
      <AdminHeader title="مدیریت کاربران" subtitle={`${users.length} کاربر ثبت‌نام شده`} />
      <main className="flex-1 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 w-64">
            <Search size={15} className="text-navy-muted shrink-0" />
            <input
              type="text" value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی کاربر..."
              className="bg-transparent text-sm text-navy placeholder-navy-muted/50 focus:outline-none w-full"
            />
          </div>
        </div>

        {loading ? (
          <AdminTableSkeleton cols={5} rows={8} />
        ) : (
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-navy-muted">کاربری یافت نشد</td>
                    </tr>
                  ) : filtered.map((u) => (
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
                      <td className="px-5 py-3.5 text-navy font-medium">{u.reservationsCount}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${u.role === "admin" ? "bg-crimson-light text-crimson" : "bg-parchment text-navy-muted"}`}>
                          {u.role === "admin"
                            ? <span className="flex items-center gap-1"><Shield size={11} />ادمین</span>
                            : <span className="flex items-center gap-1"><User size={11} />کاربر</span>}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {updating === u.id || deleting === u.id ? (
                          <Loader2 size={16} className="animate-spin text-crimson" />
                        ) : u.id !== 1 ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleRole(u.id, u.role)}
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
                          </div>
                        ) : (
                          <span className="text-xs text-navy-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
