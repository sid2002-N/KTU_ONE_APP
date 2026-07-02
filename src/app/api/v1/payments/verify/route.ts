import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedStudent } from "@/lib/auth";
import { verifyPaymentSignature, markPurchaseSuccess } from "@/lib/payments/razorpay-server";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) return NextResponse.json({ error:{code:"UNAUTHORIZED",message:"Login required"} }, { status: 401 });
  const { orderId, paymentId, signature } = await req.json() as { orderId:string; paymentId:string; signature:string };
  if (!orderId||!paymentId||!signature) return NextResponse.json({ error:{code:"BAD_REQUEST",message:"Missing payment fields"} }, { status: 400 });
  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    await db.supporterPurchase.updateMany({ where: { transactionId: orderId }, data: { status: "Failed" } });
    return NextResponse.json({ error:{code:"INVALID_SIGNATURE",message:"Payment verification failed"} }, { status: 400 });
  }
  const result = await markPurchaseSuccess(orderId, paymentId);
  if (!result) return NextResponse.json({ error:{code:"NOT_FOUND",message:"Order not found"} }, { status: 404 });
  return NextResponse.json({ ok: true });
}
