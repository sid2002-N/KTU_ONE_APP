"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FileText,
  Search,
  Download,
  Bookmark,
  BookmarkCheck,
  Eye,
  Filter,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { SketchBooks } from "@/components/ui-custom/sketch-elements";
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
import { MOCK_PAPERS } from "@/data/mock-data";
import { BRANCHES, SEMESTERS } from "@/lib/constants";
import { formatBytes, formatNumber, formatRelativeTime } from "@/lib/utils/calc";
import { useBookmarkStore } from "@/store/bookmark-store";
import { getNotificationProvider } from "@/lib/providers/notification";
import { getAnalyticsProvider } from "@/lib/providers/analytics";
import type { BranchCode, SemesterNumber } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Papers() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState<BranchCode | "ALL">("ALL");
  const [semester, setSemester] = useState<SemesterNumber | "ALL">("ALL");
  const [year, setYear] = useState<number | "ALL">("ALL");
  const prefersReduced = useReducedMotion();
  const toggleBookmark = useBookmarkStore((s) => s.toggle);
  const hasBookmark = useBookmarkStore((s) => s.has);

  const years = useMemo(
    () => Array.from(new Set(MOCK_PAPERS.map((p) => p.year))).sort((a, b) => b - a),
    [],
  );

  const filtered = useMemo(() => {
    return MOCK_PAPERS.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          p.title.toLowerCase().includes(q) ||
          p.subjectName.toLowerCase().includes(q) ||
          p.subjectCode.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (branch !== "ALL" && p.branchCode !== branch) return false;
      if (semester !== "ALL" && p.semester !== semester) return false;
      if (year !== "ALL" && p.year !== year) return false;
      return true;
    });
  }, [search, branch, semester, year]);

  const hasFilters = search || branch !== "ALL" || semester !== "ALL" || year !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setBranch("ALL");
    setSemester("ALL");
    setYear("ALL");
  };

  const onDownload = (paperId: string, title: string) => {
    getAnalyticsProvider().track({ name: "paper_downloaded", props: { paperId } });
    getNotificationProvider().show({
      kind: "success",
      title: "Download started",
      message: title,
    });
  };

  const onBookmark = (paperId: string, title: string) => {
    const added = toggleBookmark({
      id: `bm_paper_${paperId}`,
      kind: "paper",
      refId: paperId,
      title,
    });
    getAnalyticsProvider().track({
      name: "paper_bookmarked",
      props: { paperId, bookmarked: added },
    });
    getNotificationProvider().show({
      kind: added ? "success" : "info",
      title: added ? "Bookmarked" : "Removed bookmark",
      message: title,
    });
  };

  return (
    <div>
      <PageHeader
        title="Question Papers"
        description="Browse, search and download KTU question papers across all branches and years."
        icon={<FileText className="size-5" />}
      />

      {/* Filter bar */}
      <GlassCard className="p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject, code or title..."
              className="pl-10 h-11 bg-background"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:flex">
            <Select value={branch} onValueChange={(v) => setBranch(v as BranchCode | "ALL")}>
              <SelectTrigger className="h-11 bg-background lg:w-[140px]">
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
            <Select value={String(semester)} onValueChange={(v) => setSemester(v === "ALL" ? "ALL" : (Number(v) as SemesterNumber))}>
              <SelectTrigger className="h-11 bg-background lg:w-[110px]">
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
            <Select value={String(year)} onValueChange={(v) => setYear(v === "ALL" ? "ALL" : Number(v))}>
              <SelectTrigger className="h-11 bg-background lg:w-[110px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-11 px-3">
              <X className="size-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </GlassCard>

      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{filtered.length}</span> paper{filtered.length !== 1 ? "s" : ""} found
        </p>
        <Badge variant="secondary" className="gap-1">
          <Filter className="size-3" /> Filtered
        </Badge>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No papers found"
          description="Try changing your filters or searching for a different subject."
          illustration={<SketchBooks size={120} color="lavender" />}
          primaryAction={{ label: "Clear filters", onClick: clearFilters }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((p, i) => {
            const bookmarked = hasBookmark("paper", p.id);
            return (
              <motion.div
                key={p.id}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4), duration: 0.4 }}
              >
                <GlassCard hover className="p-4 h-full flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="size-11 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <FileText className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-snug line-clamp-2">
                        {p.subjectName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {p.subjectCode} · {p.branchCode} · S{p.semester}
                      </p>
                    </div>
                    <button
                      onClick={() => onBookmark(p.id, p.subjectName)}
                      className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center transition shrink-0"
                      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      {bookmarked ? (
                        <BookmarkCheck className="size-4 text-primary" fill="currentColor" />
                      ) : (
                        <Bookmark className="size-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">
                      {p.examType.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {p.month === 5 ? "May" : "Nov"} {p.year}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {p.pageCount}p · {formatBytes(p.fileSizeBytes)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" /> {formatNumber(p.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="size-3" /> {formatNumber(p.downloads)}
                    </span>
                    <span className="ml-auto">{formatRelativeTime(p.uploadedAt)}</span>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button
                      size="sm"
                      className="h-9 flex-1 rounded-full"
                      onClick={() => onDownload(p.id, p.title)}
                    >
                      <Download className="size-3.5 mr-1.5" /> Download
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-9 rounded-full"
                      onClick={() => onDownload(p.id, p.title)}
                    >
                      <Eye className="size-3.5" />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Ad after papers list */}
      <div className="mt-6">
        <BannerAd slot="papers-list" />
      </div>
    </div>
  );
}
