/**
 * GET  /api/v1/calc-history          — list calculator history (optional ?type=)
 * POST /api/v1/calc-history          — add entry
 *   Body: { type, input, output, label? }
 * DELETE /api/v1/calc-history?id=X   — remove specific entry
 * DELETE /api/v1/calc-history?all=1  — clear all
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

  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? undefined;

  const where: Record<string, unknown> = { studentId: auth.studentId };
  if (type) where.type = type;

  const rows = await db.calculatorHistoryEntry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    entries: rows.map((r) => ({
      id: r.id,
      type: r.type,
      input: JSON.parse(r.input),
      output: JSON.parse(r.output),
      label: r.label,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

const AddSchema = z.object({
  type: z.enum([
    "SGPA",
    "CGPA",
    "ATTENDANCE",
    "INTERNAL_MARKS",
    "PASS_CALCULATOR",
  ]),
  input: z.record(z.string(), z.unknown()),
  output: z.object({
    type: z.string(),
    value: z.number(),
    percentage: z.number().optional(),
    meta: z.record(z.string(), z.unknown()).optional(),
    computedAt: z.string(),
  }),
  label: z.string().max(200).optional(),
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

  const parsed = AddSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const { type, input, output, label } = parsed.data;

  const row = await db.calculatorHistoryEntry.create({
    data: {
      studentId: auth.studentId,
      type,
      input: JSON.stringify(input),
      output: JSON.stringify(output),
      label,
    },
  });

  return NextResponse.json({
    id: row.id,
    type: row.type,
    input: JSON.parse(row.input),
    output: JSON.parse(row.output),
    label: row.label,
    createdAt: row.createdAt.toISOString(),
  });
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
  const all = url.searchParams.get("all");

  if (all === "1") {
    await db.calculatorHistoryEntry.deleteMany({
      where: { studentId: auth.studentId },
    });
    return NextResponse.json({ ok: true, cleared: true });
  }

  if (!id) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Missing id or all=1" } },
      { status: 400 },
    );
  }

  await db.calculatorHistoryEntry.deleteMany({
    where: { id, studentId: auth.studentId },
  });

  return NextResponse.json({ ok: true });
}
