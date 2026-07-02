"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { useBookmarkStore, type BookmarkEntry } from "@/store/bookmark-store";
import type { Bookmark } from "@/lib/types";
import { apiUrl } from "@/lib/api-base";

/**
 * Unified bookmarks hook.
 * - When authenticated: reads/writes via BFF (`/api/v1/bookmarks`), persisted to DB
 * - When NOT authenticated: reads/writes via Zustand localStorage (fallback)
 */
export function useBookmarks() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const localEntries = useBookmarkStore((s) => s.entries);
  const localToggle = useBookmarkStore((s) => s.toggle);
  const localHas = useBookmarkStore((s) => s.has);
  const localRemove = useBookmarkStore((s) => s.remove);

  const { data: serverBookmarks = [], isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async (): Promise<Bookmark[]> => {
      const res = await fetch(apiUrl("/api/v1/bookmarks"), { credentials: "include" });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.bookmarks as Bookmark[]).map((b) => ({
        id: b.id,
        kind: b.kind as Bookmark["kind"],
        refId: b.refId,
        title: b.title,
        subtitle: b.subtitle ?? undefined,
        createdAt: b.createdAt,
      }));
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });

  const toggleMutation = useMutation({
    mutationFn: async (entry: {
      kind: BookmarkEntry["kind"];
      refId: string;
      title: string;
      subtitle?: string;
    }): Promise<boolean> => {
      const res = await fetch(apiUrl("/api/v1/bookmarks"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle bookmark");
      const data = await res.json();
      return data.bookmarked as boolean;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await fetch(apiUrl(`/api/v1/bookmarks?id=${id}`), {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const bookmarks = isAuthenticated ? serverBookmarks : localEntries;
  const isLoadingBookmarks = isAuthenticated ? isLoading : false;

  const toggle = (entry: Omit<BookmarkEntry, "createdAt">): boolean => {
    if (isAuthenticated) {
      toggleMutation.mutate(entry);
      return !serverBookmarks.some(
        (b) => b.kind === entry.kind && b.refId === entry.refId,
      );
    }
    return localToggle(entry);
  };

  const has = (kind: BookmarkEntry["kind"], refId: string): boolean => {
    if (isAuthenticated) {
      return serverBookmarks.some((b) => b.kind === kind && b.refId === refId);
    }
    return localHas(kind, refId);
  };

  const remove = (id: string) => {
    if (isAuthenticated) {
      removeMutation.mutate(id);
    } else {
      localRemove(id);
    }
  };

  return {
    bookmarks,
    toggle,
    has,
    remove,
    isLoading: isLoadingBookmarks,
  };
}
