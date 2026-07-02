/**
 * GET  /api/v1/bookmarks        — list student's bookmarks
 * POST /api/v1/bookmarks        — toggle a bookmark
 *   Body: { kind, refId, title, subtitle? }
 *   Returns: { bookmarked: boolean }
 * DELETE /api/v1/bookmarks?id=X — remove specific bookmark
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAuthenticatedStudent } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  const rows = await db.bookmark.findMany({
    where: { studentId: auth.studentId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    bookmarks: rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      refId: r.refId,
      title: r.title,
      subtitle: r.subtitle,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

const ToggleSchema = z.object({
  kind: z.enum(["paper", "syllabus", "notice", "subject"]),
  refId: z.string().min(1).max(100),
  title: z.string().min(1).max(300),
  subtitle: z.string().max(300).optional(),
});

export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON" } },
      { status: 400 },
    );
  }

  const parsed = ToggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const { kind, refId, title, subtitle } = parsed.data;
  const existing = await db.bookmark.findUnique({
    where: {
      studentId_kind_refId: {
        studentId: auth.studentId,
        kind,
        refId,
      },
    },
  });

  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  await db.bookmark.create({
    data: {
      studentId: auth.studentId,
      kind,
      refId,
      title,
      subtitle,
    },
  });
  return NextResponse.json({ bookmarked: true });
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Missing id param" } },
      { status: 400 },
    );
  }

  await db.bookmark.deleteMany({
    where: { id, studentId: auth.studentId },
  });

  return NextResponse.json({ ok: true });
}
