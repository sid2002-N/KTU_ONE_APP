/**
 * StudentService — the SINGLE gateway to student academic data.
 *
 * Pages, components, and features NEVER directly call backend endpoints.
 * They always go through StudentService.
 *
 * Currently backed by a Mock implementation that returns realistic
 * fixture data. When the real backend is ready, swap MockStudentService
 * for HttpStudentService — no UI code changes.
 */

import type {
  AuthSession,
  AttendanceRecord,
  CGPAResult,
  LoginCredentials,
  LoginResponse,
  SemesterResult,
  StudentProfile,
} from "@/lib/types";
import {
  MOCK_STUDENT,
  MOCK_CGPA,
  MOCK_SEMESTER_RESULTS,
  MOCK_ATTENDANCE,
} from "@/data/mock-data";

export interface StudentService {
  /** Restore session on app boot. Returns true if session is usable. */
  initialize(): Promise<boolean>;

  /** Login using KTU credentials. Stores tokens, returns minimal student. */
  login(credentials: LoginCredentials): Promise<LoginResponse>;

  /** Logout everywhere — clear local session + notify backend. */
  logout(): Promise<void>;

  /** Check current session validity. */
  isAuthenticated(): boolean;

  /** Refresh the access token using the refresh token. */
  refreshSession(): Promise<boolean>;

  /** Get the latest student profile (from cache or backend). */
  getProfile(): Promise<StudentProfile>;

  /** Get semester results. */
  getResults(): Promise<SemesterResult[]>;

  /** Get CGPA summary. */
  getCGPA(): Promise<CGPAResult>;

  /** Get attendance per subject. */
  getAttendance(): Promise<AttendanceRecord[]>;

  /** Re-sync all cached academic data. Returns last-sync timestamp. */
  sync(): Promise<number>;

  /** Clear all cached academic data (used on logout or manual refresh). */
  clearCache(): Promise<void>;

  /** Subscribe to auth state changes. Returns unsubscribe fn. */
  onAuthChange(listener: (session: AuthSession | null) => void): () => void;
}

/* ---------- Mock Implementation ---------- */

const MOCK_TOKEN = "mock.jwt.accessToken";
const MOCK_REFRESH = "mock.refresh.token";
const MOCK_LATENCY = 350; // ms — simulate network

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type AuthListener = (session: AuthSession | null) => void;

class MockStudentService implements StudentService {
  private session: AuthSession | null = null;
  private listeners = new Set<AuthListener>();

  async initialize(): Promise<boolean> {
    await delay(150);
    // Mock: no persisted session — student must log in.
    return this.session !== null && this.session.expiresAt > Date.now();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await delay(MOCK_LATENCY);
    if (!credentials.registerNumber || credentials.password.length < 3) {
      throw new Error("Invalid register number or password.");
    }
    const issuedAt = Date.now();
    const expiresAt = issuedAt + 60 * 60 * 1000; // 1 hour
    this.session = {
      studentId: MOCK_STUDENT.id,
      registerNumber: credentials.registerNumber,
      name: MOCK_STUDENT.name,
      accessToken: MOCK_TOKEN,
      refreshToken: MOCK_REFRESH,
      expiresAt,
      issuedAt,
    };
    const response: LoginResponse = {
      accessToken: MOCK_TOKEN,
      refreshToken: MOCK_REFRESH,
      expiresIn: 3600,
      student: {
        id: MOCK_STUDENT.id,
        name: MOCK_STUDENT.name,
        branchCode: MOCK_STUDENT.branchCode,
        branchName: MOCK_STUDENT.branchName,
        semester: MOCK_STUDENT.semester,
        registerNumber: credentials.registerNumber,
        avatarInitials: MOCK_STUDENT.avatarInitials,
      },
    };
    this.emit();
    return response;
  }

  async logout(): Promise<void> {
    await delay(150);
    this.session = null;
    this.emit();
  }

  isAuthenticated(): boolean {
    return this.session !== null && this.session.expiresAt > Date.now();
  }

  async refreshSession(): Promise<boolean> {
    await delay(200);
    if (!this.session) return false;
    this.session.issuedAt = Date.now();
    this.session.expiresAt = Date.now() + 60 * 60 * 1000;
    this.emit();
    return true;
  }

  async getProfile(): Promise<StudentProfile> {
    await delay(MOCK_LATENCY);
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated.");
    }
    return { ...MOCK_STUDENT, registerNumber: this.session?.registerNumber ?? MOCK_STUDENT.registerNumber };
  }

  async getResults(): Promise<SemesterResult[]> {
    await delay(MOCK_LATENCY);
    return [...MOCK_SEMESTER_RESULTS];
  }

  async getCGPA(): Promise<CGPAResult> {
    await delay(MOCK_LATENCY);
    return { ...MOCK_CGPA };
  }

  async getAttendance(): Promise<AttendanceRecord[]> {
    await delay(MOCK_LATENCY);
    return [...MOCK_ATTENDANCE];
  }

  async sync(): Promise<number> {
    await delay(MOCK_LATENCY * 2);
    return Date.now();
  }

  async clearCache(): Promise<void> {
    await delay(100);
  }

  onAuthChange(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    for (const l of this.listeners) {
      try {
        l(this.session);
      } catch {
        /* swallow */
      }
    }
  }
}

let _instance: StudentService | null = null;

export function getStudentService(): StudentService {
  if (!_instance) _instance = new MockStudentService();
  return _instance;
}

export function __setStudentService(s: StudentService) {
  _instance = s;
}
