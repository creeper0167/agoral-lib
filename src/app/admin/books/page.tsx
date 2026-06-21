"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Pencil, Trash2, BookOpen, X, Check, Loader2, Upload, ImageIcon } from "lucide-react";
import { AdminTableSkeleton } from "@/components/ui/Skeleton";
import AdminHeader from "@/components/layout/AdminHeader";
import { booksApi, categoriesApi, BookDto, CategoryDto } from "@/lib/api";

type BookForm = {
  title: string; author: string; category: string; isbn: string;
  publishYear: number; totalCopies: number; availableCopies: number;
  description: string; available: boolean;
};

const emptyForm: BookForm = {
  title: "", author: "", category: "", isbn: "",
  publishYear: 1400, totalCopies: 1, availableCopies: 1,
  description: "", available: true,
};

export default function AdminBooksPage() {
  const [books,      setBooks]      = useState<BookDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [total,      setTotal]      = useState(0);
  const [query,      setQuery]      = useState("");
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);

  const [showModal,    setShowModal]    = useState(false);
  const [editingBook,  setEditingBook]  = useState<BookDto | null>(null);
  const [form,         setForm]         = useState<BookForm>(emptyForm);
  const [saving,       setSaving]       = useState(false);
  const [deleteId,     setDeleteId]     = useState<number | null>(null);
  const [deleting,     setDeleting]     = useState(false);

  // Cover upload state
  const [coverFile,    setCoverFile]    = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading,    setUploading]    = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await booksApi.getAll({ query: query || undefined, page, pageSize: 20 });
      setBooks(res.items);
      setTotal(res.totalCount);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { categoriesApi.getAll().then(setCategories); }, []);
  useEffect(() => { const t = setTimeout(loadBooks, query ? 400 : 0); return () => clearTimeout(t); }, [query, page]);

  const openAdd = () => {
    setEditingBook(null); setForm(emptyForm);
    setCoverFile(null); setCoverPreview(null);
    setShowModal(true);
  };

  const openEdit = (book: BookDto) => {
    setEditingBook(book);
    setForm({ title: book.title, author: book.author, category: book.category, isbn: book.isbn,
      publishYear: book.publishYear, totalCopies: book.totalCopies, availableCopies: book.availableCopies,
      description: book.description, available: book.available });
    setCoverFile(null);
    setCoverPreview(booksApi.coverUrl(book.cover) ?? null);
    setShowModal(true);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let saved: BookDto;
      if (editingBook) {
        saved = await booksApi.update(editingBook.id, form);
      } else {
        saved = await booksApi.create(form);
      }
      // Upload cover if chosen
      if (coverFile) {
        setUploading(true);
        saved = await booksApi.uploadCover(saved.id, coverFile);
        setUploading(false);
      }
      setBooks((prev) =>
        editingBook
          ? prev.map((b) => b.id === saved.id ? saved : b)
          : [saved, ...prev]
      );
      setShowModal(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "خطا در ذخیره");
    } finally { setSaving(false); setUploading(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await booksApi.delete(deleteId);
      setBooks((prev) => prev.filter((b) => b.id !== deleteId));
      setDeleteId(null);
    } catch (e) { alert(e instanceof Error ? e.message : "خطا در حذف"); }
    finally { setDeleting(false); }
  };

  const field = (key: keyof BookForm, label: string, type = "text") => (
    <div>
      <label className="label">{label}</label>
      <input type={type} className="input-field"
        value={String(form[key])}
        onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
      />
    </div>
  );

  return (
    <>
      <AdminHeader title="مدیریت کتاب‌ها" subtitle={`${total} عنوان کتاب`} />
      <main className="flex-1 p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 w-72">
            <Search size={15} className="text-navy-muted shrink-0" />
            <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="جستجوی کتاب..." className="bg-transparent text-sm focus:outline-none w-full text-navy placeholder-navy-muted/50" />
          </div>
          <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2">
            <Plus size={16} />افزودن کتاب
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <AdminTableSkeleton cols={5} rows={8} />
        ) : (
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-parchment border-b border-border">
                <tr className="text-navy-muted text-right">
                  <th className="px-5 py-3.5 font-medium">کتاب</th>
                  <th className="px-5 py-3.5 font-medium">دسته‌بندی</th>
                  <th className="px-5 py-3.5 font-medium">موجودی</th>
                  <th className="px-5 py-3.5 font-medium">وضعیت</th>
                  <th className="px-5 py-3.5 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {!loading && books.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-navy-muted">کتابی یافت نشد</td></tr>
                )}
                {books.map((book) => {
                  const cover = booksApi.coverUrl(book.cover);
                  return (
                    <tr key={book.id} className="hover:bg-parchment/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg border border-border overflow-hidden bg-parchment shrink-0 flex items-center justify-center">
                            {cover
                              ? <img src={cover} alt={book.title} className="w-full h-full object-cover" />
                              : <BookOpen size={15} className="text-border" />}
                          </div>
                          <div>
                            <div className="font-medium text-navy">{book.title}</div>
                            <div className="text-xs text-navy-muted">{book.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-navy-muted">{book.category}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-navy font-medium">{book.availableCopies}</span>
                        <span className="text-navy-muted"> / {book.totalCopies}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {book.available
                          ? <span className="badge bg-emerald-50 text-emerald-700">موجود</span>
                          : <span className="badge bg-red-50 text-red-500">ناموجود</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(book)} className="p-1.5 rounded-lg text-navy-muted hover:text-crimson hover:bg-crimson-light transition-colors" title="ویرایش">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteId(book.id)} className="p-1.5 rounded-lg text-navy-muted hover:text-red-500 hover:bg-red-50 transition-colors" title="حذف">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      )}
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-navy/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white z-10">
              <h2 className="font-bold text-navy text-lg">{editingBook ? "ویرایش کتاب" : "افزودن کتاب جدید"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-parchment"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Cover Upload */}
              <div>
                <label className="label">تصویر جلد کتاب</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-crimson/40 hover:bg-crimson-light/30 transition-all flex items-center gap-4"
                >
                  <div className="w-16 h-20 rounded-lg border border-border overflow-hidden bg-parchment flex items-center justify-center shrink-0">
                    {coverPreview
                      ? <img src={coverPreview} alt="پیش‌نمایش" className="w-full h-full object-cover" />
                      : <ImageIcon size={24} className="text-border" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-crimson font-medium text-sm mb-1">
                      <Upload size={15} />
                      {coverPreview ? "تغییر تصویر" : "انتخاب تصویر"}
                    </div>
                    <p className="text-xs text-navy-muted">JPG، PNG یا WebP — حداکثر ۵ مگابایت</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </div>

              {field("title",  "عنوان کتاب")}
              {field("author", "نویسنده")}

              <div>
                <label className="label">دسته‌بندی</label>
                <select
                  className="input-field"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {field("isbn",        "شابک (ISBN)")}
              {field("publishYear", "سال انتشار", "number")}
              <div className="grid grid-cols-2 gap-4">
                {field("totalCopies",     "تعداد کل نسخه‌ها", "number")}
                {field("availableCopies", "نسخه‌های موجود",   "number")}
              </div>
              <div>
                <label className="label">توضیحات</label>
                <textarea
                  className="input-field min-h-[80px] resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="avail" checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="w-4 h-4 accent-crimson" />
                <label htmlFor="avail" className="text-sm text-navy cursor-pointer">کتاب موجود است</label>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 border-t border-border sticky bottom-0 bg-white">
              <button onClick={handleSave} disabled={saving}
                className="btn-primary flex items-center gap-2 disabled:opacity-60">
                {saving
                  ? <><Loader2 size={16} className="animate-spin" />{uploading ? "آپلود تصویر..." : "ذخیره..."}</>
                  : <><Check size={16} />{editingBook ? "ذخیره تغییرات" : "افزودن کتاب"}</>}
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary">انصراف</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-navy/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-navy text-lg mb-2">حذف کتاب</h3>
            <p className="text-navy-muted text-sm mb-6">آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {deleting ? <Loader2 size={16} className="animate-spin" /> : null}
                بله، حذف شود
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 btn-secondary">انصراف</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
