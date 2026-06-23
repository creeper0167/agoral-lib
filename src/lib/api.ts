/**
 * API Service Layer — all calls go to NEXT_PUBLIC_API_URL (your .NET Core backend)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "خطا در ارتباط با سرور");
  }
  return res.json() as Promise<T>;
}

const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });
const put = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "PUT", body: JSON.stringify(body) });
const del = <T>(path: string) => request<T>(path, { method: "DELETE" });

/** Multipart upload — no Content-Type header so browser sets boundary */
async function upload<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "خطا در آپلود فایل");
  }
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookDto {
  id: number;
  title: string;
  author: string;
  categoryId: number; // FK id
  category: string; // Category.Name — for display
  cover?: string;
  description: string;
  isbn: string;
  publishYear: number;
  totalCopies: number;
  availableCopies: number;
  available: boolean;
}

export interface BooksPagedResponse {
  items: BookDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// Payload types that match backend CreateBookRequest / UpdateBookRequest
export interface BookCreatePayload {
  title: string;
  author: string;
  categoryId: number; // FK — what the backend expects
  cover?: string;
  description: string;
  isbn: string;
  publishYear: number;
  totalCopies: number;
  availableCopies: number;
}

export type BookUpdatePayload = BookCreatePayload;

export interface BookQueryParams {
  query?: string;
  categoryId?: number; // filter by FK id
  available?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface ReservationDto {
  id: number;
  bookId: number;
  userId: number;
  status: "pending" | "active" | "returned" | "cancelled";
  reservedAt: string;
  dueDate: string;
  book?: BookDto;
  user?: { id: number; name: string; email: string };
}

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  joinedAt: string;
  reservationsCount: number;
}

export interface DashboardStatsDto {
  totalBooks: number;
  activeUsers: number;
  activeReservations: number;
  monthlyReservations: number;
  lowStockBooks: BookDto[];
  recentReservations: ReservationDto[];
}

export interface AuthResponse {
  token: string;
  user: { id: number; name: string; email: string; role: "user" | "admin" };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: (data: { email: string; password: string }) =>
    post<AuthResponse>("/auth/login", data),
  register: (data: { name: string; email: string; password: string }) =>
    post<AuthResponse>("/auth/register", data),
  forgotPassword: (email: string) =>
    post<{ message: string }>("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    post<{ message: string }>("/auth/reset-password", { token, password }),
  me: () => get<AuthResponse["user"]>("/auth/me"),
};

// ─── Books API ────────────────────────────────────────────────────────────────

export const booksApi = {
  getAll: (params?: BookQueryParams): Promise<BooksPagedResponse> => {
    const qs = new URLSearchParams();
    if (params?.query) qs.set("query", params.query);
    if (params?.categoryId !== undefined)
      qs.set("categoryId", String(params.categoryId));
    if (params?.available !== undefined)
      qs.set("available", String(params.available));
    if (params?.page) qs.set("page", String(params.page));
    if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
    const s = qs.toString();
    return get<BooksPagedResponse>(`/books${s ? `?${s}` : ""}`);
  },

  getById: (id: number) => get<BookDto>(`/books/${id}`),
  create: (data: BookCreatePayload) => post<BookDto>("/books", data),
  update: (id: number, data: BookUpdatePayload) =>
    put<BookDto>(`/books/${id}`, data),
  delete: (id: number) => del<{ message: string }>(`/books/${id}`),

  /** Upload cover image. Returns updated BookDto with new cover URL. */
  uploadCover: (id: number, file: File): Promise<BookDto> => {
    const fd = new FormData();
    fd.append("file", file);
    return upload<BookDto>(`/books/${id}/cover`, fd);
  },

  /** Resolve a cover URL — prepends the static-files base when it's a relative path.
   *  NEXT_PUBLIC_API_URL = https://lib.fanavaranpars.com/api
   *  static base          = https://lib.fanavaranpars.com
   */
  coverUrl: (cover?: string): string | undefined => {
    if (!cover) return undefined;
    if (cover.startsWith("http")) return cover;
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
    const staticBase = apiUrl.endsWith("/api")
      ? apiUrl.slice(0, -4) // strip trailing /api
      : apiUrl.replace(/\/api$/, ""); // safe fallback
    return `${staticBase}${cover}`;
  },
};

// ─── Reservations API ─────────────────────────────────────────────────────────

export const reservationsApi = {
  getAll: () => get<ReservationDto[]>("/reservations"),
  getMine: () => get<ReservationDto[]>("/reservations/me"),
  create: (bookId: number) => post<ReservationDto>("/reservations", { bookId }),
  updateStatus: (id: number, status: ReservationDto["status"]) =>
    put<ReservationDto>(`/reservations/${id}/status`, { status }),
};

// ─── Users API ────────────────────────────────────────────────────────────────

export const usersApi = {
  getAll: () => get<UserResponseDto[]>("/users"),
  updateRole: (id: number, role: "user" | "admin") =>
    put<UserResponseDto>(`/users/${id}/role`, { role }),
  delete: (id: number) => del<{ message: string }>(`/users/${id}`),
};

// ─── Categories API ───────────────────────────────────────────────────────────

export const categoriesApi = {
  getAll: () => get<CategoryDto[]>("/categories"),
};

// ─── Admin API ────────────────────────────────────────────────────────────────

export const adminApi = {
  getDashboard: () => get<DashboardStatsDto>("/admin/dashboard"),
};
