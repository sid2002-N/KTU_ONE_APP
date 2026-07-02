import type {
  BranchCode,
  Branch,
  SemesterNumber,
  Grade,
} from "@/lib/types";

export const APP_NAME = "KTU One";
export const APP_TAGLINE = "Everything a KTU Student Needs.";
export const APP_VERSION = "1.0.0-alpha";
export const SUPPORTER_PRICE_INR = 99;

export const BRANCHES: Branch[] = [
  { code: "CSE", name: "CSE", fullName: "Computer Science & Engineering" },
  { code: "EC", name: "EC", fullName: "Electronics & Communication" },
  { code: "EEE", name: "EEE", fullName: "Electrical & Electronics Engineering" },
  { code: "ME", name: "ME", fullName: "Mechanical Engineering" },
  { code: "CE", name: "CE", fullName: "Civil Engineering" },
  { code: "IT", name: "IT", fullName: "Information Technology" },
  { code: "AE", name: "AE", fullName: "Automobile Engineering" },
  { code: "IE", name: "IE", fullName: "Industrial Engineering" },
];

export const BRANCH_CODE_LIST: BranchCode[] = BRANCHES.map((b) => b.code);

export const SEMESTERS: SemesterNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];

export const GRADE_OPTIONS: Grade[] = ["O", "A+", "A", "B+", "B", "C", "P", "F"];

export const GRADE_LABELS: Record<Grade, string> = {
  O: "O — Outstanding (10)",
  "A+": "A+ — Excellent (9)",
  A: "A — Very Good (8)",
  "B+": "B+ — Good (7)",
  B: "B — Above Average (6)",
  C: "C — Average (5)",
  P: "P — Pass (4)",
  F: "F — Fail (0)",
  I: "I — Incomplete",
  Absent: "Absent",
};

export const SCHEME = "2019 Scheme";
export const UNIVERSITY_NAME = "APJ Abdul Kalam Technological University";

export const NAV_ITEMS = [
  { key: "dashboard", label: "Home", icon: "Home" },
  { key: "calculators", label: "Calculators", icon: "Calculator" },
  { key: "papers", label: "Papers", icon: "FileText" },
  { key: "syllabus", label: "Syllabus", icon: "BookOpen" },
  { key: "calendar", label: "Calendar", icon: "CalendarDays" },
  { key: "notices", label: "Notices", icon: "Bell" },
  { key: "settings", label: "Settings", icon: "Settings" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];

export const PRIMARY_NAV_KEYS: NavKey[] = [
  "dashboard",
  "calculators",
  "papers",
  "calendar",
];

export const CALCULATORS = [
  {
    key: "sgpa",
    title: "SGPA Calculator",
    description: "Compute Semester Grade Point Average for any semester.",
    icon: "Trophy",
    accent: "plum",
  },
  {
    key: "cgpa",
    title: "CGPA Calculator",
    description: "Cumulative Grade Point Average across all semesters.",
    icon: "Award",
    accent: "amber",
  },
  {
    key: "attendance",
    title: "Attendance Calculator",
    description: "Track attendance and predict how many classes to attend.",
    icon: "CalendarCheck",
    accent: "mint",
  },
  {
    key: "internal",
    title: "Internal Marks",
    description: "Estimate internal marks from series + assignment + attendance.",
    icon: "ClipboardList",
    accent: "coral",
  },
  {
    key: "pass",
    title: "Pass Calculator",
    description: "Find the marks you need in end-sem to pass a subject.",
    icon: "Target",
    accent: "plum",
  },
] as const;

export type CalculatorKey = (typeof CALCULATORS)[number]["key"];
