"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ThemeMode } from "@/lib/types";

interface ThemeState {
  mode: ThemeMode;
  resolved: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  setResolved: (resolved: "light" | "dark") => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      resolved: "light",
      setMode: (mode) => set({ mode }),
      setResolved: (resolved) => set({ resolved }),
      toggle: () => {
        const current = get().resolved;
        set({ mode: current === "light" ? "dark" : "light" });
      },
    }),
    {
      name: "ktu_one:theme",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ mode: s.mode }),
    },
  ),
);
