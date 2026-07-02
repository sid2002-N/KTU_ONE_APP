/**
 * GET /api/v1/dashboard/stats — aggregate counts for the dashboard.
 * Replaces the `getDashboardStats` Server Action for the Capacitor client.
 */
import { NextResponse } from "next/server";
import { getDashboardStats } from "@/features/dashboard/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}
