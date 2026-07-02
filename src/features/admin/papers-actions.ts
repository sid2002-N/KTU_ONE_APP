"use server";
import { db } from "@/lib/db";
import { deleteFromR2 } from "@/lib/storage/r2";
export async function listAllPapersForAdmin() { return db.questionPaper.findMany({ where: { deletedAt: null }, orderBy: [{ year: "desc" }, { month: "desc" }] }); }
export async function deletePaper(id: string) { const p = await db.questionPaper.findUnique({ where: { id } }); if (!p) return; await db.questionPaper.update({ where: { id }, data: { deletedAt: new Date() } }); try { await deleteFromR2(p.fileUrl); } catch {} }
export async function listAllSyllabusForAdmin() { return db.syllabus.findMany({ where: { deletedAt: null }, orderBy: [{ semester: "asc" }, { subjectCode: "asc" }] }); }
export async function deleteSyllabus(id: string) { const s = await db.syllabus.findUnique({ where: { id } }); if (!s) return; await db.syllabus.update({ where: { id }, data: { deletedAt: new Date() } }); try { await deleteFromR2(s.fileUrl); } catch {} }
