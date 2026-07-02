"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CalculatorHistoryEntry, CalculatorType, CalculatorResult } from "@/lib/types";

interface CalcHistoryState {
  entries: CalculatorHistoryEntry[];
  add: (type: CalculatorType, input: Record<string, unknown>, output: CalculatorResult, label?: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCalcHistoryStore = create<CalcHistoryState>()(
  persist(
    (set) => ({
      entries: [],
      add: (type, input, output, label) =>
        set((s) => ({
          entries: [
            {
              id: `h_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              type,
              input,
              output,
              label,
              createdAt: new Date().toISOString(),
            },
            ...s.entries,
          ].slice(0, 50),
        })),
      remove: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "ktu_one:calc-history",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
