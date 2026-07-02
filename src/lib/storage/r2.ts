import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

function getClient(): S3Client {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) throw new Error("R2 credentials not configured");
  return new S3Client({ region: "auto", endpoint: R2_ENDPOINT, credentials: { accessKeyId, secretAccessKey } });
}

function getBucket(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME not configured");
  return bucket;
}

export async function uploadToR2(key: string, body: Buffer | Uint8Array, contentType: string) {
  const client = getClient();
  await client.send(new PutObjectCommand({ Bucket: getBucket(), Key: key, Body: body, ContentType: contentType }));
  return { key, size: body.byteLength };
}

export async function getSignedDownloadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  const client = getClient();
  return getSignedUrl(client, new GetObjectCommand({ Bucket: getBucket(), Key: key }), { expiresIn: expiresInSeconds });
}

export async function deleteFromR2(key: string): Promise<void> {
  const client = getClient();
  await client.send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }));
}

export function buildPaperKey(p: { branchCode: string; year: number; month: number; subjectCode: string; examType: string }): string {
  return `papers/${p.branchCode}/${p.year}/${String(p.month).padStart(2, "0")}/${p.subjectCode}-${p.examType}.pdf`;
}

export function buildSyllabusKey(p: { branchCode: string; subjectCode: string }): string {
  return `syllabus/${p.branchCode}/${p.subjectCode}.pdf`;
}
