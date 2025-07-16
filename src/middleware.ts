import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const publicRoutes = [
    '/api/webhooks/clerk',
    '/api/auth/callback',
    '/api/auth/signin',
    '/api/auth/signout',
    '/api/auth/magic-link',
    '/api/auth/session',
    '/api/auth/user'
  ];

  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for Clerk session token
  const sessionToken = request.cookies.get('clerk.session');

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
