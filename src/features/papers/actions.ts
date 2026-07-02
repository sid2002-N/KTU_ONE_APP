"use server";

import { db } from "@/lib/db";
import type { QuestionPaper, ExamType } from "@/lib/types";

export interface PaperFilters {
  search?: string;
  branch?: string | "ALL";
  semester?: number | "ALL";
  year?: number | "ALL";
}

export async function getPapers(filters: PaperFilters = {}): Promise<QuestionPaper[]> {
  const where: Record<string, unknown> = {
    deletedAt: null,
  };

  if (filters.search) {
    const q = filters.search.toLowerCase();
    // SQLite doesn't support mode: 'insensitive' — use contains with raw lower
    where.OR = [
      { title: { contains: q } },
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
  if (filters.year && filters.year !== "ALL") {
    where.year = filters.year;
  }

  const rows = await db.questionPaper.findMany({
    where,
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 100,
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    subjectCode: r.subjectCode,
    subjectName: r.subjectName,
    semester: r.semester as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    branchCode: r.branchCode as QuestionPaper["branchCode"],
    year: r.year,
    month: r.month,
    examType: r.examType as ExamType,
    fileUrl: r.fileUrl,
    fileSizeBytes: r.fileSizeBytes,
    pageCount: r.pageCount,
    downloads: r.downloads,
    views: r.views,
    uploadedAt: r.uploadedAt.toISOString(),
  }));
}

export async function getPaperYears(): Promise<number[]> {
  const rows = await db.questionPaper.findMany({
    where: { deletedAt: null },
    distinct: ["year"],
    orderBy: { year: "desc" },
    select: { year: true },
  });
  return rows.map((r) => r.year);
}

export async function incrementPaperView(paperId: string): Promise<void> {
  await db.questionPaper.update({
    where: { id: paperId },
    data: { views: { increment: 1 } },
  });
}

export async function incrementPaperDownload(paperId: string): Promise<void> {
  await db.questionPaper.update({
    where: { id: paperId },
    data: { downloads: { increment: 1 } },
  });
}
