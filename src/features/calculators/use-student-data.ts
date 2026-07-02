"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { apiUrl } from "@/lib/api-base";
import type { SemesterResult, CGPAResult, Grade } from "@/lib/types";
import type { CalculatorCourse } from "@/lib/types";

/**
 * Fetches the student's real academic data from the BFF.
 * Returns null when not authenticated.
 *
 * Used by calculators to pre-fill forms with real grades/SGPA.
 */
export function useStudentData() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: results } = useQuery({
    queryKey: ["student-results"],
    queryFn: async (): Promise<SemesterResult[] | null> => {
      const res = await fetch(apiUrl("/api/v1/results"), { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      return data.results as SemesterResult[];
    },
    enabled: isAuthenticated,
    staleTime: 60 * 60 * 1000, // 1 hour — matches cache TTL
  });

  const { data: cgpa } = useQuery({
    queryKey: ["student-cgpa"],
    queryFn: async (): Promise<CGPAResult | null> => {
      const res = await fetch(apiUrl("/api/v1/cgpa"), { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      return data.cgpa as CGPAResult;
    },
    enabled: isAuthenticated,
    staleTime: 60 * 60 * 1000,
  });

  return { results, cgpa, isAuthenticated };
}

/**
 * Convert a SemesterResult into the CalculatorCourse[] format
 * that the SGPA calculator expects.
 */
export function semesterResultToCourses(sem: SemesterResult): CalculatorCourse[] {
  return sem.subjects.map((s, i) => ({
    id: `real_${sem.semester}_${i}`,
    subjectCode: s.subjectCode,
    subjectName: s.subjectName,
    credits: s.credits,
    grade: s.grade as Grade,
  }));
}

/**
 * Convert CGPAResult.semesters into the { sgpa, credits }[] format
 * that the CGPA calculator expects.
 */
export function cgpaToSemesters(cgpa: CGPAResult): { sgpa: number; credits: number }[] {
  return cgpa.semesters.map((s) => ({
    sgpa: s.sgpa,
    credits: s.totalCredits,
  }));
}
