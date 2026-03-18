import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isProtectedRoute = createRouteMatcher(["/checkout(.*)", "/perfil(.*)", "/pedidos(.*)", "/carrito(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  if (isAdminRoute(request)) {
    if (!userId) return NextResponse.redirect(new URL("/sign-in", request.url));
    const role = (sessionClaims?.metadata as any)?.role;
    if (role !== "admin") return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedRoute(request)) {
    if (!userId) return NextResponse.redirect(new URL("/sign-in", request.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};