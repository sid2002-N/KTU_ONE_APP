"use server";
import { db } from "@/lib/db";
import type { SearchResult } from "@/lib/types";

export async function searchAll(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];

  const subjects = await db.subject.findMany({ where: { OR: [{ name: { contains: q } }, { code: { contains: q } }] }, take: 5 });
  for (const s of subjects) results.push({ id: s.id, kind: "subject", title: s.name, subtitle: s.code, meta: `${s.branchCode} · S${s.semester} · ${s.credits} credits` });

  const papers = await db.questionPaper.findMany({ where: { deletedAt: null, OR: [{ title: { contains: q } }, { subjectName: { contains: q } }, { subjectCode: { contains: q } }] }, take: 10, orderBy: { views: "desc" } });
  for (const p of papers) results.push({ id: p.id, kind: "paper", title: p.subjectName, subtitle: p.subjectCode, meta: `${p.branchCode} · S${p.semester} · ${p.month === 5 ? "May" : "Nov"} ${p.year}` });

  const syllabus = await db.syllabus.findMany({ where: { deletedAt: null, OR: [{ subjectName: { contains: q } }, { subjectCode: { contains: q } }] }, take: 5 });
  for (const s of syllabus) results.push({ id: s.id, kind: "syllabus", title: s.subjectName, subtitle: s.subjectCode, meta: `${s.branchCode} · S${s.semester}` });

  const notices = await db.kTUNotice.findMany({ where: { active: true, deletedAt: null, OR: [{ title: { contains: q } }, { description: { contains: q } }] }, take: 5, orderBy: { publishedAt: "desc" } });
  for (const n of notices) results.push({ id: n.id, kind: "notice", title: n.title, subtitle: n.category });

  const events = await db.calendarEvent.findMany({ where: { OR: [{ title: { contains: q } }, { description: { contains: q } }] }, take: 5, orderBy: { startDate: "asc" } });
  for (const e of events) results.push({ id: e.id, kind: "calendar", title: e.title, subtitle: e.type });

  return results;
}
