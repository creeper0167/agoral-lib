/**
 * API Service Layer
 * Base URL is read from NEXT_PUBLIC_API_URL environment variable.
 * All functions map to .NET Core endpoints.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// ─── Generic helpers ──────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? "خطا در ارتباط با سرور");
  }

  return res.json() as Promise<T>;
}

const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });
const put = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "PUT", body: JSON.stringify(body) });
const del = <T>(path: string) => request<T>(path, { method: "DELETE" });

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
  };
}

export const authApi = {
  login: (data: LoginPayload) => post<AuthResponse>("/auth/login", data),
  register: (data: RegisterPayload) =>
    post<AuthResponse>("/auth/register", data),
  forgotPassword: (email: string) =>
    post<{ message: string }>("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    post<{ message: string }>("/auth/reset-password", { token, password }),
  me: () => get<AuthResponse["user"]>("/auth/me"),
};

// ─── Books ────────────────────────────────────────────────────────────────────

export interface BookFilters {
  query?: string;
  category?: string;
  available?: boolean;
  page?: number;
  pageSize?: number;
}

export interface BooksResponse {
  items: import("@/types").Book[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const booksApi = {
  getAll: (filters?: BookFilters) => {
    const params = new URLSearchParams();
    if (filters?.query) params.set("query", filters.query);
    if (filters?.category) params.set("category", filters.category);
    if (filters?.available !== undefined)
      params.set("available", String(filters.available));
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.pageSize) params.set("pageSize", String(filters.pageSize));
    const qs = params.toString();
    return get<BooksResponse>(`/books${qs ? `?${qs}` : ""}`);
  },

  getById: (id: number) => get<import("@/types").Book>(`/books/${id}`),

  create: (data: Omit<import("@/types").Book, "id">) =>
    post<import("@/types").Book>("/books", data),

  update: (id: number, data: Omit<import("@/types").Book, "id">) =>
    put<import("@/types").Book>(`/books/${id}`, data),

  delete: (id: number) => del<{ message: string }>(`/books/${id}`),
};

// ─── Reservations ─────────────────────────────────────────────────────────────

export interface ReservationResponse {
  id: number;
  bookId: number;
  userId: number;
  status: "pending" | "active" | "returned" | "cancelled";
  reservedAt: string;
  dueDate: string;
  book?: import("@/types").Book;
  user?: { id: number; name: string; email: string };
}

export const reservationsApi = {
  /** Current user's own reservations */
  getMine: () => get<ReservationResponse[]>("/reservations/me"),

  /** Admin: all reservations */
  getAll: () => get<ReservationResponse[]>("/reservations"),

  /** Reserve a book */
  create: (bookId: number) =>
    post<ReservationResponse>("/reservations", { bookId }),

  /** Admin: change status (approve / mark returned / cancel) */
  updateStatus: (id: number, status: ReservationResponse["status"]) =>
    put<ReservationResponse>(`/reservations/${id}/status`, { status }),

  cancel: (id: number) =>
    put<ReservationResponse>(`/reservations/${id}/status`, {
      status: "cancelled",
    }),
};

// ─── Users (admin) ────────────────────────────────────────────────────────────

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  joinedAt: string;
  reservationsCount: number;
}

export const usersApi = {
  getAll: () => get<UserResponse[]>("/users"),
  updateRole: (id: number, role: "user" | "admin") =>
    put<UserResponse>(`/users/${id}/role`, { role }),
  delete: (id: number) => del<{ message: string }>(`/users/${id}`),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  getAll: () => get<import("@/types").Category[]>("/categories"),
};

// ─── Dashboard stats (admin) ──────────────────────────────────────────────────

export interface DashboardStats {
  totalBooks: number;
  activeUsers: number;
  activeReservations: number;
  monthlyReservations: number;
  lowStockBooks: import("@/types").Book[];
  recentReservations: ReservationResponse[];
}

export const adminApi = {
  getDashboard: () => get<DashboardStats>("/admin/dashboard"),
};
