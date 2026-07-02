/**
 * HttpStudentService — talks to the BFF API routes (login, refresh, logout,
 * profile, results, cgpa). Cookies handle JWT transport automatically.
 *
 * Drop-in replacement for MockStudentService. UI code unchanged.
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
import type { StudentService } from "@/lib/providers/student";
import { authedFetch } from "@/lib/providers/authed-fetch";
import { apiUrl } from "@/lib/api-base";

type AuthListener = (session: AuthSession | null) => void;

/**
 * Typed error thrown by HttpStudentService. Includes the BFF error code so
 * the UI can branch on it (e.g. show "KTU is down" vs "wrong password").
 */
export class BffError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "BffError";
  }
}

export class HttpStudentService implements StudentService {
  private listeners = new Set<AuthListener>();

  async initialize(): Promise<boolean> {
    // Try to restore session by calling /api/v1/refresh
    try {
      const res = await fetch(apiUrl("/api/v1/refresh"), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return false;

      // If refresh succeeded, we have a valid access token cookie.
      // Optionally fetch profile to confirm student record exists.
      return true;
    } catch {
      return false;
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const res = await fetch(apiUrl("/api/v1/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const code = data?.error?.code ?? "LOGIN_FAILED";
      const message = data?.error?.message ?? "Login failed";
      throw new BffError(code, message, res.status);
    }

    const data = (await res.json()) as LoginResponse & { expiresIn: number };

    // Build a session object for the auth store
    const session: AuthSession = {
      studentId: data.student.id,
      registerNumber: data.student.registerNumber,
      name: data.student.name,
      accessToken: "in-cookie", // not actually stored client-side — cookie is
      refreshToken: "in-cookie",
      expiresAt: Date.now() + (data.expiresIn ?? 3600) * 1000,
      issuedAt: Date.now(),
    };

    this.emit(session);
    return data;
  }

  async logout(): Promise<void> {
    await fetch(apiUrl("/api/v1/logout"), {
      method: "POST",
      credentials: "include",
    });
    this.emit(null);
  }

  isAuthenticated(): boolean {
    // We don't store tokens client-side; we rely on the cookie being present.
    // Optimistic — actual validation happens on the next API call.
    return true;
  }

  async refreshSession(): Promise<boolean> {
    try {
      const res = await fetch(apiUrl("/api/v1/refresh"), {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async getProfile(): Promise<StudentProfile> {
    const res = await authedFetch("/api/v1/profile");
    if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);
    const data = await res.json();
    return data.profile as StudentProfile;
  }

  async getResults(): Promise<SemesterResult[]> {
    const res = await authedFetch("/api/v1/results");
    if (!res.ok) throw new Error(`Failed to fetch results: ${res.status}`);
    const data = await res.json();
    return data.results as SemesterResult[];
  }

  async getCGPA(): Promise<CGPAResult> {
    const res = await authedFetch("/api/v1/cgpa");
    if (!res.ok) throw new Error(`Failed to fetch CGPA: ${res.status}`);
    const data = await res.json();
    return data.cgpa as CGPAResult;
  }

  async getAttendance(): Promise<AttendanceRecord[]> {
    // Scraper doesn't return attendance. Students enter manually.
    return [];
  }

  async sync(): Promise<number> {
    // Profile/Results/CGPA already serve cached data with `stale` flag.
    // For now, sync is a no-op — students re-login to refresh from scraper.
    return Date.now();
  }

  async clearCache(): Promise<void> {
    // No client-side cache to clear (cookies handle everything).
  }

  onAuthChange(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(session: AuthSession | null) {
    for (const l of this.listeners) {
      try { l(session); } catch { /* swallow */ }
    }
  }
}
