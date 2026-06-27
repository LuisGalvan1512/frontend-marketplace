import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  
  const { pathname } = request.nextUrl;

  // Protect /admin route
  if (pathname.startsWith('/admin')) {
    if (!token || userRole !== 'ADMIN') {
      // Redirect to home page if not authorized
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Prevent logged in users from accessing login or register pages
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Config to specify matching routes
export const config = {
  matcher: ['/admin/:path*', '/login', '/register'],
};
