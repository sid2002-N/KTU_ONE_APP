"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Upload,
  Trash2,
  AlertCircle,
  RefreshCw,
  Download,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRANCHES, SEMESTERS } from "@/lib/constants";
import type { Syllabus } from "@/lib/types";

interface SyllabusAdminProps {
  adminKey: string;
}

const authHeaders = (key: string) => ({
  Authorization: `Bearer ${key}`,
});

export function SyllabusAdmin({ adminKey }: SyllabusAdminProps) {
  const [items, setItems] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // form state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [semester, setSemester] = useState<string>("");
  const [branchCode, setBranchCode] = useState<string>("");
  const [version, setVersion] = useState("2019");
  const [modules, setModules] = useState<string>("5");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/syllabus", {
        headers: authHeaders(adminKey),
      });
      if (!res.ok) throw new Error(`Failed to load (HTTP ${res.status})`);
      const data = (await res.json()) as Syllabus[];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load syllabi.");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setFile(null);
    setTitle("");
    setSubjectCode("");
    setSubjectName("");
    setSemester("");
    setBranchCode("");
    setVersion("2019");
    setModules("5");
    const el = document.getElementById("syllabus-file") as HTMLInputElement | null;
    if (el) el.value = "";
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (!title.trim() || !subjectCode.trim() || !subjectName.trim()) {
      setError("Title, subject code and subject name are required.");
      return;
    }
    if (!semester || !branchCode) {
      setError("Semester and branch are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", title.trim());
      fd.append("subjectCode", subjectCode.trim());
      fd.append("subjectName", subjectName.trim());
      fd.append("semester", semester);
      fd.append("branchCode", branchCode);
      fd.append("version", version.trim());
      fd.append("modules", modules);

      const res = await fetch("/api/v1/admin/syllabus/upload", {
        method: "POST",
        headers: authHeaders(adminKey),
        body: fd,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error ?? `Upload failed (HTTP ${res.status})`,
        );
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this syllabus?")) return;
    try {
      const res = await fetch(`/api/v1/admin/syllabus?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(adminKey),
      });
      if (!res.ok) throw new Error(`Delete failed (HTTP ${res.status})`);
      setItems((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Upload Syllabus</CardTitle>
          <CardDescription>
            Upload a PDF syllabus. File is sent as multipart form data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="syllabus-file">PDF File</Label>
              <Input
                id="syllabus-file"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                disabled={submitting}
                required
              />
              {file && (
                <p className="text-xs text-muted-foreground">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="syllabus-title">Title</Label>
              <Input
                id="syllabus-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Data Structures — Syllabus 2019 Scheme"
                disabled={submitting}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="syllabus-code">Subject Code</Label>
                <Input
                  id="syllabus-code"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  placeholder="CST201"
                  disabled={submitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="syllabus-subject">Subject Name</Label>
                <Input
                  id="syllabus-subject"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Data Structures"
                  disabled={submitting}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select
                  value={semester}
                  onValueChange={setSemester}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((s) => (
                      <SelectItem key={s} value={String(s)}>
                        Semester {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select
                  value={branchCode}
                  onValueChange={setBranchCode}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((b) => (
                      <SelectItem key={b.code} value={b.code}>
                        {b.code} — {b.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="syllabus-version">Version / Scheme</Label>
                <Input
                  id="syllabus-version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="2019"
                  disabled={submitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="syllabus-modules">Modules</Label>
                <Input
                  id="syllabus-modules"
                  type="number"
                  min="1"
                  max="20"
                  value={modules}
                  onChange={(e) => setModules(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="size-4" />
                    Upload Syllabus
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={resetForm}
                disabled={submitting}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1.5">
            <CardTitle>Existing Syllabi</CardTitle>
            <CardDescription>{items.length} total</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              <span className="ml-2">Loading syllabi…</span>
            </div>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No syllabi uploaded yet.
            </p>
          ) : (
            <ul className="max-h-96 space-y-3 overflow-y-auto pr-1">
              {items.map((s) => (
                <li
                  key={s.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background/40 p-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <BookOpen className="size-3.5 text-primary" />
                      <span className="truncate font-medium">{s.title}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="text-xs">
                        {s.subjectCode}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        S{s.semester}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {s.branchCode}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        v{s.version}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {s.modules} modules
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(s.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={`/api/v1/syllabus/${s.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        title="Test download"
                      >
                        <Download className="size-4" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => void handleDelete(s.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
