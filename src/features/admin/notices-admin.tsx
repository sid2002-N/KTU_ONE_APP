"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, Trash2, Pin, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import type {
  KTUNotice,
  NoticeCategory,
  NoticePriority,
} from "@/lib/types";

const CATEGORIES: NoticeCategory[] = [
  "Academic",
  "Examination",
  "Scholarship",
  "Placement",
  "Cultural",
  "General",
];

const PRIORITIES: NoticePriority[] = ["Pinned", "High", "Normal", "Low"];

interface NoticesAdminProps {
  adminKey: string;
}

const authHeaders = (key: string) => ({
  Authorization: `Bearer ${key}`,
});

const jsonHeaders = (key: string) => ({
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
});

export function NoticesAdmin({ adminKey }: NoticesAdminProps) {
  const [notices, setNotices] = useState<KTUNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<NoticeCategory>("General");
  const [priority, setPriority] = useState<NoticePriority>("Normal");
  const [pinned, setPinned] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [tags, setTags] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/notices", {
        headers: authHeaders(adminKey),
      });
      if (!res.ok) throw new Error(`Failed to load (HTTP ${res.status})`);
      const data = (await res.json()) as KTUNotice[];
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notices.");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("General");
    setPriority("Normal");
    setPinned(false);
    setExternalUrl("");
    setTags("");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        pinned,
        externalUrl: externalUrl.trim() || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/v1/admin/notices", {
        method: "POST",
        headers: jsonHeaders(adminKey),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error ?? `Create failed (HTTP ${res.status})`,
        );
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this notice? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/v1/admin/notices?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(adminKey),
      });
      if (!res.ok) throw new Error(`Delete failed (HTTP ${res.status})`);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Create Notice</CardTitle>
          <CardDescription>
            Publish a new notice to all KTU One users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notice-title">Title</Label>
              <Input
                id="notice-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notice title"
                disabled={submitting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notice-desc">Description</Label>
              <Textarea
                id="notice-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description…"
                rows={3}
                disabled={submitting}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as NoticeCategory)}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as NoticePriority)}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="notice-url">External URL (optional)</Label>
                <Input
                  id="notice-url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://ktu.edu.in/…"
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notice-tags">Tags (comma-separated)</Label>
                <Input
                  id="notice-tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="exam, results, 2025"
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="notice-pinned"
                checked={pinned}
                onCheckedChange={(v) => setPinned(v === true)}
                disabled={submitting}
              />
              <Label htmlFor="notice-pinned" className="cursor-pointer">
                Pin to top
              </Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    Create Notice
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
            <CardTitle>Existing Notices</CardTitle>
            <CardDescription>{notices.length} total</CardDescription>
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
              <span className="ml-2">Loading notices…</span>
            </div>
          ) : notices.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No notices yet.
            </p>
          ) : (
            <ul className="max-h-96 space-y-3 overflow-y-auto pr-1">
              {notices.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background/40 p-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {n.pinned && (
                        <Pin className="size-3.5 text-primary" />
                      )}
                      <span className="truncate font-medium">{n.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {n.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {n.priority}
                      </Badge>
                    </div>
                    {n.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {n.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.publishedAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => void handleDelete(n.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
