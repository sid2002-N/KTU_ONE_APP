/**
 * PaymentProvider — abstracts the supporter purchase flow.
 *
 * MVP: MockPaymentProvider (simulates success after short delay).
 * Future: RazorpayProvider (web), Google Play Billing (android), Apple IAP (ios).
 *
 * Pages only call PaymentProvider.initiatePurchase() — never Razorpay directly.
 */

import type { PaymentProvider as ProviderName, SupporterPurchase } from "@/lib/types";

export interface InitiatePurchaseInput {
  studentId?: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

export interface InitiatePurchaseResult {
  purchaseId: string;
  status: SupporterPurchase["status"];
  provider: ProviderName;
  transactionId: string;
  receiptUrl?: string;
}

export interface PaymentProvider {
  readonly name: ProviderName;
  initiatePurchase(input: InitiatePurchaseInput): Promise<InitiatePurchaseResult>;
  verifyPurchase(purchaseId: string): Promise<SupporterPurchase>;
  restorePurchase(studentId?: string): Promise<SupporterPurchase | null>;
  cancelPurchase?(purchaseId: string): Promise<void>;
}

class MockPaymentProvider implements PaymentProvider {
  readonly name: ProviderName = "Mock";

  async initiatePurchase(input: InitiatePurchaseInput): Promise<InitiatePurchaseResult> {
    await new Promise((r) => setTimeout(r, 1200));
    const purchaseId = `purchase_${Date.now()}`;
    const transactionId = `txn_${Math.random().toString(36).slice(2, 12).toUpperCase()}`;
    return {
      purchaseId,
      status: "Success",
      provider: "Mock",
      transactionId,
      receiptUrl: undefined,
    };
  }

  async verifyPurchase(purchaseId: string): Promise<SupporterPurchase> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      id: purchaseId,
      amount: 99,
      currency: "INR",
      status: "Success",
      provider: "Mock",
      transactionId: `txn_${Math.random().toString(36).slice(2, 12).toUpperCase()}`,
      purchasedAt: new Date().toISOString(),
    };
  }

  async restorePurchase(studentId?: string): Promise<SupporterPurchase | null> {
    await new Promise((r) => setTimeout(r, 300));
    return null;
  }
}

let _instance: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (!_instance) _instance = new MockPaymentProvider();
  return _instance;
}

export function __setPaymentProvider(p: PaymentProvider) {
  _instance = p;
}
