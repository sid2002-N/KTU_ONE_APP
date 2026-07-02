"use server";

import { db } from "@/lib/db";
import type { CalendarEvent, CalendarEventType } from "@/lib/types";

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const rows = await db.calendarEvent.findMany({
    orderBy: { startDate: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    type: r.type as CalendarEventType,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString(),
    allDay: r.allDay,
    color: r.color,
    reminderEnabled: r.reminderEnabled,
  }));
}
