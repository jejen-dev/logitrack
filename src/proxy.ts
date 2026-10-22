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

  const pathname = request.nextUrl.pathname;
  const isPublicLandingPage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isJoinPage = pathname === "/join" || pathname.startsWith("/join/");
  const isTeamPage = pathname === "/team" || pathname.startsWith("/team/");

  const hasValidId =
    !!token &&
    typeof token.id === "string" &&
    token.id.length > 0;

  const role = token?.role;

  const hasValidRole = isUserRole(role);

  const isAuthenticated =
    hasValidId && hasValidRole && token?.authProvider === "google";

  if (!isAuthenticated && !isLoginPage && !isPublicLandingPage) {
    if (isJoinPage) {
      const callbackUrl = `${pathname}${request.nextUrl.search}`;
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(
      new URL("/login", request.url),
    );
  }

  if (isAuthenticated && isTeamPage) {
    return NextResponse.redirect(new URL("/users", request.url));
  }

  if (isAuthenticated && !token?.merchantId && !isJoinPage && !isLoginPage && !isPublicLandingPage) {
    return NextResponse.redirect(new URL("/join", request.url));
  }

  if (isAuthenticated && !token?.merchantId && isLoginPage) {
    return NextResponse.redirect(new URL("/join", request.url));
  }

  if (isAuthenticated && token?.merchantId && isJoinPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthenticated && isLoginPage && token?.merchantId) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
  }

  if (isAuthenticated && !isJoinPage) {
    const isOwnerUsersPage = pathname.startsWith("/users") && token?.isMerchantOwner === true;
    if (!canAccessRoute(pathname, role) && !isOwnerUsersPage) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
