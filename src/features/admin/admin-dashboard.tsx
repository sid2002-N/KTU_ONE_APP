"use client";

import { useState } from "react";
import { LogOut, Bell, CalendarDays, FileText, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { NoticesAdmin } from "@/features/admin/notices-admin";
import { CalendarAdmin } from "@/features/admin/calendar-admin";
import { PapersAdmin } from "@/features/admin/papers-admin";
import { SyllabusAdmin } from "@/features/admin/syllabus-admin";
import { TimetablesAdmin } from "@/features/admin/timetables-admin";

interface AdminDashboardProps {
  adminKey: string;
  onLogout: () => void;
}

type TabKey = "notices" | "calendar" | "papers" | "syllabus" | "timetables";

export function AdminDashboard({ adminKey, onLogout }: AdminDashboardProps) {
  const [tab, setTab] = useState<TabKey>("notices");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">K1</span>
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none">
                KTU One Admin
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Content management dashboard
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              Manage Content
            </CardTitle>
            <CardDescription>
              Create, update, and delete notices, calendar events, question
              papers and syllabi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as TabKey)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
                <TabsTrigger value="notices">
                  <Bell className="size-4" />
                  <span className="hidden sm:inline">Notices</span>
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <CalendarDays className="size-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="papers">
                  <FileText className="size-4" />
                  <span className="hidden sm:inline">Papers</span>
                </TabsTrigger>
                <TabsTrigger value="syllabus">
                  <BookOpen className="size-4" />
                  <span className="hidden sm:inline">Syllabus</span>
                </TabsTrigger>
                <TabsTrigger value="timetables">
                  <GraduationCap className="size-4" />
                  <span className="hidden sm:inline">Timetables</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="notices" className="mt-4">
                <NoticesAdmin adminKey={adminKey} />
              </TabsContent>
              <TabsContent value="calendar" className="mt-4">
                <CalendarAdmin adminKey={adminKey} />
              </TabsContent>
              <TabsContent value="papers" className="mt-4">
                <PapersAdmin adminKey={adminKey} />
              </TabsContent>
              <TabsContent value="syllabus" className="mt-4">
                <SyllabusAdmin adminKey={adminKey} />
              </TabsContent>
              <TabsContent value="timetables" className="mt-4">
                <TimetablesAdmin adminKey={adminKey} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
