/**
 * Maps the scraper's response shape → our domain types.
 * Pure functions, easily testable.
 */
import { BRANCHES } from "@/lib/constants";
import type {
  StudentProfile,
  SemesterResult,
  SubjectResult,
  CGPAResult,
  Grade,
  BranchCode,
} from "@/lib/types";
import { GRADE_POINTS } from "@/lib/types";
import type { ScraperStudentResponse, ScraperCourse } from "@/lib/scraper";

const BRANCH_NAME_TO_CODE: Record<string, BranchCode> = Object.fromEntries(
  BRANCHES.map((b) => [b.fullName.toUpperCase(), b.code]),
) as Record<string, BranchCode>;

/** Try to match a scraper branch name to our BranchCode; fallback to "CSE". */
export function normalizeBranchCode(admittedBranch: string | undefined): BranchCode {
  if (!admittedBranch) return "CSE";
  const upper = admittedBranch.toUpperCase();
  return BRANCH_NAME_TO_CODE[upper] ?? "CSE";
}

/** Parse "S8" → 8. Returns 1 if unparseable. */
export function parseSemester(raw: string | undefined): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 {
  if (!raw) return 1;
  const match = raw.match(/S?(\d)/i);
  const n = match ? Number(match[1]) : 1;
  if (n >= 1 && n <= 8) return n as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  return 1;
}

/** Parse admission year from "0/2020" or "08/2020" → 2020. */
export function parseAdmissionYear(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const parts = raw.split("/");
  const year = Number(parts[parts.length - 1]);
  return isNaN(year) ? undefined : year;
}

/** Build initials from full name: "JOHN DOE" → "JD". */
export function buildAvatarInitials(name: string | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function parseGrade(raw: string | undefined): Grade {
  if (!raw) return "F";
  const trimmed = raw.trim();
  if (["O", "A+", "A", "B+", "B", "C", "P", "F", "I", "Absent"].includes(trimmed)) {
    return trimmed as Grade;
  }
  return "F";
}

function mapCourse(c: ScraperCourse): SubjectResult {
  // course format: "MAT101 - LINEAR ALGEBRA AND CALCULUS"
  const [code, ...nameParts] = c.course.split(" - ");
  return {
    subjectCode: code?.trim() ?? c.course,
    subjectName: nameParts.join(" - ").trim() || c.course,
    credits: Number(c.credit) || 0,
    grade: parseGrade(c.earned || c.grade),
    gradePoint: GRADE_POINTS[parseGrade(c.earned || c.grade)],
    passed: (c.earned || c.grade) !== "F" && (c.earned || c.grade) !== "Absent",
  };
}

export function mapScraperToProfile(
  scraper: ScraperStudentResponse,
  studentId: string,
): StudentProfile {
  return {
    id: studentId,
    registerNumber: scraper.userid,
    name: scraper.username,
    branchCode: normalizeBranchCode(scraper.AdmittedBranch),
    branchName: scraper.AdmittedBranch ?? "Unknown",
    semester: parseSemester(scraper.CurrentSemester),
    email: scraper.Email,
    phone: scraper.Mobile,
    admissionYear: parseAdmissionYear(scraper.DateofAdmission) ?? 0,
    scheme: scraper.AdmittedScheme ?? "2019 Scheme",
    avatarInitials: buildAvatarInitials(scraper.username),
  };
}

export function mapScraperToResults(scraper: ScraperStudentResponse): SemesterResult[] {
  const out: SemesterResult[] = [];
  for (let sem = 1; sem <= 8; sem++) {
    const courses = scraper[`S${sem}` as keyof ScraperStudentResponse] as
      | ScraperCourse[]
      | undefined;
    const sgpaStr = scraper[`S${sem}sgpa` as keyof ScraperStudentResponse] as
      | string
      | undefined;
    if (!courses || courses.length === 0) continue;

    const subjects = courses.map(mapCourse);
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    const creditsEarned = subjects
      .filter((s) => s.passed)
      .reduce((sum, s) => sum + s.credits, 0);
    const sgpa = sgpaStr ? Number(sgpaStr) : 0;

    out.push({
      semester: sem as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      subjects,
      sgpa,
      totalCredits,
      creditsEarned,
    });
  }
  return out;
}

export function mapScraperToCGPA(scraper: ScraperStudentResponse): CGPAResult {
  const semesters = mapScraperToResults(scraper);
  let totalCredits = 0;
  let weighted = 0;
  for (const s of semesters) {
    totalCredits += s.totalCredits;
    weighted += s.sgpa * s.totalCredits;
  }
  const cgpa = totalCredits > 0 ? weighted / totalCredits : 0;
  return {
    cgpa: Number(cgpa.toFixed(2)),
    totalCredits,
    creditsEarned: semesters.reduce((sum, s) => sum + s.creditsEarned, 0),
    semesters,
  };
}
