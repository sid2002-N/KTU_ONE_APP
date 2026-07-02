"use server";

import { db } from "@/lib/db";
import type { KTUNotice, NoticeCategory, NoticePriority } from "@/lib/types";

export async function getNotices(category: NoticeCategory | "All" = "All"): Promise<KTUNotice[]> {
  const where: Record<string, unknown> = {
    active: true,
    deletedAt: null,
  };
  if (category !== "All") {
    where.category = category;
  }

  const rows = await db.kTUNotice.findMany({
    where,
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
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

export async function getNoticeByKey(key: string): Promise<KTUNotice | null> {
  const row = await db.kTUNotice.findUnique({ where: { key } });
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as NoticeCategory,
    publishedAt: row.publishedAt.toISOString(),
    priority: row.priority as NoticePriority,
    pdfUrl: row.pdfUrl ?? undefined,
    externalUrl: row.externalUrl ?? undefined,
    tags: JSON.parse(row.tags) as string[],
    pinned: row.pinned,
    active: row.active,
  };
}

/**
 * Upsert notices received from the scraper backend's /api/v1/notifications endpoint.
 * Called by the cron sync route.
 */
export async function upsertScraperNotifications(
  notices: Array<{
    date: string;
    heading: string;
    key: string;
    data: string;
  }>,
): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const n of notices) {
    const parsed = new Date(n.date);
    const publishedAt = isNaN(parsed.getTime()) ? new Date() : parsed;

    const result = await db.kTUNotice.upsert({
      where: { key: n.key },
      update: {
        title: n.heading,
        description: n.data,
        publishedAt,
      },
      create: {
        key: n.key,
        title: n.heading,
        description: n.data,
        category: "General",
        publishedAt,
        priority: "Normal",
        tags: JSON.stringify([]),
        pinned: false,
        active: true,
      },
    });

    // If createdAt is same as publishedAt, it was just created
    if (Math.abs(result.createdAt.getTime() - result.updatedAt.getTime()) < 1000) {
      created++;
    } else {
      updated++;
    }
  }

  return { created, updated };
}
