/**
 * POST /api/v1/logout
 * Revokes all refresh tokens for the student and clears cookies.
 * Works even if access token is expired — tries refresh token to identify student.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedStudent,
  revokeAllRefreshTokens,
  clearSessionCookies,
  verifyRefreshToken,
} from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Try access token first
  let studentId: string | null = null;
  const auth = await getAuthenticatedStudent(req);
  if (auth) {
    studentId = auth.studentId;
  } else {
    // Access token expired — try refresh token to identify the student
    const cookieHeader = req.headers.get("cookie") ?? "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [k, ...v] = c.split("=");
        return [k, v.join("=")];
      }),
    );
    const refreshToken = cookies["ktu_refresh"];
    if (refreshToken) {
      const payload = await verifyRefreshToken(refreshToken);
      if (payload) {
        // Check if this refresh token is still in the DB and not revoked
        const stored = await db.refreshToken.findUnique({
          where: { id: payload.jti },
        });
        if (stored && !stored.revokedAt) {
          studentId = payload.sub;
        }
      }
    }
  }

  // Revoke all refresh tokens for this student
  if (studentId) {
    await revokeAllRefreshTokens(studentId);
  }

  // Always clear cookies
  await clearSessionCookies();

  return NextResponse.json({ ok: true });
}
