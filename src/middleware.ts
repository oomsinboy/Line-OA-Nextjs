import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL('/home ', request.url))
// }

// // // See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/login/:path*',
// }

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

// // Middleware function to check login status
// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Allow access to /login, static files, and favicon.ico
//   if (
//     pathname === "/login" ||
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/static") ||
//     pathname === "/favicon.ico"
//   ) {
//     return NextResponse.next();
//   }

//   try {
//     // Make a request to the login status API
//     const response = await fetch(
//       "https://city.planetcloud.cloud/citybackend/lineoa/login/",
//       {
//         method: "",
//       }
//     );

//     // Check if the status is 200 (logged in)
//     if (response.status === 200) {
//       if (pathname === "/") {
//         return NextResponse.redirect(new URL("/home", request.url));
//       }
//       return NextResponse.next();
//     } else {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   } catch (error) {
//     console.error("Error checking login status:", error);
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }

// // Config to specify the matching paths
// export const config = {
//   matcher: "/:path*",
// };
