import type {
  Subject,
  QuestionPaper,
  Syllabus,
  KTUNotice,
  CalendarEvent,
  SubjectResult,
  SemesterResult,
  CGPAResult,
  AttendanceRecord,
  StudentProfile,
  ExamType,
} from "@/lib/types";

/* ---------- Subjects ---------- */

export const SUBJECTS: Subject[] = [
  { id: "s1", code: "CST301", name: "Discrete Computational Structures", semester: 3, branchCode: "CSE", credits: 4, type: "CORE", isElective: false, isLab: false },
  { id: "s2", code: "CST303", name: "Object Oriented Programming Using Java", semester: 3, branchCode: "CSE", credits: 4, type: "CORE", isElective: false, isLab: false },
  { id: "s3", code: "CST305", name: "Data Structures", semester: 3, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
  { id: "s4", code: "CST307", name: "Database Management Systems", semester: 3, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
  { id: "s5", code: "CST309", name: "Computer Organization & Architecture", semester: 3, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
  { id: "s6", code: "CST311", name: "Theory of Computation", semester: 3, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
  { id: "s7", code: "CSL331", name: "Data Structures Lab", semester: 3, branchCode: "CSE", credits: 2, type: "LAB", isElective: false, isLab: true },
  { id: "s8", code: "CSL333", name: "DBMS Lab", semester: 3, branchCode: "CSE", credits: 2, type: "LAB", isElective: false, isLab: true },
  { id: "s9", code: "CST401", name: "Operating Systems", semester: 4, branchCode: "CSE", credits: 4, type: "CORE", isElective: false, isLab: false },
  { id: "s10", code: "CST403", name: "Computer Networks", semester: 4, branchCode: "CSE", credits: 4, type: "CORE", isElective: false, isLab: false },
  { id: "s11", code: "CST405", name: "Microprocessors & Microcontrollers", semester: 4, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
  { id: "s12", code: "CST407", name: "Software Engineering", semester: 4, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
];

/* ---------- Mock Student ---------- */

export const MOCK_STUDENT: StudentProfile = {
  id: "stu_001",
  registerNumber: "TVE21CS001",
  name: "Aarav Menon",
  branchCode: "CSE",
  branchName: "Computer Science & Engineering",
  semester: 5,
  email: "aarav.menon@example.com",
  phone: "+91 98765 43210",
  admissionYear: 2021,
  scheme: "2019 Scheme",
  avatarInitials: "AM",
};

/* ---------- CGPA / SGPA mock ---------- */

const s3Results: SubjectResult[] = [
  { subjectCode: "CST301", subjectName: "Discrete Computational Structures", credits: 4, grade: "A", gradePoint: 8, passed: true },
  { subjectCode: "CST303", subjectName: "OOP Using Java", credits: 4, grade: "A+", gradePoint: 9, passed: true },
  { subjectCode: "CST305", subjectName: "Data Structures", credits: 3, grade: "O", gradePoint: 10, passed: true },
  { subjectCode: "CST307", subjectName: "DBMS", credits: 3, grade: "B+", gradePoint: 7, passed: true },
  { subjectCode: "CST309", subjectName: "COA", credits: 3, grade: "A", gradePoint: 8, passed: true },
  { subjectCode: "CST311", subjectName: "Theory of Computation", credits: 3, grade: "B+", gradePoint: 7, passed: true },
  { subjectCode: "CSL331", subjectName: "DS Lab", credits: 2, grade: "A+", gradePoint: 9, passed: true },
  { subjectCode: "CSL333", subjectName: "DBMS Lab", credits: 2, grade: "A", gradePoint: 8, passed: true },
];

const s4Results: SubjectResult[] = [
  { subjectCode: "CST401", subjectName: "Operating Systems", credits: 4, grade: "A", gradePoint: 8, passed: true },
  { subjectCode: "CST403", subjectName: "Computer Networks", credits: 4, grade: "O", gradePoint: 10, passed: true },
  { subjectCode: "CST405", subjectName: "Microprocessors", credits: 3, grade: "B+", gradePoint: 7, passed: true },
  { subjectCode: "CST407", subjectName: "Software Engineering", credits: 3, grade: "A+", gradePoint: 9, passed: true },
];

export const MOCK_SEMESTER_RESULTS: SemesterResult[] = [
  {
    semester: 3,
    subjects: s3Results,
    sgpa: 8.23,
    totalCredits: 24,
    creditsEarned: 24,
  },
  {
    semester: 4,
    subjects: s4Results,
    sgpa: 8.43,
    totalCredits: 14,
    creditsEarned: 14,
  },
];

export const MOCK_CGPA: CGPAResult = {
  cgpa: 8.31,
  totalCredits: 38,
  creditsEarned: 38,
  semesters: MOCK_SEMESTER_RESULTS,
};

/* ---------- Attendance mock ---------- */

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { subjectCode: "CST501", subjectName: "Formal Languages & Automata Theory", attended: 32, total: 38, percentage: 84.2, atRisk: false },
  { subjectCode: "CST503", subjectName: "Computer Graphics", attended: 28, total: 40, percentage: 70.0, atRisk: true },
  { subjectCode: "CST505", subjectName: "Machine Learning", attended: 35, total: 38, percentage: 92.1, atRisk: false },
  { subjectCode: "CST507", subjectName: "System Software", attended: 30, total: 36, percentage: 83.3, atRisk: false },
  { subjectCode: "CST509", subjectName: "Compiler Design", attended: 22, total: 38, percentage: 57.9, atRisk: true },
  { subjectCode: "CST511", subjectName: "Industrial Economics", attended: 18, total: 22, percentage: 81.8, atRisk: false },
];

/* ---------- Question Papers ---------- */

const examTypes: ExamType[] = ["END_SEM", "SERIES_1", "SERIES_2", "MODEL"];

function makePapers(): QuestionPaper[] {
  const out: QuestionPaper[] = [];
  const branches = ["CSE", "EC", "EEE", "ME", "IT"] as const;
  const years = [2022, 2023, 2024, 2025];
  const months = [5, 11];
  const subjectsByBranch: Record<string, string[]> = {
    CSE: ["Discrete Structures", "Data Structures", "DBMS", "Operating Systems", "Computer Networks", "OOP Java"],
    EC: ["Signals & Systems", "Digital Electronics", "Analog Circuits", "Microprocessors"],
    EEE: ["Power Systems", "Electrical Machines", "Control Systems"],
    ME: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer"],
    IT: ["Web Technologies", "Cyber Security", "Cloud Computing"],
  };

  let id = 1;
  for (const branch of branches) {
    const subs = subjectsByBranch[branch]!;
    for (const year of years) {
      for (const month of months) {
        for (let s = 0; s < Math.min(2, subs.length); s++) {
          const examType = examTypes[(year + month + s) % examTypes.length]!;
          const sem = ((year - 2021) % 4) + 3;
          out.push({
            id: `paper_${id}`,
            title: `${subs[s]} — ${examType.replace("_", " ")} ${month === 5 ? "May" : "Nov"} ${year}`,
            subjectCode: `${branch.slice(0, 2)}T${300 + sem * 2}${s + 1}`,
            subjectName: subs[s]!,
            semester: sem as 3 | 4 | 5 | 6,
            branchCode: branch,
            year,
            month,
            examType,
            fileUrl: `https://r2.ktuone.in/papers/${branch}/${year}/${month}/${subs[s]?.replace(/\s+/g, "-")}.pdf`,
            fileSizeBytes: 800_000 + Math.floor(Math.random() * 1_500_000),
            pageCount: 6 + Math.floor(Math.random() * 6),
            downloads: Math.floor(Math.random() * 1800),
            views: Math.floor(Math.random() * 4500),
            uploadedAt: new Date(year, month - 1, 10).toISOString(),
            bookmarked: id % 7 === 0,
          });
          id++;
        }
      }
    }
  }
  return out.slice(0, 32);
}

export const MOCK_PAPERS: QuestionPaper[] = makePapers();

/* ---------- Syllabus ---------- */

export const MOCK_SYLLABUS: Syllabus[] = SUBJECTS.slice(0, 10).map((s, i) => ({
  id: `syllabus_${i + 1}`,
  title: `${s.name} — Syllabus`,
  semester: s.semester,
  branchCode: s.branchCode,
  subjectCode: s.code,
  subjectName: s.name,
  version: "v2019.1",
  fileUrl: `https://r2.ktuone.in/syllabus/${s.code}.pdf`,
  lastUpdated: new Date(2024, 7, 15).toISOString(),
  modules: 5,
  bookmarked: i % 5 === 0,
}));

/* ---------- Notices ---------- */

export const MOCK_NOTICES: KTUNotice[] = [
  {
    id: "n1",
    title: "End Semester Examination — December 2025 Timetable Released",
    description:
      "The timetable for the December 2025 End Semester Examinations has been published. All affiliated colleges are requested to ensure students are informed. Examinations commence on December 8, 2025.",
    category: "Examination",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    priority: "Pinned",
    pdfUrl: "https://r2.ktuone.in/notices/dec-2025-timetable.pdf",
    tags: ["end-sem", "timetable", "december"],
    pinned: true,
    active: true,
    read: false,
  },
  {
    id: "n2",
    title: "Revised Internal Assessment Mark Distribution",
    description:
      "Internal assessment marks will now be distributed as 50% series, 30% assignment, and 20% attendance effective Semester 5 onwards.",
    category: "Academic",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    priority: "High",
    tags: ["internal", "assessment"],
    pinned: false,
    active: true,
    read: false,
  },
  {
    id: "n3",
    title: "Scholarship Applications Open — Kerala State Higher Education",
    description:
      "Applications for the Kerala State Higher Education Council scholarship are now open for the academic year 2025-26. Last date: November 30, 2025.",
    category: "Scholarship",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    priority: "High",
    externalUrl: "https://dcescholarship.kerala.gov.in",
    tags: ["scholarship", "kerala"],
    pinned: false,
    active: true,
    read: true,
  },
  {
    id: "n4",
    title: "Placement Drive — TCS, Infosys & Wipro On-Campus",
    description:
      "Three back-to-back placement drives are scheduled in the second week of November. Eligible final-year students must register on the placement portal by November 5.",
    category: "Placement",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    priority: "High",
    tags: ["placement", "tcs", "infosys"],
    pinned: false,
    active: true,
    read: false,
  },
  {
    id: "n5",
    title: "TechFest 2025 — Registrations Open",
    description:
      "The annual technical festival returns this December with hackathons, robotics, paper presentations and contests worth ₹2 lakh in prizes.",
    category: "Cultural",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    priority: "Normal",
    tags: ["techfest", "event"],
    pinned: false,
    active: true,
    read: true,
  },
  {
    id: "n6",
    title: "Valuation of Answer Scripts — Series-2 Results Published",
    description:
      "Series-2 internal examination results for Semester 5 have been published. Students may contact their respective faculty advisors for revaluation requests.",
    category: "Academic",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    priority: "Normal",
    tags: ["series-2", "result"],
    pinned: false,
    active: true,
    read: true,
  },
];

/* ---------- Calendar ---------- */

export const MOCK_CALENDAR: CalendarEvent[] = [
  {
    id: "c1",
    title: "Series-1 Internal Examinations",
    description: "First internal series for Semester 5 across all branches.",
    type: "EXAM",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    allDay: true,
    color: "#9333EA",
    reminderEnabled: true,
  },
  {
    id: "c2",
    title: "Last Date — Scholarship Application",
    description: "Kerala State Higher Education scholarship deadline.",
    type: "DEADLINE",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    allDay: true,
    color: "#F59E0B",
    reminderEnabled: true,
  },
  {
    id: "c3",
    title: "Placement Drive — TCS",
    description: "On-campus placement drive. Aptitude test followed by technical interview.",
    type: "EVENT",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    allDay: true,
    color: "#E11D48",
    reminderEnabled: true,
  },
  {
    id: "c4",
    title: "End-Semester Examination Begins",
    description: "December 2025 End-Semester Examinations commence.",
    type: "EXAM",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).toISOString(),
    allDay: true,
    color: "#9333EA",
    reminderEnabled: true,
  },
  {
    id: "c5",
    title: "Christmas Holidays",
    description: "Holiday break for all affiliated colleges.",
    type: "HOLIDAY",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 38).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 47).toISOString(),
    allDay: true,
    color: "#10B981",
    reminderEnabled: false,
  },
  {
    id: "c6",
    title: "Semester Result Publication",
    description: "Provisional results for Semester 5 end-sem examinations.",
    type: "RESULT",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    allDay: true,
    color: "#0EA5E9",
    reminderEnabled: false,
  },
];

/* ---------- Recent Calculator History (mock) ---------- */

export const MOCK_HISTORY = [
  {
    id: "h1",
    type: "SGPA" as const,
    label: "Semester 5 — Trial 1",
    output: { type: "SGPA" as const, value: 8.45, percentage: 84.5, computedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  },
  {
    id: "h2",
    type: "ATTENDANCE" as const,
    label: "CST503 — Computer Graphics",
    output: { type: "ATTENDANCE" as const, value: 70.0, percentage: 70, computedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
  },
  {
    id: "h3",
    type: "CGPA" as const,
    label: "Up to Semester 4",
    output: { type: "CGPA" as const, value: 8.31, percentage: 83.1, computedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  },
];
