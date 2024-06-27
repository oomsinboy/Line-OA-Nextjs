import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Request path:", pathname);

  //   if (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname === '/favicon.ico') {
  //     console.log('Allowing request');
  return NextResponse.next();
  //   }

  //   console.log('Redirecting to /login');
  //   return NextResponse.redirect(new URL('/login', request.url));
}

