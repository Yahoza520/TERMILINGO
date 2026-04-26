import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = token?.role as string;

    // /dashboard root → role'e göre yönlendir
    if (pathname === "/dashboard") {
      if (role === "EMPLOYER" || role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/musteri", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard/tercuman", req.url));
    }

    // Müşteri paneli: sadece EMPLOYER ve ADMIN
    if (pathname.startsWith("/dashboard/musteri")) {
      if (role !== "EMPLOYER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/tercuman", req.url));
      }
    }

    // Tercüman paneli: sadece TRANSLATOR, STUDENT, ADMIN
    if (pathname.startsWith("/dashboard/tercuman")) {
      if (role === "EMPLOYER") {
        return NextResponse.redirect(new URL("/dashboard/musteri", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
