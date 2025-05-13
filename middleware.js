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

export default function middleware() { }