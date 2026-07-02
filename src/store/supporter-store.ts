"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SupporterStatus } from "@/lib/types";

interface SupporterState extends SupporterStatus {
  markSupporter: (transactionId: string, purchasedAt: string) => void;
  clear: () => void;
}

export const useSupporterStore = create<SupporterState>()(
  persist(
    (set) => ({
      isSupporter: false,
      badge: null,
      markSupporter: (transactionId, purchasedAt) =>
        set({
          isSupporter: true,
          transactionId,
          purchasedAt,
          badge: "Lifetime Supporter",
        }),
      clear: () => set({ isSupporter: false, badge: null, transactionId: undefined, purchasedAt: undefined }),
    }),
    {
      name: "ktu_one:supporter",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
