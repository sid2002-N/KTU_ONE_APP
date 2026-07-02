import type { PaymentProvider as ProviderName, SupporterPurchase } from "@/lib/types";
import type { PaymentProvider, InitiatePurchaseInput, InitiatePurchaseResult } from "@/lib/providers/payment";
import { authedFetch } from "@/lib/providers/authed-fetch";

interface RazorpayInstance { open(): void; on(event:"payment.success",handler:(r:any)=>void):void; on(event:"payment.error",handler:(r:any)=>void):void; }
interface RazorpayOptions { key:string; amount:number; currency:string; order_id:string; name:string; description:string; theme?:{color:string}; prefill?:any; modal?:{ondismiss:()=>void}; }
declare global { interface Window { Razorpay?: new(o:RazorpayOptions)=>RazorpayInstance; } }

function loadScript(): Promise<void> {
  return new Promise((resolve,reject) => {
    if (window.Razorpay) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.async = true;
    s.onload = () => resolve(); s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });
}

export class RazorpayPaymentProvider implements PaymentProvider {
  readonly name: ProviderName = "Razorpay";

  async initiatePurchase(input: InitiatePurchaseInput): Promise<InitiatePurchaseResult> {
    const orderRes = await authedFetch("/api/v1/payments/create-order", { method: "POST" });
    if (!orderRes.ok) { const d = await orderRes.json().catch(()=>({})); if (d?.error?.code==="ALREADY_SUPPORTER") throw new Error("ALREADY_SUPPORTER"); throw new Error(d?.error?.message??"Failed to create order"); }
    const order = await orderRes.json() as { orderId:string; amount:number; currency:string; purchaseId:string; keyId:string };
    await loadScript();
    if (!window.Razorpay) throw new Error("Razorpay checkout failed to load");
    return new Promise((resolve,reject) => {
      const rzp = new window.Razorpay!({ key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId, name: "KTU One", description: "Lifetime Supporter — ₹99", theme: { color: "#7c3aed" }, prefill: input.metadata, modal: { ondismiss: () => reject(new Error("Payment cancelled")) } });
      rzp.on("payment.success", async (response: any) => {
        try {
          const verifyRes = await authedFetch("/api/v1/payments/verify", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature }) });
          if (!verifyRes.ok) { const d = await verifyRes.json().catch(()=>({})); throw new Error(d?.error?.message??"Verification failed"); }
          resolve({ purchaseId: order.purchaseId, status: "Success", provider: "Razorpay", transactionId: response.razorpay_payment_id });
        } catch(e) { reject(e); }
      });
      rzp.on("payment.error", (response: any) => reject(new Error(response?.error?.description??"Payment failed")));
      rzp.open();
    });
  }

  async verifyPurchase(): Promise<SupporterPurchase> { throw new Error("Use restorePurchase instead"); }

  async restorePurchase(): Promise<SupporterPurchase | null> {
    const res = await authedFetch("/api/v1/payments/restore");
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.isSupporter) return null;
    return { id:"restored", amount:9900, currency:"INR", status:"Success", provider:"Razorpay", transactionId:"", purchasedAt: data.purchasedAt ?? new Date().toISOString() };
  }
}
