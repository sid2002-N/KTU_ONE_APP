/**
 * KTU One — Core Domain Types
 * These types model the entities surfaced across the application.
 * They are platform-agnostic and provider-agnostic.
 */

export type ID = string;
export type ISODate = string; // ISO 8601
export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/* ---------- Academic structure ---------- */

export type BranchCode =
  | "CSE"
  | "EC"
  | "EEE"
  | "ME"
  | "CE"
  | "IT"
  | "AE"
  | "IE";

export interface Branch {
  code: BranchCode;
  name: string;
  fullName: string;
}

export interface Semester {
  number: SemesterNumber;
  branchCode: BranchCode;
  academicYear: string; // e.g. "2025-2026"
  totalCredits: number;
}

export type SubjectType = "CORE" | "ELECTIVE" | "LAB" | "PROJECT" | "HONORS";

export interface Subject {
  id: ID;
  code: string; // e.g. "CST201"
  name: string;
  semester: SemesterNumber;
  branchCode: BranchCode;
  credits: number;
  type: SubjectType;
  isElective: boolean;
  isLab: boolean;
}

/* ---------- Student ---------- */

export interface StudentProfile {
  id: ID;
  registerNumber: string;
  name: string;
  branchCode: BranchCode;
  branchName: string;
  semester: SemesterNumber;
  email?: string;
  phone?: string;
  admissionYear: number;
  scheme: string; // e.g. "2019 Scheme"
  avatarInitials: string;
}

export interface SubjectResult {
  subjectCode: string;
  subjectName: string;
  credits: number;
  grade: Grade;
  gradePoint: number;
  passed: boolean;
}

export type Grade = "O" | "A+" | "A" | "B+" | "B" | "C" | "P" | "F" | "I" | "Absent";

export const GRADE_POINTS: Record<Grade, number> = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  P: 4,
  F: 0,
  I: 0,
  Absent: 0,
};

export interface SemesterResult {
  semester: SemesterNumber;
  subjects: SubjectResult[];
  sgpa: number;
  totalCredits: number;
  creditsEarned: number;
}

export interface CGPAResult {
  cgpa: number;
  totalCredits: number;
  creditsEarned: number;
  semesters: SemesterResult[];
}

export interface AttendanceRecord {
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number;
  atRisk: boolean; // < 75%
}

/* ---------- Question Papers ---------- */

export type ExamType = "END_SEM" | "SERIES_1" | "SERIES_2" | "MODEL";

export interface QuestionPaper {
  id: ID;
  title: string;
  subjectCode: string;
  subjectName: string;
  semester: SemesterNumber;
  branchCode: BranchCode;
  year: number;
  month: number;
  examType: ExamType;
  fileUrl: string;
  fileSizeBytes: number;
  pageCount: number;
  downloads: number;
  views: number;
  uploadedAt: ISODate;
  bookmarked?: boolean;
}

/* ---------- Syllabus ---------- */

export interface Syllabus {
  id: ID;
  title: string;
  semester: SemesterNumber;
  branchCode: BranchCode;
  subjectCode: string;
  subjectName: string;
  version: string;
  fileUrl: string;
  lastUpdated: ISODate;
  modules: number;
  bookmarked?: boolean;
}

/* ---------- Notices ---------- */

export type NoticePriority = "Pinned" | "High" | "Normal" | "Low";
export type NoticeCategory =
  | "Academic"
  | "Examination"
  | "Scholarship"
  | "Placement"
  | "Cultural"
  | "General";

export interface KTUNotice {
  id: ID;
  title: string;
  description: string;
  category: NoticeCategory;
  publishedAt: ISODate;
  priority: NoticePriority;
  pdfUrl?: string;
  externalUrl?: string;
  tags: string[];
  pinned: boolean;
  active: boolean;
  read?: boolean;
}

/* ---------- Calendar ---------- */

export type CalendarEventType =
  | "EXAM"
  | "HOLIDAY"
  | "RESULT"
  | "REGISTRATION"
  | "WORKSHOP"
  | "DEADLINE"
  | "EVENT";

export interface CalendarEvent {
  id: ID;
  title: string;
  description: string;
  type: CalendarEventType;
  startDate: ISODate;
  endDate: ISODate;
  allDay: boolean;
  color: string; // hex
  reminderEnabled: boolean;
}

/* ---------- Calculators ---------- */

export type CalculatorType =
  | "SGPA"
  | "CGPA"
  | "ATTENDANCE"
  | "INTERNAL_MARKS"
  | "PASS_CALCULATOR";

export interface CalculatorCourse {
  id: string;
  subjectCode?: string;
  subjectName: string;
  credits: number;
  grade: Grade; // for SGPA
  internalMarks?: number; // for Internal
  seriesMarks?: number;
  assignmentMarks?: number;
  attended?: number; // for Attendance
  total?: number;
  currentGrade?: number;
}

export interface CalculatorResult {
  type: CalculatorType;
  value: number;
  percentage?: number;
  meta?: Record<string, number | string>;
  computedAt: ISODate;
}

export interface CalculatorHistoryEntry {
  id: ID;
  type: CalculatorType;
  input: Record<string, unknown>;
  output: CalculatorResult;
  createdAt: ISODate;
  label?: string;
}

/* ---------- Search ---------- */

export type SearchKind =
  | "subject"
  | "paper"
  | "syllabus"
  | "notice"
  | "calendar"
  | "history"
  | "bookmark";

export interface SearchResult {
  id: ID;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  href?: string;
  meta?: string | Record<string, string | number>;
}

export interface RecentSearch {
  id: ID;
  query: string;
  searchedAt: ISODate;
}

/* ---------- Bookmarks ---------- */

export interface Bookmark {
  id: ID;
  kind: SearchKind;
  refId: ID;
  title: string;
  subtitle?: string;
  createdAt: ISODate;
}

/* ---------- Supporter ---------- */

export type PaymentStatus = "Pending" | "Success" | "Failed" | "Refunded";
export type PaymentProvider = "Mock" | "Razorpay";

export interface SupporterPurchase {
  id: ID;
  studentId?: ID;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  transactionId: string;
  receiptUrl?: string;
  purchasedAt: ISODate;
}

export interface SupporterStatus {
  isSupporter: boolean;
  purchasedAt?: ISODate;
  transactionId?: string;
  badge: "Lifetime Supporter" | null;
}

/* ---------- Settings ---------- */

export type ThemeMode = "light" | "dark" | "system";

export interface AppPreferences {
  theme: ThemeMode;
  reduceMotion: boolean;
  compactMode: boolean;
  language: "en" | "ml";
  defaultBranch?: BranchCode;
  defaultSemester?: SemesterNumber;
  showAds: boolean;
}

/* ---------- Notifications ---------- */

export type NotificationKind = "success" | "warning" | "error" | "info";

export interface AppNotification {
  id: ID;
  kind: NotificationKind;
  title: string;
  message?: string;
  createdAt: ISODate;
  read: boolean;
}

/* ---------- Auth ---------- */

export interface AuthSession {
  studentId: ID;
  registerNumber: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
  issuedAt: number;
}

export interface LoginCredentials {
  registerNumber: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  student: Pick<
    StudentProfile,
    "id" | "name" | "branchCode" | "branchName" | "semester" | "registerNumber" | "avatarInitials"
  >;
}
