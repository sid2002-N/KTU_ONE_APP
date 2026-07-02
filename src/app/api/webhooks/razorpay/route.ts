import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { markPurchaseSuccess } from "@/lib/payments/razorpay-server";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error:"Webhook secret not configured" }, { status: 500 });
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (signature !== expected) return NextResponse.json({ error:"Invalid webhook signature" }, { status: 401 });
  let payload: any; try { payload = JSON.parse(body); } catch { return NextResponse.json({ error:"Invalid JSON" }, { status: 400 }); }
  if (payload.event === "payment.captured") {
    const payment = payload.payload?.payment?.entity;
    if (payment?.order_id && payment?.id) {
      const result = await markPurchaseSuccess(payment.order_id, payment.id);
      if (!result) { const notes = payment.notes; if (notes?.studentId) await db.supporterPurchase.create({ data: { studentId: notes.studentId, amount: payment.amount, currency: payment.currency, status: "Success", provider: "Razorpay", transactionId: payment.id } }); }
    }
  }
  return NextResponse.json({ ok: true });
}
