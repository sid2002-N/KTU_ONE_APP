/**
 * GET /api/v1/timetable?semester=&branch= — active exam timetable.
 * Replaces the `getActiveTimetable` Server Action for the Capacitor client.
 * Returns the timetable object or `null`.
 */
import { NextRequest, NextResponse } from "next/server";
import { getActiveTimetable } from "@/features/timetable/actions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const semesterRaw = url.searchParams.get("semester");
  const branch = url.searchParams.get("branch") ?? undefined;
  const semester = semesterRaw ? Number(semesterRaw) : undefined;
  const timetable = await getActiveTimetable(
    Number.isFinite(semester) ? semester : undefined,
    branch,
  );
  return NextResponse.json(timetable);
}
