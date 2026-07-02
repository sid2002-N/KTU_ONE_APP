"use server";
import { db } from "@/lib/db";
import { z } from "zod";

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

function mapTimetable(t: any): TimetableWithEntries {
  return {
    id: t.id, title: t.title, examType: t.examType, semester: t.semester,
    branchCode: t.branchCode, academicYear: t.academicYear, isActive: t.isActive,
    publishedAt: t.publishedAt.toISOString(),
    entries: (t.entries ?? []).map((e: any) => ({
      id: e.id, date: e.date.toISOString(), session: e.session,
      subjectCode: e.subjectCode, subjectName: e.subjectName,
    })),
  };
}

export async function getActiveTimetable(semester?: number, branchCode?: string): Promise<TimetableWithEntries | null> {
  const where: any = { isActive: true };
  if (semester) where.semester = semester;
  const branchSpecific = await db.examTimetable.findFirst({
    where: { ...where, branchCode: branchCode ?? "ALL" },
    include: { entries: { orderBy: { date: "asc" } } },
    orderBy: { publishedAt: "desc" },
  });
  if (branchSpecific) return mapTimetable(branchSpecific);
  const allBranches = await db.examTimetable.findFirst({
    where: { ...where, branchCode: "ALL" },
    include: { entries: { orderBy: { date: "asc" } } },
    orderBy: { publishedAt: "desc" },
  });
  if (allBranches) return mapTimetable(allBranches);
  return null;
}

export async function getAllActiveTimetables(): Promise<TimetableWithEntries[]> {
  const timetables = await db.examTimetable.findMany({
    where: { isActive: true },
    include: { entries: { orderBy: { date: "asc" } } },
    orderBy: [{ semester: "asc" }, { publishedAt: "desc" }],
  });
  return timetables.map(mapTimetable);
}

const EntrySchema = z.object({
  date: z.string(), session: z.enum(["FN", "AN"]),
  subjectCode: z.string().min(1), subjectName: z.string().min(1),
});
const TimetableSchema = z.object({
  title: z.string().min(1).max(300), examType: z.enum(["END_SEM", "SERIES_1", "SERIES_2"]),
  semester: z.number().min(1).max(8), branchCode: z.string().min(1),
  academicYear: z.string().optional(), entries: z.array(EntrySchema).min(1),
});

export async function createTimetable(input: z.infer<typeof TimetableSchema>) {
  const p = TimetableSchema.parse(input);
  await db.examTimetable.updateMany({
    where: { semester: p.semester, branchCode: p.branchCode, examType: p.examType, isActive: true },
    data: { isActive: false },
  });
  const t = await db.examTimetable.create({
    data: {
      title: p.title, examType: p.examType, semester: p.semester,
      branchCode: p.branchCode, academicYear: p.academicYear ?? null, isActive: true,
      entries: { create: p.entries.map((e) => ({ date: new Date(e.date), session: e.session, subjectCode: e.subjectCode, subjectName: e.subjectName })) },
    },
    include: { entries: { orderBy: { date: "asc" } } },
  });
  return mapTimetable(t);
}

export async function deleteTimetable(id: string) { await db.examTimetable.delete({ where: { id } }); }
export async function toggleTimetableActive(id: string, isActive: boolean) { await db.examTimetable.update({ where: { id }, data: { isActive } }); }
export async function listAllTimetablesForAdmin(): Promise<TimetableWithEntries[]> {
  const timetables = await db.examTimetable.findMany({
    include: { entries: { orderBy: { date: "asc" } } },
    orderBy: [{ isActive: "desc" }, { semester: "asc" }, { publishedAt: "desc" }],
  });
  return timetables.map(mapTimetable);
}
