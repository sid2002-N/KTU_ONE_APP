import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "@/lib/db";

function getClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay credentials not configured");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

const AMOUNT = 9900;
const CURRENCY = "INR";

export async function createOrder(studentId: string, registerNumber: string) {
  const client = getClient();
  const order = await client.orders.create({ amount: AMOUNT, currency: CURRENCY, receipt: `ktu1_sup_${studentId.slice(-8)}_${Date.now()}`, notes: { studentId, registerNumber, purpose: "KTU One Lifetime Supporter" } });
  const purchase = await db.supporterPurchase.create({ data: { studentId, amount: AMOUNT, currency: CURRENCY, status: "Pending", provider: "Razorpay", transactionId: order.id } });
  return { orderId: order.id, amount: order.amount, currency: order.currency, purchaseId: purchase.id, keyId: process.env.RAZORPAY_KEY_ID! };
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

export async function markPurchaseSuccess(orderId: string, paymentId: string) {
  const purchase = await db.supporterPurchase.findFirst({ where: { transactionId: orderId } });
  if (!purchase) return null;
  await db.supporterPurchase.update({ where: { id: purchase.id }, data: { status: "Success", transactionId: paymentId } });
  return { studentId: purchase.studentId! };
}

export async function checkSupporterStatus(studentId: string) {
  const count = await db.supporterPurchase.count({ where: { studentId, status: "Success" } });
  return count > 0;
}
