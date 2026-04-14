import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(function middleware(req) {
  const { pathname } = req.nextUrl;
  const role = req.nextauth.token?.role;

  if (pathname.startsWith('/admin') && role !== 'admin')
    return NextResponse.redirect(new URL('/login', req.url));

  if (pathname.startsWith('/teacher') && role !== 'teacher' && role !== 'classTeacher')
    return NextResponse.redirect(new URL('/login', req.url));
}, {
  callbacks: { authorized: ({ token }) => !!token }
});

export const config = { matcher: ['/admin/:path*', '/teacher/:path*'] };