/**
 * GET /api/v1/results
 * JWT-protected. Returns semester-by-semester results from cached scraper data.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedStudent } from "@/lib/auth";
import { mapScraperToResults } from "@/lib/scraper/mapper";
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
  const results = mapScraperToResults(scraperData);

  return NextResponse.json({
    results,
    cachedAt: cached.cachedAt.toISOString(),
    stale: cached.expiresAt < new Date(),
  });
}
