/**
 * Auth helpers — JWT issue/verify, refresh token hashing, cookie helpers.
 * Server-only. Never import from a Client Component.
 */
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const ACCESS_COOKIE = "ktu_access";
const REFRESH_COOKIE = "ktu_refresh";

export interface AccessTokenPayload {
  sub: string; // studentId
  reg: string; // registerNumber
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string; // token id (matches RefreshToken.id)
  type: "refresh";
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return new TextEncoder().encode(secret);
}

/**
 * Cookie SameSite/Secure attributes.
 *
 * The Capacitor mobile app runs on `https://localhost` and calls this backend
 * cross-origin, so its auth cookies must be `SameSite=None; Secure` to be
 * stored/sent by the native HTTP layer. Enable this on the deployment that
 * serves the mobile app by setting `CROSS_SITE_COOKIES=true`. Web-only
 * deployments keep the stricter `SameSite=Lax` (better CSRF posture).
 */
function cookieSecurity(): { sameSite: "lax" | "none"; secure: boolean } {
  if (process.env.CROSS_SITE_COOKIES === "true") {
    return { sameSite: "none", secure: true };
  }
  return { sameSite: "lax", secure: process.env.NODE_ENV === "production" };
}

export async function signAccessToken(payload: { sub: string; reg: string }): Promise<string> {
  const ttl = Number(process.env.JWT_ACCESS_TTL ?? 3600);
  return new SignJWT({ ...payload, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(getSecret());
}

export async function signRefreshToken(payload: { sub: string; jti: string }): Promise<string> {
  const ttl = Number(process.env.JWT_REFRESH_TTL ?? 30 * 24 * 60 * 60);
  return new SignJWT({ ...payload, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(getSecret());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "access") return null;
    return payload as unknown as AccessTokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "refresh") return null;
    return payload as unknown as RefreshTokenPayload;
  } catch {
    return null;
  }
}

export async function hashRefreshToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10);
}

export async function compareRefreshToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

/**
 * Issue access + refresh tokens, persist the hashed refresh token, set both as
 * httpOnly cookies. Returns the access token's TTL (seconds) so callers can
 * include it in the response body if they want.
 */
export async function issueSession(studentId: string, registerNumber: string): Promise<{
  accessToken: string;
  expiresIn: number;
}> {
  // Create refresh token record first to get its id
  const ttl = Number(process.env.JWT_REFRESH_TTL ?? 30 * 24 * 60 * 60);
  const expiresAt = new Date(Date.now() + ttl * 1000);
  const refreshTokenRow = await db.refreshToken.create({
    data: {
      studentId,
      tokenHash: "pending", // placeholder, will update after hashing the actual token
      expiresAt,
    },
  });

  // Sign the refresh token JWT containing the row id as jti
  const refreshToken = await signRefreshToken({ sub: studentId, jti: refreshTokenRow.id });
  const tokenHash = await hashRefreshToken(refreshToken);
  await db.refreshToken.update({
    where: { id: refreshTokenRow.id },
    data: { tokenHash },
  });

  // Sign access token
  const accessToken = await signAccessToken({ sub: studentId, reg: registerNumber });
  const accessTtl = Number(process.env.JWT_ACCESS_TTL ?? 3600);

  // Set cookies
  const { sameSite, secure } = cookieSecurity();
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    maxAge: accessTtl,
  });
  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite,
    path: "/api/v1/refresh",
    maxAge: ttl,
  });

  return { accessToken, expiresIn: accessTtl };
}

/**
 * Revoke all refresh tokens for a student (used on logout).
 */
export async function revokeAllRefreshTokens(studentId: string): Promise<void> {
  await db.refreshToken.updateMany({
    where: { studentId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/**
 * Clear auth cookies (used on logout).
 */
export async function clearSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  const { sameSite, secure } = cookieSecurity();
  // Set to empty with maxAge 0 to ensure deletion with correct path
  cookieStore.set(ACCESS_COOKIE, "", {
    httpOnly: true, secure, sameSite, path: "/", maxAge: 0,
  });
  cookieStore.set(REFRESH_COOKIE, "", {
    httpOnly: true, secure, sameSite, path: "/api/v1/refresh", maxAge: 0,
  });
}

/**
 * Read the access token from the request cookies and verify it.
 * Returns null if missing, expired, or invalid.
 */
export async function getAuthenticatedStudent(req: Request): Promise<{
  studentId: string;
  registerNumber: string;
} | null> {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [k, ...v] = c.split("=");
      return [k, v.join("=")];
    }),
  );
  const token = cookies[ACCESS_COOKIE];
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  if (!payload) return null;
  return { studentId: payload.sub, registerNumber: payload.reg };
}

/**
 * Read the refresh token from the request cookies.
 */
export async function getRefreshTokenFromRequest(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [k, ...v] = c.split("=");
      return [k, v.join("=")];
    }),
  );
  return cookies[REFRESH_COOKIE] ?? null;
}

export const ACCESS_COOKIE_NAME = ACCESS_COOKIE;
export const REFRESH_COOKIE_NAME = REFRESH_COOKIE;
