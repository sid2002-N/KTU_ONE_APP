"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle, X, CalendarDays } from "lucide-react";
import { BRANCHES, SEMESTERS } from "@/lib/constants";
import { formatDate } from "@/lib/utils/calc";

interface Entry {
  date: string;
  session: string;
  subjectCode: string;
  subjectName: string;
}

interface Timetable {
  id: string;
  title: string;
  examType: string;
  semester: number;
  branchCode: string;
  academicYear: string | null;
  isActive: boolean;
  publishedAt: string;
  entries: { id: string; date: string; session: string; subjectCode: string; subjectName: string }[];
}

export function TimetablesAdmin({ adminKey }: { adminKey: string }) {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [examType, setExamType] = useState("END_SEM");
  const [semester, setSemester] = useState(5);
  const [branchCode, setBranchCode] = useState("CSE");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [entries, setEntries] = useState<Entry[]>([{ date: "", session: "FN", subjectCode: "", subjectName: "" }]);

  const authHeader = { Authorization: `Bearer ${adminKey}` };

  const fetchTimetables = async () => {
    setLoading(true);
    const res = await fetch("/api/v1/admin/timetables", { headers: authHeader });
    const data = await res.json();
    setTimetables(data.timetables ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchTimetables(); }, []);

  const addEntry = () => setEntries([...entries, { date: "", session: "FN", subjectCode: "", subjectName: "" }]);
  const removeEntry = (i: number) => setEntries(entries.filter((_, idx) => idx !== i));
  const updateEntry = (i: number, field: keyof Entry, value: string) => {
    setEntries(entries.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/timetables", {
        method: "POST",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ title, examType, semester, branchCode, academicYear, entries }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error?.message ?? "Failed");
      }
      setTitle(""); setEntries([{ date: "", session: "FN", subjectCode: "", subjectName: "" }]);
      setShowForm(false);
      fetchTimetables();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this timetable?")) return;
    await fetch(`/api/v1/admin/timetables?id=${id}`, { method: "DELETE", headers: authHeader });
    fetchTimetables();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Exam Timetables ({timetables.length})</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="size-4" /> {showForm ? "Cancel" : "New Timetable"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="size-4" /> {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="space-y-3 p-4 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold">Create Exam Timetable</h3>

          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g. S5 End Semester December 2025)" required
            className="w-full h-11 px-3 rounded-lg border border-border bg-background text-sm" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select value={examType} onChange={(e) => setExamType(e.target.value)}
              className="h-11 px-3 rounded-lg border border-border bg-background text-sm">
              <option value="END_SEM">End Semester</option>
              <option value="SERIES_1">Series 1</option>
              <option value="SERIES_2">Series 2</option>
            </select>
            <select value={semester} onChange={(e) => setSemester(Number(e.target.value))}
              className="h-11 px-3 rounded-lg border border-border bg-background text-sm">
              {SEMESTERS.map((s) => <option key={s} value={s}>S{s}</option>)}
            </select>
            <select value={branchCode} onChange={(e) => setBranchCode(e.target.value)}
              className="h-11 px-3 rounded-lg border border-border bg-background text-sm">
              <option value="ALL">All Branches</option>
              {BRANCHES.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
            </select>
          </div>

          <input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="Academic Year (e.g. 2025-2026)"
            className="w-full h-11 px-3 rounded-lg border border-border bg-background text-sm" />

          {/* Dynamic entries */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exam Entries</p>
            {entries.map((entry, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end p-2 rounded-lg bg-secondary/40">
                <div>
                  <label className="text-[10px] text-muted-foreground">Date</label>
                  <input type="date" value={entry.date.slice(0,10)} onChange={(e) => updateEntry(i, "date", e.target.value)} required
                    className="w-full h-10 px-2 rounded border border-border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Session</label>
                  <select value={entry.session} onChange={(e) => updateEntry(i, "session", e.target.value)}
                    className="w-full h-10 px-2 rounded border border-border bg-background text-sm">
                    <option value="FN">FN (Forenoon)</option>
                    <option value="AN">AN (Afternoon)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Subject Code</label>
                  <input value={entry.subjectCode} onChange={(e) => updateEntry(i, "subjectCode", e.target.value)}
                    placeholder="CST301" required
                    className="w-full h-10 px-2 rounded border border-border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Subject Name</label>
                  <input value={entry.subjectName} onChange={(e) => updateEntry(i, "subjectName", e.target.value)}
                    placeholder="DBMS" required
                    className="w-full h-10 px-2 rounded border border-border bg-background text-sm" />
                </div>
                <button type="button" onClick={() => removeEntry(i)}
                  className="h-10 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center">
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addEntry}
              className="flex items-center gap-1 text-sm text-primary hover:underline font-medium">
              <Plus className="size-3.5" /> Add another exam
            </button>
          </div>

          <button type="submit" disabled={creating}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50">
            {creating ? "Publishing..." : "Publish Timetable"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : timetables.length === 0 ? (
        <p className="text-sm text-muted-foreground">No timetables yet.</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {timetables.map((t) => (
            <div key={t.id} className="p-3 rounded-lg border border-border bg-card">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${t.isActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-secondary text-muted-foreground"}`}>
                      {t.isActive ? "Active" : "Archived"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{t.examType.replace("_"," ")}</span>
                    <span className="text-xs text-muted-foreground">S{t.semester} · {t.branchCode}</span>
                  </div>
                  <p className="text-sm font-medium">{t.title}</p>
                  <div className="mt-2 space-y-0.5">
                    {t.entries.map((e) => (
                      <div key={e.id} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="font-mono">{e.subjectCode}</span>
                        <span>{e.subjectName}</span>
                        <span>· {formatDate(e.date)} · {e.session}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleDelete(t.id)}
                  className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center shrink-0">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
