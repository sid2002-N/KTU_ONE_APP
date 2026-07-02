"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Trophy, Award, CalendarCheck, ClipboardList, Target, Plus, X, Save, Share2, History } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { GradientCard } from "@/components/ui-custom/gradient-card";
import { AnimatedCounter } from "@/components/ui-custom/animated-counter";
import { CircularProgress } from "@/components/ui-custom/circular-progress";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { SketchNotebook, SketchPencil, SketchBooks, SketchCoffeeCup } from "@/components/ui-custom/sketch-elements";
import { CALCULATORS, GRADE_OPTIONS, GRADE_LABELS, type CalculatorKey } from "@/lib/constants";
import { GRADE_POINTS, type Grade, type CalculatorCourse, type CalculatorType } from "@/lib/types";
import {
  computeSGPA,
  computeCGPA,
  computeAttendance,
  computeInternalMarks,
  computePassMarks,
  formatDate,
} from "@/lib/utils/calc";
import { useCalcHistory } from "@/features/calculators/use-calc-history";
import { useStudentData, semesterResultToCourses, cgpaToSemesters } from "@/features/calculators/use-student-data";
import { getNotificationProvider } from "@/lib/providers/notification";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const calcIcons: Record<CalculatorKey, React.ComponentType<{ className?: string }>> = {
  sgpa: Trophy,
  cgpa: Award,
  attendance: CalendarCheck,
  internal: ClipboardList,
  pass: Target,
};

