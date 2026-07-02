"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface BookmarkEntry {
  id: string;
  kind: "paper" | "syllabus" | "notice" | "subject";
  refId: string;
  title: string;
  subtitle?: string;
  createdAt: string;
}

interface BookmarkState {
  entries: BookmarkEntry[];
  toggle: (entry: Omit<BookmarkEntry, "createdAt">) => boolean;
  has: (kind: BookmarkEntry["kind"], refId: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      entries: [],
      toggle: (entry) => {
        const exists = get().entries.find(
          (e) => e.kind === entry.kind && e.refId === entry.refId,
        );
        if (exists) {
          set((s) => ({ entries: s.entries.filter((e) => e !== exists) }));
          return false;
        }
        set((s) => ({
          entries: [
            { ...entry, createdAt: new Date().toISOString() },
            ...s.entries,
          ],
        }));
        return true;
      },
      has: (kind, refId) =>
        get().entries.some((e) => e.kind === kind && e.refId === refId),
      remove: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "ktu_one:bookmarks",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
