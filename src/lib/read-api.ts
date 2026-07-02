/**
 * Client-side fetchers for public read data (calendar, timetable, dashboard).
 *
 * These replace the Server Actions in `features/{calendar,dashboard,timetable}`
 * for the client SPA. Server Actions do not run in the Capacitor static export,
 * so the app fetches the equivalent public GET routes instead. Works identically
 * on web (relative URL, same origin) and Capacitor (absolute URL via `apiUrl`).
 *
 * The matching backend routes live under `src/app/api/v1/` and reuse the exact
 * Prisma queries previously in the `actions.ts` files.
 */
import { apiUrl } from "@/lib/api-base";
import type { CalendarEvent, KTUNotice } from "@/lib/types";

/** Mirrors the server `TimetableWithEntries` shape (types are erased at build). */
export interface TimetableWithEntries {
  id: string;
  title: string;
  examType: string;
  semester: number;
  branchCode: string;
  academicYear: string | null;
  isActive: boolean;
  publishedAt: string;
  entries: {
    id: string;
    date: string;
    session: string;
    subjectCode: string;
    subjectName: string;
  }[];
}

export interface DashboardStats {
  papers: number;
  notices: number;
  activeNotices: number;
  unreadNotices: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  color: string;
}

export interface DashboardPaper {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  branchCode: string;
  year: number;
  month: string | null;
  examType: string;
  views: number;
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(apiUrl(path), { credentials: "include" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  return getJson<CalendarEvent[]>("/api/v1/calendar", []);
}

export function fetchActiveTimetable(
  semester?: number,
  branchCode?: string,
): Promise<TimetableWithEntries | null> {
  const qs = new URLSearchParams();
  if (semester) qs.set("semester", String(semester));
  if (branchCode) qs.set("branch", branchCode);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return getJson<TimetableWithEntries | null>(`/api/v1/timetable${suffix}`, null);
}

export function fetchDashboardStats(): Promise<DashboardStats> {
  return getJson<DashboardStats>("/api/v1/dashboard/stats", {
    papers: 0,
    notices: 0,
    activeNotices: 0,
    unreadNotices: 0,
  });
}

export function fetchRecentNotices(limit = 3): Promise<KTUNotice[]> {
  return getJson<KTUNotice[]>(`/api/v1/notices?limit=${limit}`, []);
}

export function fetchUpcomingEvent(): Promise<UpcomingEvent | null> {
  return getJson<UpcomingEvent | null>("/api/v1/events/upcoming", null);
}

export function fetchRecentPapers(limit = 4): Promise<DashboardPaper[]> {
  return getJson<DashboardPaper[]>(`/api/v1/papers?limit=${limit}`, []);
}
