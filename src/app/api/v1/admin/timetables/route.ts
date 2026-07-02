import { NextRequest } from "next/server";
import { createTimetable, deleteTimetable, toggleTimetableActive, listAllTimetablesForAdmin } from "@/features/timetable/actions";
import { adminJsonResponse, handleAdminOptions } from "@/lib/auth/admin-cors";
export const dynamic = "force-dynamic";
function auth(req: NextRequest) { return req.headers.get("authorization") === `Bearer ${process.env.ADMIN_API_KEY}`; }
export async function OPTIONS() { return handleAdminOptions(); }
export async function GET(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); return adminJsonResponse({ timetables: await listAllTimetablesForAdmin() }); }
export async function POST(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); const body = await req.json(); try { return adminJsonResponse({ timetable: await createTimetable(body) }); } catch(e) { return adminJsonResponse({ error:{code:"VALIDATION_FAILED",message:e instanceof Error?e.message:"Failed"} }, 400); } }
export async function DELETE(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); const url = new URL(req.url); const id = url.searchParams.get("id"); if (!id) return adminJsonResponse({ error:{code:"BAD_REQUEST",message:"Missing id"} }, 400); await deleteTimetable(id); return adminJsonResponse({ ok: true }); }
export async function PUT(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); const url = new URL(req.url); const id = url.searchParams.get("id"); const body = await req.json(); if (body.isActive !== undefined) { await toggleTimetableActive(id!, body.isActive); return adminJsonResponse({ ok: true }); } return adminJsonResponse({ error:{code:"BAD_REQUEST"} }, 400); }
