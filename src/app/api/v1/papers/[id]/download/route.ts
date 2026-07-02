import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSignedDownloadUrl } from "@/lib/storage/r2";
import { getAuthenticatedStudent } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Require authentication — papers are for logged-in students only
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Login required to download papers" } },
      { status: 401 },
    );
  }

  const { id } = await params;
  const paper = await db.questionPaper.findUnique({ where: { id } });
  if (!paper || paper.deletedAt) {
    return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
  }

  try {
    // Short-lived signed URL (2 min instead of 1 hour — reduces shareability)
    const signedUrl = await getSignedDownloadUrl(paper.fileUrl, 120);
    await db.questionPaper.update({ where: { id }, data: { downloads: { increment: 1 } } });
    return NextResponse.redirect(signedUrl, 302);
  } catch (e) {
    return NextResponse.json(
      { error: { code: "DOWNLOAD_FAILED", message: e instanceof Error ? e.message : "Failed" } },
      { status: 500 },
    );
  }
}
