import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedStudent } from "@/lib/auth";
import { checkSupporterStatus } from "@/lib/payments/razorpay-server";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) return NextResponse.json({ error:{code:"UNAUTHORIZED",message:"Login required"} }, { status: 401 });
  const isSupporter = await checkSupporterStatus(auth.studentId);
  if (isSupporter) { const p = await db.supporterPurchase.findFirst({ where:{studentId:auth.studentId,status:"Success"}, orderBy:{purchasedAt:"desc"} }); return NextResponse.json({ isSupporter:true, purchasedAt:p?.purchasedAt.toISOString() }); }
  return NextResponse.json({ isSupporter:false });
}
