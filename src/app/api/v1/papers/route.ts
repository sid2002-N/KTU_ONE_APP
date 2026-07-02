/**
 * GET /api/v1/papers?limit= — most-viewed question papers (metadata only).
 * Replaces the `getRecentPapers` Server Action for the Capacitor client.
 */
import { NextRequest, NextResponse } from "next/server";
import { getRecentPapers } from "@/features/dashboard/actions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? "4");
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 4;
  const papers = await getRecentPapers(limit);
  return NextResponse.json(papers);
}
