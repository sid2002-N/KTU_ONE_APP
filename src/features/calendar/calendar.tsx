"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, Bell, GraduationCap, CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { SketchNotebook } from "@/components/ui-custom/sketch-elements";
import {
  fetchCalendarEvents,
  fetchActiveTimetable,
  type TimetableWithEntries,
} from "@/lib/read-api";
import { useAuthStore } from "@/store/auth-store";
import { formatDate } from "@/lib/utils/calc";
import type { CalendarEventType } from "@/lib/types";
import { cn } from "@/lib/utils";

const eventTypeMeta: Record<CalendarEventType, { label: string; bg: string }> = {
  EXAM: { label: "Exam", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  HOLIDAY: { label: "Holiday", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  RESULT: { label: "Result", bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  REGISTRATION: { label: "Registration", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  WORKSHOP: { label: "Workshop", bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  DEADLINE: { label: "Deadline", bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  EVENT: { label: "Event", bg: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
};

type Tab = "calendar" | "timetable";

export function Calendar() {
  const prefersReduced = useReducedMotion();
  const [tab, setTab] = useState<Tab>("calendar");
  const profile = useAuthStore((s) => s.profile);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["calendar"],
    queryFn: () => fetchCalendarEvents(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: timetable, isLoading: ttLoading } = useQuery({
    queryKey: ["timetable", profile?.branchCode, profile?.semester],
    queryFn: () => fetchActiveTimetable(profile?.semester, profile?.branchCode),
    staleTime: 5 * 60 * 1000,
  });

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  return (
    <div>
      <PageHeader
        title="Calendar & Timetables"
        description="Stay on top of exams, deadlines, holidays and your exam timetable."
        icon={<CalendarDays className="size-5" />}
      />

      {/* Tab switcher */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("calendar")}
          className={cn(
            "btn-tactile px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2",
            tab === "calendar" ? "bg-primary text-primary-foreground" : "paper-card text-foreground",
          )}
        >
          <CalendarDays className="size-4" />
          Academic Calendar
        </button>
        <button
          onClick={() => setTab("timetable")}
          className={cn(
            "btn-tactile px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2",
            tab === "timetable" ? "bg-primary text-primary-foreground" : "paper-card text-foreground",
          )}
        >
          <GraduationCap className="size-4" />
          Exam Timetable
        </button>
      </div>

      {/* Academic Calendar tab */}
      {tab === "calendar" && (
        <div className="space-y-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))
            : sortedEvents.length === 0 ? (
              <EmptyState
                title="No events"
                description="Calendar events will appear here."
                illustration={<SketchNotebook size={100} color="plum" />}
              />
            ) : (
              sortedEvents.map((e, i) => {
                const meta = eventTypeMeta[e.type];
                const startDate = new Date(e.startDate);
                const endDate = new Date(e.endDate);
                const isMultiDay = startDate.toDateString() !== endDate.toDateString();
                const daysUntil = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <motion.div
                    key={e.id}
                    initial={prefersReduced ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <GlassCard className="p-4 sm:p-5 relative overflow-hidden" hover>
                      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: e.color }} />
                      <div className="flex items-start gap-4 pl-2">
                        <div className="text-center shrink-0 min-w-[64px]">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                            {startDate.toLocaleString("en-IN", { month: "short" })}
                          </p>
                          <p className="stamped-number text-3xl leading-none mt-0.5">
                            {startDate.getDate()}
                          </p>
                          {isMultiDay && (
                            <p className="text-[10px] text-muted-foreground mt-1">→ {endDate.getDate()}</p>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <h3 className="font-serif-display text-base">{e.title}</h3>
                            <Badge className={cn("text-[10px]", meta.bg)} variant="secondary">{meta.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{e.description}</p>
                          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {isMultiDay ? `${formatDate(e.startDate)} → ${formatDate(e.endDate)}` : formatDate(e.startDate)}
                            </span>
                            {e.reminderEnabled && (
                              <span className="flex items-center gap-1 text-primary">
                                <Bell className="size-3" /> Reminder on
                              </span>
                            )}
                            {daysUntil > 0 && (
                              <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                in {daysUntil} day{daysUntil !== 1 ? "s" : ""}
                              </span>
                            )}
                            {daysUntil === 0 && (
                              <span className="ml-auto px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
                                Today
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })
            )}
        </div>
      )}

      {/* Exam Timetable tab */}
      {tab === "timetable" && (
        <ExamTimetableView timetable={timetable ?? null} loading={ttLoading} isLoggedIn={!!profile} />
      )}
    </div>
  );
}

function ExamTimetableView({
  timetable,
  loading,
  isLoggedIn,
}: {
  timetable: TimetableWithEntries | null;
  loading: boolean;
  isLoggedIn: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <EmptyState
        title="Log in to see your timetable"
        description="Sign in with your KTU credentials and we'll show your exam schedule automatically."
        illustration={<SketchNotebook size={120} color="plum" />}
      />
    );
  }

  if (!timetable) {
    return (
      <EmptyState
        title="No active timetable"
        description="Your exam timetable hasn't been published yet. Check back soon!"
        illustration={<SketchNotebook size={120} color="amber" />}
      />
    );
  }

  const now = Date.now();
  const upcoming = timetable.entries.filter((e) => new Date(e.date).getTime() >= now - 86400000);
  const past = timetable.entries.filter((e) => new Date(e.date).getTime() < now - 86400000);

  return (
    <div className="space-y-4">
      {/* Timetable header */}
      <GlassCard variant="paper" className="p-4 sm:p-5 relative">
        <div className="tape-corner-tl" aria-hidden="true" />
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3 className="font-serif-display text-lg">{timetable.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 italic">
              Published {formatDate(timetable.publishedAt)} · {timetable.entries.length} exams
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary text-[10px]">
            {timetable.branchCode === "ALL" ? "All Branches" : timetable.branchCode} · S{timetable.semester}
          </Badge>
        </div>
      </GlassCard>

      {/* Upcoming exams */}
      {upcoming.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold px-1">
            Upcoming Exams
          </p>
          {upcoming.map((e, i) => {
            const examDate = new Date(e.date);
            const daysLeft = Math.ceil((examDate.getTime() - now) / (1000 * 60 * 60 * 24));
            const isToday = daysLeft === 0;
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassCard variant="paper" hover className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                  <div className="text-center shrink-0 min-w-[52px] px-1">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                      {examDate.toLocaleString("en-IN", { month: "short" })}
                    </p>
                    <p className="stamped-number text-2xl leading-none">
                      {examDate.getDate()}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif-display text-sm truncate">{e.subjectName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{e.subjectCode}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold",
                      e.session === "FN" ? "bg-amber-500/15 text-amber-700 dark:text-amber-400" : "bg-sky-500/15 text-sky-700 dark:text-sky-400"
                    )}>
                      {e.session}
                    </span>
                    {isToday ? (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-1">Today!</p>
                    ) : daysLeft > 0 ? (
                      <p className="text-xs text-primary font-bold mt-1">{daysLeft}d left</p>
                    ) : null}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Past exams */}
      {past.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-bold px-1">
            Completed
          </p>
          {past.map((e) => {
            const examDate = new Date(e.date);
            return (
              <GlassCard key={e.id} className="p-3 flex items-center gap-3 opacity-50">
                <div className="text-center shrink-0 min-w-[52px]">
                  <p className="text-[9px] uppercase text-muted-foreground">{examDate.toLocaleString("en-IN", { month: "short" })}</p>
                  <p className="text-lg font-bold text-muted-foreground">{examDate.getDate()}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-through">{e.subjectName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{e.subjectCode} · {e.session}</p>
                </div>
                <CalendarCheck className="size-4 text-emerald-500" />
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
