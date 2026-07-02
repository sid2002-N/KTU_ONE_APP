"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Search, Download, Bookmark, BookmarkCheck, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { SketchNotebook } from "@/components/ui-custom/sketch-elements";
import { BannerAd } from "@/components/ui-custom/banner-ad";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_SYLLABUS } from "@/data/mock-data";
import { BRANCHES, SEMESTERS } from "@/lib/constants";
import { formatDate } from "@/lib/utils/calc";
import { useBookmarkStore } from "@/store/bookmark-store";
import { getNotificationProvider } from "@/lib/providers/notification";
import type { BranchCode, SemesterNumber } from "@/lib/types";

export function Syllabus() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState<BranchCode | "ALL">("ALL");
  const [semester, setSemester] = useState<SemesterNumber | "ALL">("ALL");
  const prefersReduced = useReducedMotion();
  const toggleBookmark = useBookmarkStore((s) => s.toggle);
  const hasBookmark = useBookmarkStore((s) => s.has);

  const filtered = useMemo(() => {
    return MOCK_SYLLABUS.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (!s.subjectName.toLowerCase().includes(q) && !s.subjectCode.toLowerCase().includes(q))
          return false;
      }
      if (branch !== "ALL" && s.branchCode !== branch) return false;
      if (semester !== "ALL" && s.semester !== semester) return false;
      return true;
    });
  }, [search, branch, semester]);

  return (
    <div>
      <PageHeader
        title="Syllabus"
        description="Official KTU syllabus documents for every subject, branch and semester."
        icon={<BookOpen className="size-5" />}
      />

      <GlassCard className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject name or code..."
              className="pl-10 h-11 bg-background"
            />
          </div>
          <Select value={branch} onValueChange={(v) => setBranch(v as BranchCode | "ALL")}>
            <SelectTrigger className="h-11 bg-background sm:w-[140px]">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All branches</SelectItem>
              {BRANCHES.map((b) => (
                <SelectItem key={b.code} value={b.code}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(semester)}
            onValueChange={(v) =>
              setSemester(v === "ALL" ? "ALL" : (Number(v) as SemesterNumber))
            }
          >
            <SelectTrigger className="h-11 bg-background sm:w-[110px]">
              <SelectValue placeholder="Sem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All sems</SelectItem>
              {SEMESTERS.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  S{s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      <p className="text-sm text-muted-foreground mb-3 px-1">
        <span className="font-medium text-foreground">{filtered.length}</span> syllabus documents
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No syllabus found"
          description="Try a different search or branch."
          illustration={<SketchNotebook size={120} color="plum" />}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((s, i) => {
            const bookmarked = hasBookmark("syllabus", s.id);
            return (
              <motion.div
                key={s.id}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.4 }}
              >
                <GlassCard hover className="p-4 flex items-start gap-3">
                  <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug line-clamp-2">
                      {s.subjectName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {s.subjectCode} · {s.branchCode} · S{s.semester}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        {s.modules} modules
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {s.version}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        Updated {formatDate(s.lastUpdated)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="h-8 flex-1 rounded-full"
                        onClick={() =>
                          getNotificationProvider().show({
                            kind: "success",
                            title: "Download started",
                            message: s.title,
                          })
                        }
                      >
                        <Download className="size-3.5 mr-1" /> Download
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 rounded-full"
                        onClick={() => {
                          toggleBookmark({
                            id: `bm_syl_${s.id}`,
                            kind: "syllabus",
                            refId: s.id,
                            title: s.subjectName,
                          });
                          getNotificationProvider().show({
                            kind: bookmarked ? "info" : "success",
                            title: bookmarked ? "Removed bookmark" : "Bookmarked",
                            message: s.subjectName,
                          });
                        }}
                      >
                        {bookmarked ? (
                          <BookmarkCheck className="size-3.5 text-primary" fill="currentColor" />
                        ) : (
                          <Bookmark className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <BannerAd slot="syllabus-list" />
      </div>
    </div>
  );
}
