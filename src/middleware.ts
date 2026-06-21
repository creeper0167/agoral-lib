import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware — intentionally minimal.
 *
 * Auth is stored in localStorage (set by auth-context.tsx after login).
 * Middleware runs on the Edge and cannot access localStorage, so token
 * validation is handled client-side by useAuth() in each protected page.
 *
 * This middleware only does one safe, stateless thing:
 * strips trailing slashes for clean URLs.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Remove trailing slash (except root)
  if (pathname !== "/" && pathname.endsWith("/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
