import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import {
  canAccessRoute,
  isUserRole,
} from "@/lib/auth/permissions";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === "/login";

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(
      new URL("/login", request.url),
    );
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
  }

  if (isLoggedIn) {
    const role = token.role;

    if (
      !isUserRole(role) ||
      !canAccessRoute(pathname, role)
    ) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};