import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { uploadToR2, buildPaperKey } from "@/lib/storage/r2";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const MAX = 20*1024*1024;
function auth(req: NextRequest) { return req.headers.get("authorization") === `Bearer ${process.env.ADMIN_API_KEY}`; }

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error:{code:"UNAUTHORIZED",message:"Invalid admin key"} }, { status: 401 });
  try {
    const fd = await req.formData();
    const file = fd.get("file") as File|null;
    const title = fd.get("title") as string|null;
    const subjectCode = fd.get("subjectCode") as string|null;
    const subjectName = fd.get("subjectName") as string|null;
    const semester = Number(fd.get("semester"));
    const branchCode = fd.get("branchCode") as string|null;
    const year = Number(fd.get("year"));
    const month = Number(fd.get("month"));
    const examType = fd.get("examType") as string|null;
    if (!file||!title||!subjectCode||!subjectName||!branchCode||!examType) return NextResponse.json({ error:{code:"VALIDATION_FAILED",message:"Missing required fields"} }, { status: 400 });
    if (file.size>MAX) return NextResponse.json({ error:{code:"FILE_TOO_LARGE",message:"Max 20MB"} }, { status: 413 });
    if (file.type!=="application/pdf") return NextResponse.json({ error:{code:"INVALID_TYPE",message:"PDF only"} }, { status: 400 });
    const key = buildPaperKey({ branchCode, year, month, subjectCode, examType });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { size } = await uploadToR2(key, bytes, "application/pdf");
    const paper = await db.questionPaper.create({ data: { title, subjectCode, subjectName, semester, branchCode, year, month, examType, fileUrl: key, fileSizeBytes: size, pageCount: Math.max(1,Math.round(size/50000)), downloads:0, views:0 } });
    return NextResponse.json({ paper });
  } catch(e) { return NextResponse.json({ error:{code:"UPLOAD_FAILED",message:e instanceof Error?e.message:"Upload failed"} }, { status: 500 }); }
}
