"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy,
  Award,
  CalendarCheck,
  ClipboardList,
  Target,
  FileText,
  BookOpen,
  Bell,
  CalendarDays,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
  Heart,
  GraduationCap,
  LogIn,
} from "lucide-react";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { StatCard } from "@/components/ui-custom/stat-card";
import { AnimatedCounter } from "@/components/ui-custom/animated-counter";
import { BannerAd } from "@/components/ui-custom/banner-ad";
import { HandwrittenText } from "@/components/ui-custom/handwritten-text";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SketchArrow,
  SketchHeart,
  SketchCoffeeCup,
  SketchBooks,
  SketchPencil,
  SketchNotebook,
} from "@/components/ui-custom/sketch-elements";
import { CardDecoration } from "@/components/ui-custom/card-decoration";
import { EditorialDivider } from "@/components/ui-custom/editorial-divider";
import { useNavStore } from "@/store/nav-store";
import { useSupporterStore } from "@/store/supporter-store";
import { useAuthStore } from "@/store/auth-store";
import { useCalcHistory } from "@/features/calculators/use-calc-history";
import {
  CALCULATORS,
  APP_VERSION,
  UNIVERSITY_NAME,
  type NavKey,
  type CalculatorKey,
} from "@/lib/constants";
import {
  fetchDashboardStats,
  fetchRecentNotices,
  fetchUpcomingEvent,
  fetchRecentPapers,
  fetchActiveTimetable,
  type TimetableWithEntries,
} from "@/lib/read-api";
import { apiUrl } from "@/lib/api-base";
import { formatRelativeTime, formatDate, formatNumber } from "@/lib/utils/calc";

const calcIcons: Record<CalculatorKey, React.ComponentType<{ className?: string }>> = {
  sgpa: Trophy,
  cgpa: Award,
  attendance: CalendarCheck,
  internal: ClipboardList,
  pass: Target,
};

const accentMap: Record<string, "plum" | "amber" | "mint" | "coral"> = {
  plum: "plum",
  amber: "amber",
  mint: "mint",
  coral: "coral",
};

