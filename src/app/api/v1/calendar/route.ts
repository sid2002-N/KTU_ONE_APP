/**
 * GET /api/v1/calendar — public list of academic calendar events.
 * Replaces the `getCalendarEvents` Server Action for the Capacitor client.
 */
import { NextResponse } from "next/server";
import { getCalendarEvents } from "@/features/calendar/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const events = await getCalendarEvents();
  return NextResponse.json(events);
}
