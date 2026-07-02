import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Middleware — defense-in-depth route protection.
 *
 * Blocks all /api/v1/* routes EXCEPT the public allowlist.
 * If a valid access token cookie is present, the request passes through.
 * If not, it returns 401.
 *
 * This does NOT replace per-handler auth checks — it's a safety net
 * that catches any future route that forgets to add getAuthenticatedStudent().
 */

const PUBLIC_API_ROUTES = [
  "/api/v1/login",
  "/api/v1/refresh",
  "/api/v1/logout",
  // Public read data (no auth) — also consumed by the Capacitor mobile app,
  // which fetches these instead of the equivalent Server Actions.
  "/api/v1/calendar",
  "/api/v1/timetable",
  "/api/v1/dashboard/stats",
  "/api/v1/notices",
  "/api/v1/events/upcoming",
  "/api/v1/papers",
];

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) return new Uint8Array();
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /api/v1/* routes (not /api/v1/admin/* which uses its own Bearer auth,
  // not /api/webhooks/*, not /api/cron/*, not /api/ health check)
  if (!pathname.startsWith("/api/v1/")) {
    return NextResponse.next();
  }

  // Allow admin routes (they use Bearer ADMIN_API_KEY, not JWT)
  if (pathname.startsWith("/api/v1/admin/")) {
    return NextResponse.next();
  }

  // Check public allowlist (exact match or prefix for dynamic routes)
  const isPublic = PUBLIC_API_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  if (isPublic) {
    return NextResponse.next();
  }

  // Check for download routes — these have their own per-handler auth
  // (we added getAuthenticatedStudent to them, but middleware also checks)
  if (pathname.match(/^\/api\/v1\/papers\/[^/]+\/download$/)) {
    return NextResponse.next(); // handler does its own auth check
  }
  if (pathname.match(/^\/api\/v1\/syllabus\/[^/]+\/download$/)) {
    return NextResponse.next(); // handler does its own auth check
  }

  // For all other /api/v1/* routes, check for valid access token
  const accessToken = req.cookies.get("ktu_access")?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 },
    );
  }

  // Verify JWT signature + expiry (lightweight check — full auth in handler)
  try {
    const secret = getSecret();
    if (secret.length === 0) {
      // JWT_SECRET not configured — fail closed
      return NextResponse.json(
        { error: { code: "SERVER_ERROR", message: "Auth not configured" } },
        { status: 500 },
      );
    }
    const { payload } = await jwtVerify(accessToken, secret);
    if (payload.type !== "access") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Invalid token type" } },
        { status: 401 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Token expired or invalid" } },
      { status: 401 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/v1/:path*"],
};