export function Dashboard() {
  const set = useNavStore((s) => s.set);
  const setSupportOpen = useNavStore((s) => s.setSupportOpen);
  const setLoginOpen = useNavStore((s) => s.setLoginOpen);
  const isSupporter = useSupporterStore((s) => s.isSupporter);
  const profile = useAuthStore((s) => s.profile);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const prefersReduced = useReducedMotion();

  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => {
    const h = new Date().getHours();
    const g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    Promise.resolve().then(() => setGreeting(g));
  }, []);

  const firstName = (profile?.name ?? "Student").split(" ")[0]!;

  // Fetch dashboard data via Server Actions + TanStack Query
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => fetchDashboardStats(),
    staleTime: 5 * 60 * 1000,
  });
  const { data: recentNotices = [], isLoading: noticesLoading } = useQuery({
    queryKey: ["dashboard", "recent-notices"],
    queryFn: () => fetchRecentNotices(3),
    staleTime: 60 * 1000,
  });
  const { data: upcomingEvent, isLoading: upcomingLoading } = useQuery({
    queryKey: ["dashboard", "upcoming"],
    queryFn: () => fetchUpcomingEvent(),
    staleTime: 5 * 60 * 1000,
  });
  const { data: recentPapers = [], isLoading: papersLoading } = useQuery({
    queryKey: ["dashboard", "recent-papers"],
    queryFn: () => fetchRecentPapers(4),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch real CGPA when authenticated
  const { data: cgpaData } = useQuery({
    queryKey: ["cgpa"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/v1/cgpa"), { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      return data.cgpa as { cgpa: number; totalCredits: number; creditsEarned: number };
    },
    enabled: isAuthenticated,
    staleTime: 60 * 60 * 1000,
  });

  // Calc history via unified hook
  const { entries: calcHistory } = useCalcHistory();
  const recentHistory = calcHistory.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero — editorial notebook cover (paper, not gradient) */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="notebook-cover p-5 sm:p-10 pl-8 sm:pl-14 float-subtle">
          {/* Study desk illustrations cluster — top right */}
          <motion.div
            className="absolute top-8 right-8 hidden lg:flex items-end gap-1 pointer-events-none opacity-90"
            initial={prefersReduced ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <SketchBooks size={56} color="amber" />
            <div className="-ml-2 -mb-1">
              <SketchCoffeeCup size={36} color="coral" />
            </div>
            <div className="-ml-1 -mb-2">
              <SketchPencil size={28} color="amber" />
            </div>
          </motion.div>

          <div className="flex items-start justify-between gap-4 flex-wrap relative">
            <div className="flex-1 min-w-[200px]">
              {/* Handwritten annotation above heading */}
              <motion.div
                className="mb-3"
                initial={prefersReduced ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <HandwrittenText as="p" color="amber" className="text-2xl rotate-[-3deg] inline-block">
                  {greeting}, {firstName} 👋
                </HandwrittenText>
              </motion.div>

              {/* Serif display headline — embossed into notebook cover */}
              <h1 className="font-serif-display embossed-title-ink text-3xl sm:text-5xl lg:text-6xl leading-[1.05]">
                Your academic day,
                <br className="hidden sm:block" />
                <span className="relative inline-block italic">
                  sorted.
                  <HandwrittenText
                    as="span"
                    color="amber"
                    className="absolute -top-7 -right-6 text-2xl rotate-[8deg] hidden sm:block not-italic"
                  >
                    !
                  </HandwrittenText>
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                {profile
                  ? `${profile.branchName} · Semester ${profile.semester}`
                  : "Sign in to see your CGPA, attendance and results."}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-7">
                <button
                  onClick={() => set("calculators")}
                  className="btn-tactile px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 shadow-soft hover:opacity-90"
                >
                  <Sparkles className="size-4" />
                  Open a calculator
                </button>
                {!isSupporter && (
                  <button
                    onClick={() => setSupportOpen(true)}
                    className="btn-tactile px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 flex items-center gap-2 border border-border/60"
                  >
                    <Heart className="size-3.5" fill="currentColor" />
                    Go ad-free · ₹99
                  </button>
                )}
              </div>
            </div>
            {/* Editorial illustration cluster */}
            <div className="hidden sm:block relative">
              <motion.div
                className="flex items-end gap-1"
                initial={prefersReduced ? false : { opacity: 0, scale: 0.85, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 16 }}
              >
                <SketchNotebook size={120} color="plum" />
                <div className="-ml-3 -mb-1">
                  <SketchPencil size={44} color="amber" />
                </div>
              </motion.div>
              {/* Tiny floating sketch arrow accent */}
              <motion.div
                className="absolute -top-3 -left-8"
                initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <SketchArrow size={36} color="amber" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick stats — dynamic, DB-backed */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {statsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Current CGPA"
              value={
                isAuthenticated && cgpaData ? (
                  <AnimatedCounter value={cgpaData.cgpa} decimals={2} />
                ) : isAuthenticated ? (
                  <span className="text-base text-muted-foreground">Loading…</span>
                ) : (
                  <span className="text-base text-muted-foreground">Login</span>
                )
              }
              icon={<TrendingUp className="size-5" />}
              accent="plum"
              variant="index"
              rotate={-1}
              hint={
                isAuthenticated && cgpaData
                  ? `${cgpaData.totalCredits} credits earned`
                  : "Sign in to view"
              }
            />
            <StatCard
              label="Attendance"
              value={<span className="text-base text-muted-foreground">Manual</span>}
              icon={<CalendarCheck className="size-5" />}
              accent="amber"
              variant="index"
              rotate={1}
              hint="Use the attendance calculator"
            />
            <StatCard
              label="Papers"
              value={<AnimatedCounter value={stats?.papers ?? 0} />}
              icon={<FileText className="size-5" />}
              accent="mint"
              variant="index"
              rotate={-0.5}
              hint="Available to download"
            />
            <StatCard
              label="Notices"
              value={<AnimatedCounter value={stats?.notices ?? 0} />}
              icon={<Bell className="size-5" />}
              accent="coral"
              variant="index"
              rotate={0.5}
              hint={`${stats?.unreadNotices ?? 0} unread this week`}
            />
          </div>
        )}
      </motion.div>

      {/* Quick actions — calculator shortcuts */}
      <motion.section
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <SectionHeader
          title="Quick actions"
          subtitle="Jump straight into a calculator"
          onSeeAll={() => set("calculators" as NavKey)}
          accent="let's go!"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CALCULATORS.map((calc, i) => {
            const Icon = calcIcons[calc.key];
            // Map accent to CSS custom property for notebook-tab top strip
            const tabColor =
              calc.accent === "plum"
                ? "oklch(0.50 0.10 340)"
                : calc.accent === "amber"
                  ? "oklch(0.62 0.11 70)"
                  : calc.accent === "mint"
                    ? "oklch(0.58 0.09 155)"
                    : "oklch(0.55 0.10 25)";
            return (
              <motion.button
                key={calc.key}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                onClick={() => set("calculators")}
                style={{
                  transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)`,
                  // @ts-expect-error custom property
                  "--tab-color": tabColor,
                }}
                className="btn-tactile notebook-tab notebook-tab-hover rounded-2xl p-4 text-left group relative"
              >
                <div
                  className={`size-10 rounded-xl flex items-center justify-center mb-3 border border-foreground/10 ${
                    calc.accent === "plum"
                      ? "bg-primary/15 text-primary"
                      : calc.accent === "amber"
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                        : calc.accent === "mint"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <p className="font-serif-display text-base leading-tight">{calc.title.replace(" Calculator", "")}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">
                  {calc.description}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition">
                  Open <ArrowRight className="size-3" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Upcoming Exams widget — auto-shows from timetable when logged in */}
      <UpcomingExamsWidget />

      {/* Editorial divider */}
      <EditorialDivider ornament="diamond" label="your day at a glance" />

      {/* Ad */}
      <BannerAd slot="home-top" />

      {/* Two-column section: recent activity + upcoming */}
      <motion.div
        className="grid lg:grid-cols-3 gap-4"
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {/* Recent calculations — feels like a notebook page with entries */}
        <GlassCard variant="lined" className="lg:col-span-2 p-5 pl-12 relative">
          <div className="tape-corner-tr" aria-hidden="true" />
          <SectionHeader
            title="Recent activity"
            subtitle="What you calculated recently"
            compact
            accent="keep going!"
          />
          {profile ? (
            recentHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <SketchNotebook size={56} color="plum" />
                <p className="text-sm text-muted-foreground mt-3 italic max-w-[220px]">
                  No calculations yet. Run your first calculator to see it here.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {recentHistory.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => set("calculators")}
                    className="w-full flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg hover:bg-primary/5 transition text-left border border-transparent hover:border-primary/15"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/15">
                        {h.type === "SGPA" && <Trophy className="size-4" />}
                        {h.type === "CGPA" && <Award className="size-4" />}
                        {h.type === "ATTENDANCE" && <CalendarCheck className="size-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif-display text-sm truncate">
                          {h.label ?? h.type}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 italic">
                          <Clock className="size-3" />
                          {formatRelativeTime(h.output.computedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="stamped-number text-xl tabular-nums">
                        {h.output.value.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-bold">
                        {h.type}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <SketchNotebook size={64} color="plum" />
              <p className="font-serif-display text-base mt-3">No history yet</p>
              <p className="text-sm text-muted-foreground mt-1 italic max-w-[240px]">
                Log in to see your calculation history synced across devices.
              </p>
              <button
                onClick={() => setLoginOpen(true)}
                className="btn-tactile mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition shadow-soft flex items-center gap-1.5"
              >
                <LogIn className="size-3.5" />
                Sign in
              </button>
            </div>
          )}
        </GlassCard>

        {/* Attendance — manual, no scraper data */}
        <GlassCard variant="kraft" className="p-5 relative">
          <CardDecoration variant="cornerHeart" position="top-right" color="coral" />
          <SectionHeader title="Attendance" subtitle="This semester" compact accent="track it!" />
          <div className="flex flex-col items-center justify-center py-3">
            <div className="flex flex-col items-center text-center gap-2 py-6">
              <CalendarCheck className="size-10 text-foreground/40" />
              <p className="text-sm text-foreground/70 max-w-[180px] leading-relaxed">
                KTU doesn't expose attendance data. Use the calculator to track yours manually.
              </p>
            </div>
            <button
              onClick={() => set("calculators")}
              className="btn-tactile mt-3 text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              Open attendance calculator <ChevronRight className="size-3" />
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Editorial divider */}
      <EditorialDivider ornament="star" label="from the university" />

      {/* Notices */}
      <motion.section
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <SectionHeader
          title="Latest notices"
          subtitle="From the university"
          onSeeAll={() => set("notices" as NavKey)}
          accent="fresh today"
        />
        {noticesLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentNotices.map((n, i) => (
              <GlassCard
                key={n.id}
                variant="paper"
                hover
                className="p-5 sm:p-6 cursor-pointer"
                onClick={() => set("notices" as NavKey)}
              >
                {/* Tape strip on first card — feels pinned up */}
                {i === 0 && <div className="tape-corner-tl" aria-hidden="true" />}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/15">
                    {n.category}
                  </span>
                  {n.pinned && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20">
                      ★ Pinned
                    </span>
                  )}
                </div>
                <p className="font-serif-display text-sm leading-snug line-clamp-2">
                  {n.title}
                </p>
                <p className="text-xs text-muted-foreground mt-2 italic flex items-center gap-1">
                  <Clock className="size-3" />
                  {formatRelativeTime(n.publishedAt)}
                </p>
              </GlassCard>
            ))}
          </div>
        )}
      </motion.section>

      {/* Editorial divider */}
      <EditorialDivider ornament="diamond" label="what's next" />

      {/* Upcoming + Continue Reading */}
      <motion.div
        className="grid lg:grid-cols-2 gap-4"
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {/* Upcoming academic event */}
        <GlassCard variant="kraft" className="p-5 relative">
          <CardDecoration variant="pageFold" />
          <SectionHeader title="Upcoming" subtitle="Next on your calendar" compact accent="don't miss!" />
          {!profile ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <SketchNotebook size={56} color="plum" />
              <p className="font-serif-display text-base mt-3">Sign in to see your schedule</p>
              <p className="text-sm text-foreground/70 mt-1 italic max-w-[240px]">
                Log in to see your exam schedule and academic calendar.
              </p>
              <button
                onClick={() => setLoginOpen(true)}
                className="btn-tactile mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition shadow-soft flex items-center gap-1.5"
              >
                <LogIn className="size-3.5" />
                Sign in
              </button>
            </div>
          ) : upcomingLoading ? (
            <Skeleton className="h-24 rounded-2xl" />
          ) : upcomingEvent ? (
            <div className="flex items-start gap-4 p-3 rounded-lg border border-foreground/10 bg-foreground/[0.03]">
              <div className="text-center shrink-0 px-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-foreground/60 font-bold">
                  {new Date(upcomingEvent.startDate).toLocaleString("en-IN", { month: "short" })}
                </p>
                <p className="stamped-number text-3xl text-primary">
                  {new Date(upcomingEvent.startDate).getDate()}
                </p>
              </div>
              <div className="min-w-0 border-l border-foreground/15 pl-3">
                <p className="font-serif-display text-sm leading-snug">{upcomingEvent.title}</p>
                <p className="text-xs text-foreground/70 mt-1 line-clamp-2 italic">
                  {upcomingEvent.description}
                </p>
                <button
                  onClick={() => set("calendar" as NavKey)}
                  className="btn-tactile mt-2 text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  View calendar <ChevronRight className="size-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 text-sm text-foreground/60 italic">
              No upcoming events
            </div>
          )}
        </GlassCard>

        {/* Continue reading — notebook page */}
        <GlassCard variant="lined" className="p-5 pl-12 relative">
          <CardDecoration variant="cornerStar" position="top-right" color="amber" />
          <SectionHeader
            title="Continue reading"
            subtitle="Recently viewed papers"
            onSeeAll={() => set("papers" as NavKey)}
            compact
            accent="pick up where you left off"
          />
          {!profile ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <SketchNotebook size={56} color="amber" />
              <p className="font-serif-display text-base mt-3">Browse papers to get started</p>
              <p className="text-sm text-muted-foreground mt-1 italic max-w-[240px]">
                Explore previous question papers and save them for later.
              </p>
              <button
                onClick={() => set("papers" as NavKey)}
                className="btn-tactile mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition shadow-soft flex items-center gap-1.5"
              >
                <FileText className="size-3.5" />
                Browse papers
              </button>
            </div>
          ) : papersLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : recentPapers.length === 0 ? (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground italic">
              No papers yet
            </div>
          ) : (
            <div className="space-y-1">
              {recentPapers.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => set("papers" as NavKey)}
                  className="w-full flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-primary/5 transition text-left border border-transparent hover:border-primary/15"
                >
                  <div className="size-9 rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif-display text-sm truncate">{p.subjectName}</p>
                    <p className="text-xs text-muted-foreground italic">
                      {p.examType.replace("_", " ")} · {p.year} · {formatNumber(p.views)} views
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Support banner — for non-supporters (kraft paper, no gradient) */}
      {!isSupporter && (
        <motion.div
          className="kraft-card p-6 sm:p-8 relative overflow-hidden float-subtle"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          {/* Tiny sketch heart accent */}
          <div className="absolute top-4 right-4 opacity-70">
            <SketchHeart size={20} color="coral" />
          </div>
          <div className="flex items-center gap-5 flex-wrap relative">
            {/* Editorial illustration */}
            <div className="shrink-0">
              <SketchBooks size={84} color="amber" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <HandwrittenText as="p" color="amber" className="text-xl rotate-[-2deg] inline-block mb-1">
                Hey friend!
              </HandwrittenText>
              <h3 className="font-serif-display text-2xl sm:text-3xl tracking-tight text-foreground">
                Love KTU One?
              </h3>
              <p className="text-sm text-foreground/80 mt-2 max-w-md leading-relaxed">
                Support development for ₹99 lifetime. Remove ads, get a badge,
                and help every KTU student.
              </p>
            </div>
            <button
              onClick={() => setSupportOpen(true)}
              className="btn-tactile bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 shadow-soft hover:opacity-90"
            >
              <Heart className="size-4" fill="currentColor" />
              Become a Supporter
            </button>
          </div>
        </motion.div>
      )}

      {/* Footer note — editorial colophon */}
      <footer className="pt-8 pb-2">
        <EditorialDivider ornament="diamond" />
        <div className="text-center">
          <p className="font-handwritten text-base text-muted-foreground">
            made with 💜 for KTU students
          </p>
          <p className="text-[11px] text-muted-foreground/70 mt-1 tracking-wide">
            {UNIVERSITY_NAME} · v{APP_VERSION}
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  onSeeAll,
  compact,
  accent,
}: {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  compact?: boolean;
  accent?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-4 ${compact ? "mb-3" : "mb-5"}`}>
      <div className="flex items-start gap-3">
        {/* Vertical accent bar — feels like a margin note rule */}
        <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary/50 via-primary/25 to-transparent mt-1" />
        <div>
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h2 className={`font-serif-display tracking-tight ${compact ? "text-lg" : "text-2xl"}`}>
              {title}
            </h2>
            {accent && (
              <HandwrittenText as="span" color="amber" className="text-lg rotate-[-3deg]">
                {accent}
              </HandwrittenText>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5 italic">{subtitle}</p>
          )}
        </div>
      </div>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="btn-tactile text-xs text-primary hover:underline font-medium flex items-center gap-1 shrink-0 px-2 py-1 rounded-full hover:bg-primary/5"
        >
          See all <ArrowRight className="size-3" />
        </button>
      )}
    </div>
  );
}

/* ====================================================================== */
/* Upcoming Exams Widget — shows next 3 exams from active timetable        */
/* ====================================================================== */

function UpcomingExamsWidget() {
  const profile = useAuthStore((s) => s.profile);
  const set = useNavStore((s) => s.set);

  const { data: timetable } = useQuery({
    queryKey: ["timetable", profile?.branchCode, profile?.semester],
    queryFn: () => fetchActiveTimetable(profile?.semester, profile?.branchCode),
    enabled: !!profile,
    staleTime: 5 * 60 * 1000,
  });

  if (!profile || !timetable) return null;

  const now = Date.now();
  const upcoming = timetable.entries
    .filter((e) => new Date(e.date).getTime() >= now - 86400000)
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <GlassCard variant="kraft" className="p-5 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-4 text-primary" />
          <h3 className="font-serif-display text-base">Upcoming Exams</h3>
        </div>
        <button
          onClick={() => set("calendar" as NavKey)}
          className="text-xs text-primary hover:underline font-medium"
        >
          View all →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {upcoming.map((e) => {
          const examDate = new Date(e.date);
          const daysLeft = Math.ceil((examDate.getTime() - now) / (1000 * 60 * 60 * 24));
          const isToday = daysLeft === 0;
          return (
            <div key={e.id} className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">
                  {examDate.toLocaleString("en-IN", { month: "short" })} {examDate.getDate()}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-foreground/5">
                  {e.session}
                </span>
              </div>
              <p className="font-serif-display text-sm truncate">{e.subjectName}</p>
              <p className="text-xs text-muted-foreground font-mono">{e.subjectCode}</p>
              {isToday ? (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-1">Today!</p>
              ) : (
                <p className="text-xs text-primary font-bold mt-1">{daysLeft} days left</p>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
