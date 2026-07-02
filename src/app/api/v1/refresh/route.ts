/**
 * POST /api/v1/refresh
 * Reads refresh token from httpOnly cookie, validates it, issues a new access token
 * AND rotates the refresh token (revokes old, issues new).
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyRefreshToken,
  compareRefreshToken,
  signAccessToken,
  signRefreshToken,
  hashRefreshToken,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "@/lib/auth";
import { checkRefreshRateLimit, getRequestIp } from "@/lib/auth/ratelimit";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Rate limit: 30 refresh attempts per hour per IP
  const ip = getRequestIp(req);
  const rateLimit = await checkRefreshRateLimit(ip);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: "Too many refresh attempts. Please try again later.",
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.reset - Date.now()) / 1000)),
        },
      },
    );
  }

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("ktu_refresh")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: { code: "NO_REFRESH_TOKEN", message: "No refresh token cookie" } },
      { status: 401 },
    );
  }

  // 1. Verify JWT signature + expiry
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    return NextResponse.json(
      { error: { code: "INVALID_REFRESH_TOKEN", message: "Refresh token invalid or expired" } },
      { status: 401 },
    );
  }

  // 2. Look up the hashed token in DB; ensure not revoked
  const stored = await db.refreshToken.findUnique({
    where: { id: payload.jti },
  });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    return NextResponse.json(
      { error: { code: "REVOKED_OR_EXPIRED", message: "Refresh token revoked or expired" } },
      { status: 401 },
    );
  }

  // 3. Compare the raw token against the stored hash
  const matches = await compareRefreshToken(refreshToken, stored.tokenHash);
  if (!matches) {
    return NextResponse.json(
      { error: { code: "TOKEN_MISMATCH", message: "Refresh token hash mismatch" } },
      { status: 401 },
    );
  }

  // 4. Fetch the student
  const student = await db.student.findUnique({
    where: { id: payload.sub },
    select: { id: true, registerNumber: true },
  });
  if (!student) {
    return NextResponse.json(
      { error: { code: "STUDENT_NOT_FOUND", message: "Student no longer exists" } },
      { status: 401 },
    );
  }

  // 5. REVOKE the old refresh token (rotation)
  await db.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  // 6. Create a NEW refresh token
  const refreshTtl = Number(process.env.JWT_REFRESH_TTL ?? 30 * 24 * 60 * 60);
  const newRefreshRow = await db.refreshToken.create({
    data: {
      studentId: student.id,
      tokenHash: "pending",
      expiresAt: new Date(Date.now() + refreshTtl * 1000),
    },
  });

  const newRefreshToken = await signRefreshToken({
    sub: student.id,
    jti: newRefreshRow.id,
  });
  const newTokenHash = await hashRefreshToken(newRefreshToken);
  await db.refreshToken.update({
    where: { id: newRefreshRow.id },
    data: { tokenHash: newTokenHash },
  });

  // 7. Issue a fresh access token
  const accessToken = await signAccessToken({
    sub: student.id,
    reg: student.registerNumber,
  });
  const accessTtl = Number(process.env.JWT_ACCESS_TTL ?? 3600);

  // 8. Set both new cookies
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: accessTtl,
  });

  cookieStore.set(REFRESH_COOKIE_NAME, newRefreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/v1/refresh",
    maxAge: refreshTtl,
  });

  return NextResponse.json({ ok: true, expiresIn: accessTtl });
}
