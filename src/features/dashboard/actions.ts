"use server";

import { db } from "@/lib/db";
import type { KTUNotice, NoticeCategory, NoticePriority } from "@/lib/types";

export async function getDashboardStats() {
  const [papers, notices, activeNotices, unreadNotices] = await Promise.all([
    db.questionPaper.count({ where: { deletedAt: null } }),
    db.kTUNotice.count({ where: { active: true, deletedAt: null } }),
    db.kTUNotice.count({
      where: { active: true, deletedAt: null, publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    db.kTUNotice.count({
      where: {
        active: true,
        deletedAt: null,
        publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    papers,
    notices,
    activeNotices,
    unreadNotices: unreadNotices,
  };
}

export async function getRecentNotices(limit = 3): Promise<KTUNotice[]> {
  const rows = await db.kTUNotice.findMany({
    where: { active: true, deletedAt: null },
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category as NoticeCategory,
    publishedAt: r.publishedAt.toISOString(),
    priority: r.priority as NoticePriority,
    pdfUrl: r.pdfUrl ?? undefined,
    externalUrl: r.externalUrl ?? undefined,
    tags: JSON.parse(r.tags) as string[],
    pinned: r.pinned,
    active: r.active,
  }));
}

export async function getUpcomingEvent() {
  const row = await db.calendarEvent.findFirst({
    where: { startDate: { gte: new Date() } },
    orderBy: { startDate: "asc" },
  });
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    startDate: row.startDate.toISOString(),
    endDate: row.endDate.toISOString(),
    color: row.color,
  };
}

export async function getRecentPapers(limit = 4) {
  const rows = await db.questionPaper.findMany({
    where: { deletedAt: null },
    orderBy: [{ views: "desc" }],
    take: limit,
    select: {
      id: true,
      title: true,
      subjectCode: true,
      subjectName: true,
      semester: true,
      branchCode: true,
      year: true,
      month: true,
      examType: true,
      views: true,
    },
  });
  return rows;
}
