import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route protection middleware.
 *
 * Protected routes:
 *  - /reserve        → any authenticated user
 *  - /admin/*        → admin role only (verified server-side)
 *
 * The JWT is stored as an httpOnly cookie named "token" (set by the
 * .NET Core backend on /api/auth/login). For cookie-less setups where
 * the token lives in localStorage only, move validation to individual
 * page components using the useAuth() hook.
 */

const PUBLIC_PATHS = ["/", "/books", "/book", "/categories", "/about", "/auth"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Redirect unauthenticated users trying to access protected routes
  if (!isPublic(pathname) && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only routes — real role check happens in API; this is a UX guard
  if (pathname.startsWith("/admin")) {
    const role = request.cookies.get("role")?.value;
    if (role && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
