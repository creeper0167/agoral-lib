"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, BookOpen, X, Check } from "lucide-react";
import AdminHeader from "@/components/layout/AdminHeader";
import { books as initialBooks } from "@/lib/mock-data";
import { Book } from "@/types";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const emptyForm: Omit<Book, "id"> = {
    title: "", author: "", category: "", available: true,
    totalCopies: 1, availableCopies: 1, publishYear: 1400,
    isbn: "", description: "",
  };
  const [form, setForm] = useState<Omit<Book, "id">>(emptyForm);

  const filtered = books.filter(
    (b) => b.title.includes(query) || b.author.includes(query) || b.category.includes(query)
  );

  const openAdd = () => { setEditingBook(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (book: Book) => {
    setEditingBook(book);
    setForm({ title: book.title, author: book.author, category: book.category, available: book.available,
      totalCopies: book.totalCopies, availableCopies: book.availableCopies, publishYear: book.publishYear,
      isbn: book.isbn, description: book.description });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingBook) {
      setBooks((prev) => prev.map((b) => b.id === editingBook.id ? { ...form, id: editingBook.id } : b));
    } else {
      const newId = Math.max(...books.map((b) => b.id)) + 1;
      setBooks((prev) => [...prev, { ...form, id: newId }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setDeleteId(null);
  };

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className="input-field"
        value={String(form[key])}
        onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
      />
    </div>
  );

  return (
    <>
      <AdminHeader title="مدیریت کتاب‌ها" subtitle={`${books.length} عنوان کتاب`} />

      <main className="flex-1 p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 w-72">
            <Search size={15} className="text-navy-muted shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی کتاب..."
              className="bg-transparent text-sm text-navy placeholder-navy-muted/50 focus:outline-none w-full"
            />
          </div>
          <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2">
            <Plus size={16} />
            افزودن کتاب
          </button>
        </div>

        {/* Table */}
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-navy-muted">
                      کتابی یافت نشد
                    </td>
                  </tr>
                )}
                {filtered.map((book) => (
                  <tr key={book.id} className="hover:bg-parchment/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-parchment rounded-lg border border-border flex items-center justify-center shrink-0">
                          <BookOpen size={15} className="text-border" />
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
                      {book.available ? (
                        <span className="badge bg-emerald-50 text-emerald-700">موجود</span>
                      ) : (
                        <span className="badge bg-red-50 text-red-500">ناموجود</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(book)}
                          className="p-1.5 rounded-lg text-navy-muted hover:text-crimson hover:bg-crimson-light transition-colors"
                          title="ویرایش"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(book.id)}
                          className="p-1.5 rounded-lg text-navy-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-navy/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold text-navy text-lg">
                {editingBook ? "ویرایش کتاب" : "افزودن کتاب جدید"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-parchment">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {field("title", "عنوان کتاب")}
              {field("author", "نویسنده")}
              {field("category", "دسته‌بندی")}
              {field("isbn", "شابک (ISBN)")}
              {field("publishYear", "سال انتشار", "number")}
              <div className="grid grid-cols-2 gap-4">
                {field("totalCopies", "تعداد کل نسخه‌ها", "number")}
                {field("availableCopies", "نسخه‌های موجود", "number")}
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
                <input
                  type="checkbox"
                  id="avail"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="w-4 h-4 accent-crimson"
                />
                <label htmlFor="avail" className="text-sm text-navy cursor-pointer">کتاب موجود است</label>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 border-t border-border">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Check size={16} />
                {editingBook ? "ذخیره تغییرات" : "افزودن کتاب"}
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary">
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-navy/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-navy text-lg mb-2">حذف کتاب</h3>
            <p className="text-navy-muted text-sm mb-6">آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">
                بله، حذف شود
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 btn-secondary">
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
