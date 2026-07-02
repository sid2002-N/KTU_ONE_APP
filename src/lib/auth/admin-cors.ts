import { NextResponse } from "next/server";

export function getAdminCorsHeaders(): Record<string, string> {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    "Access-Control-Allow-Origin": isProduction ? (process.env.ADMIN_ALLOWED_ORIGIN ?? "") : "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export function adminJsonResponse(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: getAdminCorsHeaders() });
}

export function handleAdminOptions(): NextResponse {
  return new NextResponse(null, { status: 204, headers: getAdminCorsHeaders() });
}
