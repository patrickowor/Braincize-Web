import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

/** Gate the app area behind a session, and keep signed-in users out of the auth screens. */
export function middleware(request: NextRequest) {
  const signedIn = request.cookies.has(SESSION_COOKIE);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !signedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if ((pathname === "/login" || pathname === "/signup") && signedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
