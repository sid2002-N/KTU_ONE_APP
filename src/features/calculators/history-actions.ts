"use server";

import { db } from "@/lib/db";
import type { CalculatorHistoryEntry, CalculatorType, CalculatorResult } from "@/lib/types";

export async function addCalcHistoryDB(
  studentId: string,
  type: CalculatorType,
  input: Record<string, unknown>,
  output: CalculatorResult,
  label?: string,
): Promise<CalculatorHistoryEntry> {
  const row = await db.calculatorHistoryEntry.create({
    data: {
      studentId,
      type,
      input: JSON.stringify(input),
      output: JSON.stringify(output),
      label,
    },
  });
  return {
    id: row.id,
    type: row.type as CalculatorType,
    input: JSON.parse(row.input) as Record<string, unknown>,
    output: JSON.parse(row.output) as CalculatorResult,
    label: row.label ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listCalcHistoryDB(
  studentId: string,
  type?: CalculatorType,
): Promise<CalculatorHistoryEntry[]> {
  const where: Record<string, unknown> = { studentId };
  if (type) where.type = type;
  const rows = await db.calculatorHistoryEntry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return rows.map((r) => ({
    id: r.id,
    type: r.type as CalculatorType,
    input: JSON.parse(r.input) as Record<string, unknown>,
    output: JSON.parse(r.output) as CalculatorResult,
    label: r.label ?? undefined,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function removeCalcHistoryDB(
  studentId: string,
  entryId: string,
): Promise<void> {
  await db.calculatorHistoryEntry.deleteMany({
    where: { id: entryId, studentId },
  });
}

export async function clearCalcHistoryDB(studentId: string): Promise<void> {
  await db.calculatorHistoryEntry.deleteMany({
    where: { studentId },
  });
}
