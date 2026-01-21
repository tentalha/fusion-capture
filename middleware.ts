import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Public paths
  if (path === '/login' || path === '/unauthorized') {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Role-based route protection
  const roleRoutes: { [key: string]: string[] } = {
    admin: ['/users', '/analytics'],
    editor: ['/dashboard', '/content'],
  };

  const userRole = token.role as string;

  // Check if route requires specific role
  for (const [role, routes] of Object.entries(roleRoutes)) {
    if (routes.some((route) => path.startsWith(route))) {
      if (userRole === 'admin') {
        // Admin can access everything
        return NextResponse.next();
      }
      if (userRole !== role && !roleRoutes.admin.includes(path)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/content/:path*',
    '/users/:path*',
    '/analytics/:path*',
    '/profile/:path*',
  ],
};
