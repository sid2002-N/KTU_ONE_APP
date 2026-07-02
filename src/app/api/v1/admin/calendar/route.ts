import { NextRequest } from "next/server";
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent, listAllCalendarEventsForAdmin } from "@/features/admin/actions";
import { adminJsonResponse, handleAdminOptions } from "@/lib/auth/admin-cors";
export const dynamic = "force-dynamic";
function auth(req: NextRequest) { return req.headers.get("authorization") === `Bearer ${process.env.ADMIN_API_KEY}`; }
export async function OPTIONS() { return handleAdminOptions(); }
export async function GET(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); return adminJsonResponse({ events: await listAllCalendarEventsForAdmin() }); }
export async function POST(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); const body = await req.json(); return adminJsonResponse({ event: await createCalendarEvent(body) }); }
export async function PUT(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); const id = new URL(req.url).searchParams.get("id"); if (!id) return adminJsonResponse({ error:{code:"BAD_REQUEST",message:"Missing id"} }, 400); const body = await req.json(); return adminJsonResponse({ event: await updateCalendarEvent(id, body) }); }
export async function DELETE(req: NextRequest) { if (!auth(req)) return adminJsonResponse({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, 401); const id = new URL(req.url).searchParams.get("id"); if (!id) return adminJsonResponse({ error:{code:"BAD_REQUEST",message:"Missing id"} }, 400); await deleteCalendarEvent(id); return adminJsonResponse({ ok: true }); }
