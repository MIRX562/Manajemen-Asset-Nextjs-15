import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const securedRoutes = [
  "/dashboard",
  "/activities",
  "/assets",
  "/employees",
  "/inventories",
  "/maintenance",
  "/locations",
  "/notifications",
  "/reports",
  "/settings",
  "/users",
];
const authRoutes = ["/auth"];
const publicRoutes = ["/public"];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get("session")?.value ?? null;

  const urlPath = new URL(request.url).pathname;

  // Secured Routes: Require a valid session
  if (securedRoutes.some((route) => urlPath.startsWith(route))) {
    if (!token) {
      // Redirect to the login page if there's no session
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    const response = NextResponse.next();
    // Extend the session expiration
    response.cookies.set("session", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  // Auth Routes: Redirect to dashboard if already logged in
  if (authRoutes.some((route) => urlPath.startsWith(route))) {
    if (token) {
      // If the user already has a session, redirect them to the dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next(); // Allow access to the login page if no session
  }

  // Public Routes: Allow access without session
  if (publicRoutes.some((route) => urlPath.startsWith(route))) {
    return NextResponse.next();
  }

  // Default case: Proceed with the request if no route matches
  return NextResponse.next();
}
