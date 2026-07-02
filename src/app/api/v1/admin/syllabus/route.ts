import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { deleteFromR2 } from "@/lib/storage/r2";
import { adminJsonResponse, handleAdminOptions } from "@/lib/auth/admin-cors";
export const dynamic = "force-dynamic";
function auth(req: NextRequest) { return req.headers.get("authorization") === `Bearer ${process.env.ADMIN_API_KEY}`; }
export async function OPTIONS() { return handleAdminOptions(); }
export async function GET(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); const syl = await db.syllabus.findMany({ where: { deletedAt: null }, orderBy: [{ semester:"asc" },{ subjectCode:"asc" }] }); return adminJsonResponse({ syllabus: syl.map(s => ({ id:s.id, title:s.title, subjectCode:s.subjectCode, subjectName:s.subjectName, semester:s.semester, branchCode:s.branchCode, version:s.version, fileUrl:s.fileUrl, modules:s.modules, lastUpdated:s.lastUpdated.toISOString() })) }); }
export async function DELETE(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); const id = new URL(req.url).searchParams.get("id"); if (!id) return adminJsonResponse({ error:{code:"BAD_REQUEST",message:"Missing id"} }, 400); const s = await db.syllabus.findUnique({ where: { id } }); if (!s) return adminJsonResponse({ error:{code:"NOT_FOUND"} }, 404); await db.syllabus.update({ where:{id}, data:{deletedAt:new Date()} }); try { await deleteFromR2(s.fileUrl); } catch {} return adminJsonResponse({ ok: true }); }
