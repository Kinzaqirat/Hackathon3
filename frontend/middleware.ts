import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
// Note: '/' is excluded because it has client-side auth checks
const protectedRoutes = [
  '/exercises',
  '/exercises/*',
  '/quizzes',
  '/quizzes/*',
  '/chat',
  '/analytics',
  '/profile',
  '/settings',
  '/teacher-dashboard',
  '/create-quiz',
  '/create-exercise'
];

export function middleware(request: NextRequest) {
  // Check if the current path matches any protected route
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.endsWith('/*')) {
      const basePath = route.slice(0, -2); // Remove '/*' from the end
      return request.nextUrl.pathname.startsWith(basePath);
    }
    return request.nextUrl.pathname === route;
  });

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute) {
    const token = request.cookies.get('session_token')?.value;

    if (!token) {
      // Redirect to login page, preserving the original destination
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('return', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Apply middleware to all routes except public ones
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register (public auth pages)
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|login|register$).*)',
  ],
};