export function Calculators() {
  const [active, setActive] = useState<CalculatorKey>("sgpa");
  const prefersReduced = useReducedMotion();
  const calc = CALCULATORS.find((c) => c.key === active)!;
  const Icon = calcIcons[calc.key];

  return (
    <div>
      <PageHeader
        title="Calculators"
        description="Premium, fast and offline-ready calculators for every KTU scenario."
        icon={<Icon className="size-5" />}
      />

      {/* Calculator selector pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CALCULATORS.map((c) => {
          const CIcon = calcIcons[c.key];
          const isActive = active === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={cn(
                "relative px-3.5 py-2 rounded-full text-sm font-medium transition flex items-center gap-2",
                isActive
                  ? "text-primary-foreground"
                  : "glass text-foreground hover:bg-secondary/60",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="calc-pill"
                  className="absolute inset-0 rounded-full bg-primary -z-10"
                  transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <CIcon className="size-4" />
              {c.title.replace(" Calculator", "")}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {active === "sgpa" && <SgpaCalculator />}
          {active === "cgpa" && <CgpaCalculator />}
          {active === "attendance" && <AttendanceCalculator />}
          {active === "internal" && <InternalMarksCalculator />}
          {active === "pass" && <PassCalculator />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ====================================================================== */
/* SHARED: Result Display                                                  */
/* ====================================================================== */

function ResultDisplay({
  label,
  value,
  max,
  suffix = "",
  decimals = 2,
  hint,
}: {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
  decimals?: number;
  hint?: string;
}) {
  const pct = max ? (value / max) * 100 : undefined;
  const [celebrate, setCelebrate] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <GradientCard gradient="plum" className="p-6 sm:p-8 text-center">
      <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">
        {label}
      </p>
      <div className="mt-3 flex items-baseline justify-center gap-2">
        <span className="text-5xl sm:text-7xl font-bold tabular-nums tracking-tight">
          <AnimatedCounter key={value} value={value} decimals={decimals} />
        </span>
        {suffix && <span className="text-2xl font-medium opacity-80">{suffix}</span>}
      </div>
      {pct !== undefined && (
        <p className="text-sm opacity-80 mt-2">
          {pct.toFixed(1)}% {max === 10 ? "efficiency" : "of max"}
        </p>
      )}
      {hint && <p className="text-sm opacity-90 mt-2">{hint}</p>}
      <AnimatePresence>
        {celebrate && !prefersReduced && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            onAnimationComplete={() => setCelebrate(false)}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute size-2 rounded-full"
                style={{
                  background: ["#fff", "#F59E0B", "#E11D48"][i % 3],
                  left: "50%",
                  top: "50%",
                }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: Math.cos((i / 12) * 2 * Math.PI) * 120,
                  y: Math.sin((i / 12) * 2 * Math.PI) * 120,
                  scale: [0, 1, 0],
                }}
                transition={{ duration: 0.9 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Expose setter via ref-like pattern */}
      <CelebrationTrigger onCompute={setCelebrate} />
    </GradientCard>
  );
}

function CelebrationTrigger({ onCompute }: { onCompute: (v: boolean) => void }) {
  // no-op; we trigger through the parent button via custom event
  useEffect(() => {
    const handler = () => onCompute(true);
    window.addEventListener("ktu:celebrate", handler);
    return () => window.removeEventListener("ktu:celebrate", handler);
  }, [onCompute]);
  return null;
}

function fireCelebration() {
  window.dispatchEvent(new Event("ktu:celebrate"));
}

/* ====================================================================== */
/* SGPA CALCULATOR                                                         */
/* ====================================================================== */

function SgpaCalculator() {
  const { results, isAuthenticated } = useStudentData();
  const prefersReduced = useReducedMotion();

  // Start with default courses; pre-fill from real data when available
  const [courses, setCourses] = useState<CalculatorCourse[]>([
    { id: "c1", subjectName: "Discrete Structures", credits: 4, grade: "A" },
    { id: "c2", subjectName: "Data Structures", credits: 3, grade: "A+" },
    { id: "c3", subjectName: "DBMS", credits: 3, grade: "B+" },
  ]);
  const [result, setResult] = useState<ReturnType<typeof computeSGPA> | null>(null);
  const [realLoaded, setRealLoaded] = useState(false);
  const { add: addHistory } = useCalcHistory();

  // Pre-fill with real student data when available
  useEffect(() => {
    if (isAuthenticated && results && results.length > 0 && !realLoaded) {
      Promise.resolve().then(() => {
        // Use the latest semester's results
        const latestSem = results[results.length - 1]!;
        setCourses(semesterResultToCourses(latestSem));
        setRealLoaded(true);
      });
    }
  }, [isAuthenticated, results, realLoaded]);

  const update = (id: string, patch: Partial<CalculatorCourse>) => {
    setCourses((arr) => arr.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const addCourse = () => {
    setCourses((arr) => [
      ...arr,
      { id: `c_${Date.now()}`, subjectName: `Subject ${arr.length + 1}`, credits: 3, grade: "A" },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses((arr) => arr.filter((c) => c.id !== id));
  };

  const compute = () => {
    const r = computeSGPA(courses);
    setResult(r);
    fireCelebration();
    addHistory("SGPA", { courses }, r, `Semester — ${courses.length} subjects`);
    getNotificationProvider().show({
      kind: "success",
      title: `SGPA: ${r.value.toFixed(2)}`,
      message: `Across ${courses.length} subjects · ${r.meta?.totalCredits} credits`,
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Courses</h3>
            <button
              onClick={addCourse}
              className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-1.5"
            >
              <Plus className="size-3.5" /> Add subject
            </button>
          </div>
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {courses.map((c, i) => (
                <motion.div
                  key={c.id}
                  layout={!prefersReduced}
                  initial={prefersReduced ? false : { opacity: 0, height: 0 }}
                  animate={prefersReduced ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end p-3 rounded-xl bg-secondary/40 overflow-hidden"
                >
                  <div className="col-span-1 sm:col-span-5 mt-2 sm:mt-0">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Subject {i + 1}
                    </Label>
                    <Input
                      value={c.subjectName}
                      onChange={(e) => update(c.id, { subjectName: e.target.value })}
                      className="mt-1 h-9 bg-background"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-3 sm:col-start-6 mt-2 sm:mt-0">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Credits
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={6}
                      value={c.credits}
                      onChange={(e) => update(c.id, { credits: Math.max(1, Number(e.target.value)) })}
                      className="mt-1 h-9 bg-background"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-3 mt-2 sm:mt-0">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Grade
                    </Label>
                    <Select
                      value={c.grade}
                      onValueChange={(v) => update(c.id, { grade: v as Grade })}
                    >
                      <SelectTrigger className="mt-1 h-9 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADE_OPTIONS.map((g) => (
                          <SelectItem key={g} value={g}>
                            {GRADE_LABELS[g]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 sm:col-span-1 flex justify-end mt-2 sm:mt-0">
                    <button
                      onClick={() => removeCourse(c.id)}
                      className="size-9 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition"
                      aria-label="Remove course"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {courses.length === 0 && (
              <EmptyState
                title="No subjects yet"
                description="Add a subject to compute SGPA."
                compact
                illustration={<SketchNotebook size={64} color="plum" />}
                primaryAction={{ label: "Add subject", onClick: addCourse }}
              />
            )}
          </div>
        </GlassCard>

        <div className="flex gap-2">
          <Button onClick={compute} disabled={courses.length === 0} className="flex-1 h-11 rounded-full shadow-soft">
            <Trophy className="size-4 mr-2" />
            Calculate SGPA
          </Button>
          <Button variant="secondary" className="h-11 rounded-full" disabled={!result}>
            <Save className="size-4 mr-2" /> Save
          </Button>
          <Button variant="secondary" className="h-11 rounded-full" disabled={!result}>
            <Share2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {result ? (
          <ResultDisplay
            label="Your SGPA"
            value={result.value}
            max={10}
            hint={`${result.meta?.totalCredits} credits across ${result.meta?.courses} subjects`}
          />
        ) : (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <SketchNotebook size={80} color="plum" />
            <p className="text-sm text-muted-foreground mt-3 italic">
              Add subjects and tap Calculate.
            </p>
          </GlassCard>
        )}
        <HistoryPanel type="SGPA" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* CGPA CALCULATOR                                                         */
/* ====================================================================== */

function CgpaCalculator() {
  const { cgpa, isAuthenticated } = useStudentData();
  const prefersReduced = useReducedMotion();

  const [sems, setSems] = useState([
    { sgpa: 8.5, credits: 24 },
    { sgpa: 8.7, credits: 24 },
    { sgpa: 8.4, credits: 26 },
  ]);
  const [result, setResult] = useState<ReturnType<typeof computeCGPA> | null>(null);
  const [realLoaded, setRealLoaded] = useState(false);
  const { add: addHistory } = useCalcHistory();

  // Pre-fill with real CGPA data when available
  useEffect(() => {
    if (isAuthenticated && cgpa && cgpa.semesters.length > 0 && !realLoaded) {
      Promise.resolve().then(() => {
        setSems(cgpaToSemesters(cgpa));
        setRealLoaded(true);
      });
    }
  }, [isAuthenticated, cgpa, realLoaded]);

  const update = (i: number, patch: Partial<(typeof sems)[number]>) => {
    setSems((arr) => arr.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };

  const addSem = () => setSems((arr) => [...arr, { sgpa: 8, credits: 24 }]);
  const removeSem = (i: number) => setSems((arr) => arr.filter((_, idx) => idx !== i));

  const compute = () => {
    const r = computeCGPA(sems);
    setResult(r);
    fireCelebration();
    addHistory("CGPA", { semesters: sems }, r, `Across ${sems.length} semesters`);
    getNotificationProvider().show({
      kind: "success",
      title: `CGPA: ${r.value.toFixed(2)}`,
      message: `${r.meta?.totalCredits} credits earned across ${sems.length} semesters`,
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Semesters</h3>
            <button
              onClick={addSem}
              className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-1.5"
            >
              <Plus className="size-3.5" /> Add semester
            </button>
          </div>
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {sems.map((s, i) => (
                <motion.div
                  key={`sem-${i}`}
                  layout={!prefersReduced}
                  initial={prefersReduced ? false : { opacity: 0, height: 0 }}
                  animate={prefersReduced ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end p-3 rounded-xl bg-secondary/40 overflow-hidden"
                >
                  <div className="col-span-1 sm:col-span-2 flex items-center justify-center mt-2 sm:mt-0">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      S{i + 1}
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-5 mt-2 sm:mt-0">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      SGPA
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      max={10}
                      value={s.sgpa}
                      onChange={(e) => update(i, { sgpa: Number(e.target.value) })}
                      className="mt-1 h-9 bg-background"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-4 mt-2 sm:mt-0">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Credits
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={s.credits}
                      onChange={(e) => update(i, { credits: Number(e.target.value) })}
                      className="mt-1 h-9 bg-background"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-1 flex justify-end mt-2 sm:mt-0">
                    <button
                      onClick={() => removeSem(i)}
                      className="size-9 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition"
                      aria-label="Remove semester"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>
        <div className="flex gap-2">
          <Button onClick={compute} className="flex-1 h-11 rounded-full shadow-soft">
            <Award className="size-4 mr-2" /> Calculate CGPA
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {result ? (
          <ResultDisplay
            label="Your CGPA"
            value={result.value}
            max={10}
            hint={`${result.meta?.totalCredits} credits across ${result.meta?.semesters} semesters`}
          />
        ) : (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <SketchBooks size={80} color="lavender" />
            <p className="text-sm text-muted-foreground mt-3 italic">
              Enter semester SGPA and credits.
            </p>
          </GlassCard>
        )}
        <HistoryPanel type="CGPA" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* ATTENDANCE CALCULATOR                                                   */
/* ====================================================================== */

function AttendanceCalculator() {
  const [attended, setAttended] = useState(28);
  const [total, setTotal] = useState(40);
  const [result, setResult] = useState<ReturnType<typeof computeAttendance> | null>(null);
  const { add: addHistory } = useCalcHistory();

  const compute = () => {
    const r = computeAttendance(attended, total);
    setResult(r);
    addHistory(
      "ATTENDANCE",
      { attended, total },
      { type: "ATTENDANCE", value: r.percentage, percentage: r.percentage, computedAt: new Date().toISOString() },
      `Attended ${attended}/${total}`,
    );
    getNotificationProvider().show({
      kind: r.atRisk ? "warning" : "success",
      title: `Attendance: ${r.percentage}%`,
      message: r.atRisk
        ? `${r.neededToReach75} more classes needed to reach 75%.`
        : `You can bunk ${r.canBunk} more classes.`,
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">Attendance inputs</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Classes attended
              </Label>
              <Input
                type="number"
                min={0}
                value={attended}
                onChange={(e) => setAttended(Math.max(0, Number(e.target.value)))}
                className="mt-1 h-12 text-lg bg-background"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Total classes held
              </Label>
              <Input
                type="number"
                min={1}
                value={total}
                onChange={(e) => setTotal(Math.max(1, Number(e.target.value)))}
                className="mt-1 h-12 text-lg bg-background"
              />
            </div>
          </div>
          <Button onClick={compute} className="w-full mt-5 h-11 rounded-full shadow-soft">
            <CalendarCheck className="size-4 mr-2" /> Calculate
          </Button>
        </GlassCard>

        {result && (
          <GlassCard className="p-5">
            <h4 className="text-sm font-semibold mb-3">Breakdown</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="text-xl font-bold mt-1">{result.percentage}%</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Need to attend</p>
                <p className="text-xl font-bold mt-1 text-amber-500">{result.neededToReach75}</p>
                <p className="text-[10px] text-muted-foreground">to reach 75%</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Can bunk</p>
                <p className="text-xl font-bold mt-1 text-emerald-500">{result.canBunk}</p>
                <p className="text-[10px] text-muted-foreground">and stay safe</p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
      <div className="space-y-4">
        {result ? (
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
            <CircularProgress
              value={result.percentage}
              size={160}
              color={result.percentage >= 85 ? "var(--success)" : result.percentage >= 75 ? "var(--warning)" : "var(--destructive)"}
              label={<span className="text-3xl font-bold"><AnimatedCounter value={result.percentage} decimals={1} />%</span>}
              sublabel={result.atRisk ? "Below 75% — at risk" : "Above threshold"}
            />
            <p className="text-sm text-muted-foreground mt-4">
              {result.atRisk
                ? "⚠️ You need to attend more classes to be eligible for exams."
                : "✓ You're safe. Keep up the consistency."}
            </p>
          </GlassCard>
        ) : (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <SketchPencil size={80} color="amber" />
            <p className="text-sm text-muted-foreground mt-3 italic">
              Enter attendance and tap Calculate.
            </p>
          </GlassCard>
        )}
        <HistoryPanel type="ATTENDANCE" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* INTERNAL MARKS CALCULATOR                                               */
/* ====================================================================== */

function InternalMarksCalculator() {
  const [series1, setSeries1] = useState(28);
  const [series2, setSeries2] = useState(32);
  const [assignment, setAssignment] = useState(8);
  const [attendance, setAttendance] = useState(7);
  const [result, setResult] = useState<ReturnType<typeof computeInternalMarks> | null>(null);
  const { add: addHistory } = useCalcHistory();

  const compute = () => {
    const r = computeInternalMarks({ series1, series2, assignment, attendance });
    setResult(r);
    fireCelebration();
    addHistory("INTERNAL_MARKS", { series1, series2, assignment, attendance }, r, "Internal marks");
    getNotificationProvider().show({
      kind: "success",
      title: `Internal: ${r.value}/70`,
      message: `Best series: ${r.meta?.bestSeries}/50`,
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">Internal assessment inputs</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <LabeledInput label="Series-1 marks" sub="/50" value={series1} onChange={setSeries1} max={50} />
            <LabeledInput label="Series-2 marks" sub="/50" value={series2} onChange={setSeries2} max={50} />
            <LabeledInput label="Assignment" sub="/10" value={assignment} onChange={setAssignment} max={10} />
            <LabeledInput label="Attendance" sub="/10" value={attendance} onChange={setAttendance} max={10} />
          </div>
          <Button onClick={compute} className="w-full mt-5 h-11 rounded-full shadow-soft">
            <ClipboardList className="size-4 mr-2" /> Calculate Internal
          </Button>
        </GlassCard>
        {result && (
          <GlassCard className="p-5">
            <h4 className="text-sm font-semibold mb-3">Breakdown</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Best series</p>
                <p className="text-xl font-bold mt-1">{String(result.meta?.bestSeries)}/50</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Assignment</p>
                <p className="text-xl font-bold mt-1">{assignment}/10</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Attendance</p>
                <p className="text-xl font-bold mt-1">{attendance}/10</p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
      <div className="space-y-4">
        {result ? (
          <ResultDisplay
            label="Internal Marks"
            value={result.value}
            suffix="/70"
            decimals={1}
            hint={`${result.percentage}% of internal component`}
          />
        ) : (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <SketchCoffeeCup size={80} color="coral" />
            <p className="text-sm text-muted-foreground mt-3 italic">Fill series + assignment + attendance.</p>
          </GlassCard>
        )}
        <HistoryPanel type="INTERNAL_MARKS" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* PASS CALCULATOR                                                         */
/* ====================================================================== */

function PassCalculator() {
  const [internal, setInternal] = useState(22);
  const [passMark, setPassMark] = useState(40);
  const [totalMarks, setTotalMarks] = useState(100);
  const [result, setResult] = useState<ReturnType<typeof computePassMarks> | null>(null);
  const { add: addHistory } = useCalcHistory();

  const compute = () => {
    const r = computePassMarks({
      internalOutOf30: internal,
      passMark,
      totalMarks,
    });
    setResult(r);
    addHistory(
      "PASS_CALCULATOR",
      { internal, passMark, totalMarks },
      r,
      `Need ${r.value}/${r.meta?.externalTotal} in end-sem`,
    );
    getNotificationProvider().show({
      kind: "info",
      title: `Score ${r.value} in end-sem`,
      message: `Out of ${r.meta?.externalTotal} — to reach pass mark of ${passMark}.`,
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">Pass calculator inputs</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <LabeledInput label="Internal marks" sub="/30" value={internal} onChange={setInternal} max={30} />
            <LabeledInput label="Pass mark" sub="/100" value={passMark} onChange={setPassMark} max={100} />
            <LabeledInput label="Total marks" sub="" value={totalMarks} onChange={setTotalMarks} max={100} />
          </div>
          <Button onClick={compute} className="w-full mt-5 h-11 rounded-full shadow-soft">
            <Target className="size-4 mr-2" /> Calculate required marks
          </Button>
        </GlassCard>
        {result && (
          <GlassCard className="p-5">
            <h4 className="text-sm font-semibold mb-3">Breakdown</h4>
            <div className="space-y-2 text-sm">
              <Row label="Your internal" value={`${internal} / 30`} />
              <Row label="External is out of" value={`${String(result.meta?.externalTotal)}`} />
              <Row label="You need" value={`${result.value} marks in end-sem`} bold />
              <Row label="That's" value={`${result.percentage}% of end-sem`} />
            </div>
          </GlassCard>
        )}
      </div>
      <div className="space-y-4">
        {result ? (
          <GradientCard gradient="warm" className="p-6 text-center">
            <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">
              Required in End-Sem
            </p>
            <div className="mt-3 flex items-baseline justify-center gap-2">
              <span className="text-6xl font-bold tabular-nums">
                <AnimatedCounter key={result.value} value={result.value} decimals={0} />
              </span>
              <span className="text-xl opacity-80">/ {result.meta?.externalTotal}</span>
            </div>
            <p className="text-sm opacity-90 mt-3">
              Aim higher — this is the bare minimum.
            </p>
          </GradientCard>
        ) : (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="flex items-end gap-1">
              <SketchNotebook size={64} color="plum" />
              <div className="-ml-2 -mb-1">
                <SketchPencil size={36} color="amber" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 italic">Enter internal + pass mark.</p>
          </GlassCard>
        )}
        <HistoryPanel type="PASS_CALCULATOR" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* SHARED                                                                  */
/* ====================================================================== */

function LabeledInput({
  label,
  sub,
  value,
  onChange,
  max,
}: {
  label: string;
  sub?: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
        {label} {sub && <span className="text-muted-foreground/70 normal-case">({sub})</span>}
      </Label>
      <Input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="mt-1 h-12 text-lg bg-background"
      />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-semibold text-primary" : "font-medium"}>{value}</span>
    </div>
  );
}

function HistoryPanel({ type }: { type: string }) {
  const { entries } = useCalcHistory(type as CalculatorType);
  if (entries.length === 0) {
    return (
      <GlassCard className="p-4 text-center">
        <History className="size-5 mx-auto text-muted-foreground/60 mb-1" />
        <p className="text-xs text-muted-foreground">No history yet</p>
      </GlassCard>
    );
  }
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <History className="size-4 text-muted-foreground" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          History
        </h4>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {entries.slice(0, 8).map((e) => (
          <div key={e.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-secondary/40">
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{e.label ?? e.type}</p>
              <p className="text-[10px] text-muted-foreground">{formatDate(e.createdAt)}</p>
            </div>
            <span className="text-sm font-bold tabular-nums">{e.output.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
