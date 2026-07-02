/**
 * Cron route — syncs notifications from the scraper backend into Prisma.
 * Runs every 15 min via Vercel Cron (configured in vercel.json).
 * Protected by CRON_SECRET header.
 */
import { NextRequest, NextResponse } from "next/server";
import { upsertScraperNotifications } from "@/features/notices/actions";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Missing or invalid cron secret" } },
      { status: 401 },
    );
  }

  const scraperUrl = process.env.SCRAPER_API_URL;
  if (!scraperUrl) {
    return NextResponse.json(
      { error: { code: "MISCONFIGURED", message: "SCRAPER_API_URL not set" } },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${scraperUrl}/api/v1/notifications`, {
      method: "GET",
      headers: { Accept: "application/json" },
      // 10s timeout
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: {
            code: "SCRAPER_UNAVAILABLE",
            message: `Scraper returned ${res.status}`,
          },
        },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      notifications: Array<{
        date: string;
        heading: string;
        key: string;
        data: string;
      }>;
    };

    if (!data.notifications || !Array.isArray(data.notifications)) {
      return NextResponse.json(
        { error: { code: "BAD_RESPONSE", message: "Invalid notification shape" } },
        { status: 502 },
      );
    }

    const result = await upsertScraperNotifications(data.notifications);

    return NextResponse.json({
      ok: true,
      synced: data.notifications.length,
      created: result.created,
      updated: result.updated,
      at: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: { code: "SYNC_FAILED", message } },
      { status: 500 },
    );
  }
}
