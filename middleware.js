// import { NextResponse } from "next/server";
// import refreshAccessToken from "./lib/refreshToken";
// import axios from "axios";
// import dashboardNavItems from "./constants/DashboardNavLinks";

// export async function middleware(request) {
//   const { pathname } = request.nextUrl;
//   const accessToken = request.cookies.get("accessToken")?.value;
//   const refreshToken = request.cookies.get("refreshToken")?.value;
//   const response = NextResponse.next();

//   if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
//     if (accessToken || refreshToken) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     return NextResponse.next();
//   }

//   if (pathname.startsWith("/logout")) {
//     if (!accessToken && !refreshToken) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     return NextResponse.next();
//   }

//   if (pathname.startsWith("/profile")) {
//     if (!accessToken && refreshToken) {
//       try {
//         await refreshAccessToken();
//       } catch (error) {
//         response.cookies.delete("refreshToken");
//         return NextResponse.redirect(new URL("/login", request.url));
//       }
//     }

//     if (!accessToken) {
//       response.cookies.delete("refreshToken");
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     return response;
//   }

//   if (pathname.startsWith("/dashboard")) {
//     if (!accessToken && refreshToken) {
//       try {
//         await refreshAccessToken();
//       } catch (error) {
//         response.cookies.delete("refreshToken");
//         return NextResponse.redirect(new URL("/login", request.url));
//       }
//     }

//     if (!accessToken) {
//       response.cookies.delete("refreshToken");
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       const matchedNavItem = dashboardNavItems.find((item) => {
//         const splitPathname = pathname.split("/").filter(Boolean);
//         const splitHref = item.href.split("/").filter(Boolean);
//         return (
//           splitHref.includes(splitPathname.length > 1 ? splitPathname[1] : splitPathname[0]) &&
//           item.allowedRoles.includes(res.data.role)
//         );
//       });

//       if (!matchedNavItem) {
//         return NextResponse.redirect(new URL("/403", request.url)); // Keep your redirect to home
//       }

//       return response;
//     } catch (error) {
//       response.cookies.delete("refreshToken");
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/login", "/register", "/profile/:path*", "/dashboard/:path*", "/logout"],
// };

import { NextResponse } from 'next/server';
import axios from 'axios';
import refreshAccessToken from './lib/refreshToken';
import dashboardNavItems from './constants/DashboardNavLinks';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const cookies = request.cookies;
  console.log(request);
  const accessToken = cookies.get('accessToken')?.value;
  const refreshToken = cookies.get('refreshToken')?.value;
  const response = NextResponse.next();

  // Debug logging for production (avoid logging sensitive data)
  console.log(`[Middleware] Path: ${pathname}, AccessToken: ${!!accessToken}, RefreshToken: ${!!refreshToken}`);

  // Handle public auth routes
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (accessToken || refreshToken) {
      console.log('[Middleware] Redirecting authenticated user to home');
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response;
  }

  // Handle logout route
  if (pathname.startsWith('/logout')) {
    if (!accessToken && !refreshToken) {
      console.log('[Middleware] No tokens found, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response;
  }

  // Handle protected routes
  if (pathname.startsWith('/profile') || pathname.startsWith('/dashboard')) {
    // Attempt to refresh token if accessToken is missing but refreshToken exists
    if (!accessToken && refreshToken) {
      try {
        console.log('[Middleware] Attempting to refresh access token');
        await refreshAccessToken(request, response);
        // Check if accessToken was set after refresh
        const newAccessToken = response.cookies.get('accessToken')?.value;
        if (!newAccessToken) {
          throw new Error('Failed to refresh access token');
        }
        console.log('[Middleware] Token refreshed successfully');
      } catch (error) {
        console.error(`[Middleware] Token refresh failed: ${error.message}`);
        response.cookies.delete('refreshToken');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // If no accessToken after refresh attempt, redirect to login
    const finalAccessToken = accessToken || response.cookies.get('accessToken')?.value;
    if (!finalAccessToken) {
      console.log('[Middleware] No access token, redirecting to login');
      response.cookies.delete('refreshToken');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // For dashboard, verify role-based access
    if (pathname.startsWith('/dashboard')) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error('[Middleware] NEXT_PUBLIC_API_URL is not defined');
          throw new Error('API URL not configured');
        }

        console.log('[Middleware] Fetching user account data');
        const res = await axios.get(`${apiUrl}/account`, {
          headers: { Authorization: `Bearer ${finalAccessToken}` },
        });

        const splitPathname = pathname.split('/').filter(Boolean);
        const matchedNavItem = dashboardNavItems.find((item) => {
          const splitHref = item.href.split('/').filter(Boolean);
          return (
            splitHref.includes(splitPathname.length > 1 ? splitPathname[1] : splitPathname[0]) &&
            item.allowedRoles.includes(res.data.role)
          );
        });

        if (!matchedNavItem) {
          console.log('[Middleware] Unauthorized dashboard access, redirecting to 403');
          return NextResponse.redirect(new URL('/403', request.url));
        }

        console.log('[Middleware] Dashboard access granted');
        return response;
      } catch (error) {
        console.error(`[Middleware] Dashboard auth failed: ${error.message}`);
        response.cookies.delete('refreshToken');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    console.log('[Middleware] Profile access granted');
    return response;
  }

  return response;
}

export const config = {
  matcher: ['/login', '/register', '/profile/:path*', '/dashboard/:path*', '/logout'],
};