import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware();

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
