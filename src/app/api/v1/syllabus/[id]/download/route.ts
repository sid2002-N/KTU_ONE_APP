import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSignedDownloadUrl } from "@/lib/storage/r2";
import { getAuthenticatedStudent } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Require authentication
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Login required to download syllabus" } },
      { status: 401 },
    );
  }

  const { id } = await params;
  const syllabus = await db.syllabus.findUnique({ where: { id } });
  if (!syllabus || syllabus.deletedAt) {
    return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
  }

  try {
    const signedUrl = await getSignedDownloadUrl(syllabus.fileUrl, 120);
    return NextResponse.redirect(signedUrl, 302);
  } catch (e) {
    return NextResponse.json(
      { error: { code: "DOWNLOAD_FAILED", message: e instanceof Error ? e.message : "Failed" } },
      { status: 500 },
    );
  }
}
