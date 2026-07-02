import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { deleteFromR2 } from "@/lib/storage/r2";
import { adminJsonResponse, handleAdminOptions } from "@/lib/auth/admin-cors";
export const dynamic = "force-dynamic";
function auth(req: NextRequest) { return req.headers.get("authorization") === `Bearer ${process.env.ADMIN_API_KEY}`; }
export async function OPTIONS() { return handleAdminOptions(); }
export async function GET(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); const papers = await db.questionPaper.findMany({ where: { deletedAt: null }, orderBy: [{ year:"desc" },{ month:"desc" }] }); return adminJsonResponse({ papers: papers.map(p => ({ id:p.id, title:p.title, subjectCode:p.subjectCode, subjectName:p.subjectName, semester:p.semester, branchCode:p.branchCode, year:p.year, month:p.month, examType:p.examType, fileUrl:p.fileUrl, fileSizeBytes:p.fileSizeBytes, pageCount:p.pageCount, downloads:p.downloads, views:p.views, uploadedAt:p.uploadedAt.toISOString() })) }); }
export async function DELETE(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); const id = new URL(req.url).searchParams.get("id"); if (!id) return adminJsonResponse({ error:{code:"BAD_REQUEST",message:"Missing id"} }, 400); const p = await db.questionPaper.findUnique({ where: { id } }); if (!p) return adminJsonResponse({ error:{code:"NOT_FOUND"} }, 404); await db.questionPaper.update({ where:{id}, data:{deletedAt:new Date()} }); try { await deleteFromR2(p.fileUrl); } catch {} return adminJsonResponse({ ok: true }); }
