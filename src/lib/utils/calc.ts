import { GRADE_POINTS } from "@/lib/types";
import type {
  CalculatorCourse,
  CalculatorResult,
  Grade,
  AttendanceRecord,
} from "@/lib/types";

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.abs(now - then);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (diff < 60_000) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatNumber(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

/* ---------- Calculator logic (pure functions, easily testable) ---------- */

export function computeSGPA(courses: CalculatorCourse[]): CalculatorResult {
  let totalCredits = 0;
  let weighted = 0;
  for (const c of courses) {
    const gp = GRADE_POINTS[c.grade];
    totalCredits += c.credits;
    weighted += gp * c.credits;
  }
  const sgpa = totalCredits > 0 ? weighted / totalCredits : 0;
  return {
    type: "SGPA",
    value: Number(sgpa.toFixed(2)),
    percentage: Number((sgpa * 10).toFixed(1)),
    meta: { totalCredits, courses: courses.length },
    computedAt: new Date().toISOString(),
  };
}

export function computeCGPA(
  semesters: { sgpa: number; credits: number }[],
): CalculatorResult {
  let totalCredits = 0;
  let weighted = 0;
  for (const s of semesters) {
    totalCredits += s.credits;
    weighted += s.sgpa * s.credits;
  }
  const cgpa = totalCredits > 0 ? weighted / totalCredits : 0;
  return {
    type: "CGPA",
    value: Number(cgpa.toFixed(2)),
    percentage: Number((cgpa * 10).toFixed(1)),
    meta: { totalCredits, semesters: semesters.length },
    computedAt: new Date().toISOString(),
  };
}

export function computeAttendance(attended: number, total: number) {
  if (total <= 0) {
    return {
      percentage: 0,
      atRisk: true,
      neededToReach75: 0,
      canBunk: 0,
    };
  }
  const percentage = (attended / total) * 100;
  const atRisk = percentage < 75;
  // classes needed to reach 75%: solve (attended + x) / (total + x) >= 0.75
  // x >= (0.75 * total - attended) / 0.25
  const needed = Math.max(0, Math.ceil((0.75 * total - attended) / 0.25));
  // classes can bunk while staying above 75%: solve (attended) / (total + x) >= 0.75
  // x <= (attended / 0.75) - total
  const canBunk = Math.max(0, Math.floor(attended / 0.75 - total));
  return {
    percentage: Number(percentage.toFixed(1)),
    atRisk,
    neededToReach75: needed,
    canBunk,
  };
}

export function computeInternalMarks(input: {
  series1: number; // out of 50 (best of two series)
  series2: number;
  assignment: number; // out of 10
  attendance: number; // 0..10 (already scaled)
}): CalculatorResult {
  // KTU internal: best of two series scaled to 50, assignment out of 10, attendance out of 10
  const best = Math.max(input.series1, input.series2);
  // best is already out of 50; total internal out of 70
  // (Remaining 30 from end-sem external)
  const internal = best + input.assignment + input.attendance;
  return {
    type: "INTERNAL_MARKS",
    value: Number(internal.toFixed(1)),
    percentage: Number(((internal / 70) * 100).toFixed(1)),
    meta: { bestSeries: best, outOf: 70 },
    computedAt: new Date().toISOString(),
  };
}

export function computePassMarks(input: {
  internalOutOf30: number; // already scaled internal
  passMark: number; // typically 40 for theory, 50 for lab
  totalMarks: number; // typically 100
}): CalculatorResult {
  // end-sem = totalMarks - internalOutOf30 (so end-sem is out of (totalMarks - 30))
  // pass mark typically applies to TOTAL not end-sem.
  // Find end-sem mark needed so that internal + endsem >= passMark
  const externalTotal = input.totalMarks - input.internalOutOf30;
  const neededInExternal = Math.max(0, input.passMark - input.internalOutOf30);
  // Also external must be >= 30% of externalTotal (rule of thumb)
  const minExternal = Math.ceil(0.3 * externalTotal);
  const required = Math.max(neededInExternal, minExternal);
  return {
    type: "PASS_CALCULATOR",
    value: Number(required.toFixed(0)),
    percentage: Number(((required / externalTotal) * 100).toFixed(1)),
    meta: { externalTotal, passMark: input.passMark },
    computedAt: new Date().toISOString(),
  };
}

export function gradeFromMark(mark: number, total = 100): Grade {
  const pct = (mark / total) * 100;
  if (pct >= 90) return "O";
  if (pct >= 80) return "A+";
  if (pct >= 70) return "A";
  if (pct >= 60) return "B+";
  if (pct >= 50) return "B";
  if (pct >= 45) return "C";
  if (pct >= 40) return "P";
  return "F";
}

export function getAttendanceColor(record: AttendanceRecord): string {
  if (record.percentage >= 85) return "var(--success)";
  if (record.percentage >= 75) return "var(--warning)";
  return "var(--destructive)";
}
