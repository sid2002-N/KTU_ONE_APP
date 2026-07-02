/**
 * GET /api/v1/notices?limit= — recent active notices.
 * Replaces the `getRecentNotices` Server Action for the Capacitor client.
 */
import { NextRequest, NextResponse } from "next/server";
import { getRecentNotices } from "@/features/dashboard/actions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? "3");
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 3;
  const notices = await getRecentNotices(limit);
  return NextResponse.json(notices);
}
