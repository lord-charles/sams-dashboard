import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/dashboard/auth",
    },
  }
);

export const config = {
  matcher: [
    // "/dashboard/:path+",
    "/((?!dashboard|dashboard/auth|api|login|_next/static|_next/image|favicon.ico).*)",
  ],
};
