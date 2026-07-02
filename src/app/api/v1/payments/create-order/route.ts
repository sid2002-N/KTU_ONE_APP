import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedStudent } from "@/lib/auth";
import { createOrder } from "@/lib/payments/razorpay-server";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) return NextResponse.json({ error:{code:"UNAUTHORIZED",message:"Login required to purchase"} }, { status: 401 });
  const existing = await db.supporterPurchase.findFirst({ where: { studentId: auth.studentId, status: "Success" } });
  if (existing) return NextResponse.json({ error:{code:"ALREADY_SUPPORTER",message:"You're already a supporter!"} }, { status: 409 });
  try { return NextResponse.json(await createOrder(auth.studentId, auth.registerNumber)); }
  catch(e) { return NextResponse.json({ error:{code:"ORDER_FAILED",message:e instanceof Error?e.message:"Failed"} }, { status: 500 }); }
}
