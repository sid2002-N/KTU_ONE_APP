/**
 * GET /api/v1/events/upcoming — next upcoming calendar event (or null).
 * Replaces the `getUpcomingEvent` Server Action for the Capacitor client.
 */
import { NextResponse } from "next/server";
import { getUpcomingEvent } from "@/features/dashboard/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const event = await getUpcomingEvent();
  return NextResponse.json(event);
}
