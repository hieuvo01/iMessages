import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // ignore auth section
    // '/auth/*'
    // these routes are protected
    '/',
  ]
};

export function middleware(request: NextRequest) {
  // if there is no token, force login
  if (!request.cookies.has('token')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // request.cookies.delete('nextjs');
  // request.cookies.has('nextjs'); // => false

  // // Setting cookies on the response using the `ResponseCookies` API
  const response = NextResponse.next();
  // handle the rests
  // response.cookies.set('something', 'fast');

  return response;
}