"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, Trash2, AlertCircle, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import type { CalendarEvent, CalendarEventType } from "@/lib/types";

const EVENT_TYPES: CalendarEventType[] = [
  "EXAM",
  "HOLIDAY",
  "RESULT",
  "REGISTRATION",
  "WORKSHOP",
  "DEADLINE",
  "EVENT",
];

// Auto-assign color based on type (hex strings).
const TYPE_COLORS: Record<CalendarEventType, string> = {
  EXAM: "#ef4444",
  HOLIDAY: "#10b981",
  RESULT: "#f59e0b",
  REGISTRATION: "#3b82f6",
  WORKSHOP: "#8b5cf6",
  DEADLINE: "#ec4899",
  EVENT: "#0ea5e9",
};

interface CalendarAdminProps {
  adminKey: string;
}

const authHeaders = (key: string) => ({
  Authorization: `Bearer ${key}`,
});

const jsonHeaders = (key: string) => ({
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
});

export function CalendarAdmin({ adminKey }: CalendarAdminProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CalendarEventType>("EVENT");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/calendar", {
        headers: authHeaders(adminKey),
      });
      if (!res.ok) throw new Error(`Failed to load (HTTP ${res.status})`);
      const data = (await res.json()) as CalendarEvent[];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events.");
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
    setType("EVENT");
    setStartDate("");
    setEndDate("");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Start and end dates are required.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        type,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        color: TYPE_COLORS[type],
      };
      const res = await fetch("/api/v1/admin/calendar", {
        method: "POST",
        headers: jsonHeaders(adminKey),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Create failed (HTTP ${res.status})`);
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
    if (!confirm("Delete this calendar event?")) return;
    try {
      const res = await fetch(`/api/v1/admin/calendar?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(adminKey),
      });
      if (!res.ok) throw new Error(`Delete failed (HTTP ${res.status})`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Create Calendar Event</CardTitle>
          <CardDescription>
            Color is auto-assigned based on event type.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cal-title">Title</Label>
              <Input
                id="cal-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                disabled={submitting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cal-desc">Description</Label>
              <Textarea
                id="cal-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event description…"
                rows={3}
                disabled={submitting}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as CalendarEventType)}
                  disabled={submitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        <span className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: TYPE_COLORS[t] }}
                          />
                          {t}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div
                  className="flex h-9 w-full items-center gap-2 rounded-md border border-input px-3 text-sm"
                  style={{ backgroundColor: `${TYPE_COLORS[type]}1a` }}
                >
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: TYPE_COLORS[type] }}
                  />
                  <span className="text-muted-foreground">
                    Color: {TYPE_COLORS[type]}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cal-start">Start Date</Label>
                <Input
                  id="cal-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cal-end">End Date</Label>
                <Input
                  id="cal-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    Create Event
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
            <CardTitle>Existing Events</CardTitle>
            <CardDescription>{events.length} total</CardDescription>
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
              <span className="ml-2">Loading events…</span>
            </div>
          ) : events.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No calendar events yet.
            </p>
          ) : (
            <ul className="max-h-96 space-y-3 overflow-y-auto pr-1">
              {events.map((ev) => (
                <li
                  key={ev.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background/40 p-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: ev.color }}
                      />
                      <span className="truncate font-medium">{ev.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {ev.type}
                      </Badge>
                    </div>
                    {ev.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {ev.description}
                      </p>
                    )}
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      {new Date(ev.startDate).toLocaleDateString()} —{" "}
                      {new Date(ev.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => void handleDelete(ev.id)}
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
