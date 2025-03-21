import { NextResponse } from "next/server";

export function middleware(req) {
  const student = req.cookies.get("student"); // 🔥 Use cookies for authentication
  const protectedRoutes = ["/student/dashboard", "/student/attendance"];

  if (!student && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/student/login", req.url));
  }
}
