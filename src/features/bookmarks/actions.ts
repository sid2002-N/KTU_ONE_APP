"use server";

import { db } from "@/lib/db";
import { getAuthenticatedStudent } from "@/lib/auth";
import type { Bookmark } from "@/lib/types";

/**
 * Get all bookmarks for the authenticated student.
 * Returns empty array if not logged in.
 */
export async function getBookmarks(): Promise<Bookmark[]> {
  // Server Action — but we need to read cookies from next/headers, not req.
  // For now, use a non-action fetch path via /api/v1/bookmarks route.
  // This file is for the action helpers; actual auth uses the route.
  return [];
}

/**
 * Toggle a bookmark. If authenticated, persists to DB.
 * If not, returns the would-be state (caller falls back to localStorage).
 */
export async function toggleBookmarkDB(
  studentId: string,
  entry: { kind: Bookmark["kind"]; refId: string; title: string; subtitle?: string },
): Promise<boolean> {
  const existing = await db.bookmark.findUnique({
    where: {
      studentId_kind_refId: {
        studentId,
        kind: entry.kind,
        refId: entry.refId,
      },
    },
  });

  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
    return false;
  }

  await db.bookmark.create({
    data: {
      studentId,
      kind: entry.kind,
      refId: entry.refId,
      title: entry.title,
      subtitle: entry.subtitle,
    },
  });
  return true;
}

export async function hasBookmarkDB(
  studentId: string,
  kind: string,
  refId: string,
): Promise<boolean> {
  const existing = await db.bookmark.findUnique({
    where: {
      studentId_kind_refId: {
        studentId,
        kind,
        refId,
      },
    },
  });
  return !!existing;
}

export async function listBookmarksDB(studentId: string): Promise<Bookmark[]> {
  const rows = await db.bookmark.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    kind: r.kind as Bookmark["kind"],
    refId: r.refId,
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    createdAt: r.createdAt.toISOString(),
  }));
}
