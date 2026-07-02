/**
 * GET /api/v1/profile
 * JWT-protected. Returns the authenticated student's profile.
 * Reads from CachedStudentData (24h cache); falls back to "stale" flag if expired.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedStudent } from "@/lib/auth";
import { mapScraperToProfile } from "@/lib/scraper/mapper";
import type { ScraperStudentResponse } from "@/lib/scraper";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  const cached = await db.cachedStudentData.findUnique({
    where: { studentId: auth.studentId },
  });

  if (!cached) {
    return NextResponse.json(
      {
        error: {
          code: "NO_CACHE",
          message: "No cached data — student must re-login to refresh from scraper",
        },
      },
      { status: 404 },
    );
  }

  const scraperData = JSON.parse(cached.rawJson) as ScraperStudentResponse;
  const profile = mapScraperToProfile(scraperData, auth.studentId);

  const isStale = cached.expiresAt < new Date();

  return NextResponse.json({
    profile,
    cachedAt: cached.cachedAt.toISOString(),
    expiresAt: cached.expiresAt.toISOString(),
    stale: isStale,
  });
}
