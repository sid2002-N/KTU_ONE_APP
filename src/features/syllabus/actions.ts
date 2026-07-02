"use server";

import { db } from "@/lib/db";
import type { Syllabus } from "@/lib/types";

export interface SyllabusFilters {
  search?: string;
  branch?: string | "ALL";
  semester?: number | "ALL";
}

export async function getSyllabus(filters: SyllabusFilters = {}): Promise<Syllabus[]> {
  const where: Record<string, unknown> = {
    deletedAt: null,
  };

  if (filters.search) {
    const q = filters.search.toLowerCase();
    where.OR = [
      { subjectName: { contains: q } },
      { subjectCode: { contains: q } },
    ];
  }
  if (filters.branch && filters.branch !== "ALL") {
    where.branchCode = filters.branch;
  }
  if (filters.semester && filters.semester !== "ALL") {
    where.semester = filters.semester;
  }

  const rows = await db.syllabus.findMany({
    where,
    orderBy: [{ semester: "asc" }, { subjectCode: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    semester: r.semester as Syllabus["semester"],
    branchCode: r.branchCode as Syllabus["branchCode"],
    subjectCode: r.subjectCode,
    subjectName: r.subjectName,
    version: r.version,
    fileUrl: r.fileUrl,
    lastUpdated: r.lastUpdated.toISOString(),
    modules: r.modules,
  }));
}
