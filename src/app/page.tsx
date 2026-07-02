"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AppShell } from "@/components/layout/app-shell";
import { SupportCurtain } from "@/components/support/support-curtain";
import { LoginDialog } from "@/features/login/login-dialog";
import { SearchOverlay } from "@/features/search/search-overlay";
import { Dashboard } from "@/features/dashboard/dashboard";
import { Calculators } from "@/features/calculators/calculators";
import { Papers } from "@/features/papers/papers";
import { Syllabus } from "@/features/syllabus/syllabus";
import { Calendar } from "@/features/calendar/calendar";
import { Notices } from "@/features/notices/notices";
import { Settings } from "@/features/settings/settings";
import { useNavStore } from "@/store/nav-store";
import { getAnalyticsProvider } from "@/lib/providers/analytics";
import type { NavKey } from "@/lib/constants";

const views: Record<NavKey, React.ComponentType> = {
  dashboard: Dashboard,
  calculators: Calculators,
  papers: Papers,
  syllabus: Syllabus,
  calendar: Calendar,
  notices: Notices,
  settings: Settings,
};

export default function Home() {
  const active = useNavStore((s) => s.active);
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const View = views[active];

  useEffect(() => {
    // Use microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => {
      setMounted(true);
      if (typeof window !== "undefined") {
        import("@capacitor/splash-screen").then(({ SplashScreen }) => {
          SplashScreen.hide().catch(() => {});
        });
      }
    });
    getAnalyticsProvider().track({
      name: "page_view",
      props: { path: active, title: active },
    });
  }, [active]);

  // Render an empty shell during SSR + first paint to avoid hydration mismatches
  // from Date.now() / useReducedMotion / Math.random inside feature views.
  // After mount, swap to the live view.
  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={mounted ? active : "ssr"}
          // Disable entry animation during SSR + first paint to avoid
          // hydration mismatch (server would render opacity:0 / translateY(8px)
          // as inline styles, client immediately animates to opacity:1 / none).
          // After mount, subsequent view changes get the nice fade-up.
          initial={mounted && !prefersReduced ? { opacity: 0, x: 20 } : false}
          animate={{ opacity: 1, x: 0 }}
          exit={mounted && !prefersReduced ? { opacity: 0, x: -20 } : { opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {mounted ? <View /> : <SSRShell />}
        </motion.div>
      </AnimatePresence>

      {/* Global overlays */}
      <SupportCurtain />
      <LoginDialog />
      <SearchOverlay />
    </AppShell>
  );
}

function SSRShell() {
  // Minimal stable shell rendered during SSR — no time-dependent or
  // browser-API-derived content. Replaced after mount.
  return (
    <div className="min-h-[60vh]" aria-busy="true" aria-live="polite" />
  );
}

