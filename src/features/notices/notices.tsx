"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Bell, Pin, ExternalLink, FileText, ChevronLeft, X } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { SketchBooks } from "@/components/ui-custom/sketch-elements";
import { BannerAd } from "@/components/ui-custom/banner-ad";
import { Badge } from "@/components/ui/badge";
import { MOCK_NOTICES } from "@/data/mock-data";
import { formatRelativeTime, formatDate } from "@/lib/utils/calc";
import type { KTUNotice, NoticeCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryColor: Record<NoticeCategory, string> = {
  Academic: "bg-primary/10 text-primary",
  Examination: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  Scholarship: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Placement: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Cultural: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  General: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

const categories: (NoticeCategory | "All")[] = [
  "All",
  "Academic",
  "Examination",
  "Scholarship",
  "Placement",
  "Cultural",
  "General",
];

export function Notices() {
  const [filter, setFilter] = useState<NoticeCategory | "All">("All");
  const [selected, setSelected] = useState<KTUNotice | null>(null);
  const prefersReduced = useReducedMotion();

  const filtered = useMemo(() => {
    const list = filter === "All" ? MOCK_NOTICES : MOCK_NOTICES.filter((n) => n.category === filter);
    return [...list].sort((a, b) => {
      // Pinned first, then by date desc
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [filter]);

  return (
    <div>
      <PageHeader
        title="Notices"
        description="Stay updated with the latest from APJ Abdul Kalam Technological University."
        icon={<Bell className="size-5" />}
      />

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition",
              filter === c
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No notices in this category"
          description="Try a different category filter."
          illustration={<SketchBooks size={120} color="amber" />}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((n, i) => (
            <motion.button
              key={n.id}
              initial={prefersReduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              onClick={() => setSelected(n)}
              className="w-full text-left"
            >
              <GlassCard hover className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Badge className={cn("text-[10px]", categoryColor[n.category])} variant="secondary">
                        {n.category}
                      </Badge>
                      {n.pinned && (
                        <Badge className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400" variant="secondary">
                          <Pin className="size-2.5 mr-1" /> Pinned
                        </Badge>
                      )}
                      {!n.read && (
                        <Badge className="text-[10px] bg-primary/15 text-primary" variant="secondary">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold leading-snug line-clamp-2">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {n.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatRelativeTime(n.publishedAt)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <BannerAd slot="notices-list" />
      </div>

      {/* Detail bottom sheet */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="relative w-full sm:max-w-2xl glass-strong rounded-t-3xl sm:rounded-3xl shadow-floating max-h-[90vh] overflow-y-auto"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="sticky top-0 glass-strong border-b border-border/40 px-6 py-4 flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelected(null)}
                  className="size-9 rounded-xl hover:bg-secondary flex items-center justify-center"
                  aria-label="Back"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <Badge className={cn("text-[10px]", categoryColor[selected.category])} variant="secondary">
                  {selected.category}
                </Badge>
                <button
                  onClick={() => setSelected(null)}
                  className="size-9 rounded-xl hover:bg-secondary flex items-center justify-center ml-auto"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold tracking-tight">{selected.title}</h2>
                <p className="text-xs text-muted-foreground mt-2">
                  Published {formatDate(selected.publishedAt)} · {formatRelativeTime(selected.publishedAt)}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                  {selected.description}
                </p>
                {selected.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {selected.tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">#{t}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-6">
                  {selected.pdfUrl && (
                    <a
                      href={selected.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
                    >
                      <FileText className="size-4" /> View PDF
                    </a>
                  )}
                  {selected.externalUrl && (
                    <a
                      href={selected.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 rounded-full bg-secondary text-secondary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition"
                    >
                      <ExternalLink className="size-4" /> Open link
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
