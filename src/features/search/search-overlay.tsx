"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, X, Clock, FileText, BookOpen, Bell, CalendarDays, TrendingUp } from "lucide-react";
import { useNavStore } from "@/store/nav-store";
import { MOCK_PAPERS, MOCK_SYLLABUS, MOCK_NOTICES, MOCK_CALENDAR, SUBJECTS } from "@/data/mock-data";
import { getAnalyticsProvider } from "@/lib/providers/analytics";
import type { NavKey } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils/calc";

type ResultKind = "paper" | "syllabus" | "notice" | "calendar" | "subject";
interface Result {
  id: string;
  kind: ResultKind;
  title: string;
  subtitle?: string;
  meta?: string;
}

const kindMeta: Record<ResultKind, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  paper: { label: "Paper", icon: FileText, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  syllabus: { label: "Syllabus", icon: BookOpen, color: "bg-primary/10 text-primary" },
  notice: { label: "Notice", icon: Bell, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  calendar: { label: "Event", icon: CalendarDays, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  subject: { label: "Subject", icon: TrendingUp, color: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
};

const RECENT_KEY = "ktu_one:search:recent";

export function SearchOverlay() {
  const open = useNavStore((s) => s.searchOpen);
  const setOpen = useNavStore((s) => s.setSearchOpen);
  const setNav = useNavStore((s) => s.set);
  const prefersReduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        Promise.resolve().then(() => setRecent(parsed));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      Promise.resolve().then(() => setQuery(""));
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const results = useMemo<Result[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const out: Result[] = [];

    for (const s of SUBJECTS.slice(0, 10)) {
      if (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
      ) {
        out.push({
          id: s.id,
          kind: "subject",
          title: s.name,
          subtitle: s.code,
          meta: `${s.branchCode} · S${s.semester} · ${s.credits} credits`,
        });
      }
    }
    for (const p of MOCK_PAPERS) {
      if (out.length > 20) break;
      if (
        p.subjectName.toLowerCase().includes(q) ||
        p.subjectCode.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
      ) {
        out.push({
          id: p.id,
          kind: "paper",
          title: p.subjectName,
          subtitle: p.subjectCode,
          meta: `${p.branchCode} · S${p.semester} · ${p.month === 5 ? "May" : "Nov"} ${p.year}`,
        });
      }
    }
    for (const s of MOCK_SYLLABUS) {
      if (out.length > 30) break;
      if (
        s.subjectName.toLowerCase().includes(q) ||
        s.subjectCode.toLowerCase().includes(q)
      ) {
        out.push({
          id: s.id,
          kind: "syllabus",
          title: s.subjectName,
          subtitle: s.subjectCode,
          meta: `${s.branchCode} · S${s.semester}`,
        });
      }
    }
    for (const n of MOCK_NOTICES) {
      if (out.length > 40) break;
      if (n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)) {
        out.push({
          id: n.id,
          kind: "notice",
          title: n.title,
          subtitle: n.category,
          meta: formatRelativeTime(n.publishedAt),
        });
      }
    }
    for (const c of MOCK_CALENDAR) {
      if (out.length > 50) break;
      if (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
        out.push({
          id: c.id,
          kind: "calendar",
          title: c.title,
          subtitle: c.type,
          meta: formatRelativeTime(c.startDate),
        });
      }
    }
    return out;
  }, [query]);

  const saveRecent = (q: string) => {
    const next = [q, ...recent.filter((r) => r !== q)].slice(0, 6);
    setRecent(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const handleResultClick = (r: Result) => {
    saveRecent(query);
    getAnalyticsProvider().track({
      name: "search_performed",
      props: { query, resultCount: results.length },
    });
    const navMap: Record<ResultKind, NavKey> = {
      paper: "papers",
      syllabus: "syllabus",
      notice: "notices",
      calendar: "calendar",
      subject: "papers",
    };
    setNav(navMap[r.kind]);
    setOpen(false);
  };

  const grouped = useMemo(() => {
    const map = new Map<ResultKind, Result[]>();
    for (const r of results) {
      const arr = map.get(r.kind) ?? [];
      arr.push(r);
      map.set(r.kind, arr);
    }
    return Array.from(map.entries());
  }, [results]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95]">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 sm:top-[8vh] w-full max-w-none sm:max-w-2xl px-0 sm:px-4"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="glass-strong rounded-none sm:rounded-3xl shadow-floating overflow-hidden flex flex-col min-h-screen sm:min-h-0">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
                <Search className="size-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subjects, papers, syllabus, notices..."
                  className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:block text-[10px] px-2 py-1 rounded bg-secondary text-muted-foreground font-mono">
                  ESC
                </kbd>
                <button
                  onClick={() => setOpen(false)}
                  className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center"
                  aria-label="Close search"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Results / recent */}
              <div className="flex-1 overflow-y-auto sm:max-h-[60vh]">
                {!query.trim() ? (
                  <div className="p-4">
                    {recent.length > 0 ? (
                      <>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold px-2 mb-2">
                          Recent searches
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {recent.map((r) => (
                            <button
                              key={r}
                              onClick={() => setQuery(r)}
                              className="px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 text-sm flex items-center gap-1.5"
                            >
                              <Clock className="size-3" /> {r}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-sm text-muted-foreground">
                        Search across papers, syllabus, notices, calendar and more.
                      </div>
                    )}
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No results for &quot;{query}&quot;
                    </p>
                  </div>
                ) : (
                  grouped.map(([kind, items]) => {
                    const meta = kindMeta[kind];
                    const Icon = meta.icon;
                    return (
                      <div key={kind} className="py-2">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold px-5 py-1.5 flex items-center gap-1.5">
                          <Icon className="size-3" /> {meta.label}
                        </p>
                        {items.map((r) => {
                          const RIcon = kindMeta[r.kind].icon;
                          return (
                            <button
                              key={`${r.kind}_${r.id}`}
                              onClick={() => handleResultClick(r)}
                              className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-secondary/60 transition text-left"
                            >
                              <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", kindMeta[r.kind].color)}>
                                <RIcon className="size-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{r.title}</p>
                                {r.subtitle && (
                                  <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                                )}
                              </div>
                              {r.meta && (
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {r.meta}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border/40 px-5 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{results.length} result{results.length !== 1 ? "s" : ""}</span>
                <span>Press <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono">↵</kbd> to open</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
