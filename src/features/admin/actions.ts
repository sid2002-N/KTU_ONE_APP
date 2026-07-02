"use server";
import { db } from "@/lib/db";
import { z } from "zod";
import type { KTUNotice, NoticeCategory, NoticePriority } from "@/lib/types";

const NoticeInputSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(5000),
  category: z.enum(["Academic","Examination","Scholarship","Placement","Cultural","General"]),
  priority: z.enum(["Pinned","High","Normal","Low"]).default("Normal"),
  pdfUrl: z.string().url().optional().or(z.literal("")),
  externalUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  pinned: z.boolean().default(false),
  active: z.boolean().default(true),
});

function mapNotice(r: any): KTUNotice {
  return { id: r.id, title: r.title, description: r.description, category: r.category as NoticeCategory, publishedAt: r.publishedAt.toISOString(), priority: r.priority as NoticePriority, pdfUrl: r.pdfUrl ?? undefined, externalUrl: r.externalUrl ?? undefined, tags: JSON.parse(r.tags), pinned: r.pinned, active: r.active };
}

export async function createNotice(input: z.infer<typeof NoticeInputSchema>) {
  const p = NoticeInputSchema.parse(input);
  const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,100);
  return mapNotice(await db.kTUNotice.create({ data: { key: `${slug}-${Date.now().toString(36)}`, title: p.title, description: p.description, category: p.category, publishedAt: new Date(), priority: p.priority, pdfUrl: p.pdfUrl||null, externalUrl: p.externalUrl||null, tags: JSON.stringify(p.tags), pinned: p.pinned, active: p.active } }));
}
export async function updateNotice(id: string, input: Partial<z.infer<typeof NoticeInputSchema>>) {
  const p = NoticeInputSchema.partial().parse(input);
  const r = await db.kTUNotice.update({ where: { id }, data: { ...(p.title&&{title:p.title}), ...(p.description&&{description:p.description}), ...(p.category&&{category:p.category}), ...(p.priority&&{priority:p.priority}), ...(p.pdfUrl!==undefined&&{pdfUrl:p.pdfUrl||null}), ...(p.externalUrl!==undefined&&{externalUrl:p.externalUrl||null}), ...(p.tags&&{tags:JSON.stringify(p.tags)}), ...(p.pinned!==undefined&&{pinned:p.pinned}), ...(p.active!==undefined&&{active:p.active}) } });
  return mapNotice(r);
}
export async function deleteNotice(id: string) { await db.kTUNotice.update({ where: { id }, data: { deletedAt: new Date(), active: false } }); }
export async function listAllNoticesForAdmin() { return (await db.kTUNotice.findMany({ where: { deletedAt: null }, orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }] })).map(mapNotice); }

const CalSchema = z.object({ title: z.string().min(1).max(300), description: z.string().min(1).max(2000), type: z.enum(["EXAM","HOLIDAY","RESULT","REGISTRATION","WORKSHOP","DEADLINE","EVENT"]), startDate: z.string(), endDate: z.string(), allDay: z.boolean().default(true), color: z.string().default("#9333EA"), reminderEnabled: z.boolean().default(false) });
export async function createCalendarEvent(input: z.infer<typeof CalSchema>) { const p=CalSchema.parse(input); return db.calendarEvent.create({ data: { title:p.title, description:p.description, type:p.type, startDate:new Date(p.startDate), endDate:new Date(p.endDate), allDay:p.allDay, color:p.color, reminderEnabled:p.reminderEnabled } }); }
export async function updateCalendarEvent(id: string, input: Partial<z.infer<typeof CalSchema>>) { const p=CalSchema.partial().parse(input); return db.calendarEvent.update({ where:{id}, data:{ ...(p.title&&{title:p.title}), ...(p.description&&{description:p.description}), ...(p.type&&{type:p.type}), ...(p.startDate&&{startDate:new Date(p.startDate)}), ...(p.endDate&&{endDate:new Date(p.endDate)}), ...(p.allDay!==undefined&&{allDay:p.allDay}), ...(p.color&&{color:p.color}), ...(p.reminderEnabled!==undefined&&{reminderEnabled:p.reminderEnabled}) } }); }
export async function deleteCalendarEvent(id: string) { await db.calendarEvent.delete({ where: { id } }); }
export async function listAllCalendarEventsForAdmin() { return db.calendarEvent.findMany({ orderBy: { startDate: "asc" } }); }
