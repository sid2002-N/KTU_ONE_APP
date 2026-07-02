/**
 * POST /api/v1/login
 * Body: { registerNumber, password }
 *
 * Calls the scraper backend to validate credentials and fetch academic data,
 * then issues JWT access + refresh tokens (httpOnly cookies), persists the
 * scraper response in Prisma as a 24h cache, and returns the student profile.
 *
 * Password is NEVER persisted, NEVER logged.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { fetchStudentFromScraper, ScraperError } from "@/lib/scraper";
import { mapScraperToProfile } from "@/lib/scraper/mapper";
import { issueSession } from "@/lib/auth";
import { checkLoginRateLimit, getRequestIp } from "@/lib/auth/ratelimit";

export const dynamic = "force-dynamic";

const LoginSchema = z.object({
  registerNumber: z.string().min(1).max(50),
  password: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  // Rate limit: 5 login attempts per 15 min per IP
  const ip = getRequestIp(req);
  const rateLimit = await checkLoginRateLimit(ip);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: "Too many login attempts. Please try again later.",
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.reset - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateLimit.reset),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON body" } },
      { status: 400 },
    );
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_FAILED",
          message: parsed.error.issues[0]?.message ?? "Invalid input",
        },
      },
      { status: 400 },
    );
  }

  const { registerNumber, password } = parsed.data;

  try {
    // 1. Call the scraper (validates credentials + fetches academic data)
    const scraperData = await fetchStudentFromScraper(registerNumber, password);

    // 2. Upsert Student row
    const student = await db.student.upsert({
      where: { registerNumber: scraperData.userid },
      update: {
        name: scraperData.username,
        branchName: scraperData.AdmittedBranch,
        email: scraperData.Email,
        phone: scraperData.Mobile,
        lastLoginAt: new Date(),
      },
      create: {
        registerNumber: scraperData.userid,
        name: scraperData.username,
        branchName: scraperData.AdmittedBranch,
        email: scraperData.Email,
        phone: scraperData.Mobile,
        lastLoginAt: new Date(),
      },
    });

    // Update derived fields via mapper (separate update to keep logic clean)
    const profile = mapScraperToProfile(scraperData, student.id);
    await db.student.update({
      where: { id: student.id },
      data: {
        branchCode: profile.branchCode,
        semester: profile.semester,
        scheme: profile.scheme,
        avatarInitials: profile.avatarInitials,
        admissionYear: profile.admissionYear,
      },
    });

    // 3. Cache the scraper response (24h TTL)
    const cacheTtl = Number(process.env.CACHE_TTL_SECONDS ?? 86400);
    await db.cachedStudentData.upsert({
      where: { studentId: student.id },
      update: {
        rawJson: JSON.stringify(scraperData),
        cachedAt: new Date(),
        expiresAt: new Date(Date.now() + cacheTtl * 1000),
      },
      create: {
        studentId: student.id,
        rawJson: JSON.stringify(scraperData),
        expiresAt: new Date(Date.now() + cacheTtl * 1000),
      },
    });

    // 4. Issue JWT + refresh tokens, set cookies
    const { expiresIn } = await issueSession(student.id, student.registerNumber);

    // 5. Return the student profile for the frontend
    return NextResponse.json({
      accessToken: "in-cookie",
      expiresIn,
      student: {
        id: student.id,
        name: profile.name,
        branchCode: profile.branchCode,
        branchName: profile.branchName,
        semester: profile.semester,
        registerNumber: profile.registerNumber,
        avatarInitials: profile.avatarInitials,
      },
    });
  } catch (e) {
    if (e instanceof ScraperError) {
      // AUTH_FAILED → 401 (wrong password)
      // SCRAPE_FAILED → 502 (KTU site down, HTML changed, etc.)
      // SCRAPER_UNAVAILABLE → 502 (can't reach scraper)
      // BAD_RESPONSE → 502 (scraper returned garbage)
      const httpStatus = e.code === "AUTH_FAILED" ? 401 : e.status;
      return NextResponse.json(
        { error: { code: e.code, message: e.message } },
        { status: httpStatus },
      );
    }
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: { code: "INTERNAL", message } },
      { status: 500 },
    );
  }
}
