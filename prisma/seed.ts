/**
 * KTU One — Database seed script
 * Ports src/data/mock-data.ts into Prisma rows.
 * Run with: bun run db:seed
 */
import { PrismaClient } from "@prisma/client";
import {
  BRANCHES,
  SEMESTERS,
} from "../src/lib/constants";
import {
  SUBJECTS,
  MOCK_PAPERS,
  MOCK_SYLLABUS,
  MOCK_NOTICES,
  MOCK_CALENDAR,
} from "../src/data/mock-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding KTU One database...");

  // 1. Branches
  console.log("  → Branches");
  for (const b of BRANCHES) {
    await prisma.branch.upsert({
      where: { code: b.code },
      update: { name: b.name, fullName: b.fullName },
      create: { code: b.code, name: b.name, fullName: b.fullName },
    });
  }

  // 2. Semesters (one per branch × 8)
  console.log("  → Semesters");
  for (const branch of BRANCHES) {
    for (const num of SEMESTERS) {
      await prisma.semester.upsert({
        where: {
          number_branchCode_academicYear: {
            number: num,
            branchCode: branch.code,
            academicYear: "2025-2026",
          },
        },
        update: {},
        create: {
          number: num,
          branchCode: branch.code,
          academicYear: "2025-2026",
          totalCredits: 24,
        },
      });
    }
  }

  // 3. Subjects (only the CSE ones in mock-data)
  console.log("  → Subjects");
  for (const s of SUBJECTS) {
    await prisma.subject.upsert({
      where: { code: s.code },
      update: {
        name: s.name,
        semester: s.semester,
        branchCode: s.branchCode,
        credits: s.credits,
        type: s.type,
        isElective: s.isElective,
        isLab: s.isLab,
      },
      create: {
        code: s.code,
        name: s.name,
        semester: s.semester,
        branchCode: s.branchCode,
        credits: s.credits,
        type: s.type,
        isElective: s.isElective,
        isLab: s.isLab,
      },
    });
  }

  // 4. Question papers (clear + reinsert to keep things deterministic)
  console.log("  → Question papers");
  await prisma.questionPaper.deleteMany({});
  for (const p of MOCK_PAPERS) {
    await prisma.questionPaper.create({
      data: {
        title: p.title,
        subjectCode: p.subjectCode,
        subjectName: p.subjectName,
        semester: p.semester,
        branchCode: p.branchCode,
        year: p.year,
        month: p.month,
        examType: p.examType,
        fileUrl: p.fileUrl,
        fileSizeBytes: p.fileSizeBytes,
        pageCount: p.pageCount,
        downloads: p.downloads,
        views: p.views,
        uploadedAt: new Date(p.uploadedAt),
      },
    });
  }

  // 5. Syllabus
  console.log("  → Syllabus");
  await prisma.syllabus.deleteMany({});
  for (const s of MOCK_SYLLABUS) {
    await prisma.syllabus.create({
      data: {
        title: s.title,
        semester: s.semester,
        branchCode: s.branchCode,
        subjectCode: s.subjectCode,
        subjectName: s.subjectName,
        version: s.version,
        fileUrl: s.fileUrl,
        lastUpdated: new Date(s.lastUpdated),
        modules: s.modules,
      },
    });
  }

  // 6. Notices (upsert by key — so we don't duplicate on re-seed)
  console.log("  → Notices");
  for (const n of MOCK_NOTICES) {
    const slug = n.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100);
    await prisma.kTUNotice.upsert({
      where: { key: slug },
      update: {
        title: n.title,
        description: n.description,
        category: n.category,
        publishedAt: new Date(n.publishedAt),
        priority: n.priority,
        pdfUrl: n.pdfUrl ?? null,
        externalUrl: n.externalUrl ?? null,
        tags: JSON.stringify(n.tags),
        pinned: n.pinned,
        active: n.active,
      },
      create: {
        key: slug,
        title: n.title,
        description: n.description,
        category: n.category,
        publishedAt: new Date(n.publishedAt),
        priority: n.priority,
        pdfUrl: n.pdfUrl ?? null,
        externalUrl: n.externalUrl ?? null,
        tags: JSON.stringify(n.tags),
        pinned: n.pinned,
        active: n.active,
      },
    });
  }

  // 7. Calendar events
  console.log("  → Calendar events");
  await prisma.calendarEvent.deleteMany({});
  for (const e of MOCK_CALENDAR) {
    await prisma.calendarEvent.create({
      data: {
        title: e.title,
        description: e.description,
        type: e.type,
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate),
        allDay: e.allDay,
        color: e.color,
        reminderEnabled: e.reminderEnabled,
      },
    });
  }

  // 8. Default app settings
  console.log("  → App settings");
  await prisma.appSettings.upsert({
    where: { key: "app.version" },
    update: {},
    create: { key: "app.version", value: JSON.stringify("1.0.0-alpha") },
  });

  console.log("✅ Seed complete");
  console.log(`   ${BRANCHES.length} branches`);
  console.log(`   ${BRANCHES.length * SEMESTERS.length} semesters`);
  console.log(`   ${SUBJECTS.length} subjects`);
  console.log(`   ${MOCK_PAPERS.length} question papers`);
  console.log(`   ${MOCK_SYLLABUS.length} syllabus entries`);
  console.log(`   ${MOCK_NOTICES.length} notices`);
  console.log(`   ${MOCK_CALENDAR.length} calendar events`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
