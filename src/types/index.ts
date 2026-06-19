export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  cover?: string;
  available: boolean;
  totalCopies: number;
  availableCopies: number;
  publishYear: number;
  description: string;
  isbn: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Reservation {
  id: number;
  bookId: number;
  userId: number;
  status: "pending" | "active" | "returned" | "cancelled";
  reservedAt: string;
  dueDate: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}
