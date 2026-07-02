# KTU One — Complete Codebase Reference

**Phase 1 + Visual v3.1 (Material Realism)**

This document contains every piece of code written for KTU One Phase 1, organized by layer. Pre-existing shadcn/ui scaffold components are not included — only the KTU One application code.

---

## Table of Contents

1. Project Configuration
2. App Core (layout, page, globals)
3. Design System (globals.css)
4. Domain Types & Constants
5. Provider Architecture
6. Zustand Stores
7. Mock Data
8. Pure Utilities
9. Custom UI Components
10. Sketch & Editorial Components
11. Layout Components
12. Feature Views
13. Signature Experiences
14. File Tree Summary
15. Visual Iteration History

---

# 1. Project Configuration

## package.json

**File:** `/home/z/my-project/package.json`

```json
{
  "name": "nextjs_tailwind_shadcn_ts",
  "version": "0.2.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000 2>&1 | tee dev.log",
    "build": "next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/",
    "start": "NODE_ENV=production bun .next/standalone/server.js 2>&1 | tee server.log",
    "lint": "eslint .",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset",
    "db:seed": "bun run prisma/seed.ts"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@hookform/resolvers": "^5.1.1",
    "@mdxeditor/editor": "^3.39.1",
    "@prisma/client": "^6.11.1",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@reactuses/core": "^6.0.5",
    "@tanstack/react-query": "^5.82.0",
    "@tanstack/react-table": "^8.21.3",
    "bcryptjs": "^3.0.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.23.2",
    "input-otp": "^1.4.2",
    "jose": "^6.2.3",
    "lucide-react": "^0.525.0",
    "next": "^16.1.1",
    "next-auth": "^4.24.11",
    "next-intl": "^4.3.4",
    "next-themes": "^0.4.6",
    "prisma": "^6.11.1",
    "react": "^19.0.0",
    "react-day-picker": "^9.8.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.60.0",
    "react-markdown": "^10.1.0",
    "react-resizable-panels": "^3.0.3",
    "react-syntax-highlighter": "^15.6.1",
    "recharts": "^2.15.4",
    "sharp": "^0.34.3",
    "sonner": "^2.0.6",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "uuid": "^11.1.0",
    "vaul": "^1.1.2",
    "z-ai-web-dev-sdk": "^0.0.18",
    "zod": "^4.0.2",
    "zustand": "^5.0.6"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/bcryptjs": "^3.0.0",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "bun-types": "^1.3.4",
    "eslint": "^9",
    "eslint-config-next": "^16.1.1",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.5",
    "typescript": "^5"
  }
}
```

---

## manifest.webmanifest

**File:** `/home/z/my-project/public/manifest.webmanifest`

```json
{
  "name": "KTU One",
  "short_name": "KTU One",
  "description": "Everything a KTU Student Needs.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#faf8f5",
  "theme_color": "#9333EA",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/logo.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

---

## tsconfig.json

**File:** `/home/z/my-project/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "noImplicitAny": false,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

---
# 2. App Core

## src/app/layout.tsx

**File:** `/home/z/my-project/src/app/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Caveat, Lora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "KTU One — Everything a KTU Student Needs.",
  description:
    "The ultimate academic companion for APJ Abdul Kalam Technological University students. SGPA/CGPA calculators, question papers, syllabus, notices, calendar — all in one premium app.",
  keywords: [
    "KTU",
    "KTU One",
    "APJ Abdul Kalam Technological University",
    "SGPA Calculator",
    "CGPA Calculator",
    "KTU Question Papers",
    "KTU Syllabus",
    "KTU Notices",
  ],
  authors: [{ name: "KTU One" }],
  applicationName: "KTU One",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KTU One",
  },
  openGraph: {
    title: "KTU One — Everything a KTU Student Needs.",
    description: "Premium academic companion for KTU students.",
    type: "website",
    siteName: "KTU One",
  },
  twitter: {
    card: "summary_large_image",
    title: "KTU One",
    description: "Premium academic companion for KTU students.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCFBF8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1620" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${lora.variable} antialiased`}
      >
        {/* Ambient background blobs — fixed, behind everything */}
        <div className="ambient-blobs" aria-hidden="true">
          <div className="ambient-blob-3" />
        </div>
        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
        <Toaster />
        <SonnerToaster position="top-center" />
      </body>
    </html>
  );
}
```

---

## src/app/page.tsx

**File:** `/home/z/my-project/src/app/page.tsx`

```tsx
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
    Promise.resolve().then(() => setMounted(true));
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
          initial={mounted && !prefersReduced ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={mounted && !prefersReduced ? { opacity: 0, y: -8 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
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

```

---

## src/app/api/route.ts

**File:** `/home/z/my-project/src/app/api/route.ts`

```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}```

---
# 3. Design System (globals.css)

## src/app/globals.css

**File:** `/home/z/my-project/src/app/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* ==========================================================================
   KTU ONE — VISUAL LANGUAGE v3
   "Student Notebook + Editorial Sketchbook"
   - Paper-textured cards as the DEFAULT surface (no more glass as default)
   - Hand-drawn borders via offset double-stroke + irregular radius
   - Mixed typography: serif display + sans body + handwritten accents
   - Magazine-style composition: drop caps, editorial rules, ornaments
   - Stationery-card variants: index card, kraft, lined page, magazine
   - Warm cream / plum / coral / amber palette — never corporate
   ========================================================================== */

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-display: var(--font-display-sans);
  --font-hand: var(--font-caveat);
  --font-serif: var(--font-lora);

  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);

  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);

  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);

  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);

  --color-glass: var(--glass);
  --color-glass-border: var(--glass-border);
  --color-glass-highlight: var(--glass-highlight);
  --color-glass-tinted: var(--glass-tinted);
  --color-glass-warm: var(--glass-warm);

  --color-gradient-1: var(--gradient-1);
  --color-gradient-2: var(--gradient-2);
  --color-gradient-3: var(--gradient-3);
  --color-gradient-4: var(--gradient-4);

  --color-rose: var(--rose);
  --color-coral: var(--coral);
  --color-peach: var(--peach);
  --color-lavender: var(--lavender);
  --color-olive: var(--olive);
  --color-mint: var(--mint);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 10px);
  --radius-3xl: calc(var(--radius) + 20px);

  --shadow-soft: var(--shadow-soft);
  --shadow-elevated: var(--shadow-elevated);
  --shadow-floating: var(--shadow-floating);
  --shadow-glass: var(--shadow-glass);
  --shadow-paper: var(--shadow-paper);
}

:root {
  --radius: 1.125rem;

  /* Surfaces — warmer paper tones (more cream/beige) */
  --background: oklch(0.978 0.014 78);              /* warm cream paper */
  --foreground: oklch(0.25 0.018 50);               /* warm dark brown ink (not plum) */
  --card: oklch(0.992 0.008 78);                    /* warm white card */
  --card-foreground: oklch(0.25 0.018 50);
  --popover: oklch(0.992 0.008 78);
  --popover-foreground: oklch(0.25 0.018 50);

  /* Primary — desaturated plum (chroma 0.18 → 0.12, ~33% reduction) */
  --primary: oklch(0.50 0.12 340);
  --primary-foreground: oklch(0.99 0.008 78);

  /* Secondary — warm cream */
  --secondary: oklch(0.94 0.018 75);
  --secondary-foreground: oklch(0.32 0.025 50);

  /* Muted — warm pebble */
  --muted: oklch(0.94 0.012 75);
  --muted-foreground: oklch(0.50 0.018 65);

  /* Accent — Warm Amber (kept warm, slightly more saturated) */
  --accent: oklch(0.91 0.055 70);
  --accent-foreground: oklch(0.35 0.09 65);

  /* Status (desaturated, never neon) */
  --destructive: oklch(0.55 0.13 25);               /* reduced from 0.18 → 0.13 */
  --destructive-foreground: oklch(0.99 0.008 78);
  --success: oklch(0.58 0.09 155);
  --success-foreground: oklch(0.99 0.008 78);
  --warning: oklch(0.74 0.11 70);
  --warning-foreground: oklch(0.28 0.04 65);
  --info: oklch(0.58 0.08 220);
  --info-foreground: oklch(0.99 0.008 78);

  /* Lines — warm translucent */
  --border: oklch(0.82 0.018 65 / 0.60);
  --input: oklch(0.82 0.018 65 / 0.60);
  --ring: oklch(0.50 0.12 340);

  /* Charts — desaturated */
  --chart-1: oklch(0.52 0.12 340);                    /* plum (reduced) */
  --chart-2: oklch(0.68 0.13 70);                     /* amber */
  --chart-3: oklch(0.62 0.10 155);                    /* mint */
  --chart-4: oklch(0.58 0.12 25);                     /* coral (reduced) */
  --chart-5: oklch(0.58 0.08 280);                    /* lavender (reduced) */

  /* Glass — warmer, frosted, low transparency */
  --glass: oklch(0.99 0.008 78 / 0.55);
  --glass-border: oklch(1 0 0 / 0.45);
  --glass-highlight: oklch(1 0 0 / 0.7);
  --glass-tinted: oklch(0.95 0.018 75 / 0.6);
  --glass-warm: oklch(0.96 0.025 70 / 0.65);

  /* Signature Gradients — desaturated */
  --gradient-1: oklch(0.52 0.12 340);                 /* plum (reduced) */
  --gradient-2: oklch(0.62 0.12 20);                  /* coral (reduced) */
  --gradient-3: oklch(0.68 0.13 70);                  /* amber */
  --gradient-4: oklch(0.58 0.08 280);                 /* lavender (reduced) */

  /* Editorial palette — pinks/corals reduced ~30% */
  --rose: oklch(0.62 0.09 15);                        /* chroma 0.13 → 0.09 */
  --coral: oklch(0.65 0.10 25);                       /* chroma 0.15 → 0.10 */
  --peach: oklch(0.85 0.06 60);
  --lavender: oklch(0.66 0.055 300);                  /* chroma 0.08 → 0.055 */
  --olive: oklch(0.60 0.07 110);
  --mint: oklch(0.68 0.07 155);

  /* Sidebar */
  --sidebar: oklch(0.96 0.012 75);
  --sidebar-foreground: oklch(0.25 0.018 50);
  --sidebar-primary: oklch(0.50 0.12 340);
  --sidebar-primary-foreground: oklch(0.99 0.008 78);
  --sidebar-accent: oklch(0.92 0.018 75);
  --sidebar-accent-foreground: oklch(0.32 0.025 50);
  --sidebar-border: oklch(0.82 0.018 65 / 0.5);
  --sidebar-ring: oklch(0.50 0.12 340);

  /* Shadows — Apple-like, large blur, very low opacity, warm brown-tinted */
  --shadow-soft:
    0 1px 2px -1px oklch(0.30 0.04 50 / 0.05),
    0 4px 12px -4px oklch(0.30 0.04 50 / 0.07),
    0 8px 24px -8px oklch(0.30 0.04 50 / 0.05);
  --shadow-elevated:
    0 2px 4px -2px oklch(0.30 0.04 50 / 0.06),
    0 12px 28px -8px oklch(0.30 0.04 50 / 0.11),
    0 24px 56px -16px oklch(0.30 0.04 50 / 0.09);
  --shadow-floating:
    0 4px 8px -4px oklch(0.30 0.04 50 / 0.09),
    0 20px 48px -12px oklch(0.30 0.04 50 / 0.17),
    0 40px 96px -24px oklch(0.30 0.04 50 / 0.13);
  --shadow-glass:
    0 2px 8px -2px oklch(0.30 0.04 50 / 0.07),
    inset 0 1px 0 0 oklch(1 0 0 / 0.5);
  --shadow-paper:
    0 1px 0 oklch(1 0 0 / 0.8) inset,
    0 1px 2px oklch(0.30 0.04 50 / 0.05),
    0 4px 12px -4px oklch(0.30 0.04 50 / 0.06);
}

.dark {
  --background: oklch(0.19 0.012 50);                 /* warm dark brown ink */
  --foreground: oklch(0.95 0.008 78);
  --card: oklch(0.24 0.014 50);
  --card-foreground: oklch(0.95 0.008 78);
  --popover: oklch(0.24 0.014 50);
  --popover-foreground: oklch(0.95 0.008 78);

  --primary: oklch(0.72 0.11 340);                    /* reduced from 0.16 */
  --primary-foreground: oklch(0.19 0.012 50);

  --secondary: oklch(0.28 0.018 60);
  --secondary-foreground: oklch(0.95 0.008 78);

  --muted: oklch(0.26 0.014 60);
  --muted-foreground: oklch(0.70 0.014 65);

  --accent: oklch(0.36 0.05 70);
  --accent-foreground: oklch(0.90 0.07 70);

  --destructive: oklch(0.70 0.13 25);                 /* reduced from 0.18 */
  --destructive-foreground: oklch(0.99 0.008 78);
  --success: oklch(0.72 0.10 155);
  --success-foreground: oklch(0.19 0.012 50);
  --warning: oklch(0.78 0.11 70);
  --warning-foreground: oklch(0.22 0.04 70);
  --info: oklch(0.70 0.08 220);
  --info-foreground: oklch(0.19 0.012 50);

  --border: oklch(1 0 0 / 9%);
  --input: oklch(1 0 0 / 13%);
  --ring: oklch(0.72 0.11 340);

  --chart-1: oklch(0.72 0.11 340);
  --chart-2: oklch(0.78 0.12 70);
  --chart-3: oklch(0.72 0.10 155);
  --chart-4: oklch(0.72 0.12 25);
  --chart-5: oklch(0.70 0.08 280);

  --glass: oklch(0.24 0.014 50 / 0.5);
  --glass-border: oklch(1 0 0 / 0.08);
  --glass-highlight: oklch(1 0 0 / 0.12);
  --glass-tinted: oklch(0.28 0.018 60 / 0.55);
  --glass-warm: oklch(0.30 0.022 65 / 0.55);

  --gradient-1: oklch(0.72 0.11 340);
  --gradient-2: oklch(0.72 0.12 20);
  --gradient-3: oklch(0.78 0.12 70);
  --gradient-4: oklch(0.70 0.08 280);

  --rose: oklch(0.72 0.09 15);
  --coral: oklch(0.74 0.10 25);
  --peach: oklch(0.45 0.05 60);
  --lavender: oklch(0.72 0.06 300);
  --olive: oklch(0.68 0.07 110);
  --mint: oklch(0.72 0.08 155);

  --sidebar: oklch(0.21 0.012 50);
  --sidebar-foreground: oklch(0.95 0.008 78);
  --sidebar-primary: oklch(0.72 0.11 340);
  --sidebar-primary-foreground: oklch(0.99 0.008 78);
  --sidebar-accent: oklch(0.28 0.018 60);
  --sidebar-accent-foreground: oklch(0.95 0.008 78);
  --sidebar-border: oklch(1 0 0 / 9%);
  --sidebar-ring: oklch(0.72 0.11 340);

  --shadow-soft:
    0 1px 2px -1px oklch(0 0 0 / 0.20),
    0 4px 12px -4px oklch(0 0 0 / 0.28),
    0 8px 24px -8px oklch(0 0 0 / 0.20);
  --shadow-elevated:
    0 2px 4px -2px oklch(0 0 0 / 0.32),
    0 12px 28px -8px oklch(0 0 0 / 0.48),
    0 24px 56px -16px oklch(0 0 0 / 0.36);
  --shadow-floating:
    0 4px 8px -4px oklch(0 0 0 / 0.40),
    0 20px 48px -12px oklch(0 0 0 / 0.56),
    0 40px 96px -24px oklch(0 0 0 / 0.40);
  --shadow-glass:
    0 2px 8px -2px oklch(0 0 0 / 0.32),
    inset 0 1px 0 0 oklch(1 0 0 / 0.06);
  --shadow-paper:
    0 1px 0 oklch(1 0 0 / 0.04) inset,
    0 1px 2px oklch(0 0 0 / 0.20),
    0 4px 12px -4px oklch(0 0 0 / 0.24);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  html, body {
    @apply bg-background text-foreground;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  body {
    font-feature-settings: "ss01", "cv01", "cv02";
    position: relative;
    min-height: 100vh;
  }
  /* Paper grain — SVG noise, almost invisible */
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.15 0 0 0 0 0.25 0 0 0 1 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
    mix-blend-mode: multiply;
  }
  .dark body::before {
    opacity: 0.04;
    mix-blend-mode: screen;
  }

  /* Custom scrollbar — warmer, softer */
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: oklch(0.50 0.02 340 / 0.20);
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: oklch(0.50 0.02 340 / 0.35);
  }
}

@layer utilities {
  /* ========== GLASSMORPHISM — softer, warmer ========== */
  .glass {
    background: var(--glass);
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-glass);
  }
  .glass-strong {
    background: var(--glass-highlight);
    backdrop-filter: blur(18px) saturate(160%);
    -webkit-backdrop-filter: blur(18px) saturate(160%);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-glass);
  }
  .glass-tinted {
    background: var(--glass-tinted);
    backdrop-filter: blur(16px) saturate(150%);
    -webkit-backdrop-filter: blur(16px) saturate(150%);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-glass);
  }
  .glass-warm {
    background: var(--glass-warm);
    backdrop-filter: blur(16px) saturate(150%);
    -webkit-backdrop-filter: blur(16px) saturate(150%);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-glass);
  }
  /* Warm white card — for editorial / paper feel */
  .card-warm {
    background: var(--card);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-paper);
  }

  /* ========== SIGNATURE GRADIENTS ========== */
  .bg-gradient-plum {
    background-image: linear-gradient(135deg, var(--gradient-1) 0%, var(--gradient-2) 100%);
  }
  .bg-gradient-warm {
    background-image: linear-gradient(135deg, var(--gradient-2) 0%, var(--gradient-3) 100%);
  }
  .bg-gradient-tri {
    background-image: linear-gradient(135deg, var(--gradient-1) 0%, var(--gradient-2) 50%, var(--gradient-3) 100%);
  }
  .bg-gradient-lavender {
    background-image: linear-gradient(135deg, var(--gradient-1) 0%, var(--gradient-4) 100%);
  }
  .text-gradient-plum {
    background-image: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  /* ========== AMBIENT BACKGROUND BLOBS ========== */
  .ambient-blobs {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .ambient-blobs::before,
  .ambient-blobs::after,
  .ambient-blob-3 {
    content: "";
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
  }
  .ambient-blobs::before {
    width: 520px; height: 520px;
    top: -180px; left: -120px;
    background: radial-gradient(circle, var(--peach), transparent 70%);
  }
  .ambient-blobs::after {
    width: 600px; height: 600px;
    top: -100px; right: -200px;
    background: radial-gradient(circle, var(--lavender), transparent 70%);
    opacity: 0.28;
  }
  .ambient-blob-3 {
    width: 480px; height: 480px;
    bottom: -200px; left: 30%;
    background: radial-gradient(circle, var(--peach), transparent 70%);
    opacity: 0.22;
  }
  .dark .ambient-blobs::before { opacity: 0.18; }
  .dark .ambient-blobs::after { opacity: 0.15; }
  .dark .ambient-blob-3 { opacity: 0.12; }

  /* ========== SHADOWS ========== */
  .shadow-soft { box-shadow: var(--shadow-soft); }
  .shadow-elevated { box-shadow: var(--shadow-elevated); }
  .shadow-floating { box-shadow: var(--shadow-floating); }
  .shadow-glass { box-shadow: var(--shadow-glass); }
  .shadow-paper { box-shadow: var(--shadow-paper); }

  /* ========== GRID / DOTS ========== */
  .bg-grid {
    background-image:
      linear-gradient(to right, oklch(0.50 0.02 320 / 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, oklch(0.50 0.02 320 / 0.04) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .bg-dots {
    background-image: radial-gradient(oklch(0.50 0.02 320 / 0.12) 1px, transparent 1px);
    background-size: 18px 18px;
  }

  /* ========== SKETCH UNDERLINE — hand-drawn feel ========== */
  .sketch-underline {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8' preserveAspectRatio='none'><path d='M2 5 Q 30 1 60 4 T 118 5' stroke='oklch(0.65 0.18 20)' stroke-width='2.2' fill='none' stroke-linecap='round'/></svg>");
    background-repeat: no-repeat;
    background-position: 0 100%;
    background-size: 100% 0.32em;
    padding-bottom: 0.18em;
  }
  .sketch-circle {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60' preserveAspectRatio='none'><path d='M10 30 Q 10 8 60 8 Q 110 8 110 30 Q 110 52 60 52 Q 10 52 10 30 Z' stroke='oklch(0.65 0.18 20)' stroke-width='2' fill='none' stroke-linecap='round' stroke-dasharray='2 3'/></svg>");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
  }

  /* ========== HANDWRITTEN FONT ========== */
  .font-hand {
    font-family: var(--font-caveat), "Comic Sans MS", cursive;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  /* ========== FLOATING ANIMATION — cards gently float ========== */
  @keyframes float-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  .float-subtle {
    animation: float-subtle 6s ease-in-out infinite;
  }
  .float-subtle-slow {
    animation: float-subtle 9s ease-in-out infinite;
  }

  /* ========== TACTILE BUTTONS ========== */
  .btn-tactile {
    transition:
      transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.18s ease,
      opacity 0.18s ease;
  }
  .btn-tactile:hover {
    transform: translateY(-1px);
  }
  .btn-tactile:active {
    transform: translateY(0.5px) scale(0.985);
  }

  /* ========== NO TAP HIGHLIGHT ========== */
  .no-tap-highlight { -webkit-tap-highlight-color: transparent; }

  /* ========== SAFE AREA ========== */
  .safe-top { padding-top: env(safe-area-inset-top); }
  .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }

  /* ========== REDUCED MOTION ========== */
  @media (prefers-reduced-motion: reduce) {
    .motion-reduce, .float-subtle, .float-subtle-slow {
      animation: none !important;
      transition: none !important;
    }
  }

  /* ========== PARTICLE DOT — for hero ========== */
  .particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  /* ========== SKETCH BORDERS — hand-drawn outlines ========== */
  /* Wavy imperfect border using SVG mask */
  .sketch-border {
    position: relative;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-paper);
  }
  .sketch-border::after {
    content: "";
    position: absolute;
    inset: -1.5px;
    border-radius: inherit;
    pointer-events: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><path d='M2 8 Q 5 4 10 6 T 22 7 T 34 6 T 46 7' stroke='oklch(0.55 0.18 340)' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>");
    background-repeat: repeat-x;
    background-position: 0 0;
    background-size: 50px 8px;
    opacity: 0.25;
  }

  /* Double-stroke sketch border */
  .sketch-double {
    border: 1.5px solid var(--border);
    box-shadow:
      0 0 0 1.5px transparent,
      inset 0 0 0 4px transparent,
      4px 4px 0 0 oklch(0.55 0.18 340 / 0.08),
      var(--shadow-paper);
  }

  /* Pencil-style edge — subtle dashed warm outline */
  .sketch-pencil {
    border: 1.5px dashed oklch(0.55 0.18 340 / 0.35);
    box-shadow: var(--shadow-paper);
  }

  /* ========== NOTEBOOK RULED LINES — for hero / sticky notes ========== */
  .notebook-ruled {
    background-image:
      linear-gradient(to bottom, transparent 27px, oklch(0.55 0.18 340 / 0.08) 27px, oklch(0.55 0.18 340 / 0.08) 28px, transparent 28px);
    background-size: 100% 28px;
    background-position: 0 4px;
  }
  /* Margin red line on left — like a notebook */
  .notebook-margin {
    border-left: 1.5px solid oklch(0.62 0.18 25 / 0.25);
    padding-left: 1rem;
  }

  /* ========== PAGE FOLD — corner of a card looks folded ========== */
  .page-fold {
    position: relative;
  }
  .page-fold::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 28px;
    height: 28px;
    background:
      linear-gradient(225deg, transparent 50%, oklch(0.88 0.01 60 / 0.7) 50%, oklch(0.85 0.015 60) 100%);
    border-bottom-left-radius: 6px;
    box-shadow: -2px 2px 4px -2px oklch(0.30 0.05 340 / 0.15);
    pointer-events: none;
  }
  .dark .page-fold::before {
    background:
      linear-gradient(225deg, transparent 50%, oklch(0.30 0.015 290 / 0.8) 50%, oklch(0.26 0.012 290) 100%);
  }

  /* ========== STICKY NOTE — paper-textured yellow tint ========== */
  .sticky-note {
    background:
      linear-gradient(180deg, oklch(0.95 0.05 90) 0%, oklch(0.92 0.06 90) 100%);
    box-shadow:
      0 1px 0 oklch(0.70 0.10 80 / 0.4) inset,
      0 6px 16px -4px oklch(0.30 0.05 340 / 0.18),
      0 2px 4px -2px oklch(0.30 0.05 340 / 0.10);
    border: 1px solid oklch(0.85 0.06 80 / 0.4);
    position: relative;
  }
  .sticky-note::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/></filter><rect width='100' height='100' filter='url(%23n)' opacity='0.08'/></svg>");
    pointer-events: none;
    border-radius: inherit;
    mix-blend-mode: multiply;
  }

  /* ========== TAPE STRIP — washi tape look ========== */
  .tape-strip {
    position: absolute;
    width: 80px;
    height: 22px;
    background:
      linear-gradient(135deg, oklch(0.88 0.08 70 / 0.7) 0%, oklch(0.85 0.06 75 / 0.7) 100%);
    box-shadow: 0 2px 6px -2px oklch(0.30 0.05 340 / 0.18);
    border-radius: 1px;
    transform: rotate(-3deg);
  }

  /* ========== PAPER CLIP — metallic clip on card edge ========== */
  .paper-clip {
    position: absolute;
    top: -10px;
    right: 24px;
    width: 18px;
    height: 38px;
    border: 2px solid oklch(0.55 0.10 220 / 0.55);
    border-radius: 9px 9px 0 0;
    border-bottom: none;
    pointer-events: none;
  }
  .paper-clip::after {
    content: "";
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 22px;
    border: 2px solid oklch(0.55 0.10 220 / 0.55);
    border-top: none;
    border-radius: 0 0 4px 4px;
  }

  /* ========== TACTILE BUTTON — premium tactile feel ========== */
  .btn-tactile-warm {
    background:
      linear-gradient(180deg, oklch(1 0 0 / 0.5) 0%, oklch(1 0 0 / 0) 60%),
      var(--primary);
    background-blend-mode: overlay;
    box-shadow:
      0 1px 0 oklch(1 0 0 / 0.3) inset,
      0 -1px 0 oklch(0 0 0 / 0.08) inset,
      0 2px 6px -2px oklch(0.30 0.05 340 / 0.20),
      0 6px 16px -4px oklch(0.30 0.05 340 / 0.15);
    transition:
      transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.18s ease;
  }
  .btn-tactile-warm:hover {
    transform: translateY(-1px);
    box-shadow:
      0 1px 0 oklch(1 0 0 / 0.3) inset,
      0 -1px 0 oklch(0 0 0 / 0.08) inset,
      0 4px 10px -2px oklch(0.30 0.05 340 / 0.25),
      0 10px 24px -6px oklch(0.30 0.05 340 / 0.22);
  }
  .btn-tactile-warm:active {
    transform: translateY(0.5px) scale(0.985);
    box-shadow:
      0 1px 0 oklch(1 0 0 / 0.2) inset,
      0 -1px 0 oklch(0 0 0 / 0.12) inset,
      0 2px 4px -1px oklch(0.30 0.05 340 / 0.20);
  }

  /* ========== HANDWRITTEN NOTE — for sticky-note text ========== */
  .handwritten-note {
    font-family: var(--font-caveat), "Comic Sans MS", cursive;
    font-weight: 500;
    line-height: 1.4;
  }

  /* ========== SKETCH CORNER DECORATION — small doodle in corner ========== */
  .sketch-corner-tl::before,
  .sketch-corner-tr::before,
  .sketch-corner-bl::before,
  .sketch-corner-br::before {
    content: "";
    position: absolute;
    width: 24px;
    height: 24px;
    pointer-events: none;
    opacity: 0.5;
  }
  .sketch-corner-tl::before {
    top: 6px; left: 6px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M3 3 L 10 3 M3 3 L 3 10' stroke='oklch(0.55 0.18 340)' stroke-width='1.8' fill='none' stroke-linecap='round'/><circle cx='3' cy='3' r='1.5' fill='oklch(0.55 0.18 340)'/></svg>");
  }
  .sketch-corner-tr::before {
    top: 6px; right: 6px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M14 3 L 21 3 M21 3 L 21 10' stroke='oklch(0.55 0.18 340)' stroke-width='1.8' fill='none' stroke-linecap='round'/><circle cx='21' cy='3' r='1.5' fill='oklch(0.55 0.18 340)'/></svg>");
  }
  .sketch-corner-bl::before {
    bottom: 6px; left: 6px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M3 14 L 3 21 M3 21 L 10 21' stroke='oklch(0.55 0.18 340)' stroke-width='1.8' fill='none' stroke-linecap='round'/><circle cx='3' cy='21' r='1.5' fill='oklch(0.55 0.18 340)'/></svg>");
  }
  .sketch-corner-br::before {
    bottom: 6px; right: 6px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M14 21 L 21 21 M21 14 L 21 21' stroke='oklch(0.55 0.18 340)' stroke-width='1.8' fill='none' stroke-linecap='round'/><circle cx='21' cy='21' r='1.5' fill='oklch(0.55 0.18 340)'/></svg>");
  }

  /* ====================================================================== */
  /* v3 — PAPER CARD (default surface, replaces glass as default)            */
  /* ====================================================================== */
  /* Hand-drawn border via offset double-stroke + slightly irregular radius  */
  /* v3.1 — warmer cream paper, brown ink border (not plum), more imperfect  */
  .paper-card {
    background: oklch(0.99 0.01 78);
    border: 1.5px solid oklch(0.30 0.04 50 / 0.55);
    border-radius: 17px 15px 18px 14px;
    box-shadow:
      3px 3px 0 0 oklch(0.30 0.04 50 / 0.08),
      0 1px 2px -1px oklch(0.30 0.04 50 / 0.05),
      0 4px 12px -4px oklch(0.30 0.04 50 / 0.06);
    position: relative;
  }
  .paper-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.25 0 0 0 0 0.15 0 0 0 1 0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>");
    opacity: 0.04;
    pointer-events: none;
    mix-blend-mode: multiply;
  }
  /* Slightly imperfect inner edge — like a hand-drawn line just inside the border */
  .paper-card::after {
    content: "";
    position: absolute;
    inset: 4px;
    border-radius: 13px 11px 14px 10px;
    border: 0.5px solid oklch(0.30 0.04 50 / 0.10);
    pointer-events: none;
  }
  .dark .paper-card {
    background: oklch(0.25 0.014 50);
    border-color: oklch(0.95 0.008 78 / 0.25);
    box-shadow:
      3px 3px 0 0 oklch(0 0 0 / 0.22),
      0 1px 2px -1px oklch(0 0 0 / 0.18),
      0 4px 12px -4px oklch(0 0 0 / 0.28);
  }
  .dark .paper-card::before {
    opacity: 0.05;
    mix-blend-mode: screen;
  }
  .dark .paper-card::after {
    border-color: oklch(0.95 0.008 78 / 0.06);
  }

  /* Paper card hover — lifts like a page being turned */
  .paper-card-hover {
    transition:
      transform 0.28s cubic-bezier(0.34, 1.4, 0.64, 1),
      box-shadow 0.28s ease;
  }
  .paper-card-hover:hover {
    transform: translateY(-2px) rotate(-0.3deg);
    box-shadow:
      5px 6px 0 0 oklch(0.30 0.04 50 / 0.10),
      0 2px 4px -1px oklch(0.30 0.04 50 / 0.08),
      0 8px 20px -6px oklch(0.30 0.04 50 / 0.10);
  }

  /* ====================================================================== */
  /* v3.1 — NOTEBOOK COVER (editorial hero, replaces gradient cover)         */
  /* ====================================================================== */
  /* Cream paper with embossed feel, spiral-binding accent on left edge      */
  .notebook-cover {
    background:
      linear-gradient(180deg, oklch(0.99 0.012 78) 0%, oklch(0.97 0.018 75) 100%);
    border: 2px solid oklch(0.30 0.04 50 / 0.45);
    border-radius: 18px 20px 18px 20px;
    box-shadow:
      4px 5px 0 0 oklch(0.30 0.04 50 / 0.10),
      0 2px 4px -1px oklch(0.30 0.04 50 / 0.06),
      0 12px 32px -8px oklch(0.30 0.04 50 / 0.12);
    position: relative;
    overflow: hidden;
  }
  /* Paper grain */
  .notebook-cover::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.25 0 0 0 0 0.15 0 0 0 1 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
    opacity: 0.06;
    pointer-events: none;
    mix-blend-mode: multiply;
  }
  /* Spiral binding — small circles down the left edge */
  .notebook-cover::after {
    content: "";
    position: absolute;
    top: 16px;
    bottom: 16px;
    left: 8px;
    width: 14px;
    background-image: radial-gradient(circle at center, oklch(0.30 0.04 50 / 0.30) 2px, transparent 2.5px);
    background-size: 14px 28px;
    background-position: center top;
    background-repeat: repeat-y;
    pointer-events: none;
  }
  .dark .notebook-cover {
    background:
      linear-gradient(180deg, oklch(0.27 0.016 50) 0%, oklch(0.24 0.014 50) 100%);
    border-color: oklch(0.95 0.008 78 / 0.20);
    box-shadow:
      4px 5px 0 0 oklch(0 0 0 / 0.30),
      0 2px 4px -1px oklch(0 0 0 / 0.20),
      0 12px 32px -8px oklch(0 0 0 / 0.40);
  }
  .dark .notebook-cover::before {
    opacity: 0.08;
    mix-blend-mode: screen;
  }
  .dark .notebook-cover::after {
    background-image: radial-gradient(circle at center, oklch(0.95 0.008 78 / 0.20) 2px, transparent 2.5px);
  }

  /* Embossed title for light paper background — uses dark ink shadow */
  .embossed-title-ink {
    text-shadow:
      0 1px 0 oklch(1 0 0 / 0.6),
      0 -1px 0 oklch(0.30 0.04 50 / 0.18),
      0 2px 3px oklch(0.30 0.04 50 / 0.10);
    letter-spacing: -0.02em;
    color: oklch(0.25 0.018 50);
  }
  .dark .embossed-title-ink {
    color: oklch(0.95 0.008 78);
    text-shadow:
      0 1px 0 oklch(1 0 0 / 0.10),
      0 -1px 0 oklch(0 0 0 / 0.40),
      0 2px 3px oklch(0 0 0 / 0.30);
  }

  /* ====================================================================== */
  /* v3.1 — NOTEBOOK TAB CARD (for Quick Action cards)                       */
  /* ====================================================================== */
  /* Like a notebook divider card — colored top tab, ruled line under title  */
  .notebook-tab {
    background: oklch(0.99 0.01 78);
    border: 1.5px solid oklch(0.30 0.04 50 / 0.50);
    border-radius: 14px 13px 15px 12px;
    box-shadow:
      2px 2px 0 0 oklch(0.30 0.04 50 / 0.07),
      0 1px 2px -1px oklch(0.30 0.04 50 / 0.04),
      0 4px 10px -4px oklch(0.30 0.04 50 / 0.05);
    position: relative;
    overflow: hidden;
  }
  /* Colored top tab strip — like a notebook divider */
  .notebook-tab::before {
    content: "";
    position: absolute;
    top: 0;
    left: 12px;
    right: 12px;
    height: 5px;
    background: var(--tab-color, oklch(0.50 0.12 340));
    border-radius: 0 0 3px 3px;
    opacity: 0.85;
  }
  /* Paper grain */
  .notebook-tab::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.25 0 0 0 0 0.15 0 0 0 1 0'/></filter><rect width='140' height='140' filter='url(%23n)'/></svg>");
    opacity: 0.035;
    pointer-events: none;
    mix-blend-mode: multiply;
  }
  .dark .notebook-tab {
    background: oklch(0.26 0.014 50);
    border-color: oklch(0.95 0.008 78 / 0.22);
    box-shadow:
      2px 2px 0 0 oklch(0 0 0 / 0.20),
      0 1px 2px -1px oklch(0 0 0 / 0.16),
      0 4px 10px -4px oklch(0 0 0 / 0.24);
  }
  .dark .notebook-tab::after {
    opacity: 0.05;
    mix-blend-mode: screen;
  }
  .notebook-tab-hover {
    transition:
      transform 0.28s cubic-bezier(0.34, 1.4, 0.64, 1),
      box-shadow 0.28s ease;
  }
  .notebook-tab-hover:hover {
    transform: translateY(-3px) rotate(-0.5deg);
    box-shadow:
      4px 5px 0 0 oklch(0.30 0.04 50 / 0.10),
      0 2px 4px -1px oklch(0.30 0.04 50 / 0.06),
      0 8px 18px -6px oklch(0.30 0.04 50 / 0.08);
  }

  /* ====================================================================== */
  /* v3 — INDEX CARD (for stat cards, pinned-to-corkboard feel)              */
  /* ====================================================================== */
  .index-card {
    background: oklch(0.99 0.01 78);
    border: 1.5px solid oklch(0.30 0.04 50 / 0.50);
    border-radius: 11px 13px 10px 12px;
    box-shadow:
      2px 2px 0 0 oklch(0.30 0.04 50 / 0.07),
      0 1px 2px -1px oklch(0.30 0.04 50 / 0.04);
    position: relative;
    overflow: hidden;
  }
  .index-card::before {
    /* Top rule — warm amber instead of red (reduces pink) */
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background:
      linear-gradient(90deg,
        oklch(0.62 0.11 70 / 0.75) 0%,
        oklch(0.62 0.11 70 / 0.55) 60%,
        oklch(0.62 0.11 70 / 0.35) 100%);
  }
  .index-card::after {
    /* Paper grain */
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.25 0 0 0 0 0.15 0 0 0 1 0'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>");
    opacity: 0.04;
    pointer-events: none;
    mix-blend-mode: multiply;
  }
  .dark .index-card {
    background: oklch(0.26 0.014 50);
    border-color: oklch(0.95 0.008 78 / 0.22);
  }
  .dark .index-card::after { opacity: 0.05; mix-blend-mode: screen; }

  /* ====================================================================== */
  /* v3 — KRAFT CARD (brown paper, for warm/editorial blocks)                */
  /* ====================================================================== */
  .kraft-card {
    background: oklch(0.88 0.045 65);
    border: 1.5px solid oklch(0.40 0.06 50 / 0.50);
    border-radius: 15px 13px 16px 14px;
    box-shadow:
      3px 3px 0 0 oklch(0.40 0.06 50 / 0.12),
      0 4px 12px -4px oklch(0.30 0.04 50 / 0.10);
    position: relative;
  }
  .kraft-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.25 0 0 0 0 0.15 0 0 0 1 0'/></filter><rect width='140' height='140' filter='url(%23n)'/></svg>");
    opacity: 0.12;
    pointer-events: none;
    mix-blend-mode: multiply;
  }
  .dark .kraft-card {
    background: oklch(0.31 0.025 60);
    border-color: oklch(0.70 0.04 60 / 0.40);
  }

  /* ====================================================================== */
  /* v3 — LINED PAGE (notebook ruled paper as card identity)                 */
  /* ====================================================================== */
  .lined-page {
    background: oklch(0.99 0.008 78);
    border: 1.5px solid oklch(0.30 0.04 50 / 0.50);
    border-radius: 13px 11px 14px 12px;
    box-shadow:
      2px 2px 0 0 oklch(0.30 0.04 50 / 0.07),
      0 4px 12px -4px oklch(0.30 0.04 50 / 0.06);
    background-image:
      linear-gradient(to bottom, transparent 27px, oklch(0.50 0.12 340 / 0.08) 27px, oklch(0.50 0.12 340 / 0.08) 28px, transparent 28px);
    background-size: 100% 28px;
    background-position: 0 8px;
    position: relative;
  }
  .lined-page::before {
    /* Left margin line — amber instead of red (reduces pink) */
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 32px;
    width: 1.5px;
    background: oklch(0.62 0.11 70 / 0.35);
    pointer-events: none;
  }
  .dark .lined-page {
    background: oklch(0.25 0.014 50);
    border-color: oklch(0.95 0.008 78 / 0.22);
    background-image:
      linear-gradient(to bottom, transparent 27px, oklch(0.95 0.008 78 / 0.07) 27px, oklch(0.95 0.008 78 / 0.07) 28px, transparent 28px);
  }
  .dark .lined-page::before { background: oklch(0.62 0.11 70 / 0.50); }

  /* ====================================================================== */
  /* v3 — MAGAZINE CARD (editorial, with drop-cap support)                   */
  /* ====================================================================== */
  .magazine-card {
    background: oklch(0.99 0.01 78);
    border: 1px solid oklch(0.30 0.04 50 / 0.18);
    border-radius: 5px 4px 5px 4px;
    box-shadow:
      0 1px 2px -1px oklch(0.30 0.04 50 / 0.04),
      0 8px 24px -8px oklch(0.30 0.04 50 / 0.08);
    position: relative;
  }
  .magazine-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.25 0 0 0 0 0.15 0 0 0 1 0'/></filter><rect width='140' height='140' filter='url(%23n)'/></svg>");
    opacity: 0.03;
    pointer-events: none;
    mix-blend-mode: multiply;
  }
  .dark .magazine-card {
    background: oklch(0.25 0.014 50);
    border-color: oklch(0.95 0.008 78 / 0.10);
  }

  /* ====================================================================== */
  /* v3 — EDITORIAL TYPOGRAPHY UTILITIES                                    */
  /* ====================================================================== */
  .font-serif-display {
    font-family: var(--font-lora), Georgia, "Times New Roman", serif;
    font-weight: 600;
    letter-spacing: -0.015em;
  }
  .font-handwritten {
    font-family: var(--font-caveat), "Comic Sans MS", cursive;
    font-weight: 600;
  }

  /* Drop cap — first letter of paragraph, magazine-style */
  .drop-cap::first-letter {
    font-family: var(--font-lora), Georgia, serif;
    font-weight: 700;
    font-size: 3.4em;
    line-height: 0.85;
    float: left;
    margin: 0.08em 0.12em 0 0;
    color: oklch(0.50 0.12 340);
  }
  .dark .drop-cap::first-letter {
    color: oklch(0.72 0.11 340);
  }

  /* Stamped number — feels like rubber-stamped ink, warm brown */
  .stamped-number {
    font-family: var(--font-lora), Georgia, serif;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: oklch(0.30 0.04 50);
    text-shadow:
      0.5px 0.5px 0 oklch(0.30 0.04 50 / 0.7),
      -0.3px -0.3px 0 oklch(0.50 0.12 340 / 0.3);
    font-variant-numeric: tabular-nums;
  }
  .dark .stamped-number {
    color: oklch(0.92 0.012 75);
    text-shadow:
      0.5px 0.5px 0 oklch(0.95 0.008 78 / 0.4),
      -0.3px -0.3px 0 oklch(0.72 0.11 340 / 0.25);
  }

  /* ====================================================================== */
  /* v3 — EDITORIAL DIVIDER (magazine-style rule with ornament)              */
  /* ====================================================================== */
  .editorial-rule {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 8px 0;
  }
  .editorial-rule::before,
  .editorial-rule::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, oklch(0.30 0.08 340 / 0.20), transparent);
  }
  .dark .editorial-rule::before,
  .dark .editorial-rule::after {
    background: linear-gradient(90deg, transparent, oklch(0.95 0.005 75 / 0.15), transparent);
  }

  /* ====================================================================== */
  /* v3 — TAPE CORNER (washi tape fixing a card to the page)                */
  /* ====================================================================== */
  .tape-corner-tl,
  .tape-corner-tr {
    position: absolute;
    width: 70px;
    height: 20px;
    background:
      linear-gradient(135deg,
        oklch(0.88 0.08 70 / 0.65) 0%,
        oklch(0.85 0.06 75 / 0.55) 50%,
        oklch(0.88 0.08 70 / 0.65) 100%);
    box-shadow: 0 2px 4px -2px oklch(0.30 0.05 340 / 0.20);
    pointer-events: none;
  }
  .tape-corner-tl {
    top: -8px;
    left: 16px;
    transform: rotate(-4deg);
  }
  .tape-corner-tr {
    top: -8px;
    right: 16px;
    transform: rotate(3deg);
  }

  /* ====================================================================== */
  /* v3 — EMBOSSED TITLE (for hero — feels pressed into notebook cover)      */
  /* ====================================================================== */
  .embossed-title {
    text-shadow:
      0 1px 0 oklch(1 0 0 / 0.25),
      0 -1px 0 oklch(0 0 0 / 0.15),
      0 2px 4px oklch(0 0 0 / 0.20);
    letter-spacing: -0.02em;
  }

  /* ====================================================================== */
  /* v3 — PIN (pushpin on corkboard, for stat cards)                         */
  /* ====================================================================== */
  .pushpin {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, oklch(0.70 0.18 25), oklch(0.50 0.20 25));
    box-shadow:
      0 2px 4px -1px oklch(0 0 0 / 0.30),
      inset -1px -1px 2px oklch(0 0 0 / 0.20),
      inset 1px 1px 2px oklch(1 0 0 / 0.40);
    z-index: 2;
  }
}
```

---
# 4. Domain Types & Constants

## src/lib/types/index.ts

**File:** `/home/z/my-project/src/lib/types/index.ts`

```tsx
/**
 * KTU One — Core Domain Types
 * These types model the entities surfaced across the application.
 * They are platform-agnostic and provider-agnostic.
 */

export type ID = string;
export type ISODate = string; // ISO 8601
export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/* ---------- Academic structure ---------- */

export type BranchCode =
  | "CSE"
  | "EC"
  | "EEE"
  | "ME"
  | "CE"
  | "IT"
  | "AE"
  | "IE";

export interface Branch {
  code: BranchCode;
  name: string;
  fullName: string;
}

export interface Semester {
  number: SemesterNumber;
  branchCode: BranchCode;
  academicYear: string; // e.g. "2025-2026"
  totalCredits: number;
}

export type SubjectType = "CORE" | "ELECTIVE" | "LAB" | "PROJECT" | "HONORS";

export interface Subject {
  id: ID;
  code: string; // e.g. "CST201"
  name: string;
  semester: SemesterNumber;
  branchCode: BranchCode;
  credits: number;
  type: SubjectType;
  isElective: boolean;
  isLab: boolean;
}

/* ---------- Student ---------- */

export interface StudentProfile {
  id: ID;
  registerNumber: string;
  name: string;
  branchCode: BranchCode;
  branchName: string;
  semester: SemesterNumber;
  email?: string;
  phone?: string;
  admissionYear: number;
  scheme: string; // e.g. "2019 Scheme"
  avatarInitials: string;
}

export interface SubjectResult {
  subjectCode: string;
  subjectName: string;
  credits: number;
  grade: Grade;
  gradePoint: number;
  passed: boolean;
}

export type Grade = "O" | "A+" | "A" | "B+" | "B" | "C" | "P" | "F" | "I" | "Absent";

export const GRADE_POINTS: Record<Grade, number> = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  P: 4,
  F: 0,
  I: 0,
  Absent: 0,
};

export interface SemesterResult {
  semester: SemesterNumber;
  subjects: SubjectResult[];
  sgpa: number;
  totalCredits: number;
  creditsEarned: number;
}

export interface CGPAResult {
  cgpa: number;
  totalCredits: number;
  creditsEarned: number;
  semesters: SemesterResult[];
}

export interface AttendanceRecord {
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number;
  atRisk: boolean; // < 75%
}

/* ---------- Question Papers ---------- */

export type ExamType = "END_SEM" | "SERIES_1" | "SERIES_2" | "MODEL";

export interface QuestionPaper {
  id: ID;
  title: string;
  subjectCode: string;
  subjectName: string;
  semester: SemesterNumber;
  branchCode: BranchCode;
  year: number;
  month: number;
  examType: ExamType;
  fileUrl: string;
  fileSizeBytes: number;
  pageCount: number;
  downloads: number;
  views: number;
  uploadedAt: ISODate;
  bookmarked?: boolean;
}

/* ---------- Syllabus ---------- */

export interface Syllabus {
  id: ID;
  title: string;
  semester: SemesterNumber;
  branchCode: BranchCode;
  subjectCode: string;
  subjectName: string;
  version: string;
  fileUrl: string;
  lastUpdated: ISODate;
  modules: number;
  bookmarked?: boolean;
}

/* ---------- Notices ---------- */

export type NoticePriority = "Pinned" | "High" | "Normal" | "Low";
export type NoticeCategory =
  | "Academic"
  | "Examination"
  | "Scholarship"
  | "Placement"
  | "Cultural"
  | "General";

export interface KTUNotice {
  id: ID;
  title: string;
  description: string;
  category: NoticeCategory;
  publishedAt: ISODate;
  priority: NoticePriority;
  pdfUrl?: string;
  externalUrl?: string;
  tags: string[];
  pinned: boolean;
  active: boolean;
  read?: boolean;
}

/* ---------- Calendar ---------- */

export type CalendarEventType =
  | "EXAM"
  | "HOLIDAY"
  | "RESULT"
  | "REGISTRATION"
  | "WORKSHOP"
  | "DEADLINE"
  | "EVENT";

export interface CalendarEvent {
  id: ID;
  title: string;
  description: string;
  type: CalendarEventType;
  startDate: ISODate;
  endDate: ISODate;
  allDay: boolean;
  color: string; // hex
  reminderEnabled: boolean;
}

/* ---------- Calculators ---------- */

export type CalculatorType =
  | "SGPA"
  | "CGPA"
  | "ATTENDANCE"
  | "INTERNAL_MARKS"
  | "PASS_CALCULATOR";

export interface CalculatorCourse {
  id: string;
  subjectCode?: string;
  subjectName: string;
  credits: number;
  grade: Grade; // for SGPA
  internalMarks?: number; // for Internal
  seriesMarks?: number;
  assignmentMarks?: number;
  attended?: number; // for Attendance
  total?: number;
  currentGrade?: number;
}

export interface CalculatorResult {
  type: CalculatorType;
  value: number;
  percentage?: number;
  meta?: Record<string, number | string>;
  computedAt: ISODate;
}

export interface CalculatorHistoryEntry {
  id: ID;
  type: CalculatorType;
  input: Record<string, unknown>;
  output: CalculatorResult;
  createdAt: ISODate;
  label?: string;
}

/* ---------- Search ---------- */

export type SearchKind =
  | "subject"
  | "paper"
  | "syllabus"
  | "notice"
  | "calendar"
  | "history"
  | "bookmark";

export interface SearchResult {
  id: ID;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  href?: string;
  meta?: Record<string, string | number>;
}

export interface RecentSearch {
  id: ID;
  query: string;
  searchedAt: ISODate;
}

/* ---------- Bookmarks ---------- */

export interface Bookmark {
  id: ID;
  kind: SearchKind;
  refId: ID;
  title: string;
  subtitle?: string;
  createdAt: ISODate;
}

/* ---------- Supporter ---------- */

export type PaymentStatus = "Pending" | "Success" | "Failed" | "Refunded";
export type PaymentProvider = "Mock" | "Razorpay";

export interface SupporterPurchase {
  id: ID;
  studentId?: ID;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  transactionId: string;
  receiptUrl?: string;
  purchasedAt: ISODate;
}

export interface SupporterStatus {
  isSupporter: boolean;
  purchasedAt?: ISODate;
  transactionId?: string;
  badge: "Lifetime Supporter" | null;
}

/* ---------- Settings ---------- */

export type ThemeMode = "light" | "dark" | "system";

export interface AppPreferences {
  theme: ThemeMode;
  reduceMotion: boolean;
  compactMode: boolean;
  language: "en" | "ml";
  defaultBranch?: BranchCode;
  defaultSemester?: SemesterNumber;
  showAds: boolean;
}

/* ---------- Notifications ---------- */

export type NotificationKind = "success" | "warning" | "error" | "info";

export interface AppNotification {
  id: ID;
  kind: NotificationKind;
  title: string;
  message?: string;
  createdAt: ISODate;
  read: boolean;
}

/* ---------- Auth ---------- */

export interface AuthSession {
  studentId: ID;
  registerNumber: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
  issuedAt: number;
}

export interface LoginCredentials {
  registerNumber: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  student: Pick<
    StudentProfile,
    "id" | "name" | "branchCode" | "branchName" | "semester" | "registerNumber" | "avatarInitials"
  >;
}
```

---

## src/lib/constants/index.ts

**File:** `/home/z/my-project/src/lib/constants/index.ts`

```tsx
import type {
  BranchCode,
  Branch,
  SemesterNumber,
  Grade,
} from "@/lib/types";

export const APP_NAME = "KTU One";
export const APP_TAGLINE = "Everything a KTU Student Needs.";
export const APP_VERSION = "1.0.0-alpha";
export const SUPPORTER_PRICE_INR = 99;

export const BRANCHES: Branch[] = [
  { code: "CSE", name: "CSE", fullName: "Computer Science & Engineering" },
  { code: "EC", name: "EC", fullName: "Electronics & Communication" },
  { code: "EEE", name: "EEE", fullName: "Electrical & Electronics Engineering" },
  { code: "ME", name: "ME", fullName: "Mechanical Engineering" },
  { code: "CE", name: "CE", fullName: "Civil Engineering" },
  { code: "IT", name: "IT", fullName: "Information Technology" },
  { code: "AE", name: "AE", fullName: "Automobile Engineering" },
  { code: "IE", name: "IE", fullName: "Industrial Engineering" },
];

export const BRANCH_CODE_LIST: BranchCode[] = BRANCHES.map((b) => b.code);

export const SEMESTERS: SemesterNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];

export const GRADE_OPTIONS: Grade[] = ["O", "A+", "A", "B+", "B", "C", "P", "F"];

export const GRADE_LABELS: Record<Grade, string> = {
  O: "O — Outstanding (10)",
  "A+": "A+ — Excellent (9)",
  A: "A — Very Good (8)",
  "B+": "B+ — Good (7)",
  B: "B — Above Average (6)",
  C: "C — Average (5)",
  P: "P — Pass (4)",
  F: "F — Fail (0)",
  I: "I — Incomplete",
  Absent: "Absent",
};

export const SCHEME = "2019 Scheme";
export const UNIVERSITY_NAME = "APJ Abdul Kalam Technological University";

export const NAV_ITEMS = [
  { key: "dashboard", label: "Home", icon: "Home" },
  { key: "calculators", label: "Calculators", icon: "Calculator" },
  { key: "papers", label: "Papers", icon: "FileText" },
  { key: "syllabus", label: "Syllabus", icon: "BookOpen" },
  { key: "calendar", label: "Calendar", icon: "CalendarDays" },
  { key: "notices", label: "Notices", icon: "Bell" },
  { key: "settings", label: "Settings", icon: "Settings" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];

export const PRIMARY_NAV_KEYS: NavKey[] = [
  "dashboard",
  "calculators",
  "papers",
  "calendar",
];

export const CALCULATORS = [
  {
    key: "sgpa",
    title: "SGPA Calculator",
    description: "Compute Semester Grade Point Average for any semester.",
    icon: "Trophy",
    accent: "plum",
  },
  {
    key: "cgpa",
    title: "CGPA Calculator",
    description: "Cumulative Grade Point Average across all semesters.",
    icon: "Award",
    accent: "amber",
  },
  {
    key: "attendance",
    title: "Attendance Calculator",
    description: "Track attendance and predict how many classes to attend.",
    icon: "CalendarCheck",
    accent: "mint",
  },
  {
    key: "internal",
    title: "Internal Marks",
    description: "Estimate internal marks from series + assignment + attendance.",
    icon: "ClipboardList",
    accent: "coral",
  },
  {
    key: "pass",
    title: "Pass Calculator",
    description: "Find the marks you need in end-sem to pass a subject.",
    icon: "Target",
    accent: "plum",
  },
] as const;

export type CalculatorKey = (typeof CALCULATORS)[number]["key"];
```

---

## src/lib/utils.ts

**File:** `/home/z/my-project/src/lib/utils.ts`

```tsx
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---
# 5. Provider Architecture

## PlatformProvider

**File:** `/home/z/my-project/src/lib/providers/platform.ts`

```tsx
/**
 * PlatformProvider — abstracts the runtime platform (Web / Android / iOS).
 *
 * Providers across the app may switch implementations based on the platform.
 * The UI never branches on platform — it asks PlatformProvider.
 */

export type Platform = "web" | "android" | "ios";

export interface PlatformInfo {
  platform: Platform;
  isNative: boolean; // android or ios
  isWeb: boolean;
  isPWA: boolean;
  isStandalone: boolean; // running as installed PWA
  version: string;
}

export interface PlatformProvider {
  getInfo(): PlatformInfo;
  /**
   * Returns a secure-storage-capable flag.
   * Native platforms use SecureStorage; web uses cookies/sessionStorage.
   */
  supportsSecureStorage(): boolean;
  /**
   * Haptic feedback (no-op on web without vibration support).
   */
  haptic?(kind: "light" | "medium" | "heavy" | "success" | "error"): void;
}

class WebPlatformProvider implements PlatformProvider {
  getInfo(): PlatformInfo {
    const isStandalone =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(display-mode: standalone)").matches ||
        (window.navigator as { standalone?: boolean }).standalone === true);
    return {
      platform: "web",
      isNative: false,
      isWeb: true,
      isPWA: isStandalone,
      isStandalone,
      version: "1.0.0",
    };
  }

  supportsSecureStorage(): boolean {
    return typeof document !== "undefined" && "cookie" in document;
  }

  haptic(kind: "light" | "medium" | "heavy" | "success" | "error") {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      const patterns: Record<string, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 40,
        success: [10, 30, 10],
        error: [40, 30, 40],
      };
      navigator.vibrate(patterns[kind] as number | number[]);
    }
  }
}

let _instance: PlatformProvider | null = null;

export function getPlatformProvider(): PlatformProvider {
  if (!_instance) {
    _instance = new WebPlatformProvider();
  }
  return _instance;
}

export function __setPlatformProvider(p: PlatformProvider) {
  _instance = p;
}
```

---

## StorageProvider

**File:** `/home/z/my-project/src/lib/providers/storage.ts`

```tsx
/**
 * StorageProvider — abstracts persistent key/value storage.
 *
 * Web MVP: localStorage.
 * Future: Cloudflare R2 (for files), IndexedDB (for large blobs).
 * Native: Capacitor Preferences / SecureStorage.
 *
 * Pages and features NEVER call localStorage directly — they go through this.
 */

export interface StorageProvider {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(prefix?: string): Promise<void>;
  keys(): Promise<string[]>;
}

const PREFIX = "ktu_one:";

class LocalStorageProvider implements StorageProvider {
  async get<T = unknown>(key: string): Promise<T | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // quota exceeded — silently fail; production would evict oldest
    }
  }

  async remove(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(PREFIX + key);
  }

  async clear(prefix?: string): Promise<void> {
    if (typeof window === "undefined") return;
    const fullPrefix = PREFIX + (prefix ?? "");
    const all = Object.keys(window.localStorage).filter((k) =>
      k.startsWith(fullPrefix),
    );
    for (const k of all) window.localStorage.removeItem(k);
  }

  async keys(): Promise<string[]> {
    if (typeof window === "undefined") return [];
    return Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .map((k) => k.slice(PREFIX.length));
  }
}

let _instance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!_instance) _instance = new LocalStorageProvider();
  return _instance;
}

export const STORAGE_KEYS = {
  authSession: "auth:session",
  preferences: "app:preferences",
  supporterStatus: "supporter:status",
  calculatorHistory: "calc:history",
  bookmarks: "bookmarks",
  recentSearches: "search:recent",
  cachedProfile: "cache:profile",
  cachedResults: "cache:results",
  cachedAttendance: "cache:attendance",
  cachedCGPA: "cache:cgpa",
  lastSync: "sync:last",
} as const;
```

---

## StudentService (interface + Mock impl)

**File:** `/home/z/my-project/src/lib/providers/student.ts`

```tsx
/**
 * StudentService — the SINGLE gateway to student academic data.
 *
 * Pages, components, and features NEVER directly call backend endpoints.
 * They always go through StudentService.
 *
 * Currently backed by a Mock implementation that returns realistic
 * fixture data. When the real backend is ready, swap MockStudentService
 * for HttpStudentService — no UI code changes.
 */

import type {
  AuthSession,
  AttendanceRecord,
  CGPAResult,
  LoginCredentials,
  LoginResponse,
  SemesterResult,
  StudentProfile,
} from "@/lib/types";
import {
  MOCK_STUDENT,
  MOCK_CGPA,
  MOCK_SEMESTER_RESULTS,
  MOCK_ATTENDANCE,
} from "@/data/mock-data";

export interface StudentService {
  /** Restore session on app boot. Returns true if session is usable. */
  initialize(): Promise<boolean>;

  /** Login using KTU credentials. Stores tokens, returns minimal student. */
  login(credentials: LoginCredentials): Promise<LoginResponse>;

  /** Logout everywhere — clear local session + notify backend. */
  logout(): Promise<void>;

  /** Check current session validity. */
  isAuthenticated(): boolean;

  /** Refresh the access token using the refresh token. */
  refreshSession(): Promise<boolean>;

  /** Get the latest student profile (from cache or backend). */
  getProfile(): Promise<StudentProfile>;

  /** Get semester results. */
  getResults(): Promise<SemesterResult[]>;

  /** Get CGPA summary. */
  getCGPA(): Promise<CGPAResult>;

  /** Get attendance per subject. */
  getAttendance(): Promise<AttendanceRecord[]>;

  /** Re-sync all cached academic data. Returns last-sync timestamp. */
  sync(): Promise<number>;

  /** Clear all cached academic data (used on logout or manual refresh). */
  clearCache(): Promise<void>;

  /** Subscribe to auth state changes. Returns unsubscribe fn. */
  onAuthChange(listener: (session: AuthSession | null) => void): () => void;
}

/* ---------- Mock Implementation ---------- */

const MOCK_TOKEN = "mock.jwt.accessToken";
const MOCK_REFRESH = "mock.refresh.token";
const MOCK_LATENCY = 350; // ms — simulate network

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type AuthListener = (session: AuthSession | null) => void;

class MockStudentService implements StudentService {
  private session: AuthSession | null = null;
  private listeners = new Set<AuthListener>();

  async initialize(): Promise<boolean> {
    await delay(150);
    // Mock: no persisted session — student must log in.
    return this.session !== null && this.session.expiresAt > Date.now();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await delay(MOCK_LATENCY);
    if (!credentials.registerNumber || credentials.password.length < 3) {
      throw new Error("Invalid register number or password.");
    }
    const issuedAt = Date.now();
    const expiresAt = issuedAt + 60 * 60 * 1000; // 1 hour
    this.session = {
      studentId: MOCK_STUDENT.id,
      registerNumber: credentials.registerNumber,
      name: MOCK_STUDENT.name,
      accessToken: MOCK_TOKEN,
      refreshToken: MOCK_REFRESH,
      expiresAt,
      issuedAt,
    };
    const response: LoginResponse = {
      accessToken: MOCK_TOKEN,
      refreshToken: MOCK_REFRESH,
      expiresIn: 3600,
      student: {
        id: MOCK_STUDENT.id,
        name: MOCK_STUDENT.name,
        branchCode: MOCK_STUDENT.branchCode,
        branchName: MOCK_STUDENT.branchName,
        semester: MOCK_STUDENT.semester,
        registerNumber: credentials.registerNumber,
        avatarInitials: MOCK_STUDENT.avatarInitials,
      },
    };
    this.emit();
    return response;
  }

  async logout(): Promise<void> {
    await delay(150);
    this.session = null;
    this.emit();
  }

  isAuthenticated(): boolean {
    return this.session !== null && this.session.expiresAt > Date.now();
  }

  async refreshSession(): Promise<boolean> {
    await delay(200);
    if (!this.session) return false;
    this.session.issuedAt = Date.now();
    this.session.expiresAt = Date.now() + 60 * 60 * 1000;
    this.emit();
    return true;
  }

  async getProfile(): Promise<StudentProfile> {
    await delay(MOCK_LATENCY);
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated.");
    }
    return { ...MOCK_STUDENT, registerNumber: this.session?.registerNumber ?? MOCK_STUDENT.registerNumber };
  }

  async getResults(): Promise<SemesterResult[]> {
    await delay(MOCK_LATENCY);
    return [...MOCK_SEMESTER_RESULTS];
  }

  async getCGPA(): Promise<CGPAResult> {
    await delay(MOCK_LATENCY);
    return { ...MOCK_CGPA };
  }

  async getAttendance(): Promise<AttendanceRecord[]> {
    await delay(MOCK_LATENCY);
    return [...MOCK_ATTENDANCE];
  }

  async sync(): Promise<number> {
    await delay(MOCK_LATENCY * 2);
    return Date.now();
  }

  async clearCache(): Promise<void> {
    await delay(100);
  }

  onAuthChange(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    for (const l of this.listeners) {
      try {
        l(this.session);
      } catch {
        /* swallow */
      }
    }
  }
}

let _instance: StudentService | null = null;

export function getStudentService(): StudentService {
  if (!_instance) _instance = new MockStudentService();
  return _instance;
}

export function __setStudentService(s: StudentService) {
  _instance = s;
}
```

---

## HttpStudentService (BFF client)

**File:** `/home/z/my-project/src/lib/providers/student-http.ts`

```tsx
/**
 * HttpStudentService — talks to the BFF API routes (login, refresh, logout,
 * profile, results, cgpa). Cookies handle JWT transport automatically.
 *
 * Drop-in replacement for MockStudentService. UI code unchanged.
 */
import type {
  AuthSession,
  AttendanceRecord,
  CGPAResult,
  LoginCredentials,
  LoginResponse,
  SemesterResult,
  StudentProfile,
} from "@/lib/types";
import type { StudentService } from "@/lib/providers/student";

type AuthListener = (session: AuthSession | null) => void;

export class HttpStudentService implements StudentService {
  private listeners = new Set<AuthListener>();

  async initialize(): Promise<boolean> {
    // Try to restore session by calling /api/v1/refresh
    try {
      const res = await fetch("/api/v1/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return false;

      // If refresh succeeded, we have a valid access token cookie.
      // Optionally fetch profile to confirm student record exists.
      return true;
    } catch {
      return false;
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const res = await fetch("/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const message = data?.error?.message ?? "Login failed";
      throw new Error(message);
    }

    const data = (await res.json()) as LoginResponse & { expiresIn: number };

    // Build a session object for the auth store
    const session: AuthSession = {
      studentId: data.student.id,
      registerNumber: data.student.registerNumber,
      name: data.student.name,
      accessToken: "in-cookie", // not actually stored client-side — cookie is
      refreshToken: "in-cookie",
      expiresAt: Date.now() + (data.expiresIn ?? 3600) * 1000,
      issuedAt: Date.now(),
    };

    this.emit(session);
    return data;
  }

  async logout(): Promise<void> {
    await fetch("/api/v1/logout", {
      method: "POST",
      credentials: "include",
    });
    this.emit(null);
  }

  isAuthenticated(): boolean {
    // We don't store tokens client-side; we rely on the cookie being present.
    // Optimistic — actual validation happens on the next API call.
    return true;
  }

  async refreshSession(): Promise<boolean> {
    try {
      const res = await fetch("/api/v1/refresh", {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async getProfile(): Promise<StudentProfile> {
    const res = await this.authedFetch("/api/v1/profile");
    if (!res.ok) {
      throw new Error(`Failed to fetch profile: ${res.status}`);
    }
    const data = await res.json();
    return data.profile as StudentProfile;
  }

  async getResults(): Promise<SemesterResult[]> {
    const res = await this.authedFetch("/api/v1/results");
    if (!res.ok) {
      throw new Error(`Failed to fetch results: ${res.status}`);
    }
    const data = await res.json();
    return data.results as SemesterResult[];
  }

  async getCGPA(): Promise<CGPAResult> {
    const res = await this.authedFetch("/api/v1/cgpa");
    if (!res.ok) {
      throw new Error(`Failed to fetch CGPA: ${res.status}`);
    }
    const data = await res.json();
    return data.cgpa as CGPAResult;
  }

  async getAttendance(): Promise<AttendanceRecord[]> {
    // Scraper doesn't return attendance. Students enter manually.
    return [];
  }

  async sync(): Promise<number> {
    // Profile/Results/CGPA already serve cached data with `stale` flag.
    // For now, sync is a no-op — students re-login to refresh from scraper.
    return Date.now();
  }

  async clearCache(): Promise<void> {
    // No client-side cache to clear (cookies handle everything).
  }

  onAuthChange(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(session: AuthSession | null) {
    for (const l of this.listeners) {
      try {
        l(session);
      } catch {
        /* swallow */
      }
    }
  }

  /**
   * Fetch wrapper that auto-retries once on 401 by calling /refresh first.
   */
  private async authedFetch(url: string, init?: RequestInit): Promise<Response> {
    let res = await fetch(url, {
      ...init,
      credentials: "include",
    });

    if (res.status === 401) {
      // Try to refresh the access token
      const refreshed = await this.refreshSession();
      if (refreshed) {
        // Retry the original request
        res = await fetch(url, {
          ...init,
          credentials: "include",
        });
      }
    }

    return res;
  }
}
```

---

## AdsProvider

**File:** `/home/z/my-project/src/lib/providers/ads.ts`

```tsx
/**
 * AdsProvider — abstracts ad serving across platforms.
 *
 * Web MVP: MockAdsProvider (renders branded placeholders).
 * Future: Google AdSense (web), Google AdMob (android), none (iOS not supported).
 *
 * Pages only render <BannerAd />. They never know which provider is active.
 */

export type AdSlot = "home-top" | "home-mid" | "papers-list" | "syllabus-list" | "notices-list" | "settings-top";

export interface AdDescriptor {
  slot: AdSlot;
  // Implementation fills these in
  render: "mock" | "adsense" | "admob" | "none";
  height: number; // px
  label: string;
}

export interface AdsProvider {
  /** Whether ads should be shown (false if supporter, env flag, etc.) */
  isEnabled(): boolean;

  /** Disable ads (e.g. user just became supporter). */
  setEnabled(enabled: boolean): void;

  /** Returns ad metadata for a slot. The UI decides how to render. */
  getAd(slot: AdSlot): AdDescriptor;
}

class MockAdsProvider implements AdsProvider {
  private enabled = true;

  isEnabled() {
    return this.enabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  getAd(slot: AdSlot): AdDescriptor {
    const heights: Record<AdSlot, number> = {
      "home-top": 100,
      "home-mid": 120,
      "papers-list": 110,
      "syllabus-list": 110,
      "notices-list": 110,
      "settings-top": 90,
    };
    const labels: Record<AdSlot, string> = {
      "home-top": "Sponsored — Banner Ad",
      "home-mid": "Sponsored — Banner Ad",
      "papers-list": "Sponsored — Banner Ad",
      "syllabus-list": "Sponsored — Banner Ad",
      "notices-list": "Sponsored — Banner Ad",
      "settings-top": "Sponsored — Banner Ad",
    };
    return {
      slot,
      render: "mock",
      height: heights[slot],
      label: labels[slot],
    };
  }
}

let _instance: AdsProvider | null = null;

export function getAdsProvider(): AdsProvider {
  if (!_instance) _instance = new MockAdsProvider();
  return _instance;
}

export function __setAdsProvider(p: AdsProvider) {
  _instance = p;
}
```

---

## PaymentProvider

**File:** `/home/z/my-project/src/lib/providers/payment.ts`

```tsx
/**
 * PaymentProvider — abstracts the supporter purchase flow.
 *
 * MVP: MockPaymentProvider (simulates success after short delay).
 * Future: RazorpayProvider (web), Google Play Billing (android), Apple IAP (ios).
 *
 * Pages only call PaymentProvider.initiatePurchase() — never Razorpay directly.
 */

import type { PaymentProvider as ProviderName, SupporterPurchase } from "@/lib/types";

export interface InitiatePurchaseInput {
  studentId?: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

export interface InitiatePurchaseResult {
  purchaseId: string;
  status: SupporterPurchase["status"];
  provider: ProviderName;
  transactionId: string;
  receiptUrl?: string;
}

export interface PaymentProvider {
  readonly name: ProviderName;
  initiatePurchase(input: InitiatePurchaseInput): Promise<InitiatePurchaseResult>;
  verifyPurchase(purchaseId: string): Promise<SupporterPurchase>;
  restorePurchase(studentId?: string): Promise<SupporterPurchase | null>;
  cancelPurchase?(purchaseId: string): Promise<void>;
}

class MockPaymentProvider implements PaymentProvider {
  readonly name: ProviderName = "Mock";

  async initiatePurchase(input: InitiatePurchaseInput): Promise<InitiatePurchaseResult> {
    await new Promise((r) => setTimeout(r, 1200));
    const purchaseId = `purchase_${Date.now()}`;
    const transactionId = `txn_${Math.random().toString(36).slice(2, 12).toUpperCase()}`;
    return {
      purchaseId,
      status: "Success",
      provider: "Mock",
      transactionId,
      receiptUrl: undefined,
    };
  }

  async verifyPurchase(purchaseId: string): Promise<SupporterPurchase> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      id: purchaseId,
      amount: 99,
      currency: "INR",
      status: "Success",
      provider: "Mock",
      transactionId: `txn_${Math.random().toString(36).slice(2, 12).toUpperCase()}`,
      purchasedAt: new Date().toISOString(),
    };
  }

  async restorePurchase(studentId?: string): Promise<SupporterPurchase | null> {
    await new Promise((r) => setTimeout(r, 300));
    return null;
  }
}

let _instance: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (!_instance) _instance = new MockPaymentProvider();
  return _instance;
}

export function __setPaymentProvider(p: PaymentProvider) {
  _instance = p;
}
```

---

## AnalyticsProvider

**File:** `/home/z/my-project/src/lib/providers/analytics.ts`

```tsx
/**
 * AnalyticsProvider — abstracts event tracking.
 *
 * MVP: MockAnalyticsProvider (console logs in dev, no-op in prod).
 * Future: FirebaseAnalytics (native), GA4 / Vercel Analytics (web).
 */

export type AnalyticsEvent =
  | { name: "page_view"; props: { path: string; title?: string } }
  | { name: "calculator_used"; props: { type: string; result: number } }
  | { name: "paper_viewed"; props: { paperId: string } }
  | { name: "paper_downloaded"; props: { paperId: string } }
  | { name: "paper_bookmarked"; props: { paperId: string; bookmarked: boolean } }
  | { name: "search_performed"; props: { query: string; resultCount: number } }
  | { name: "supporter_purchase_started"; props: Record<string, never> }
  | { name: "supporter_purchase_succeeded"; props: { transactionId: string } }
  | { name: "supporter_purchase_failed"; props: { reason?: string } }
  | { name: "login_succeeded"; props: { registerNumber: string } }
  | { name: "login_failed"; props: { reason: string } }
  | { name: "notice_opened"; props: { noticeId: string } }
  | { name: "ad_clicked"; props: { slot: string } }
  | { name: "theme_changed"; props: { theme: string } };

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  setUserProperty(key: string, value: string | number | boolean | null): void;
  setUserId(id: string | null): void;
}

class MockAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[analytics] ${event.name}`, event.props);
    }
  }
  setUserProperty(key: string, value: string | number | boolean | null) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[analytics] set ${key}=${value}`);
    }
  }
  setUserId(id: string | null) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[analytics] setUserId ${id ?? "null"}`);
    }
  }
}

let _instance: AnalyticsProvider | null = null;

export function getAnalyticsProvider(): AnalyticsProvider {
  if (!_instance) _instance = new MockAnalyticsProvider();
  return _instance;
}

export function __setAnalyticsProvider(p: AnalyticsProvider) {
  _instance = p;
}
```

---

## NotificationProvider

**File:** `/home/z/my-project/src/lib/providers/notification.ts`

```tsx
/**
 * NotificationProvider — abstracts toasts/snackbars/push notifications.
 *
 * MVP: Uses shadcn/ui sonner toaster.
 * Future: Firebase Cloud Messaging (push), local scheduled notifications.
 */

import { toast } from "sonner";
import type { NotificationKind } from "@/lib/types";

export interface NotificationInput {
  kind?: NotificationKind;
  title: string;
  message?: string;
  duration?: number; // ms; 0 = sticky
  action?: { label: string; onClick: () => void };
}

export interface NotificationProvider {
  show(input: NotificationInput): void;
  dismissAll(): void;
}

class SonnerNotificationProvider implements NotificationProvider {
  show(input: NotificationInput) {
    const { kind = "info", title, message, duration = 4000, action } = input;
    const variant =
      kind === "success"
        ? "success"
        : kind === "warning"
          ? "warning"
          : kind === "error"
            ? "error"
            : "info";
    toast[variant === "info" ? "info" : variant](title, {
      description: message,
      duration: duration === 0 ? undefined : duration,
      action: action
        ? { label: action.label, onClick: action.onClick }
        : undefined,
    });
  }

  dismissAll() {
    toast.dismiss();
  }
}

let _instance: NotificationProvider | null = null;

export function getNotificationProvider(): NotificationProvider {
  if (!_instance) _instance = new SonnerNotificationProvider();
  return _instance;
}

export function __setNotificationProvider(p: NotificationProvider) {
  _instance = p;
}
```

---

## Providers (composition root)

**File:** `/home/z/my-project/src/lib/providers/index.tsx`

```tsx
"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";
import { useSupporterStore } from "@/store/supporter-store";
import { getAdsProvider } from "@/lib/providers/ads";
import { __setStudentService } from "@/lib/providers/student";
import { HttpStudentService } from "@/lib/providers/student-http";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

function ThemeSync() {
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (resolved: "light" | "dark") => {
      if (resolved === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
      useThemeStore.getState().setResolved(resolved);
    };

    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches ? "dark" : "light");
      const onChange = (e: MediaQueryListEvent) =>
        apply(e.matches ? "dark" : "light");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    apply(mode);
  }, [mode]);

  return null;
}

function SupporterAdsSync() {
  const isSupporter = useSupporterStore((s) => s.isSupporter);
  useEffect(() => {
    getAdsProvider().setEnabled(!isSupporter);
  }, [isSupporter]);
  return null;
}

/**
 * Swap the MockStudentService (default) for HttpStudentService which talks to
 * the BFF API routes. Done once at app boot.
 */
function WireStudentService() {
  useEffect(() => {
    __setStudentService(new HttpStudentService());
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={client}>
        <ThemeSync />
        <SupporterAdsSync />
        <WireStudentService />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

---
# 5b. Auth + Scraper Layer (Phase 2)

## Auth helpers (JWT + cookies)

**File:** `/home/z/my-project/src/lib/auth/index.ts`

```tsx
/**
 * Auth helpers — JWT issue/verify, refresh token hashing, cookie helpers.
 * Server-only. Never import from a Client Component.
 */
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const ACCESS_COOKIE = "ktu_access";
const REFRESH_COOKIE = "ktu_refresh";

export interface AccessTokenPayload {
  sub: string; // studentId
  reg: string; // registerNumber
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string; // token id (matches RefreshToken.id)
  type: "refresh";
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(payload: { sub: string; reg: string }): Promise<string> {
  const ttl = Number(process.env.JWT_ACCESS_TTL ?? 3600);
  return new SignJWT({ ...payload, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(getSecret());
}

export async function signRefreshToken(payload: { sub: string; jti: string }): Promise<string> {
  const ttl = Number(process.env.JWT_REFRESH_TTL ?? 30 * 24 * 60 * 60);
  return new SignJWT({ ...payload, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(getSecret());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "access") return null;
    return payload as unknown as AccessTokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "refresh") return null;
    return payload as unknown as RefreshTokenPayload;
  } catch {
    return null;
  }
}

export async function hashRefreshToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10);
}

export async function compareRefreshToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

/**
 * Issue access + refresh tokens, persist the hashed refresh token, set both as
 * httpOnly cookies. Returns the access token's TTL (seconds) so callers can
 * include it in the response body if they want.
 */
export async function issueSession(studentId: string, registerNumber: string): Promise<{
  accessToken: string;
  expiresIn: number;
}> {
  // Create refresh token record first to get its id
  const ttl = Number(process.env.JWT_REFRESH_TTL ?? 30 * 24 * 60 * 60);
  const expiresAt = new Date(Date.now() + ttl * 1000);
  const refreshTokenRow = await db.refreshToken.create({
    data: {
      studentId,
      tokenHash: "pending", // placeholder, will update after hashing the actual token
      expiresAt,
    },
  });

  // Sign the refresh token JWT containing the row id as jti
  const refreshToken = await signRefreshToken({ sub: studentId, jti: refreshTokenRow.id });
  const tokenHash = await hashRefreshToken(refreshToken);
  await db.refreshToken.update({
    where: { id: refreshTokenRow.id },
    data: { tokenHash },
  });

  // Sign access token
  const accessToken = await signAccessToken({ sub: studentId, reg: registerNumber });
  const accessTtl = Number(process.env.JWT_ACCESS_TTL ?? 3600);

  // Set cookies
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: accessTtl,
  });
  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/v1",
    maxAge: ttl,
  });

  return { accessToken, expiresIn: accessTtl };
}

/**
 * Revoke all refresh tokens for a student (used on logout).
 */
export async function revokeAllRefreshTokens(studentId: string): Promise<void> {
  await db.refreshToken.updateMany({
    where: { studentId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/**
 * Clear auth cookies (used on logout).
 */
export async function clearSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

/**
 * Read the access token from the request cookies and verify it.
 * Returns null if missing, expired, or invalid.
 */
export async function getAuthenticatedStudent(req: Request): Promise<{
  studentId: string;
  registerNumber: string;
} | null> {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [k, ...v] = c.split("=");
      return [k, v.join("=")];
    }),
  );
  const token = cookies[ACCESS_COOKIE];
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  if (!payload) return null;
  return { studentId: payload.sub, registerNumber: payload.reg };
}

/**
 * Read the refresh token from the request cookies.
 */
export async function getRefreshTokenFromRequest(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [k, ...v] = c.split("=");
      return [k, v.join("=")];
    }),
  );
  return cookies[REFRESH_COOKIE] ?? null;
}

export const ACCESS_COOKIE_NAME = ACCESS_COOKIE;
export const REFRESH_COOKIE_NAME = REFRESH_COOKIE;
```

---

## Scraper client

**File:** `/home/z/my-project/src/lib/scraper/index.ts`

```tsx
/**
 * Scraper client — thin wrapper around the existing Express scraper backend.
 * Server-only. Holds the SCRAPER_API_KEY server-side; never expose to client.
 */

export interface ScraperStudentResponse {
  username: string;
  userid: string;
  proimg?: string;
  Gender?: string;
  DateofBirth?: string;
  AadharNumber?: string;
  MotherTongue?: string;
  Category?: string;
  Religion?: string;
  Cast?: string;
  Nationality?: string;
  BloodGroup?: string;
  DateofAdmission?: string;
  AdmissionQuota?: string;
  CollegeAdmissionNumber?: string;
  AdmittedProgram?: string;
  AdmittedBranch?: string;
  AdmittedScheme?: string;
  AdmittedCategory?: string;
  AdmissionType?: string;
  Division?: string;
  EligibleForFeeConcession?: string;
  Programtobecompletedby?: string;
  CurrentSemester?: string;
  StaffAdvisor?: string;
  InstitutionName?: string;
  BankName?: string;
  BranchName?: string;
  AccountNumber?: string;
  AccountHolder?: string;
  IFSCCode?: string;
  Qualification?: string;
  "Board/University"?: string;
  QualifiedYear?: string;
  TotalMarks?: string;
  PercentageofMarks?: string;
  EntranceType?: string;
  PhysicsMarks?: string;
  "Chemistry(otherasspecifiedinCEE)Marks"?: string;
  MathsMarks?: string;
  Rankingtype?: string;
  "EntranceRank/Percentile"?: string;
  EntranceScore?: string;
  Name?: string; // parent name
  Occupation?: string;
  CommunicationAddress?: string;
  PersonalAddress?: string;
  Mobile?: string;
  Email?: string;
  HonoursCreditsRequired?: string;
  HonoursCreditsEarned?: string;
  MinorBranch?: string;
  MinorBasket?: string;
  MinorStaus?: string; // typo from KTU portal — preserved exactly
  // Semester result arrays
  S1?: ScraperCourse[];
  S1sgpa?: string;
  S2?: ScraperCourse[];
  S2sgpa?: string;
  S3?: ScraperCourse[];
  S3sgpa?: string;
  S4?: ScraperCourse[];
  S4sgpa?: string;
  S5?: ScraperCourse[];
  S5sgpa?: string;
  S6?: ScraperCourse[];
  S6sgpa?: string;
  S7?: ScraperCourse[];
  S7sgpa?: string;
  S8?: ScraperCourse[];
  S8sgpa?: string;
  activityPoints?: Record<string, string>;
}

export interface ScraperCourse {
  slot: string;
  course: string; // e.g. "MAT101 - LINEAR ALGEBRA AND CALCULUS"
  credit: string;
  type: string;
  completed: string;
  grade: string; // often "No" (means: not graded externally)
  earned: string; // the actual grade letter, e.g. "A+"
}

export interface ScraperNotification {
  date: string;
  heading: string;
  key: string;
  data: string;
}

export class ScraperError extends Error {
  code: "AUTH_FAILED" | "SCRAPE_FAILED" | "SCRAPER_UNAVAILABLE" | "BAD_RESPONSE";
  status: number;
  constructor(
    code: ScraperError["code"],
    message: string,
    status: number,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "ScraperError";
  }
}

function getScraperConfig() {
  const url = process.env.SCRAPER_API_URL;
  const key = process.env.SCRAPER_API_KEY;
  if (!url || !key) {
    throw new ScraperError("SCRAPER_UNAVAILABLE", "Scraper config missing", 500);
  }
  return { url, key };
}

/**
 * Calls the scraper's POST /api/v1/data endpoint to validate credentials and
 * fetch the student's full academic data.
 *
 * Password is NEVER persisted, NEVER logged, and only used in this single
 * request body.
 */
export async function fetchStudentFromScraper(
  userid: string,
  password: string,
): Promise<ScraperStudentResponse> {
  const { url, key } = getScraperConfig();

  let res: Response;
  try {
    res = await fetch(`${url}/api/v1/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, userid, password }),
      signal: AbortSignal.timeout(30_000), // scraper can be slow (it scrapes KTU)
    });
  } catch (e) {
    throw new ScraperError(
      "SCRAPER_UNAVAILABLE",
      e instanceof Error ? e.message : "Network error",
      502,
    );
  }

  if (res.status === 403 || res.status === 401) {
    throw new ScraperError("AUTH_FAILED", "Invalid credentials", 401);
  }
  if (!res.ok) {
    throw new ScraperError(
      "SCRAPE_FAILED",
      `Scraper returned ${res.status}`,
      502,
    );
  }

  const data = (await res.json()) as ScraperStudentResponse;
  if (!data.userid || !data.username) {
    throw new ScraperError("BAD_RESPONSE", "Scraper response missing required fields", 502);
  }

  return data;
}

/**
 * Fetch the list of notifications from the scraper backend.
 * No auth required.
 */
export async function fetchNotificationsFromScraper(): Promise<ScraperNotification[]> {
  const { url } = getScraperConfig();
  const res = await fetch(`${url}/api/v1/notifications`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new ScraperError("SCRAPER_UNAVAILABLE", `Status ${res.status}`, 502);
  }
  const data = (await res.json()) as { notifications: ScraperNotification[] };
  return data.notifications ?? [];
}
```

---

## Scraper → domain mapper

**File:** `/home/z/my-project/src/lib/scraper/mapper.ts`

```tsx
/**
 * Maps the scraper's response shape → our domain types.
 * Pure functions, easily testable.
 */
import { BRANCHES } from "@/lib/constants";
import type {
  StudentProfile,
  SemesterResult,
  SubjectResult,
  CGPAResult,
  Grade,
  BranchCode,
} from "@/lib/types";
import { GRADE_POINTS } from "@/lib/types";
import type { ScraperStudentResponse, ScraperCourse } from "@/lib/scraper";

const BRANCH_NAME_TO_CODE: Record<string, BranchCode> = Object.fromEntries(
  BRANCHES.map((b) => [b.fullName.toUpperCase(), b.code]),
) as Record<string, BranchCode>;

/** Try to match a scraper branch name to our BranchCode; fallback to "CSE". */
export function normalizeBranchCode(admittedBranch: string | undefined): BranchCode {
  if (!admittedBranch) return "CSE";
  const upper = admittedBranch.toUpperCase();
  return BRANCH_NAME_TO_CODE[upper] ?? "CSE";
}

/** Parse "S8" → 8. Returns 1 if unparseable. */
export function parseSemester(raw: string | undefined): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 {
  if (!raw) return 1;
  const match = raw.match(/S?(\d)/i);
  const n = match ? Number(match[1]) : 1;
  if (n >= 1 && n <= 8) return n as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  return 1;
}

/** Parse admission year from "0/2020" or "08/2020" → 2020. */
export function parseAdmissionYear(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const parts = raw.split("/");
  const year = Number(parts[parts.length - 1]);
  return isNaN(year) ? undefined : year;
}

/** Build initials from full name: "JOHN DOE" → "JD". */
export function buildAvatarInitials(name: string | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function parseGrade(raw: string | undefined): Grade {
  if (!raw) return "F";
  const trimmed = raw.trim();
  if (["O", "A+", "A", "B+", "B", "C", "P", "F", "I", "Absent"].includes(trimmed)) {
    return trimmed as Grade;
  }
  return "F";
}

function mapCourse(c: ScraperCourse): SubjectResult {
  // course format: "MAT101 - LINEAR ALGEBRA AND CALCULUS"
  const [code, ...nameParts] = c.course.split(" - ");
  return {
    subjectCode: code?.trim() ?? c.course,
    subjectName: nameParts.join(" - ").trim() || c.course,
    credits: Number(c.credit) || 0,
    grade: parseGrade(c.earned || c.grade),
    gradePoint: GRADE_POINTS[parseGrade(c.earned || c.grade)],
    passed: (c.earned || c.grade) !== "F" && (c.earned || c.grade) !== "Absent",
  };
}

export function mapScraperToProfile(
  scraper: ScraperStudentResponse,
  studentId: string,
): StudentProfile {
  return {
    id: studentId,
    registerNumber: scraper.userid,
    name: scraper.username,
    branchCode: normalizeBranchCode(scraper.AdmittedBranch),
    branchName: scraper.AdmittedBranch ?? "Unknown",
    semester: parseSemester(scraper.CurrentSemester),
    email: scraper.Email,
    phone: scraper.Mobile,
    admissionYear: parseAdmissionYear(scraper.DateofAdmission),
    scheme: scraper.AdmittedScheme ?? "2019 Scheme",
    avatarInitials: buildAvatarInitials(scraper.username),
  };
}

export function mapScraperToResults(scraper: ScraperStudentResponse): SemesterResult[] {
  const out: SemesterResult[] = [];
  for (let sem = 1; sem <= 8; sem++) {
    const courses = scraper[`S${sem}` as keyof ScraperStudentResponse] as
      | ScraperCourse[]
      | undefined;
    const sgpaStr = scraper[`S${sem}sgpa` as keyof ScraperStudentResponse] as
      | string
      | undefined;
    if (!courses || courses.length === 0) continue;

    const subjects = courses.map(mapCourse);
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    const creditsEarned = subjects
      .filter((s) => s.passed)
      .reduce((sum, s) => sum + s.credits, 0);
    const sgpa = sgpaStr ? Number(sgpaStr) : 0;

    out.push({
      semester: sem as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      subjects,
      sgpa,
      totalCredits,
      creditsEarned,
    });
  }
  return out;
}

export function mapScraperToCGPA(scraper: ScraperStudentResponse): CGPAResult {
  const semesters = mapScraperToResults(scraper);
  let totalCredits = 0;
  let weighted = 0;
  for (const s of semesters) {
    totalCredits += s.totalCredits;
    weighted += s.sgpa * s.totalCredits;
  }
  const cgpa = totalCredits > 0 ? weighted / totalCredits : 0;
  return {
    cgpa: Number(cgpa.toFixed(2)),
    totalCredits,
    creditsEarned: semesters.reduce((sum, s) => sum + s.creditsEarned, 0),
    semesters,
  };
}
```

---

## Prisma client

**File:** `/home/z/my-project/src/lib/db.ts`

```tsx
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db```

---

## Prisma schema

**File:** `/home/z/my-project/prisma/schema.prisma`

```prisma
// KTU One — Prisma Schema (Phase 2)
// SQLite for dev; swap datasource provider to "postgresql" + connection string for Supabase.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

/* ===================================================================== */
/* Reference data (curated, not scraped)                                  */
/* ===================================================================== */

model Branch {
  code     String   @id // e.g. "CSE", "EC"
  name     String   // short name e.g. "CSE"
  fullName String   // e.g. "Computer Science & Engineering"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("branches")
}

model Semester {
  id           String   @id @default(cuid())
  number       Int      // 1..8
  branchCode   String
  academicYear String?  // e.g. "2025-2026"
  totalCredits Int?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([number, branchCode, academicYear])
  @@map("semesters")
}

model Subject {
  id         String   @id @default(cuid())
  code       String   @unique // e.g. "CST301"
  name       String
  semester   Int      // 1..8
  branchCode String
  credits    Int
  type       String   // CORE | ELECTIVE | LAB | PROJECT | HONORS
  isElective Boolean  @default(false)
  isLab      Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([branchCode, semester])
  @@map("subjects")
}

/* ===================================================================== */
/* Content (curated by admin; Phase 3)                                    */
/* ===================================================================== */

model QuestionPaper {
  id            String   @id @default(cuid())
  title         String
  subjectCode   String
  subjectName   String
  semester      Int
  branchCode    String
  year          Int
  month         Int
  examType      String   // END_SEM | SERIES_1 | SERIES_2 | MODEL
  fileUrl       String
  fileSizeBytes Int      @default(0)
  pageCount     Int      @default(0)
  downloads     Int      @default(0)
  views         Int      @default(0)
  uploadedAt    DateTime @default(now())
  deletedAt     DateTime?

  @@index([branchCode, semester, year])
  @@index([subjectCode])
  @@map("question_papers")
}

model Syllabus {
  id          String   @id @default(cuid())
  title       String
  semester    Int
  branchCode  String
  subjectCode String
  subjectName String
  version     String   @default("v2019.1")
  fileUrl     String
  lastUpdated DateTime @default(now())
  modules     Int      @default(5)
  deletedAt   DateTime?

  @@index([branchCode, semester])
  @@map("syllabus")
}

model KTUNotice {
  id          String   @id @default(cuid())
  key         String   @unique // slug from scraper (dedup key)
  title       String
  description String
  category    String   @default("General") // Academic | Examination | Scholarship | Placement | Cultural | General
  publishedAt DateTime
  priority    String   @default("Normal") // Pinned | High | Normal | Low
  pdfUrl      String?
  externalUrl String?
  tags        String   @default("[]") // JSON array as string (SQLite limitation)
  pinned      Boolean  @default(false)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([publishedAt])
  @@index([category, active])
  @@map("ktu_notices")
}

model CalendarEvent {
  id              String   @id @default(cuid())
  title           String
  description     String
  type            String   // EXAM | HOLIDAY | RESULT | REGISTRATION | WORKSHOP | DEADLINE | EVENT
  startDate       DateTime
  endDate         DateTime
  allDay          Boolean  @default(true)
  color           String   @default("#9333EA")
  reminderEnabled Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([startDate])
  @@map("calendar_events")
}

/* ===================================================================== */
/* Auth + per-student data                                                */
/* ===================================================================== */

model Student {
  id             String   @id @default(cuid())
  registerNumber String   @unique
  name           String
  branchCode     String?
  branchName     String?  // raw from scraper (full name)
  semester       Int?
  scheme         String?
  email          String?
  phone          String?
  avatarInitials String?
  admissionYear  Int?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  lastLoginAt    DateTime?

  cachedData     CachedStudentData?
  refreshTokens  RefreshToken[]
  bookmarks      Bookmark[]
  calcHistory    CalculatorHistoryEntry[]
  supporterPurchases SupporterPurchase[]

  @@map("students")
}

model CachedStudentData {
  studentId String   @id
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  rawJson   String   // full scraper response as JSON string
  cachedAt  DateTime @default(now())
  expiresAt DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("cached_student_data")
}

model RefreshToken {
  id         String   @id @default(cuid())
  studentId  String
  student    Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  tokenHash  String   @unique // bcrypt hash of the refresh token
  expiresAt  DateTime
  revokedAt  DateTime?
  createdAt  DateTime @default(now())

  @@index([studentId])
  @@map("refresh_tokens")
}

model Bookmark {
  id        String   @id @default(cuid())
  studentId String
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  kind      String   // paper | syllabus | notice | subject
  refId     String
  title     String
  subtitle  String?
  createdAt DateTime @default(now())

  @@unique([studentId, kind, refId])
  @@index([studentId, kind])
  @@map("bookmarks")
}

model CalculatorHistoryEntry {
  id        String   @id @default(cuid())
  studentId String
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  type      String   // SGPA | CGPA | ATTENDANCE | INTERNAL_MARKS | PASS_CALCULATOR
  input     String   // JSON string
  output    String   // JSON string
  label     String?
  createdAt DateTime @default(now())

  @@index([studentId, type])
  @@map("calculator_history")
}

/* ===================================================================== */
/* Payments                                                               */
/* ===================================================================== */

model SupporterPurchase {
  id            String   @id @default(cuid())
  studentId     String?
  student       Student? @relation(fields: [studentId], references: [id])
  amount        Int
  currency      String   @default("INR")
  status        String   @default("Pending") // Pending | Success | Failed | Refunded
  provider      String   @default("Mock") // Mock | Razorpay
  transactionId String
  receiptUrl    String?
  purchasedAt   DateTime @default(now())

  @@index([studentId])
  @@map("supporter_purchases")
}

/* ===================================================================== */
/* App settings (key/value)                                               */
/* ===================================================================== */

model AppSettings {
  key       String   @id
  value     String   // JSON string
  updatedAt DateTime @updatedAt

  @@map("app_settings")
}
```

---

## Seed script

**File:** `/home/z/my-project/prisma/seed.ts`

```ts
/**
 * KTU One — Database seed script
 * Ports src/data/mock-data.ts into Prisma rows.
 * Run with: bun run db:seed
 */
import { PrismaClient } from "@prisma/client";
import {
  BRANCHES,
  SEMESTERS,
} from "../src/lib/constants";
import {
  SUBJECTS,
  MOCK_PAPERS,
  MOCK_SYLLABUS,
  MOCK_NOTICES,
  MOCK_CALENDAR,
} from "../src/data/mock-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding KTU One database...");

  // 1. Branches
  console.log("  → Branches");
  for (const b of BRANCHES) {
    await prisma.branch.upsert({
      where: { code: b.code },
      update: { name: b.name, fullName: b.fullName },
      create: { code: b.code, name: b.name, fullName: b.fullName },
    });
  }

  // 2. Semesters (one per branch × 8)
  console.log("  → Semesters");
  for (const branch of BRANCHES) {
    for (const num of SEMESTERS) {
      await prisma.semester.upsert({
        where: {
          number_branchCode_academicYear: {
            number: num,
            branchCode: branch.code,
            academicYear: "2025-2026",
          },
        },
        update: {},
        create: {
          number: num,
          branchCode: branch.code,
          academicYear: "2025-2026",
          totalCredits: 24,
        },
      });
    }
  }

  // 3. Subjects (only the CSE ones in mock-data)
  console.log("  → Subjects");
  for (const s of SUBJECTS) {
    await prisma.subject.upsert({
      where: { code: s.code },
      update: {
        name: s.name,
        semester: s.semester,
        branchCode: s.branchCode,
        credits: s.credits,
        type: s.type,
        isElective: s.isElective,
        isLab: s.isLab,
      },
      create: {
        code: s.code,
        name: s.name,
        semester: s.semester,
        branchCode: s.branchCode,
        credits: s.credits,
        type: s.type,
        isElective: s.isElective,
        isLab: s.isLab,
      },
    });
  }

  // 4. Question papers (clear + reinsert to keep things deterministic)
  console.log("  → Question papers");
  await prisma.questionPaper.deleteMany({});
  for (const p of MOCK_PAPERS) {
    await prisma.questionPaper.create({
      data: {
        title: p.title,
        subjectCode: p.subjectCode,
        subjectName: p.subjectName,
        semester: p.semester,
        branchCode: p.branchCode,
        year: p.year,
        month: p.month,
        examType: p.examType,
        fileUrl: p.fileUrl,
        fileSizeBytes: p.fileSizeBytes,
        pageCount: p.pageCount,
        downloads: p.downloads,
        views: p.views,
        uploadedAt: new Date(p.uploadedAt),
      },
    });
  }

  // 5. Syllabus
  console.log("  → Syllabus");
  await prisma.syllabus.deleteMany({});
  for (const s of MOCK_SYLLABUS) {
    await prisma.syllabus.create({
      data: {
        title: s.title,
        semester: s.semester,
        branchCode: s.branchCode,
        subjectCode: s.subjectCode,
        subjectName: s.subjectName,
        version: s.version,
        fileUrl: s.fileUrl,
        lastUpdated: new Date(s.lastUpdated),
        modules: s.modules,
      },
    });
  }

  // 6. Notices (upsert by key — so we don't duplicate on re-seed)
  console.log("  → Notices");
  for (const n of MOCK_NOTICES) {
    const slug = n.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100);
    await prisma.kTUNotice.upsert({
      where: { key: slug },
      update: {
        title: n.title,
        description: n.description,
        category: n.category,
        publishedAt: new Date(n.publishedAt),
        priority: n.priority,
        pdfUrl: n.pdfUrl ?? null,
        externalUrl: n.externalUrl ?? null,
        tags: JSON.stringify(n.tags),
        pinned: n.pinned,
        active: n.active,
      },
      create: {
        key: slug,
        title: n.title,
        description: n.description,
        category: n.category,
        publishedAt: new Date(n.publishedAt),
        priority: n.priority,
        pdfUrl: n.pdfUrl ?? null,
        externalUrl: n.externalUrl ?? null,
        tags: JSON.stringify(n.tags),
        pinned: n.pinned,
        active: n.active,
      },
    });
  }

  // 7. Calendar events
  console.log("  → Calendar events");
  await prisma.calendarEvent.deleteMany({});
  for (const e of MOCK_CALENDAR) {
    await prisma.calendarEvent.create({
      data: {
        title: e.title,
        description: e.description,
        type: e.type,
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate),
        allDay: e.allDay,
        color: e.color,
        reminderEnabled: e.reminderEnabled,
      },
    });
  }

  // 8. Default app settings
  console.log("  → App settings");
  await prisma.appSettings.upsert({
    where: { key: "app.version" },
    update: {},
    create: { key: "app.version", value: JSON.stringify("1.0.0-alpha") },
  });

  console.log("✅ Seed complete");
  console.log(`   ${BRANCHES.length} branches`);
  console.log(`   ${BRANCHES.length * SEMESTERS.length} semesters`);
  console.log(`   ${SUBJECTS.length} subjects`);
  console.log(`   ${MOCK_PAPERS.length} question papers`);
  console.log(`   ${MOCK_SYLLABUS.length} syllabus entries`);
  console.log(`   ${MOCK_NOTICES.length} notices`);
  console.log(`   ${MOCK_CALENDAR.length} calendar events`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---
# 5c. BFF API Routes (Phase 2)

## POST /api/v1/login

**File:** `/home/z/my-project/src/app/api/v1/login/route.ts`

```tsx
/**
 * POST /api/v1/login
 * Body: { registerNumber, password }
 *
 * Calls the scraper backend to validate credentials and fetch academic data,
 * then issues JWT access + refresh tokens (httpOnly cookies), persists the
 * scraper response in Prisma as a 24h cache, and returns the student profile.
 *
 * Password is NEVER persisted, NEVER logged.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { fetchStudentFromScraper, ScraperError } from "@/lib/scraper";
import { mapScraperToProfile } from "@/lib/scraper/mapper";
import { issueSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const LoginSchema = z.object({
  registerNumber: z.string().min(1).max(50),
  password: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON body" } },
      { status: 400 },
    );
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_FAILED",
          message: parsed.error.issues[0]?.message ?? "Invalid input",
        },
      },
      { status: 400 },
    );
  }

  const { registerNumber, password } = parsed.data;

  try {
    // 1. Call the scraper (validates credentials + fetches academic data)
    const scraperData = await fetchStudentFromScraper(registerNumber, password);

    // 2. Upsert Student row
    const student = await db.student.upsert({
      where: { registerNumber: scraperData.userid },
      update: {
        name: scraperData.username,
        branchName: scraperData.AdmittedBranch,
        email: scraperData.Email,
        phone: scraperData.Mobile,
        lastLoginAt: new Date(),
      },
      create: {
        registerNumber: scraperData.userid,
        name: scraperData.username,
        branchName: scraperData.AdmittedBranch,
        email: scraperData.Email,
        phone: scraperData.Mobile,
        lastLoginAt: new Date(),
      },
    });

    // Update derived fields via mapper (separate update to keep logic clean)
    const profile = mapScraperToProfile(scraperData, student.id);
    await db.student.update({
      where: { id: student.id },
      data: {
        branchCode: profile.branchCode,
        semester: profile.semester,
        scheme: profile.scheme,
        avatarInitials: profile.avatarInitials,
        admissionYear: profile.admissionYear,
      },
    });

    // 3. Cache the scraper response (24h TTL)
    const cacheTtl = Number(process.env.CACHE_TTL_SECONDS ?? 86400);
    await db.cachedStudentData.upsert({
      where: { studentId: student.id },
      update: {
        rawJson: JSON.stringify(scraperData),
        cachedAt: new Date(),
        expiresAt: new Date(Date.now() + cacheTtl * 1000),
      },
      create: {
        studentId: student.id,
        rawJson: JSON.stringify(scraperData),
        expiresAt: new Date(Date.now() + cacheTtl * 1000),
      },
    });

    // 4. Issue JWT + refresh tokens, set cookies
    const { expiresIn } = await issueSession(student.id, student.registerNumber);

    // 5. Return the student profile for the frontend
    return NextResponse.json({
      accessToken: "in-cookie",
      expiresIn,
      student: {
        id: student.id,
        name: profile.name,
        branchCode: profile.branchCode,
        branchName: profile.branchName,
        semester: profile.semester,
        registerNumber: profile.registerNumber,
        avatarInitials: profile.avatarInitials,
      },
    });
  } catch (e) {
    if (e instanceof ScraperError) {
      return NextResponse.json(
        { error: { code: e.code, message: e.message } },
        { status: e.status },
      );
    }
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: { code: "INTERNAL", message } },
      { status: 500 },
    );
  }
}
```

---

## POST /api/v1/refresh

**File:** `/home/z/my-project/src/app/api/v1/refresh/route.ts`

```tsx
/**
 * POST /api/v1/refresh
 * Reads refresh token from httpOnly cookie, validates it, issues a new access token.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyRefreshToken,
  compareRefreshToken,
  signAccessToken,
  ACCESS_COOKIE_NAME,
} from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("ktu_refresh")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: { code: "NO_REFRESH_TOKEN", message: "No refresh token cookie" } },
      { status: 401 },
    );
  }

  // 1. Verify JWT signature + expiry
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    return NextResponse.json(
      { error: { code: "INVALID_REFRESH_TOKEN", message: "Refresh token invalid or expired" } },
      { status: 401 },
    );
  }

  // 2. Look up the hashed token in DB; ensure not revoked
  const stored = await db.refreshToken.findUnique({
    where: { id: payload.jti },
  });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    return NextResponse.json(
      { error: { code: "REVOKED_OR_EXPIRED", message: "Refresh token revoked or expired" } },
      { status: 401 },
    );
  }

  // 3. Compare the raw token against the stored hash
  const matches = await compareRefreshToken(refreshToken, stored.tokenHash);
  if (!matches) {
    return NextResponse.json(
      { error: { code: "TOKEN_MISMATCH", message: "Refresh token hash mismatch" } },
      { status: 401 },
    );
  }

  // 4. Fetch the student to include registerNumber in the new access token
  const student = await db.student.findUnique({
    where: { id: payload.sub },
    select: { id: true, registerNumber: true },
  });
  if (!student) {
    return NextResponse.json(
      { error: { code: "STUDENT_NOT_FOUND", message: "Student no longer exists" } },
      { status: 401 },
    );
  }

  // 5. Issue a fresh access token
  const accessToken = await signAccessToken({
    sub: student.id,
    reg: student.registerNumber,
  });
  const accessTtl = Number(process.env.JWT_ACCESS_TTL ?? 3600);

  cookieStore.set(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: accessTtl,
  });

  return NextResponse.json({ ok: true, expiresIn: accessTtl });
}
```

---

## POST /api/v1/logout

**File:** `/home/z/my-project/src/app/api/v1/logout/route.ts`

```tsx
/**
 * POST /api/v1/logout
 * Revokes all refresh tokens for the authenticated student and clears cookies.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedStudent,
  revokeAllRefreshTokens,
  clearSessionCookies,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const student = await getAuthenticatedStudent(req);

  // Even if the access token is expired, we still want to clear cookies.
  // Try to read the refresh token's subject indirectly by revoking via studentId
  // (only if access token was valid). Otherwise just clear cookies.
  if (student) {
    await revokeAllRefreshTokens(student.studentId);
  }

  await clearSessionCookies();

  return NextResponse.json({ ok: true });
}
```

---

## GET /api/v1/profile

**File:** `/home/z/my-project/src/app/api/v1/profile/route.ts`

```tsx
/**
 * GET /api/v1/profile
 * JWT-protected. Returns the authenticated student's profile.
 * Reads from CachedStudentData (24h cache); falls back to "stale" flag if expired.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedStudent } from "@/lib/auth";
import { mapScraperToProfile } from "@/lib/scraper/mapper";
import type { ScraperStudentResponse } from "@/lib/scraper";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  const cached = await db.cachedStudentData.findUnique({
    where: { studentId: auth.studentId },
  });

  if (!cached) {
    return NextResponse.json(
      {
        error: {
          code: "NO_CACHE",
          message: "No cached data — student must re-login to refresh from scraper",
        },
      },
      { status: 404 },
    );
  }

  const scraperData = JSON.parse(cached.rawJson) as ScraperStudentResponse;
  const profile = mapScraperToProfile(scraperData, auth.studentId);

  const isStale = cached.expiresAt < new Date();

  return NextResponse.json({
    profile,
    cachedAt: cached.cachedAt.toISOString(),
    expiresAt: cached.expiresAt.toISOString(),
    stale: isStale,
  });
}
```

---

## GET /api/v1/results

**File:** `/home/z/my-project/src/app/api/v1/results/route.ts`

```tsx
/**
 * GET /api/v1/results
 * JWT-protected. Returns semester-by-semester results from cached scraper data.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedStudent } from "@/lib/auth";
import { mapScraperToResults } from "@/lib/scraper/mapper";
import type { ScraperStudentResponse } from "@/lib/scraper";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  const cached = await db.cachedStudentData.findUnique({
    where: { studentId: auth.studentId },
  });

  if (!cached) {
    return NextResponse.json(
      {
        error: {
          code: "NO_CACHE",
          message: "No cached data — student must re-login to refresh from scraper",
        },
      },
      { status: 404 },
    );
  }

  const scraperData = JSON.parse(cached.rawJson) as ScraperStudentResponse;
  const results = mapScraperToResults(scraperData);

  return NextResponse.json({
    results,
    cachedAt: cached.cachedAt.toISOString(),
    stale: cached.expiresAt < new Date(),
  });
}
```

---

## GET /api/v1/cgpa

**File:** `/home/z/my-project/src/app/api/v1/cgpa/route.ts`

```tsx
/**
 * GET /api/v1/cgpa
 * JWT-protected. Returns CGPA computed from cached scraper data.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedStudent } from "@/lib/auth";
import { mapScraperToCGPA } from "@/lib/scraper/mapper";
import type { ScraperStudentResponse } from "@/lib/scraper";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  const cached = await db.cachedStudentData.findUnique({
    where: { studentId: auth.studentId },
  });

  if (!cached) {
    return NextResponse.json(
      {
        error: {
          code: "NO_CACHE",
          message: "No cached data — student must re-login to refresh from scraper",
        },
      },
      { status: 404 },
    );
  }

  const scraperData = JSON.parse(cached.rawJson) as ScraperStudentResponse;
  const cgpa = mapScraperToCGPA(scraperData);

  return NextResponse.json({
    cgpa,
    cachedAt: cached.cachedAt.toISOString(),
    stale: cached.expiresAt < new Date(),
  });
}
```

---

## GET/POST/DELETE /api/v1/bookmarks

**File:** `/home/z/my-project/src/app/api/v1/bookmarks/route.ts`

```tsx
/**
 * GET  /api/v1/bookmarks        — list student's bookmarks
 * POST /api/v1/bookmarks        — toggle a bookmark
 *   Body: { kind, refId, title, subtitle? }
 *   Returns: { bookmarked: boolean }
 * DELETE /api/v1/bookmarks?id=X — remove specific bookmark
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAuthenticatedStudent } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  const rows = await db.bookmark.findMany({
    where: { studentId: auth.studentId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    bookmarks: rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      refId: r.refId,
      title: r.title,
      subtitle: r.subtitle,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

const ToggleSchema = z.object({
  kind: z.enum(["paper", "syllabus", "notice", "subject"]),
  refId: z.string().min(1).max(100),
  title: z.string().min(1).max(300),
  subtitle: z.string().max(300).optional(),
});

export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON" } },
      { status: 400 },
    );
  }

  const parsed = ToggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const { kind, refId, title, subtitle } = parsed.data;
  const existing = await db.bookmark.findUnique({
    where: {
      studentId_kind_refId: {
        studentId: auth.studentId,
        kind,
        refId,
      },
    },
  });

  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  await db.bookmark.create({
    data: {
      studentId: auth.studentId,
      kind,
      refId,
      title,
      subtitle,
    },
  });
  return NextResponse.json({ bookmarked: true });
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Missing id param" } },
      { status: 400 },
    );
  }

  await db.bookmark.deleteMany({
    where: { id, studentId: auth.studentId },
  });

  return NextResponse.json({ ok: true });
}
```

---

## GET/POST/DELETE /api/v1/calc-history

**File:** `/home/z/my-project/src/app/api/v1/calc-history/route.ts`

```tsx
/**
 * GET  /api/v1/calc-history          — list calculator history (optional ?type=)
 * POST /api/v1/calc-history          — add entry
 *   Body: { type, input, output, label? }
 * DELETE /api/v1/calc-history?id=X   — remove specific entry
 * DELETE /api/v1/calc-history?all=1  — clear all
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAuthenticatedStudent } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? undefined;

  const where: Record<string, unknown> = { studentId: auth.studentId };
  if (type) where.type = type;

  const rows = await db.calculatorHistoryEntry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    entries: rows.map((r) => ({
      id: r.id,
      type: r.type,
      input: JSON.parse(r.input),
      output: JSON.parse(r.output),
      label: r.label,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

const AddSchema = z.object({
  type: z.enum([
    "SGPA",
    "CGPA",
    "ATTENDANCE",
    "INTERNAL_MARKS",
    "PASS_CALCULATOR",
  ]),
  input: z.record(z.unknown()),
  output: z.object({
    type: z.string(),
    value: z.number(),
    percentage: z.number().optional(),
    meta: z.record(z.unknown()).optional(),
    computedAt: z.string(),
  }),
  label: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON" } },
      { status: 400 },
    );
  }

  const parsed = AddSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const { type, input, output, label } = parsed.data;

  const row = await db.calculatorHistoryEntry.create({
    data: {
      studentId: auth.studentId,
      type,
      input: JSON.stringify(input),
      output: JSON.stringify(output),
      label,
    },
  });

  return NextResponse.json({
    id: row.id,
    type: row.type,
    input: JSON.parse(row.input),
    output: JSON.parse(row.output),
    label: row.label,
    createdAt: row.createdAt.toISOString(),
  });
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthenticatedStudent(req);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const all = url.searchParams.get("all");

  if (all === "1") {
    await db.calculatorHistoryEntry.deleteMany({
      where: { studentId: auth.studentId },
    });
    return NextResponse.json({ ok: true, cleared: true });
  }

  if (!id) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Missing id or all=1" } },
      { status: 400 },
    );
  }

  await db.calculatorHistoryEntry.deleteMany({
    where: { id, studentId: auth.studentId },
  });

  return NextResponse.json({ ok: true });
}
```

---

## Cron: sync notifications

**File:** `/home/z/my-project/src/app/api/cron/sync-notifications/route.ts`

```tsx
/**
 * Cron route — syncs notifications from the scraper backend into Prisma.
 * Runs every 15 min via Vercel Cron (configured in vercel.json).
 * Protected by CRON_SECRET header.
 */
import { NextRequest, NextResponse } from "next/server";
import { upsertScraperNotifications } from "@/features/notices/actions";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Missing or invalid cron secret" } },
      { status: 401 },
    );
  }

  const scraperUrl = process.env.SCRAPER_API_URL;
  if (!scraperUrl) {
    return NextResponse.json(
      { error: { code: "MISCONFIGURED", message: "SCRAPER_API_URL not set" } },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${scraperUrl}/api/v1/notifications`, {
      method: "GET",
      headers: { Accept: "application/json" },
      // 10s timeout
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: {
            code: "SCRAPER_UNAVAILABLE",
            message: `Scraper returned ${res.status}`,
          },
        },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      notifications: Array<{
        date: string;
        heading: string;
        key: string;
        data: string;
      }>;
    };

    if (!data.notifications || !Array.isArray(data.notifications)) {
      return NextResponse.json(
        { error: { code: "BAD_RESPONSE", message: "Invalid notification shape" } },
        { status: 502 },
      );
    }

    const result = await upsertScraperNotifications(data.notifications);

    return NextResponse.json({
      ok: true,
      synced: data.notifications.length,
      created: result.created,
      updated: result.updated,
      at: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: { code: "SYNC_FAILED", message } },
      { status: 500 },
    );
  }
}
```

---

## vercel.json (cron config)

**File:** `/home/z/my-project/vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-notifications",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

---
# 6. Zustand Stores

## theme-store.ts

**File:** `/home/z/my-project/src/store/theme-store.ts`

```tsx
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ThemeMode } from "@/lib/types";

interface ThemeState {
  mode: ThemeMode;
  resolved: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  setResolved: (resolved: "light" | "dark") => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      resolved: "light",
      setMode: (mode) => set({ mode }),
      setResolved: (resolved) => set({ resolved }),
      toggle: () => {
        const current = get().resolved;
        set({ mode: current === "light" ? "dark" : "light" });
      },
    }),
    {
      name: "ktu_one:theme",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ mode: s.mode }),
    },
  ),
);
```

---

## auth-store.ts

**File:** `/home/z/my-project/src/store/auth-store.ts`

```tsx
"use client";

import { create } from "zustand";
import type { AuthSession, StudentProfile } from "@/lib/types";

interface AuthState {
  session: AuthSession | null;
  profile: StudentProfile | null;
  isInitializing: boolean;
  isAuthenticated: boolean;

  setSession: (session: AuthSession | null) => void;
  setProfile: (profile: StudentProfile | null) => void;
  setInitializing: (v: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  isInitializing: false,
  isAuthenticated: false,

  setSession: (session) =>
    set({
      session,
      isAuthenticated: !!session && session.expiresAt > Date.now(),
    }),
  setProfile: (profile) => set({ profile }),
  setInitializing: (isInitializing) => set({ isInitializing }),
  clear: () =>
    set({
      session: null,
      profile: null,
      isAuthenticated: false,
      isInitializing: false,
    }),
}));
```

---

## nav-store.ts

**File:** `/home/z/my-project/src/store/nav-store.ts`

```tsx
"use client";

import { create } from "zustand";
import type { NavKey } from "@/lib/constants";

interface NavState {
  active: NavKey;
  searchOpen: boolean;
  supportOpen: boolean;
  loginOpen: boolean;
  set: (key: NavKey) => void;
  setSearchOpen: (open: boolean) => void;
  setSupportOpen: (open: boolean) => void;
  setLoginOpen: (open: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
  active: "dashboard",
  searchOpen: false,
  supportOpen: false,
  loginOpen: false,
  set: (active) => set({ active }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setSupportOpen: (supportOpen) => set({ supportOpen }),
  setLoginOpen: (loginOpen) => set({ loginOpen }),
}));
```

---

## supporter-store.ts

**File:** `/home/z/my-project/src/store/supporter-store.ts`

```tsx
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SupporterStatus } from "@/lib/types";

interface SupporterState extends SupporterStatus {
  markSupporter: (transactionId: string, purchasedAt: string) => void;
  clear: () => void;
}

export const useSupporterStore = create<SupporterState>()(
  persist(
    (set) => ({
      isSupporter: false,
      badge: null,
      markSupporter: (transactionId, purchasedAt) =>
        set({
          isSupporter: true,
          transactionId,
          purchasedAt,
          badge: "Lifetime Supporter",
        }),
      clear: () => set({ isSupporter: false, badge: null, transactionId: undefined, purchasedAt: undefined }),
    }),
    {
      name: "ktu_one:supporter",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
```

---

## calc-history-store.ts

**File:** `/home/z/my-project/src/store/calc-history-store.ts`

```tsx
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CalculatorHistoryEntry, CalculatorType, CalculatorResult } from "@/lib/types";

interface CalcHistoryState {
  entries: CalculatorHistoryEntry[];
  add: (type: CalculatorType, input: Record<string, unknown>, output: CalculatorResult, label?: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCalcHistoryStore = create<CalcHistoryState>()(
  persist(
    (set) => ({
      entries: [],
      add: (type, input, output, label) =>
        set((s) => ({
          entries: [
            {
              id: `h_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              type,
              input,
              output,
              label,
              createdAt: new Date().toISOString(),
            },
            ...s.entries,
          ].slice(0, 50),
        })),
      remove: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "ktu_one:calc-history",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
```

---

## bookmark-store.ts

**File:** `/home/z/my-project/src/store/bookmark-store.ts`

```tsx
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface BookmarkEntry {
  id: string;
  kind: "paper" | "syllabus" | "notice" | "subject";
  refId: string;
  title: string;
  subtitle?: string;
  createdAt: string;
}

interface BookmarkState {
  entries: BookmarkEntry[];
  toggle: (entry: Omit<BookmarkEntry, "createdAt">) => boolean;
  has: (kind: BookmarkEntry["kind"], refId: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      entries: [],
      toggle: (entry) => {
        const exists = get().entries.find(
          (e) => e.kind === entry.kind && e.refId === entry.refId,
        );
        if (exists) {
          set((s) => ({ entries: s.entries.filter((e) => e !== exists) }));
          return false;
        }
        set((s) => ({
          entries: [
            { ...entry, createdAt: new Date().toISOString() },
            ...s.entries,
          ],
        }));
        return true;
      },
      has: (kind, refId) =>
        get().entries.some((e) => e.kind === kind && e.refId === refId),
      remove: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "ktu_one:bookmarks",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
```

---
# 7. Mock Data

## src/data/mock-data.ts

**File:** `/home/z/my-project/src/data/mock-data.ts`

```tsx
import type {
  Subject,
  QuestionPaper,
  Syllabus,
  KTUNotice,
  CalendarEvent,
  SubjectResult,
  SemesterResult,
  CGPAResult,
  AttendanceRecord,
  StudentProfile,
  ExamType,
} from "@/lib/types";

/* ---------- Subjects ---------- */

export const SUBJECTS: Subject[] = [
  { id: "s1", code: "CST301", name: "Discrete Computational Structures", semester: 3, branchCode: "CSE", credits: 4, type: "CORE", isElective: false, isLab: false },
  { id: "s2", code: "CST303", name: "Object Oriented Programming Using Java", semester: 3, branchCode: "CSE", credits: 4, type: "CORE", isElective: false, isLab: false },
  { id: "s3", code: "CST305", name: "Data Structures", semester: 3, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
  { id: "s4", code: "CST307", name: "Database Management Systems", semester: 3, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
  { id: "s5", code: "CST309", name: "Computer Organization & Architecture", semester: 3, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
  { id: "s6", code: "CST311", name: "Theory of Computation", semester: 3, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
  { id: "s7", code: "CSL331", name: "Data Structures Lab", semester: 3, branchCode: "CSE", credits: 2, type: "LAB", isElective: false, isLab: true },
  { id: "s8", code: "CSL333", name: "DBMS Lab", semester: 3, branchCode: "CSE", credits: 2, type: "LAB", isElective: false, isLab: true },
  { id: "s9", code: "CST401", name: "Operating Systems", semester: 4, branchCode: "CSE", credits: 4, type: "CORE", isElective: false, isLab: false },
  { id: "s10", code: "CST403", name: "Computer Networks", semester: 4, branchCode: "CSE", credits: 4, type: "CORE", isElective: false, isLab: false },
  { id: "s11", code: "CST405", name: "Microprocessors & Microcontrollers", semester: 4, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
  { id: "s12", code: "CST407", name: "Software Engineering", semester: 4, branchCode: "CSE", credits: 3, type: "CORE", isElective: false, isLab: false },
];

/* ---------- Mock Student ---------- */

export const MOCK_STUDENT: StudentProfile = {
  id: "stu_001",
  registerNumber: "TVE21CS001",
  name: "Aarav Menon",
  branchCode: "CSE",
  branchName: "Computer Science & Engineering",
  semester: 5,
  email: "aarav.menon@example.com",
  phone: "+91 98765 43210",
  admissionYear: 2021,
  scheme: "2019 Scheme",
  avatarInitials: "AM",
};

/* ---------- CGPA / SGPA mock ---------- */

const s3Results: SubjectResult[] = [
  { subjectCode: "CST301", subjectName: "Discrete Computational Structures", credits: 4, grade: "A", gradePoint: 8, passed: true },
  { subjectCode: "CST303", subjectName: "OOP Using Java", credits: 4, grade: "A+", gradePoint: 9, passed: true },
  { subjectCode: "CST305", subjectName: "Data Structures", credits: 3, grade: "O", gradePoint: 10, passed: true },
  { subjectCode: "CST307", subjectName: "DBMS", credits: 3, grade: "B+", gradePoint: 7, passed: true },
  { subjectCode: "CST309", subjectName: "COA", credits: 3, grade: "A", gradePoint: 8, passed: true },
  { subjectCode: "CST311", subjectName: "Theory of Computation", credits: 3, grade: "B+", gradePoint: 7, passed: true },
  { subjectCode: "CSL331", subjectName: "DS Lab", credits: 2, grade: "A+", gradePoint: 9, passed: true },
  { subjectCode: "CSL333", subjectName: "DBMS Lab", credits: 2, grade: "A", gradePoint: 8, passed: true },
];

const s4Results: SubjectResult[] = [
  { subjectCode: "CST401", subjectName: "Operating Systems", credits: 4, grade: "A", gradePoint: 8, passed: true },
  { subjectCode: "CST403", subjectName: "Computer Networks", credits: 4, grade: "O", gradePoint: 10, passed: true },
  { subjectCode: "CST405", subjectName: "Microprocessors", credits: 3, grade: "B+", gradePoint: 7, passed: true },
  { subjectCode: "CST407", subjectName: "Software Engineering", credits: 3, grade: "A+", gradePoint: 9, passed: true },
];

export const MOCK_SEMESTER_RESULTS: SemesterResult[] = [
  {
    semester: 3,
    subjects: s3Results,
    sgpa: 8.23,
    totalCredits: 24,
    creditsEarned: 24,
  },
  {
    semester: 4,
    subjects: s4Results,
    sgpa: 8.43,
    totalCredits: 14,
    creditsEarned: 14,
  },
];

export const MOCK_CGPA: CGPAResult = {
  cgpa: 8.31,
  totalCredits: 38,
  creditsEarned: 38,
  semesters: MOCK_SEMESTER_RESULTS,
};

/* ---------- Attendance mock ---------- */

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { subjectCode: "CST501", subjectName: "Formal Languages & Automata Theory", attended: 32, total: 38, percentage: 84.2, atRisk: false },
  { subjectCode: "CST503", subjectName: "Computer Graphics", attended: 28, total: 40, percentage: 70.0, atRisk: true },
  { subjectCode: "CST505", subjectName: "Machine Learning", attended: 35, total: 38, percentage: 92.1, atRisk: false },
  { subjectCode: "CST507", subjectName: "System Software", attended: 30, total: 36, percentage: 83.3, atRisk: false },
  { subjectCode: "CST509", subjectName: "Compiler Design", attended: 22, total: 38, percentage: 57.9, atRisk: true },
  { subjectCode: "CST511", subjectName: "Industrial Economics", attended: 18, total: 22, percentage: 81.8, atRisk: false },
];

/* ---------- Question Papers ---------- */

const examTypes: ExamType[] = ["END_SEM", "SERIES_1", "SERIES_2", "MODEL"];

function makePapers(): QuestionPaper[] {
  const out: QuestionPaper[] = [];
  const branches = ["CSE", "EC", "EEE", "ME", "IT"] as const;
  const years = [2022, 2023, 2024, 2025];
  const months = [5, 11];
  const subjectsByBranch: Record<string, string[]> = {
    CSE: ["Discrete Structures", "Data Structures", "DBMS", "Operating Systems", "Computer Networks", "OOP Java"],
    EC: ["Signals & Systems", "Digital Electronics", "Analog Circuits", "Microprocessors"],
    EEE: ["Power Systems", "Electrical Machines", "Control Systems"],
    ME: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer"],
    IT: ["Web Technologies", "Cyber Security", "Cloud Computing"],
  };

  let id = 1;
  for (const branch of branches) {
    const subs = subjectsByBranch[branch]!;
    for (const year of years) {
      for (const month of months) {
        for (let s = 0; s < Math.min(2, subs.length); s++) {
          const examType = examTypes[(year + month + s) % examTypes.length]!;
          const sem = ((year - 2021) % 4) + 3;
          out.push({
            id: `paper_${id}`,
            title: `${subs[s]} — ${examType.replace("_", " ")} ${month === 5 ? "May" : "Nov"} ${year}`,
            subjectCode: `${branch.slice(0, 2)}T${300 + sem * 2}${s + 1}`,
            subjectName: subs[s]!,
            semester: sem as 3 | 4 | 5 | 6,
            branchCode: branch,
            year,
            month,
            examType,
            fileUrl: `https://r2.ktuone.in/papers/${branch}/${year}/${month}/${subs[s]?.replace(/\s+/g, "-")}.pdf`,
            fileSizeBytes: 800_000 + Math.floor(Math.random() * 1_500_000),
            pageCount: 6 + Math.floor(Math.random() * 6),
            downloads: Math.floor(Math.random() * 1800),
            views: Math.floor(Math.random() * 4500),
            uploadedAt: new Date(year, month - 1, 10).toISOString(),
            bookmarked: id % 7 === 0,
          });
          id++;
        }
      }
    }
  }
  return out.slice(0, 32);
}

export const MOCK_PAPERS: QuestionPaper[] = makePapers();

/* ---------- Syllabus ---------- */

export const MOCK_SYLLABUS: Syllabus[] = SUBJECTS.slice(0, 10).map((s, i) => ({
  id: `syllabus_${i + 1}`,
  title: `${s.name} — Syllabus`,
  semester: s.semester,
  branchCode: s.branchCode,
  subjectCode: s.code,
  subjectName: s.name,
  version: "v2019.1",
  fileUrl: `https://r2.ktuone.in/syllabus/${s.code}.pdf`,
  lastUpdated: new Date(2024, 7, 15).toISOString(),
  modules: 5,
  bookmarked: i % 5 === 0,
}));

/* ---------- Notices ---------- */

export const MOCK_NOTICES: KTUNotice[] = [
  {
    id: "n1",
    title: "End Semester Examination — December 2025 Timetable Released",
    description:
      "The timetable for the December 2025 End Semester Examinations has been published. All affiliated colleges are requested to ensure students are informed. Examinations commence on December 8, 2025.",
    category: "Examination",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    priority: "Pinned",
    pdfUrl: "https://r2.ktuone.in/notices/dec-2025-timetable.pdf",
    tags: ["end-sem", "timetable", "december"],
    pinned: true,
    active: true,
    read: false,
  },
  {
    id: "n2",
    title: "Revised Internal Assessment Mark Distribution",
    description:
      "Internal assessment marks will now be distributed as 50% series, 30% assignment, and 20% attendance effective Semester 5 onwards.",
    category: "Academic",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    priority: "High",
    tags: ["internal", "assessment"],
    pinned: false,
    active: true,
    read: false,
  },
  {
    id: "n3",
    title: "Scholarship Applications Open — Kerala State Higher Education",
    description:
      "Applications for the Kerala State Higher Education Council scholarship are now open for the academic year 2025-26. Last date: November 30, 2025.",
    category: "Scholarship",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    priority: "High",
    externalUrl: "https://dcescholarship.kerala.gov.in",
    tags: ["scholarship", "kerala"],
    pinned: false,
    active: true,
    read: true,
  },
  {
    id: "n4",
    title: "Placement Drive — TCS, Infosys & Wipro On-Campus",
    description:
      "Three back-to-back placement drives are scheduled in the second week of November. Eligible final-year students must register on the placement portal by November 5.",
    category: "Placement",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    priority: "High",
    tags: ["placement", "tcs", "infosys"],
    pinned: false,
    active: true,
    read: false,
  },
  {
    id: "n5",
    title: "TechFest 2025 — Registrations Open",
    description:
      "The annual technical festival returns this December with hackathons, robotics, paper presentations and contests worth ₹2 lakh in prizes.",
    category: "Cultural",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    priority: "Normal",
    tags: ["techfest", "event"],
    pinned: false,
    active: true,
    read: true,
  },
  {
    id: "n6",
    title: "Valuation of Answer Scripts — Series-2 Results Published",
    description:
      "Series-2 internal examination results for Semester 5 have been published. Students may contact their respective faculty advisors for revaluation requests.",
    category: "Academic",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    priority: "Normal",
    tags: ["series-2", "result"],
    pinned: false,
    active: true,
    read: true,
  },
];

/* ---------- Calendar ---------- */

export const MOCK_CALENDAR: CalendarEvent[] = [
  {
    id: "c1",
    title: "Series-1 Internal Examinations",
    description: "First internal series for Semester 5 across all branches.",
    type: "EXAM",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    allDay: true,
    color: "#9333EA",
    reminderEnabled: true,
  },
  {
    id: "c2",
    title: "Last Date — Scholarship Application",
    description: "Kerala State Higher Education scholarship deadline.",
    type: "DEADLINE",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    allDay: true,
    color: "#F59E0B",
    reminderEnabled: true,
  },
  {
    id: "c3",
    title: "Placement Drive — TCS",
    description: "On-campus placement drive. Aptitude test followed by technical interview.",
    type: "EVENT",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    allDay: true,
    color: "#E11D48",
    reminderEnabled: true,
  },
  {
    id: "c4",
    title: "End-Semester Examination Begins",
    description: "December 2025 End-Semester Examinations commence.",
    type: "EXAM",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).toISOString(),
    allDay: true,
    color: "#9333EA",
    reminderEnabled: true,
  },
  {
    id: "c5",
    title: "Christmas Holidays",
    description: "Holiday break for all affiliated colleges.",
    type: "HOLIDAY",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 38).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 47).toISOString(),
    allDay: true,
    color: "#10B981",
    reminderEnabled: false,
  },
  {
    id: "c6",
    title: "Semester Result Publication",
    description: "Provisional results for Semester 5 end-sem examinations.",
    type: "RESULT",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    allDay: true,
    color: "#0EA5E9",
    reminderEnabled: false,
  },
];

/* ---------- Recent Calculator History (mock) ---------- */

export const MOCK_HISTORY = [
  {
    id: "h1",
    type: "SGPA" as const,
    label: "Semester 5 — Trial 1",
    output: { type: "SGPA" as const, value: 8.45, percentage: 84.5, computedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  },
  {
    id: "h2",
    type: "ATTENDANCE" as const,
    label: "CST503 — Computer Graphics",
    output: { type: "ATTENDANCE" as const, value: 70.0, percentage: 70, computedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
  },
  {
    id: "h3",
    type: "CGPA" as const,
    label: "Up to Semester 4",
    output: { type: "CGPA" as const, value: 8.31, percentage: 83.1, computedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  },
];
```

---
# 8. Pure Utilities (Calculator Logic)

## src/lib/utils/calc.ts

**File:** `/home/z/my-project/src/lib/utils/calc.ts`

```tsx
import { GRADE_POINTS } from "@/lib/types";
import type {
  CalculatorCourse,
  CalculatorResult,
  Grade,
  AttendanceRecord,
} from "@/lib/types";

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.abs(now - then);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (diff < 60_000) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatNumber(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

/* ---------- Calculator logic (pure functions, easily testable) ---------- */

export function computeSGPA(courses: CalculatorCourse[]): CalculatorResult {
  let totalCredits = 0;
  let weighted = 0;
  for (const c of courses) {
    const gp = GRADE_POINTS[c.grade];
    totalCredits += c.credits;
    weighted += gp * c.credits;
  }
  const sgpa = totalCredits > 0 ? weighted / totalCredits : 0;
  return {
    type: "SGPA",
    value: Number(sgpa.toFixed(2)),
    percentage: Number((sgpa * 10).toFixed(1)),
    meta: { totalCredits, courses: courses.length },
    computedAt: new Date().toISOString(),
  };
}

export function computeCGPA(
  semesters: { sgpa: number; credits: number }[],
): CalculatorResult {
  let totalCredits = 0;
  let weighted = 0;
  for (const s of semesters) {
    totalCredits += s.credits;
    weighted += s.sgpa * s.credits;
  }
  const cgpa = totalCredits > 0 ? weighted / totalCredits : 0;
  return {
    type: "CGPA",
    value: Number(cgpa.toFixed(2)),
    percentage: Number((cgpa * 10).toFixed(1)),
    meta: { totalCredits, semesters: semesters.length },
    computedAt: new Date().toISOString(),
  };
}

export function computeAttendance(attended: number, total: number) {
  if (total <= 0) {
    return {
      percentage: 0,
      atRisk: true,
      neededToReach75: 0,
      canBunk: 0,
    };
  }
  const percentage = (attended / total) * 100;
  const atRisk = percentage < 75;
  // classes needed to reach 75%: solve (attended + x) / (total + x) >= 0.75
  // x >= (0.75 * total - attended) / 0.25
  const needed = Math.max(0, Math.ceil((0.75 * total - attended) / 0.25));
  // classes can bunk while staying above 75%: solve (attended) / (total + x) >= 0.75
  // x <= (attended / 0.75) - total
  const canBunk = Math.max(0, Math.floor(attended / 0.75 - total));
  return {
    percentage: Number(percentage.toFixed(1)),
    atRisk,
    neededToReach75: needed,
    canBunk,
  };
}

export function computeInternalMarks(input: {
  series1: number; // out of 50 (best of two series)
  series2: number;
  assignment: number; // out of 10
  attendance: number; // 0..10 (already scaled)
}): CalculatorResult {
  // KTU internal: best of two series scaled to 50, assignment out of 10, attendance out of 10
  const best = Math.max(input.series1, input.series2);
  // best is already out of 50; total internal out of 70
  // (Remaining 30 from end-sem external)
  const internal = best + input.assignment + input.attendance;
  return {
    type: "INTERNAL_MARKS",
    value: Number(internal.toFixed(1)),
    percentage: Number(((internal / 70) * 100).toFixed(1)),
    meta: { bestSeries: best, outOf: 70 },
    computedAt: new Date().toISOString(),
  };
}

export function computePassMarks(input: {
  internalOutOf30: number; // already scaled internal
  passMark: number; // typically 40 for theory, 50 for lab
  totalMarks: number; // typically 100
}): CalculatorResult {
  // end-sem = totalMarks - internalOutOf30 (so end-sem is out of (totalMarks - 30))
  // pass mark typically applies to TOTAL not end-sem.
  // Find end-sem mark needed so that internal + endsem >= passMark
  const externalTotal = input.totalMarks - input.internalOutOf30;
  const neededInExternal = Math.max(0, input.passMark - input.internalOutOf30);
  // Also external must be >= 30% of externalTotal (rule of thumb)
  const minExternal = Math.ceil(0.3 * externalTotal);
  const required = Math.max(neededInExternal, minExternal);
  return {
    type: "PASS_CALCULATOR",
    value: Number(required.toFixed(0)),
    percentage: Number(((required / externalTotal) * 100).toFixed(1)),
    meta: { externalTotal, passMark: input.passMark },
    computedAt: new Date().toISOString(),
  };
}

export function gradeFromMark(mark: number, total = 100): Grade {
  const pct = (mark / total) * 100;
  if (pct >= 90) return "O";
  if (pct >= 80) return "A+";
  if (pct >= 70) return "A";
  if (pct >= 60) return "B+";
  if (pct >= 50) return "B";
  if (pct >= 45) return "C";
  if (pct >= 40) return "P";
  return "F";
}

export function getAttendanceColor(record: AttendanceRecord): string {
  if (record.percentage >= 85) return "var(--success)";
  if (record.percentage >= 75) return "var(--warning)";
  return "var(--destructive)";
}
```

---
# 9. Custom UI Components

## GlassCard

**File:** `/home/z/my-project/src/components/ui-custom/glass-card.tsx`

```tsx
"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardVariant =
  | "default"
  | "strong"
  | "tinted"
  | "warm"
  | "paper"
  | "sketch"
  | "sketch-pencil"
  | "notebook"
  | "index"
  | "kraft"
  | "lined"
  | "magazine";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  float?: boolean;
  as?: "div" | "section" | "article" | "aside";
}

const variantClass: Record<CardVariant, string> = {
  default: "paper-card",       // v3: paper-card is the new default — drawn border, paper texture
  strong: "glass-strong",      // kept for modals/overlays where translucency matters
  tinted: "glass-tinted",
  warm: "glass-warm",
  paper: "paper-card",
  sketch: "sketch-border",
  "sketch-pencil": "sketch-pencil",
  notebook: "lined-page",
  index: "index-card",
  kraft: "kraft-card",
  lined: "lined-page",
  magazine: "magazine-card",
};

/**
 * GlassCard — primary surface across KTU One (v3).
 *
 * The DEFAULT variant is now `paper-card`: a warm cream paper background with
 * a hand-drawn double-stroke border (offset shadow) and subtle paper grain.
 * This is the notebook/sketchbook aesthetic — not a SaaS card.
 *
 * Variants for variety:
 *   - default / paper:    warm paper card with drawn border (USE THIS FOR MOST CARDS)
 *   - index:              index card with red top rule (for stat-style cards)
 *   - kraft:              brown kraft paper (for warm/editorial blocks)
 *   - lined / notebook:   notebook ruled paper with red margin line
 *   - magazine:           crisp editorial card (for formal content)
 *   - strong:             frosted glass (modals/overlays only)
 *   - tinted / warm:      tinted glass (for accents)
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, float = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantClass[variant],
          "rounded-2xl",
          hover && "paper-card-hover",
          float && "float-subtle",
          className,
        )}
        {...props}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);
GlassCard.displayName = "GlassCard";
```

---

## GradientCard

**File:** `/home/z/my-project/src/components/ui-custom/gradient-card.tsx`

```tsx
"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: "plum" | "warm" | "tri" | "lavender";
  hover?: boolean;
  float?: boolean;
}

/**
 * GradientCard — premium gradient surface for hero, support banner, results.
 * v3: paper-textured overlay, embossed title feel, hand-drawn corner accents.
 * Always paired with white text. Now feels like an illustrated notebook cover.
 */
export const GradientCard = forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient = "plum", hover = false, float = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl text-white shadow-floating relative overflow-hidden border-2 border-white/15",
          gradient === "plum" && "bg-gradient-plum",
          gradient === "warm" && "bg-gradient-warm",
          gradient === "tri" && "bg-gradient-tri",
          gradient === "lavender" && "bg-gradient-lavender",
          hover && "transition-all duration-300 hover:shadow-floating hover:-translate-y-0.5",
          float && "float-subtle",
          className,
        )}
        {...props}
      >
        {/* Paper grain texture — makes the gradient feel like illustrated paper */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>\")",
          }}
          aria-hidden="true"
        />
        {/* Soft warm underglow — lower left */}
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-white/8 blur-3xl pointer-events-none" aria-hidden="true" />
        {/* Hairline top highlight — gives "embossed cover" feel */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" aria-hidden="true" />
        {/* Sketchy hand-drawn inner border — like ink illustration */}
        <div
          className="absolute inset-3 rounded-xl pointer-events-none opacity-25"
          style={{
            border: "1.5px solid white",
            borderStyle: "solid",
            maskImage: "linear-gradient(180deg, white, transparent 80%)",
            WebkitMaskImage: "linear-gradient(180deg, white, transparent 80%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);
GradientCard.displayName = "GradientCard";
```

---

## StatCard

**File:** `/home/z/my-project/src/components/ui-custom/stat-card.tsx`

```tsx
"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: string;
  accent?: "plum" | "amber" | "mint" | "coral" | "lavender";
  variant?: "index" | "kraft" | "lined" | "paper";
  rotate?: number; // slight rotation for handcrafted, corkboard feel
}

const accentInkClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  plum: "text-primary",
  amber: "text-amber-700 dark:text-amber-400",
  mint: "text-emerald-700 dark:text-emerald-400",
  coral: "text-rose-700 dark:text-rose-400",
  lavender: "text-[oklch(0.45_0.12_280)] dark:text-[oklch(0.72_0.10_280)]",
};

const accentBgClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  plum: "bg-primary/15",
  amber: "bg-amber-500/15",
  mint: "bg-emerald-500/15",
  coral: "bg-rose-500/15",
  lavender: "bg-[oklch(0.50_0.12_280/0.15)]",
};

const variantClass: Record<NonNullable<StatCardProps["variant"]>, string> = {
  index: "index-card",
  kraft: "kraft-card",
  lined: "lined-page",
  paper: "paper-card",
};

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      label,
      value,
      icon,
      hint,
      accent = "plum",
      variant = "index",
      rotate = 0,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantClass[variant],
          "rounded-2xl p-5 pt-7 transition-all duration-300 hover:-translate-y-1",
          className,
        )}
        style={rotate !== 0 ? { transform: `rotate(${rotate}deg)` } : undefined}
        {...props}
      >
        {/* Pushpin at top — like pinned to a corkboard */}
        <div className="pushpin" aria-hidden="true" />

        <div className="flex items-start gap-3.5">
          {icon && (
            <div
              className={cn(
                "size-11 rounded-xl flex items-center justify-center shrink-0 border border-foreground/10",
                accentBgClasses[accent],
                accentInkClasses[accent],
              )}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold">
              {label}
            </p>
            <p className="stamped-number text-3xl sm:text-4xl mt-1.5">
              {value}
            </p>
            {hint && (
              <p className="text-xs text-muted-foreground mt-1.5 italic">
                {hint}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
);
StatCard.displayName = "StatCard";
```

---

## CircularProgress

**File:** `/home/z/my-project/src/components/ui-custom/circular-progress.tsx`

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0..100
  size?: number;
  strokeWidth?: number;
  color?: string; // CSS color (defaults to primary)
  trackColor?: string;
  label?: string;
  sublabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  color = "var(--primary)",
  trackColor = "var(--muted)",
  label,
  sublabel,
  className,
  children,
}: CircularProgressProps) {
  const prefersReduced = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: prefersReduced ? offset : offset }}
          transition={prefersReduced ? { duration: 0 } : { duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children ?? (
          <>
            {label && (
              <span className="text-2xl font-bold tracking-tight">{label}</span>
            )}
            {sublabel && (
              <span className="text-xs text-muted-foreground">{sublabel}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
```

---

## AnimatedCounter

**File:** `/home/z/my-project/src/components/ui-custom/animated-counter.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number; // seconds
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(prefersReduced ? value : 0);
  const rafRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    if (prefersReduced) {
      // Use microtask to avoid synchronous setState in effect
      Promise.resolve().then(() => setDisplay(value));
      return;
    }
    const from = fromRef.current;
    const to = value;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, prefersReduced]);

  const formatted = display.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
```

---

## EmptyState

**File:** `/home/z/my-project/src/components/ui-custom/empty-state.tsx`

```tsx
"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  illustration?: React.ReactNode;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  compact?: boolean;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      title,
      description,
      illustration,
      primaryAction,
      secondaryAction,
      compact = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          compact ? "py-8 px-4" : "py-16 px-6",
          className,
        )}
        {...props}
      >
        {illustration && (
          <div className={cn(compact ? "mb-3" : "mb-6")}>{illustration}</div>
        )}
        <h3 className={cn("font-semibold tracking-tight", compact ? "text-base" : "text-xl")}>
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">{description}</p>
        )}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center gap-3 mt-6">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition shadow-soft"
              >
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);
EmptyState.displayName = "EmptyState";
```

---

## BannerAd

**File:** `/home/z/my-project/src/components/ui-custom/banner-ad.tsx`

```tsx
"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getAdsProvider } from "@/lib/providers/ads";
import type { AdSlot } from "@/lib/providers/ads";
import { useSupporterStore } from "@/store/supporter-store";
import { useNavStore } from "@/store/nav-store";
import { cn } from "@/lib/utils";

interface BannerAdProps {
  slot: AdSlot;
  className?: string;
}

/**
 * <BannerAd /> — the only ad component pages may render.
 * It pulls the descriptor from AdsProvider and renders the appropriate UI.
 * Pages never import ad SDKs.
 */
export function BannerAd({ slot, className }: BannerAdProps) {
  const isSupporter = useSupporterStore((s) => s.isSupporter);
  const setSupportOpen = useNavStore((s) => s.setSupportOpen);
  const prefersReduced = useReducedMotion();

  const ad = useMemo(() => getAdsProvider().getAd(slot), [slot]);
  const showAd = !isSupporter && getAdsProvider().isEnabled();

  if (!showAd) {
    // Supporters see a tiny "supporter" ribbon instead of an ad.
    return (
      <div
        className={cn(
          "glass rounded-2xl px-5 py-3 flex items-center justify-between gap-3",
          className,
        )}
      >
        <div className="flex items-center gap-2.5 text-sm">
          <Sparkles className="size-4 text-primary" />
          <span className="font-medium text-foreground">
            Ad-free experience
          </span>
          <span className="text-muted-foreground text-xs">
            — Thanks for being a Supporter 💜
          </span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
          Lifetime
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "glass rounded-2xl overflow-hidden relative",
        className,
      )}
      style={{ minHeight: ad.height }}
      role="complementary"
      aria-label="Sponsored content"
    >
      <div className="absolute top-2 right-3 text-[10px] uppercase tracking-widest text-muted-foreground/70 font-medium">
        Ad
      </div>
      <div className="h-full flex flex-col items-center justify-center text-center px-6 py-4">
        <div className="text-xs text-muted-foreground mb-1">{ad.label}</div>
        <div className="text-sm font-medium text-foreground">
          Your banner could be here
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Respectful, non-intrusive advertising · Free users only
        </div>
        <button
          onClick={() => setSupportOpen(true)}
          className="mt-2 text-xs text-primary hover:underline font-medium"
        >
          Go ad-free for ₹99 →
        </button>
      </div>
    </motion.div>
  );
}
```

---
# 10. Sketch & Editorial Components

## SketchElements

**File:** `/home/z/my-project/src/components/ui-custom/sketch-elements.tsx`

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * SketchElements — a small collection of hand-drawn SVG accents.
 * Use sparingly — 1-2 per screen, never more.
 * All elements are decorative (aria-hidden) and respect reduced motion.
 */

type SketchColor = "plum" | "coral" | "amber" | "mint" | "lavender";

const colorMap: Record<SketchColor, string> = {
  plum: "oklch(0.55 0.18 340)",
  coral: "oklch(0.65 0.18 20)",
  amber: "oklch(0.70 0.13 70)",
  mint: "oklch(0.65 0.11 155)",
  lavender: "oklch(0.60 0.12 280)",
};

interface SketchProps {
  className?: string;
  color?: SketchColor;
  size?: number;
}

/* Curved hand-drawn arrow — points up-right */
export function SketchArrow({ className, color = "coral", size = 48 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      <path
        d="M6 38 Q 18 30 24 22 T 40 8"
        stroke={c}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        style={{ strokeDasharray: 60, strokeDashoffset: 0 }}
      />
      <path
        d="M32 6 L 40 8 L 38 16"
        stroke={c}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* Hand-drawn underline stroke */
export function SketchUnderline({ className, color = "coral", size = 80 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size * 0.16}
      viewBox="0 0 80 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M3 8 Q 20 2 40 6 T 77 7"
        stroke={c}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* Sparkle — 4-pointed star */
export function SketchSparkle({ className, color = "amber", size = 16 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      <path
        d="M8 1 Q 9 6 15 8 Q 9 10 8 15 Q 7 10 1 8 Q 7 6 8 1 Z"
        fill={c}
      />
    </svg>
  );
}

/* Small 4-dot trail — for leading the eye */
export function SketchDotTrail({ className, color = "lavender", size = 24 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size * 2}
      height={size}
      viewBox="0 0 48 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      <circle cx="3" cy="6" r="2" fill={c} opacity="0.4" />
      <circle cx="14" cy="6" r="2" fill={c} opacity="0.6" />
      <circle cx="25" cy="6" r="2" fill={c} opacity="0.8" />
      <circle cx="36" cy="6" r="2.5" fill={c} />
    </svg>
  );
}

/* Tiny star (5-pointed) */
export function SketchStar({ className, color = "amber", size = 14 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      <path
        d="M7 1 L 8.4 5.2 L 13 5.5 L 9.3 8.3 L 10.5 13 L 7 10.4 L 3.5 13 L 4.7 8.3 L 1 5.5 L 5.6 5.2 Z"
        fill={c}
      />
    </svg>
  );
}

/* Curved connector — for connecting elements visually */
export function SketchCurve({ className, color = "plum", size = 60 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      <path
        d="M5 55 Q 15 20 55 5"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="3 5"
      />
    </svg>
  );
}

/* Floating particles — a cluster of small drifting dots */
export function FloatingParticles({
  className,
  count = 6,
  colors = ["amber", "coral", "lavender"],
}: {
  className?: string;
  count?: number;
  colors?: SketchColor[];
}) {
  const prefersReduced = useReducedMotion();
  const particles = Array.from({ length: count }).map((_, i) => {
    const colorKey = colors[i % colors.length]!;
    const color = colorMap[colorKey];
    // Deterministic positions to avoid hydration mismatch
    const positions = [
      { x: 8, y: 18, size: 4, delay: 0 },
      { x: 28, y: 60, size: 3, delay: 0.4 },
      { x: 52, y: 14, size: 5, delay: 0.8 },
      { x: 72, y: 70, size: 3, delay: 1.2 },
      { x: 88, y: 30, size: 4, delay: 1.6 },
      { x: 42, y: 38, size: 3, delay: 2.0 },
      { x: 16, y: 78, size: 4, delay: 2.4 },
      { x: 64, y: 88, size: 3, delay: 2.8 },
    ];
    const p = positions[i % positions.length]!;
    return { ...p, color };
  });

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.6,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={
            prefersReduced
              ? { opacity: 0.5 }
              : {
                  y: [0, -12, 0],
                  opacity: [0, 0.7, 0.2],
                }
          }
          transition={{
            duration: 4 + (i % 3),
            delay: p.delay,
            repeat: prefersReduced ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* Paper plane — hand-drawn, tilted */
export function SketchPaperPlane({ className, color = "coral", size = 28 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      <path
        d="M2 14 L 26 4 L 18 26 L 14 16 Z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={c}
        fillOpacity="0.15"
      />
      <path d="M14 16 L 26 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      {/* Motion lines */}
      <path d="M5 18 L 9 19" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M3 22 L 8 23" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

/* Checkmark in a hand-drawn circle */
export function SketchCheckmark({ className, color = "mint", size = 20 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      <path
        d="M3 10 Q 4 5 10 4 Q 16 5 17 10 Q 16 16 10 16 Q 4 15 3 10 Z"
        stroke={c}
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M6 10 L 9 13 L 14 7"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* Loose scribble — for under-the-word accents */
export function SketchScribble({ className, color = "plum", size = 40 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size * 0.4}
      viewBox="0 0 40 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      <path
        d="M2 10 Q 6 4 10 10 T 18 10 T 26 8 T 38 10"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* Heart — small hand-drawn heart */
export function SketchHeart({ className, color = "coral", size = 16 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      <path
        d="M8 14 Q 1 9 1 5 Q 1 1 4 1 Q 6 1 8 4 Q 10 1 12 1 Q 15 1 15 5 Q 15 9 8 14 Z"
        stroke={c}
        strokeWidth="1.6"
        fill={c}
        fillOpacity="0.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Coffee cup — for "study session" feel */
export function SketchCoffeeCup({ className, color = "coral", size = 36 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      {/* Steam */}
      <path d="M11 4 Q 9 7 11 10 Q 13 13 11 16" stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M17 4 Q 15 7 17 10 Q 19 13 17 16" stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* Cup body */}
      <path
        d="M6 14 L 8 30 Q 8 32 10 32 L 20 32 Q 22 32 22 30 L 24 14 Z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={c}
        fillOpacity="0.12"
      />
      {/* Handle */}
      <path
        d="M24 18 Q 30 18 30 22 Q 30 26 24 26"
        stroke={c}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Saucer */}
      <ellipse cx="15" cy="34" rx="13" ry="1.5" stroke={c} strokeWidth="1.4" fill="none" opacity="0.6" />
    </svg>
  );
}

/* Graduation cap */
export function SketchGradCap({ className, color = "plum", size = 36 }: SketchProps) {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      <path
        d="M3 14 L 18 8 L 33 14 L 18 20 Z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={c}
        fillOpacity="0.15"
      />
      <path d="M9 17 L 9 24 Q 18 28 27 24 L 27 17" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Tassel */}
      <path d="M30 14 L 30 22" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="30" cy="24" r="2" fill={c} />
    </svg>
  );
}

/* Stack of books */
export function SketchBooks({ className, color = "lavender", size = 48 }: SketchProps) {
  const c = colorMap[color];
  const amber = colorMap.amber;
  const coral = colorMap.coral;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      {/* Bottom book — lavender */}
      <rect x="6" y="34" width="36" height="8" rx="1.5" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.12" />
      <line x1="6" y1="38" x2="42" y2="38" stroke={c} strokeWidth="1" opacity="0.5" />
      {/* Middle book — amber, slightly offset */}
      <rect x="9" y="24" width="32" height="8" rx="1.5" stroke={amber} strokeWidth="1.8" fill={amber} fillOpacity="0.15" />
      <line x1="9" y1="28" x2="41" y2="28" stroke={amber} strokeWidth="1" opacity="0.5" />
      {/* Top book — coral, slightly offset */}
      <rect x="7" y="14" width="34" height="8" rx="1.5" stroke={coral} strokeWidth="1.8" fill={coral} fillOpacity="0.12" />
      <line x1="7" y1="18" x2="41" y2="18" stroke={coral} strokeWidth="1" opacity="0.5" />
      {/* Bookmark sticking out */}
      <path d="M32 14 L 32 22 L 34 20 L 36 22 L 36 14" stroke={c} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

/* Pencil — diagonal */
export function SketchPencil({ className, color = "amber", size = 32 }: SketchProps) {
  const c = colorMap[color];
  const plum = colorMap.plum;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      {/* Pencil body */}
      <path
        d="M4 28 L 22 10 L 28 4 L 30 6 L 24 12 L 6 30 Z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={c}
        fillOpacity="0.15"
      />
      {/* Tip */}
      <path d="M4 28 L 6 30 L 8 28 L 6 26 Z" stroke={plum} strokeWidth="1.4" fill={plum} fillOpacity="0.5" strokeLinejoin="round" />
      {/* Wood band */}
      <line x1="20" y1="12" x2="24" y2="16" stroke={plum} strokeWidth="1.2" opacity="0.6" />
      <line x1="22" y1="10" x2="26" y2="14" stroke={plum} strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

/* Open notebook with ruled lines */
export function SketchNotebook({ className, color = "plum", size = 48 }: SketchProps) {
  const c = colorMap[color];
  const coral = colorMap.coral;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      {/* Pages */}
      <path
        d="M4 10 L 24 14 L 44 10 L 44 38 L 24 42 L 4 38 Z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={c}
        fillOpacity="0.06"
      />
      {/* Center spine */}
      <line x1="24" y1="14" x2="24" y2="42" stroke={c} strokeWidth="1.6" />
      {/* Margin lines on left page */}
      <line x1="9" y1="16" x2="9" y2="36" stroke={coral} strokeWidth="1.2" opacity="0.4" />
      {/* Ruled lines */}
      <line x1="12" y1="20" x2="22" y2="22" stroke={c} strokeWidth="1" opacity="0.4" />
      <line x1="12" y1="24" x2="22" y2="26" stroke={c} strokeWidth="1" opacity="0.4" />
      <line x1="12" y1="28" x2="22" y2="30" stroke={c} strokeWidth="1" opacity="0.4" />
      <line x1="12" y1="32" x2="22" y2="34" stroke={c} strokeWidth="1" opacity="0.4" />
      <line x1="26" y1="20" x2="40" y2="18" stroke={c} strokeWidth="1" opacity="0.4" />
      <line x1="26" y1="24" x2="40" y2="22" stroke={c} strokeWidth="1" opacity="0.4" />
      <line x1="26" y1="28" x2="40" y2="26" stroke={c} strokeWidth="1" opacity="0.4" />
      <line x1="26" y1="32" x2="40" y2="30" stroke={c} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
```

---

## HandwrittenText

**File:** `/home/z/my-project/src/components/ui-custom/handwritten-text.tsx`

```tsx
"use client";

import { cn } from "@/lib/utils";

interface HandwrittenTextProps {
  children: React.ReactNode;
  className?: string;
  color?: "plum" | "coral" | "amber" | "mint" | "lavender" | "ink";
  as?: "span" | "p" | "h1" | "h2" | "h3";
}

const colorClasses: Record<NonNullable<HandwrittenTextProps["color"]>, string> = {
  plum: "text-primary",
  coral: "text-[oklch(0.55_0.18_20)] dark:text-[oklch(0.72_0.16_20)]",
  amber: "text-[oklch(0.55_0.13_70)] dark:text-[oklch(0.78_0.12_70)]",
  mint: "text-[oklch(0.50_0.11_155)] dark:text-[oklch(0.72_0.10_155)]",
  lavender: "text-[oklch(0.50_0.12_280)] dark:text-[oklch(0.72_0.10_280)]",
  ink: "text-foreground",
};

/**
 * HandwrittenText — sparingly used for accent words.
 * Renders in Caveat font (loaded via layout.tsx).
 * Use for: "Sorted.", "Great Job", "Keep Going", "Ready?"
 */
export function HandwrittenText({
  children,
  className,
  color = "coral",
  as: Tag = "span",
}: HandwrittenTextProps) {
  return (
    <Tag
      className={cn(
        "font-hand font-semibold leading-none",
        colorClasses[color],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

---

## CardDecoration

**File:** `/home/z/my-project/src/components/ui-custom/card-decoration.tsx`

```tsx
"use client";

import { cn } from "@/lib/utils";
import { SketchStar, SketchHeart, SketchCheckmark, SketchArrow } from "./sketch-elements";
import { motion, useReducedMotion } from "framer-motion";

/**
 * CardDecoration — decorative accents to give cards personality.
 * Use sparingly — 1 decoration per card, never more.
 *
 * Variants:
 *   paperClip   — metallic paper clip on top-right edge
 *   pageFold    — corner of card looks folded
 *   tapeStrip   — washi tape at top
 *   cornerStar  — small star doodle in corner
 *   cornerHeart — small heart in corner
 *   stickyNote  — entire card is a yellow sticky note
 *   cornerCheck — checkmark badge in corner
 */

export type DecorationVariant =
  | "paperClip"
  | "pageFold"
  | "tapeStrip"
  | "cornerStar"
  | "cornerHeart"
  | "cornerCheck";

interface CardDecorationProps {
  variant: DecorationVariant;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  color?: "plum" | "coral" | "amber" | "mint" | "lavender";
}

const positionClass: Record<NonNullable<CardDecorationProps["position"]>, string> = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-2 right-2",
};

export function CardDecoration({
  variant,
  position = "top-right",
  className,
  color = "amber",
}: CardDecorationProps) {
  const prefersReduced = useReducedMotion();

  if (variant === "paperClip") {
    return <div className={cn("paper-clip", className)} aria-hidden="true" />;
  }

  if (variant === "pageFold") {
    return <div className={cn("page-fold absolute inset-0 pointer-events-none", className)} aria-hidden="true" />;
  }

  if (variant === "tapeStrip") {
    return (
      <div
        className={cn("tape-strip", className)}
        style={{ top: "-10px", left: "50%", marginLeft: "-40px" }}
        aria-hidden="true"
      />
    );
  }

  // SVG-based corner doodles
  const icons = {
    cornerStar: SketchStar,
    cornerHeart: SketchHeart,
    cornerCheck: SketchCheckmark,
  } as const;

  const Icon = icons[variant as "cornerStar" | "cornerHeart" | "cornerCheck"];

  return (
    <motion.div
      className={cn("absolute pointer-events-none", positionClass[position], className)}
      initial={prefersReduced ? false : { opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 220, damping: 14 }}
      aria-hidden="true"
    >
      <Icon size={variant === "cornerCheck" ? 22 : 16} color={color} />
    </motion.div>
  );
}

/* Notebook-style section header — handwritten feel */
interface NotebookHeaderProps {
  title: string;
  subtitle?: string;
  accent?: React.ReactNode;
  onSeeAll?: () => void;
  compact?: boolean;
  className?: string;
}

export function NotebookHeader({
  title,
  subtitle,
  accent,
  onSeeAll,
  compact = false,
  className,
}: NotebookHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", compact ? "mb-3" : "mb-4", className)}>
      <div className="flex items-start gap-3">
        {/* Small notebook margin line */}
        <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary/40 to-primary/10 mt-1" />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className={cn("font-bold tracking-tight", compact ? "text-base" : "text-xl")}>
              {title}
            </h2>
            {accent}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="btn-tactile text-xs text-primary hover:underline font-medium flex items-center gap-1 shrink-0 px-2 py-1 rounded-full hover:bg-primary/5"
        >
          See all <SketchArrow size={14} color="plum" />
        </button>
      )}
    </div>
  );
}

/* Sticky note — a yellow post-it style note with handwritten text */
interface StickyNoteProps {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
}

export function StickyNote({ children, className, rotate = -2 }: StickyNoteProps) {
  return (
    <div
      className={cn("sticky-note rounded-md p-4 relative", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="relative z-10 handwritten-note text-foreground">
        {children}
      </div>
    </div>
  );
}
```

---

## EditorialDivider

**File:** `/home/z/my-project/src/components/ui-custom/editorial-divider.tsx`

```tsx
"use client";

import { cn } from "@/lib/utils";

interface EditorialDividerProps {
  className?: string;
  ornament?: "star" | "diamond" | "diamond-fill" | "dot" | "none";
  label?: string; // optional small label in the middle
}

/**
 * EditorialDivider — magazine-style rule with central ornament.
 * Used between sections to create editorial pacing (not SaaS stack spacing).
 */
export function EditorialDivider({
  className,
  ornament = "diamond",
  label,
}: EditorialDividerProps) {
  return (
    <div className={cn("editorial-rule my-6", className)} aria-hidden="true">
      {ornament === "star" && <OrnamentStar />}
      {ornament === "diamond" && <OrnamentDiamond filled={false} />}
      {ornament === "diamond-fill" && <OrnamentDiamond filled={true} />}
      {ornament === "dot" && <OrnamentDot />}
      {ornament === "none" && !label && <span className="w-1.5 h-1.5" />}
      {label && (
        <span className="font-handwritten text-base text-muted-foreground tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
}

function OrnamentStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 1 L 8.4 5.2 L 13 5.5 L 9.3 8.3 L 10.5 13 L 7 10.4 L 3.5 13 L 4.7 8.3 L 1 5.5 L 5.6 5.2 Z"
        fill="oklch(0.55 0.18 340 / 0.6)"
      />
    </svg>
  );
}

function OrnamentDiamond({ filled }: { filled: boolean }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 1 L 9 5 L 5 9 L 1 5 Z"
        stroke="oklch(0.55 0.18 340 / 0.6)"
        strokeWidth="1.2"
        fill={filled ? "oklch(0.55 0.18 340 / 0.6)" : "none"}
      />
    </svg>
  );
}

function OrnamentDot() {
  return (
    <span
      className="block w-1.5 h-1.5 rounded-full"
      style={{ background: "oklch(0.55 0.18 340 / 0.5)" }}
    />
  );
}
```

---

## Logo

**File:** `/home/z/my-project/src/components/brand/logo.tsx`

```tsx
"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 32, withWordmark = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="KTU One"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--gradient-1)" />
            <stop offset="100%" stopColor="var(--gradient-2)" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#logo-grad)" />
        {/* K shape — minimalist */}
        <path
          d="M14 11 L14 29 M14 20 L24 11 M14 20 L24 29"
          stroke="white"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="29" cy="14" r="2.5" fill="var(--gradient-3)" />
      </svg>
      {withWordmark && (
        <div className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-tight">
            KTU One
          </span>
          <span className="text-[10px] text-muted-foreground tracking-wide">
            Student Companion
          </span>
        </div>
      )}
    </div>
  );
}
```

---
# 11. Layout Components

## AppShell

**File:** `/home/z/my-project/src/components/layout/app-shell.tsx`

```tsx
"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Home,
  Calculator,
  FileText,
  BookOpen,
  CalendarDays,
  Bell,
  Settings,
  Search,
  Heart,
  Moon,
  Sun,
  Menu,
  X,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavStore } from "@/store/nav-store";
import { useThemeStore } from "@/store/theme-store";
import { useSupporterStore } from "@/store/supporter-store";
import { useAuthStore } from "@/store/auth-store";
import { NAV_ITEMS, PRIMARY_NAV_KEYS, APP_NAME } from "@/lib/constants";
import type { NavKey } from "@/lib/constants";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { getAnalyticsProvider } from "@/lib/providers/analytics";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Calculator,
  FileText,
  BookOpen,
  CalendarDays,
  Bell,
  Settings,
};

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const active = useNavStore((s) => s.active);
  const setActive = useNavStore((s) => s.set);
  const setSearchOpen = useNavStore((s) => s.setSearchOpen);
  const setSupportOpen = useNavStore((s) => s.setSupportOpen);
  const setLoginOpen = useNavStore((s) => s.setLoginOpen);
  const resolved = useThemeStore((s) => s.resolved);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const isSupporter = useSupporterStore((s) => s.isSupporter);
  const profile = useAuthStore((s) => s.profile);
  const [mobileMenu, setMobileMenu] = useState(false);

  const navigate = (key: NavKey) => {
    setActive(key);
    setMobileMenu(false);
    getAnalyticsProvider().track({
      name: "page_view",
      props: { path: key },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top navbar */}
      <header className="sticky top-0 z-40 safe-top">
        <div className="glass border-b border-border/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenu(true)}
                className="lg:hidden size-10 rounded-xl hover:bg-secondary flex items-center justify-center"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
              <button
                onClick={() => navigate("dashboard")}
                className="flex items-center gap-2.5 no-tap-highlight"
              >
                <Logo size={32} withWordmark />
              </button>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = ICONS[item.icon] ?? Home;
                const isActive = active === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.key)}
                    className={cn(
                      "btn-tactile relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="size-10 rounded-xl hover:bg-secondary flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="size-5" />
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                  getAnalyticsProvider().track({
                    name: "theme_changed",
                    props: { theme: resolved === "light" ? "dark" : "light" },
                  });
                }}
                className="size-10 rounded-xl hover:bg-secondary flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {resolved === "light" ? (
                  <Moon className="size-5" />
                ) : (
                  <Sun className="size-5" />
                )}
              </button>

              {isSupporter ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Heart className="size-3.5" fill="currentColor" />
                  Supporter
                </div>
              ) : (
                <button
                  onClick={() => setSupportOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition shadow-soft"
                >
                  <Heart className="size-3.5" fill="currentColor" />
                  Support
                </button>
              )}

              {profile ? (
                <div className="size-9 rounded-full bg-gradient-plum flex items-center justify-center text-white text-xs font-semibold">
                  {profile.avatarInitials}
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="size-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition"
                  aria-label="Login"
                >
                  <User className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body — sidebar + main */}
      <div className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 flex gap-6 py-6">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = ICONS[item.icon] ?? Home;
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-border/60">
              {!isSupporter && (
                <button
                  onClick={() => setSupportOpen(true)}
                  className="w-full p-3 rounded-2xl bg-gradient-plum text-white text-left hover:opacity-95 transition shadow-soft"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="size-4" fill="currentColor" />
                    <span className="text-sm font-semibold">Support KTU One</span>
                  </div>
                  <p className="text-xs opacity-90">Remove ads · ₹99 lifetime</p>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-6">{children}</main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 safe-bottom">
        <div className="glass-strong border-t border-border/40 px-2 py-2">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {PRIMARY_NAV_KEYS.map((key) => {
              const item = NAV_ITEMS.find((i) => i.key === key)!;
              const Icon = ICONS[item.icon] ?? Home;
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => navigate(key)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors min-w-[58px]",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {mobileMenu && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
            />
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-72 glass-strong p-5 flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-between mb-6">
                <Logo size={32} withWordmark />
                <button
                  onClick={() => setMobileMenu(false)}
                  className="size-9 rounded-xl hover:bg-secondary flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = ICONS[item.icon] ?? Home;
                  const isActive = active === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => navigate(item.key)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary/60",
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              {!isSupporter && (
                <button
                  onClick={() => {
                    setMobileMenu(false);
                    setSupportOpen(true);
                  }}
                  className="mt-auto p-4 rounded-2xl bg-gradient-plum text-white text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="size-4" fill="currentColor" />
                    <span className="text-sm font-semibold">Support KTU One</span>
                  </div>
                  <p className="text-xs opacity-90">Remove ads · ₹99 lifetime</p>
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## PageHeader

**File:** `/home/z/my-project/src/components/layout/page-header.tsx`

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
  className,
}: PageHeaderProps) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  );
}
```

---
# 12. Feature Views

## Dashboard

**File:** `/home/z/my-project/src/features/dashboard/dashboard.tsx`

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Trophy,
  Award,
  CalendarCheck,
  ClipboardList,
  Target,
  FileText,
  BookOpen,
  Bell,
  CalendarDays,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
  Heart,
} from "lucide-react";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { StatCard } from "@/components/ui-custom/stat-card";
import { AnimatedCounter } from "@/components/ui-custom/animated-counter";
import { CircularProgress } from "@/components/ui-custom/circular-progress";
import { BannerAd } from "@/components/ui-custom/banner-ad";
import { HandwrittenText } from "@/components/ui-custom/handwritten-text";
import {
  SketchArrow,
  SketchHeart,
  SketchCoffeeCup,
  SketchBooks,
  SketchPencil,
  SketchNotebook,
} from "@/components/ui-custom/sketch-elements";
import { CardDecoration } from "@/components/ui-custom/card-decoration";
import { EditorialDivider } from "@/components/ui-custom/editorial-divider";
import { useNavStore } from "@/store/nav-store";
import { useSupporterStore } from "@/store/supporter-store";
import { useAuthStore } from "@/store/auth-store";
import {
  CALCULATORS,
  APP_VERSION,
  UNIVERSITY_NAME,
  type NavKey,
  type CalculatorKey,
} from "@/lib/constants";
import {
  MOCK_PAPERS,
  MOCK_NOTICES,
  MOCK_CALENDAR,
  MOCK_HISTORY,
  MOCK_STUDENT,
} from "@/data/mock-data";
import { formatRelativeTime, formatNumber } from "@/lib/utils/calc";

const calcIcons: Record<CalculatorKey, React.ComponentType<{ className?: string }>> = {
  sgpa: Trophy,
  cgpa: Award,
  attendance: CalendarCheck,
  internal: ClipboardList,
  pass: Target,
};

const accentMap: Record<string, "plum" | "amber" | "mint" | "coral"> = {
  plum: "plum",
  amber: "amber",
  mint: "mint",
  coral: "coral",
};

export function Dashboard() {
  const set = useNavStore((s) => s.set);
  const setSupportOpen = useNavStore((s) => s.setSupportOpen);
  const isSupporter = useSupporterStore((s) => s.isSupporter);
  const profile = useAuthStore((s) => s.profile);
  const prefersReduced = useReducedMotion();

  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => {
    const h = new Date().getHours();
    const g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    Promise.resolve().then(() => setGreeting(g));
  }, []);

  const firstName = (profile?.name ?? MOCK_STUDENT.name).split(" ")[0]!;
  const upcomingEvent = MOCK_CALENDAR[0]!;

  const recentPapers = MOCK_PAPERS.slice(0, 4);
  const recentNotices = MOCK_NOTICES.slice(0, 3);
  const recentHistory = MOCK_HISTORY.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero — editorial notebook cover (paper, not gradient) */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="notebook-cover p-7 sm:p-12 pl-12 sm:pl-14 float-subtle">
          {/* Study desk illustrations cluster — top right */}
          <motion.div
            className="absolute top-8 right-8 hidden lg:flex items-end gap-1 pointer-events-none opacity-90"
            initial={prefersReduced ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <SketchBooks size={56} color="amber" />
            <div className="-ml-2 -mb-1">
              <SketchCoffeeCup size={36} color="coral" />
            </div>
            <div className="-ml-1 -mb-2">
              <SketchPencil size={28} color="amber" />
            </div>
          </motion.div>

          <div className="flex items-start justify-between gap-4 flex-wrap relative">
            <div className="flex-1 min-w-[200px]">
              {/* Handwritten annotation above heading */}
              <motion.div
                className="mb-3"
                initial={prefersReduced ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <HandwrittenText as="p" color="amber" className="text-2xl rotate-[-3deg] inline-block">
                  {greeting}, {firstName} 👋
                </HandwrittenText>
              </motion.div>

              {/* Serif display headline — embossed into notebook cover */}
              <h1 className="font-serif-display embossed-title-ink text-4xl sm:text-6xl leading-[1.02]">
                Your academic day,
                <br className="hidden sm:block" />
                <span className="relative inline-block italic">
                  sorted.
                  <HandwrittenText
                    as="span"
                    color="amber"
                    className="absolute -top-7 -right-6 text-2xl rotate-[8deg] hidden sm:block not-italic"
                  >
                    !
                  </HandwrittenText>
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                {profile
                  ? `${profile.branchName} · Semester ${profile.semester}`
                  : "Sign in to see your CGPA, attendance and results."}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-7">
                <button
                  onClick={() => set("calculators")}
                  className="btn-tactile px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 shadow-soft hover:opacity-90"
                >
                  <Sparkles className="size-4" />
                  Open a calculator
                </button>
                {!isSupporter && (
                  <button
                    onClick={() => setSupportOpen(true)}
                    className="btn-tactile px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 flex items-center gap-2 border border-border/60"
                  >
                    <Heart className="size-3.5" fill="currentColor" />
                    Go ad-free · ₹99
                  </button>
                )}
              </div>
            </div>
            {/* Editorial illustration cluster */}
            <div className="hidden sm:block relative">
              <motion.div
                className="flex items-end gap-1"
                initial={prefersReduced ? false : { opacity: 0, scale: 0.85, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 16 }}
              >
                <SketchNotebook size={120} color="plum" />
                <div className="-ml-3 -mb-1">
                  <SketchPencil size={44} color="amber" />
                </div>
              </motion.div>
              {/* Tiny floating sketch arrow accent */}
              <motion.div
                className="absolute -top-3 -left-8"
                initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <SketchArrow size={36} color="amber" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick stats — index cards pinned to a corkboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current CGPA"
          value={<AnimatedCounter value={8.31} decimals={2} />}
          icon={<TrendingUp className="size-5" />}
          accent="plum"
          variant="index"
          rotate={-1}
          hint="Across 2 semesters"
        />
        <StatCard
          label="Attendance"
          value={
            <span>
              <AnimatedCounter value={78.2} decimals={1} />%
            </span>
          }
          icon={<CalendarCheck className="size-5" />}
          accent="amber"
          variant="index"
          rotate={1}
          hint="2 subjects at risk"
        />
        <StatCard
          label="Papers"
          value={<AnimatedCounter value={1280} />}
          icon={<FileText className="size-5" />}
          accent="mint"
          variant="index"
          rotate={-0.5}
          hint="Available to download"
        />
        <StatCard
          label="Notices"
          value={<AnimatedCounter value={6} />}
          icon={<Bell className="size-5" />}
          accent="coral"
          variant="index"
          rotate={0.5}
          hint="2 unread this week"
        />
      </div>

      {/* Quick actions — calculator shortcuts */}
      <section>
        <SectionHeader
          title="Quick actions"
          subtitle="Jump straight into a calculator"
          onSeeAll={() => set("calculators" as NavKey)}
          accent="let's go!"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CALCULATORS.map((calc, i) => {
            const Icon = calcIcons[calc.key];
            // Map accent to CSS custom property for notebook-tab top strip
            const tabColor =
              calc.accent === "plum"
                ? "oklch(0.50 0.12 340)"
                : calc.accent === "amber"
                  ? "oklch(0.62 0.11 70)"
                  : calc.accent === "mint"
                    ? "oklch(0.58 0.09 155)"
                    : "oklch(0.55 0.10 25)";
            return (
              <motion.button
                key={calc.key}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                onClick={() => set("calculators")}
                style={{
                  transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)`,
                  // @ts-expect-error custom property
                  "--tab-color": tabColor,
                }}
                className="btn-tactile notebook-tab notebook-tab-hover rounded-2xl p-4 pt-5 text-left group relative"
              >
                <div
                  className={`size-10 rounded-xl flex items-center justify-center mb-3 border border-foreground/10 ${
                    calc.accent === "plum"
                      ? "bg-primary/15 text-primary"
                      : calc.accent === "amber"
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                        : calc.accent === "mint"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <p className="font-serif-display text-base leading-tight">{calc.title.replace(" Calculator", "")}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">
                  {calc.description}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition">
                  Open <ArrowRight className="size-3" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Editorial divider */}
      <EditorialDivider ornament="diamond" label="your day at a glance" />

      {/* Ad */}
      <BannerAd slot="home-top" />

      {/* Two-column section: recent activity + upcoming */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent calculations — feels like a notebook page with entries */}
        <GlassCard variant="lined" className="lg:col-span-2 p-5 pl-12 relative">
          <div className="tape-corner-tr" aria-hidden="true" />
          <SectionHeader
            title="Recent activity"
            subtitle="What you calculated recently"
            compact
            accent="keep going!"
          />
          <div className="space-y-1.5">
            {recentHistory.map((h) => (
              <button
                key={h.id}
                onClick={() => set("calculators")}
                className="w-full flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg hover:bg-primary/5 transition text-left border border-transparent hover:border-primary/15"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/15">
                    {h.type === "SGPA" && <Trophy className="size-4" />}
                    {h.type === "CGPA" && <Award className="size-4" />}
                    {h.type === "ATTENDANCE" && <CalendarCheck className="size-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif-display text-sm truncate">
                      {h.label ?? h.type}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 italic">
                      <Clock className="size-3" />
                      {formatRelativeTime(h.output.computedAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="stamped-number text-xl tabular-nums">
                    {h.output.value.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-bold">
                    {h.type}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Attendance gauge — kraft paper, hand-drawn feel */}
        <GlassCard variant="kraft" className="p-5 pt-7 relative">
          <CardDecoration variant="cornerHeart" position="top-right" color="coral" />
          <SectionHeader title="Attendance" subtitle="This semester" compact accent="almost there!" />
          <div className="flex flex-col items-center justify-center py-3">
            <CircularProgress
              value={78.2}
              size={140}
              label={
                <span className="stamped-number text-3xl">
                  <AnimatedCounter value={78.2} decimals={1} />%
                </span>
              }
              sublabel="Overall"
              color="oklch(0.55 0.18 25)"
            />
            <p className="mt-3 text-xs text-foreground/70 text-center italic">
              <span className="text-rose-700 dark:text-rose-400 font-semibold not-italic">2 subjects</span> below 75% threshold
            </p>
            <button
              onClick={() => set("calculators")}
              className="btn-tactile mt-3 text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              Check required classes <ChevronRight className="size-3" />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Editorial divider */}
      <EditorialDivider ornament="star" label="from the university" />

      {/* Notices */}
      <section>
        <SectionHeader
          title="Latest notices"
          subtitle="From the university"
          onSeeAll={() => set("notices" as NavKey)}
          accent="fresh today"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentNotices.map((n, i) => (
            <GlassCard
              key={n.id}
              variant="paper"
              hover
              className="p-4 cursor-pointer"
              onClick={() => set("notices" as NavKey)}
            >
              {/* Tape strip on first card — feels pinned up */}
              {i === 0 && <div className="tape-corner-tl" aria-hidden="true" />}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-[0.15em] text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/15">
                  {n.category}
                </span>
                {n.pinned && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20">
                    ★ Pinned
                  </span>
                )}
              </div>
              <p className="font-serif-display text-sm leading-snug line-clamp-2">
                {n.title}
              </p>
              <p className="text-xs text-muted-foreground mt-2 italic flex items-center gap-1">
                <Clock className="size-3" />
                {formatRelativeTime(n.publishedAt)}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Editorial divider */}
      <EditorialDivider ornament="diamond" label="what's next" />

      {/* Upcoming + Continue Reading */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Upcoming academic event */}
        <GlassCard variant="kraft" className="p-5 relative">
          <CardDecoration variant="pageFold" />
          <SectionHeader title="Upcoming" subtitle="Next on your calendar" compact accent="don't miss!" />
          <div className="flex items-start gap-4 p-3 rounded-lg border border-foreground/10 bg-foreground/[0.03]">
            <div className="text-center shrink-0 px-2">
              <p className="text-[10px] uppercase tracking-[0.15em] text-foreground/60 font-bold">
                {new Date(upcomingEvent.startDate).toLocaleString("en-IN", { month: "short" })}
              </p>
              <p className="stamped-number text-3xl text-primary">
                {new Date(upcomingEvent.startDate).getDate()}
              </p>
            </div>
            <div className="min-w-0 border-l border-foreground/15 pl-3">
              <p className="font-serif-display text-sm leading-snug">{upcomingEvent.title}</p>
              <p className="text-xs text-foreground/70 mt-1 line-clamp-2 italic">
                {upcomingEvent.description}
              </p>
              <button
                onClick={() => set("calendar" as NavKey)}
                className="btn-tactile mt-2 text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                View calendar <ChevronRight className="size-3" />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Continue reading — notebook page */}
        <GlassCard variant="lined" className="p-5 pl-12 relative">
          <CardDecoration variant="cornerStar" position="top-right" color="amber" />
          <SectionHeader
            title="Continue reading"
            subtitle="Recently viewed papers"
            onSeeAll={() => set("papers" as NavKey)}
            compact
            accent="pick up where you left off"
          />
          <div className="space-y-1">
            {recentPapers.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => set("papers" as NavKey)}
                className="w-full flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-primary/5 transition text-left border border-transparent hover:border-primary/15"
              >
                <div className="size-9 rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif-display text-sm truncate">{p.subjectName}</p>
                  <p className="text-xs text-muted-foreground italic">
                    {p.examType.replace("_", " ")} · {p.year} · {formatNumber(p.views)} views
                  </p>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Support banner — for non-supporters (kraft paper, no gradient) */}
      {!isSupporter && (
        <div className="kraft-card p-6 sm:p-8 relative overflow-hidden float-subtle">
          {/* Tiny sketch heart accent */}
          <div className="absolute top-4 right-4 opacity-70">
            <SketchHeart size={20} color="coral" />
          </div>
          <div className="flex items-center gap-5 flex-wrap relative">
            {/* Editorial illustration */}
            <div className="shrink-0">
              <SketchBooks size={84} color="amber" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <HandwrittenText as="p" color="amber" className="text-xl rotate-[-2deg] inline-block mb-1">
                Hey friend!
              </HandwrittenText>
              <h3 className="font-serif-display text-2xl sm:text-3xl tracking-tight text-foreground">
                Love KTU One?
              </h3>
              <p className="text-sm text-foreground/80 mt-2 max-w-md leading-relaxed">
                Support development for ₹99 lifetime. Remove ads, get a badge,
                and help every KTU student.
              </p>
            </div>
            <button
              onClick={() => setSupportOpen(true)}
              className="btn-tactile bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 shadow-soft hover:opacity-90"
            >
              <Heart className="size-4" fill="currentColor" />
              Become a Supporter
            </button>
          </div>
        </div>
      )}

      {/* Footer note — editorial colophon */}
      <footer className="pt-8 pb-2">
        <EditorialDivider ornament="diamond" />
        <div className="text-center">
          <p className="font-handwritten text-base text-muted-foreground">
            made with 💜 for KTU students
          </p>
          <p className="text-[11px] text-muted-foreground/70 mt-1 tracking-wide">
            {UNIVERSITY_NAME} · v{APP_VERSION}
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  onSeeAll,
  compact,
  accent,
}: {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  compact?: boolean;
  accent?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-4 ${compact ? "mb-3" : "mb-5"}`}>
      <div className="flex items-start gap-3">
        {/* Vertical accent bar — feels like a margin note rule */}
        <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary/50 via-primary/25 to-transparent mt-1" />
        <div>
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h2 className={`font-serif-display tracking-tight ${compact ? "text-lg" : "text-2xl"}`}>
              {title}
            </h2>
            {accent && (
              <HandwrittenText as="span" color="amber" className="text-lg rotate-[-3deg]">
                {accent}
              </HandwrittenText>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5 italic">{subtitle}</p>
          )}
        </div>
      </div>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="btn-tactile text-xs text-primary hover:underline font-medium flex items-center gap-1 shrink-0 px-2 py-1 rounded-full hover:bg-primary/5"
        >
          See all <ArrowRight className="size-3" />
        </button>
      )}
    </div>
  );
}
```

---

## Dashboard Server Actions

**File:** `/home/z/my-project/src/features/dashboard/actions.ts`

```tsx
"use server";

import { db } from "@/lib/db";
import type { KTUNotice, NoticeCategory, NoticePriority } from "@/lib/types";

export async function getDashboardStats() {
  const [papers, notices, activeNotices, unreadNotices] = await Promise.all([
    db.questionPaper.count({ where: { deletedAt: null } }),
    db.kTUNotice.count({ where: { active: true, deletedAt: null } }),
    db.kTUNotice.count({
      where: { active: true, deletedAt: null, publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    db.kTUNotice.count({
      where: {
        active: true,
        deletedAt: null,
        publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    papers,
    notices,
    activeNotices,
    unreadNotices: unreadNotices,
  };
}

export async function getRecentNotices(limit = 3): Promise<KTUNotice[]> {
  const rows = await db.kTUNotice.findMany({
    where: { active: true, deletedAt: null },
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category as NoticeCategory,
    publishedAt: r.publishedAt.toISOString(),
    priority: r.priority as NoticePriority,
    pdfUrl: r.pdfUrl ?? undefined,
    externalUrl: r.externalUrl ?? undefined,
    tags: JSON.parse(r.tags) as string[],
    pinned: r.pinned,
    active: r.active,
  }));
}

export async function getUpcomingEvent() {
  const row = await db.calendarEvent.findFirst({
    where: { startDate: { gte: new Date() } },
    orderBy: { startDate: "asc" },
  });
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    startDate: row.startDate.toISOString(),
    endDate: row.endDate.toISOString(),
    color: row.color,
  };
}

export async function getRecentPapers(limit = 4) {
  const rows = await db.questionPaper.findMany({
    where: { deletedAt: null },
    orderBy: [{ views: "desc" }],
    take: limit,
    select: {
      id: true,
      title: true,
      subjectCode: true,
      subjectName: true,
      semester: true,
      branchCode: true,
      year: true,
      month: true,
      examType: true,
      views: true,
    },
  });
  return rows;
}
```

---

## Calculators

**File:** `/home/z/my-project/src/features/calculators/calculators.tsx`

```tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Trophy, Award, CalendarCheck, ClipboardList, Target, Plus, X, Save, Share2, History } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { GradientCard } from "@/components/ui-custom/gradient-card";
import { AnimatedCounter } from "@/components/ui-custom/animated-counter";
import { CircularProgress } from "@/components/ui-custom/circular-progress";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { SketchNotebook, SketchPencil, SketchBooks, SketchCoffeeCup } from "@/components/ui-custom/sketch-elements";
import { CALCULATORS, GRADE_OPTIONS, GRADE_LABELS, type CalculatorKey } from "@/lib/constants";
import { GRADE_POINTS, type Grade, type CalculatorCourse } from "@/lib/types";
import {
  computeSGPA,
  computeCGPA,
  computeAttendance,
  computeInternalMarks,
  computePassMarks,
  formatDate,
} from "@/lib/utils/calc";
import { useCalcHistoryStore } from "@/store/calc-history-store";
import { getNotificationProvider } from "@/lib/providers/notification";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const calcIcons: Record<CalculatorKey, React.ComponentType<{ className?: string }>> = {
  sgpa: Trophy,
  cgpa: Award,
  attendance: CalendarCheck,
  internal: ClipboardList,
  pass: Target,
};

export function Calculators() {
  const [active, setActive] = useState<CalculatorKey>("sgpa");
  const prefersReduced = useReducedMotion();
  const calc = CALCULATORS.find((c) => c.key === active)!;
  const Icon = calcIcons[calc.key];

  return (
    <div>
      <PageHeader
        title="Calculators"
        description="Premium, fast and offline-ready calculators for every KTU scenario."
        icon={<Icon className="size-5" />}
      />

      {/* Calculator selector pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CALCULATORS.map((c) => {
          const CIcon = calcIcons[c.key];
          const isActive = active === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={cn(
                "relative px-3.5 py-2 rounded-full text-sm font-medium transition flex items-center gap-2",
                isActive
                  ? "text-primary-foreground"
                  : "glass text-foreground hover:bg-secondary/60",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="calc-pill"
                  className="absolute inset-0 rounded-full bg-primary -z-10"
                  transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <CIcon className="size-4" />
              {c.title.replace(" Calculator", "")}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {active === "sgpa" && <SgpaCalculator />}
          {active === "cgpa" && <CgpaCalculator />}
          {active === "attendance" && <AttendanceCalculator />}
          {active === "internal" && <InternalMarksCalculator />}
          {active === "pass" && <PassCalculator />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ====================================================================== */
/* SHARED: Result Display                                                  */
/* ====================================================================== */

function ResultDisplay({
  label,
  value,
  max,
  suffix = "",
  decimals = 2,
  hint,
}: {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
  decimals?: number;
  hint?: string;
}) {
  const pct = max ? (value / max) * 100 : undefined;
  const [celebrate, setCelebrate] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <GradientCard gradient="plum" className="p-6 sm:p-8 text-center">
      <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">
        {label}
      </p>
      <div className="mt-3 flex items-baseline justify-center gap-2">
        <span className="text-6xl sm:text-7xl font-bold tabular-nums tracking-tight">
          <AnimatedCounter key={value} value={value} decimals={decimals} />
        </span>
        {suffix && <span className="text-2xl font-medium opacity-80">{suffix}</span>}
      </div>
      {pct !== undefined && (
        <p className="text-sm opacity-80 mt-2">
          {pct.toFixed(1)}% {max === 10 ? "efficiency" : "of max"}
        </p>
      )}
      {hint && <p className="text-sm opacity-90 mt-2">{hint}</p>}
      <AnimatePresence>
        {celebrate && !prefersReduced && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            onAnimationComplete={() => setCelebrate(false)}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute size-2 rounded-full"
                style={{
                  background: ["#fff", "#F59E0B", "#E11D48"][i % 3],
                  left: "50%",
                  top: "50%",
                }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: Math.cos((i / 12) * 2 * Math.PI) * 120,
                  y: Math.sin((i / 12) * 2 * Math.PI) * 120,
                  scale: [0, 1, 0],
                }}
                transition={{ duration: 0.9 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Expose setter via ref-like pattern */}
      <CelebrationTrigger onCompute={setCelebrate} />
    </GradientCard>
  );
}

function CelebrationTrigger({ onCompute }: { onCompute: (v: boolean) => void }) {
  // no-op; we trigger through the parent button via custom event
  useEffect(() => {
    const handler = () => onCompute(true);
    window.addEventListener("ktu:celebrate", handler);
    return () => window.removeEventListener("ktu:celebrate", handler);
  }, [onCompute]);
  return null;
}

import { useEffect } from "react";

function fireCelebration() {
  window.dispatchEvent(new Event("ktu:celebrate"));
}

/* ====================================================================== */
/* SGPA CALCULATOR                                                         */
/* ====================================================================== */

function SgpaCalculator() {
  const [courses, setCourses] = useState<CalculatorCourse[]>([
    { id: "c1", subjectName: "Discrete Structures", credits: 4, grade: "A" },
    { id: "c2", subjectName: "Data Structures", credits: 3, grade: "A+" },
    { id: "c3", subjectName: "DBMS", credits: 3, grade: "B+" },
  ]);
  const [result, setResult] = useState<ReturnType<typeof computeSGPA> | null>(null);
  const addHistory = useCalcHistoryStore((s) => s.add);

  const update = (id: string, patch: Partial<CalculatorCourse>) => {
    setCourses((arr) => arr.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const addCourse = () => {
    setCourses((arr) => [
      ...arr,
      { id: `c_${Date.now()}`, subjectName: `Subject ${arr.length + 1}`, credits: 3, grade: "A" },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses((arr) => arr.filter((c) => c.id !== id));
  };

  const compute = () => {
    const r = computeSGPA(courses);
    setResult(r);
    fireCelebration();
    addHistory("SGPA", { courses }, r, `Semester — ${courses.length} subjects`);
    getNotificationProvider().show({
      kind: "success",
      title: `SGPA: ${r.value.toFixed(2)}`,
      message: `Across ${courses.length} subjects · ${r.meta?.totalCredits} credits`,
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Courses</h3>
            <button
              onClick={addCourse}
              className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-1.5"
            >
              <Plus className="size-3.5" /> Add subject
            </button>
          </div>
          <div className="space-y-2">
            {courses.map((c, i) => (
              <div
                key={c.id}
                className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl bg-secondary/40"
              >
                <div className="col-span-12 sm:col-span-5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Subject {i + 1}
                  </Label>
                  <Input
                    value={c.subjectName}
                    onChange={(e) => update(c.id, { subjectName: e.target.value })}
                    className="mt-1 h-9 bg-background"
                  />
                </div>
                <div className="col-span-5 sm:col-span-3">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Credits
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={6}
                    value={c.credits}
                    onChange={(e) => update(c.id, { credits: Math.max(1, Number(e.target.value)) })}
                    className="mt-1 h-9 bg-background"
                  />
                </div>
                <div className="col-span-5 sm:col-span-3">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Grade
                  </Label>
                  <Select
                    value={c.grade}
                    onValueChange={(v) => update(c.id, { grade: v as Grade })}
                  >
                    <SelectTrigger className="mt-1 h-9 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADE_OPTIONS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {GRADE_LABELS[g]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 sm:col-span-1 flex justify-end">
                  <button
                    onClick={() => removeCourse(c.id)}
                    className="size-9 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition"
                    aria-label="Remove course"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <EmptyState
                title="No subjects yet"
                description="Add a subject to compute SGPA."
                compact
                illustration={<SketchNotebook size={64} color="plum" />}
                primaryAction={{ label: "Add subject", onClick: addCourse }}
              />
            )}
          </div>
        </GlassCard>

        <div className="flex gap-2">
          <Button onClick={compute} disabled={courses.length === 0} className="flex-1 h-11 rounded-full shadow-soft">
            <Trophy className="size-4 mr-2" />
            Calculate SGPA
          </Button>
          <Button variant="secondary" className="h-11 rounded-full" disabled={!result}>
            <Save className="size-4 mr-2" /> Save
          </Button>
          <Button variant="secondary" className="h-11 rounded-full" disabled={!result}>
            <Share2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {result ? (
          <ResultDisplay
            label="Your SGPA"
            value={result.value}
            max={10}
            hint={`${result.meta?.totalCredits} credits across ${result.meta?.courses} subjects`}
          />
        ) : (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <SketchNotebook size={80} color="plum" />
            <p className="text-sm text-muted-foreground mt-3 italic">
              Add subjects and tap Calculate.
            </p>
          </GlassCard>
        )}
        <HistoryPanel type="SGPA" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* CGPA CALCULATOR                                                         */
/* ====================================================================== */

function CgpaCalculator() {
  const [sems, setSems] = useState([
    { sgpa: 8.5, credits: 24 },
    { sgpa: 8.7, credits: 24 },
    { sgpa: 8.4, credits: 26 },
  ]);
  const [result, setResult] = useState<ReturnType<typeof computeCGPA> | null>(null);
  const addHistory = useCalcHistoryStore((s) => s.add);

  const update = (i: number, patch: Partial<(typeof sems)[number]>) => {
    setSems((arr) => arr.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };

  const addSem = () => setSems((arr) => [...arr, { sgpa: 8, credits: 24 }]);
  const removeSem = (i: number) => setSems((arr) => arr.filter((_, idx) => idx !== i));

  const compute = () => {
    const r = computeCGPA(sems);
    setResult(r);
    fireCelebration();
    addHistory("CGPA", { semesters: sems }, r, `Across ${sems.length} semesters`);
    getNotificationProvider().show({
      kind: "success",
      title: `CGPA: ${r.value.toFixed(2)}`,
      message: `${r.meta?.totalCredits} credits earned across ${sems.length} semesters`,
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Semesters</h3>
            <button
              onClick={addSem}
              className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-1.5"
            >
              <Plus className="size-3.5" /> Add semester
            </button>
          </div>
          <div className="space-y-2">
            {sems.map((s, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl bg-secondary/40">
                <div className="col-span-3 sm:col-span-2 flex items-center justify-center">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    S{i + 1}
                  </div>
                </div>
                <div className="col-span-4 sm:col-span-5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    SGPA
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    max={10}
                    value={s.sgpa}
                    onChange={(e) => update(i, { sgpa: Number(e.target.value) })}
                    className="mt-1 h-9 bg-background"
                  />
                </div>
                <div className="col-span-4 sm:col-span-4">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Credits
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={s.credits}
                    onChange={(e) => update(i, { credits: Number(e.target.value) })}
                    className="mt-1 h-9 bg-background"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => removeSem(i)}
                    className="size-9 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition"
                    aria-label="Remove semester"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <div className="flex gap-2">
          <Button onClick={compute} className="flex-1 h-11 rounded-full shadow-soft">
            <Award className="size-4 mr-2" /> Calculate CGPA
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {result ? (
          <ResultDisplay
            label="Your CGPA"
            value={result.value}
            max={10}
            hint={`${result.meta?.totalCredits} credits across ${result.meta?.semesters} semesters`}
          />
        ) : (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <SketchBooks size={80} color="lavender" />
            <p className="text-sm text-muted-foreground mt-3 italic">
              Enter semester SGPA and credits.
            </p>
          </GlassCard>
        )}
        <HistoryPanel type="CGPA" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* ATTENDANCE CALCULATOR                                                   */
/* ====================================================================== */

function AttendanceCalculator() {
  const [attended, setAttended] = useState(28);
  const [total, setTotal] = useState(40);
  const [result, setResult] = useState<ReturnType<typeof computeAttendance> | null>(null);
  const addHistory = useCalcHistoryStore((s) => s.add);

  const compute = () => {
    const r = computeAttendance(attended, total);
    setResult(r);
    addHistory(
      "ATTENDANCE",
      { attended, total },
      { type: "ATTENDANCE", value: r.percentage, percentage: r.percentage, computedAt: new Date().toISOString() },
      `Attended ${attended}/${total}`,
    );
    getNotificationProvider().show({
      kind: r.atRisk ? "warning" : "success",
      title: `Attendance: ${r.percentage}%`,
      message: r.atRisk
        ? `${r.neededToReach75} more classes needed to reach 75%.`
        : `You can bunk ${r.canBunk} more classes.`,
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">Attendance inputs</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Classes attended
              </Label>
              <Input
                type="number"
                min={0}
                value={attended}
                onChange={(e) => setAttended(Math.max(0, Number(e.target.value)))}
                className="mt-1 h-12 text-lg bg-background"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Total classes held
              </Label>
              <Input
                type="number"
                min={1}
                value={total}
                onChange={(e) => setTotal(Math.max(1, Number(e.target.value)))}
                className="mt-1 h-12 text-lg bg-background"
              />
            </div>
          </div>
          <Button onClick={compute} className="w-full mt-5 h-11 rounded-full shadow-soft">
            <CalendarCheck className="size-4 mr-2" /> Calculate
          </Button>
        </GlassCard>

        {result && (
          <GlassCard className="p-5">
            <h4 className="text-sm font-semibold mb-3">Breakdown</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="text-xl font-bold mt-1">{result.percentage}%</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Need to attend</p>
                <p className="text-xl font-bold mt-1 text-amber-500">{result.neededToReach75}</p>
                <p className="text-[10px] text-muted-foreground">to reach 75%</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Can bunk</p>
                <p className="text-xl font-bold mt-1 text-emerald-500">{result.canBunk}</p>
                <p className="text-[10px] text-muted-foreground">and stay safe</p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
      <div className="space-y-4">
        {result ? (
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
            <CircularProgress
              value={result.percentage}
              size={160}
              color={result.percentage >= 85 ? "var(--success)" : result.percentage >= 75 ? "var(--warning)" : "var(--destructive)"}
              label={<span className="text-3xl font-bold"><AnimatedCounter value={result.percentage} decimals={1} />%</span>}
              sublabel={result.atRisk ? "Below 75% — at risk" : "Above threshold"}
            />
            <p className="text-sm text-muted-foreground mt-4">
              {result.atRisk
                ? "⚠️ You need to attend more classes to be eligible for exams."
                : "✓ You're safe. Keep up the consistency."}
            </p>
          </GlassCard>
        ) : (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <SketchPencil size={80} color="amber" />
            <p className="text-sm text-muted-foreground mt-3 italic">
              Enter attendance and tap Calculate.
            </p>
          </GlassCard>
        )}
        <HistoryPanel type="ATTENDANCE" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* INTERNAL MARKS CALCULATOR                                               */
/* ====================================================================== */

function InternalMarksCalculator() {
  const [series1, setSeries1] = useState(28);
  const [series2, setSeries2] = useState(32);
  const [assignment, setAssignment] = useState(8);
  const [attendance, setAttendance] = useState(7);
  const [result, setResult] = useState<ReturnType<typeof computeInternalMarks> | null>(null);
  const addHistory = useCalcHistoryStore((s) => s.add);

  const compute = () => {
    const r = computeInternalMarks({ series1, series2, assignment, attendance });
    setResult(r);
    fireCelebration();
    addHistory("INTERNAL_MARKS", { series1, series2, assignment, attendance }, r, "Internal marks");
    getNotificationProvider().show({
      kind: "success",
      title: `Internal: ${r.value}/70`,
      message: `Best series: ${r.meta?.bestSeries}/50`,
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">Internal assessment inputs</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <LabeledInput label="Series-1 marks" sub="/50" value={series1} onChange={setSeries1} max={50} />
            <LabeledInput label="Series-2 marks" sub="/50" value={series2} onChange={setSeries2} max={50} />
            <LabeledInput label="Assignment" sub="/10" value={assignment} onChange={setAssignment} max={10} />
            <LabeledInput label="Attendance" sub="/10" value={attendance} onChange={setAttendance} max={10} />
          </div>
          <Button onClick={compute} className="w-full mt-5 h-11 rounded-full shadow-soft">
            <ClipboardList className="size-4 mr-2" /> Calculate Internal
          </Button>
        </GlassCard>
        {result && (
          <GlassCard className="p-5">
            <h4 className="text-sm font-semibold mb-3">Breakdown</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Best series</p>
                <p className="text-xl font-bold mt-1">{String(result.meta?.bestSeries)}/50</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Assignment</p>
                <p className="text-xl font-bold mt-1">{assignment}/10</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground">Attendance</p>
                <p className="text-xl font-bold mt-1">{attendance}/10</p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
      <div className="space-y-4">
        {result ? (
          <ResultDisplay
            label="Internal Marks"
            value={result.value}
            suffix="/70"
            decimals={1}
            hint={`${result.percentage}% of internal component`}
          />
        ) : (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <SketchCoffeeCup size={80} color="coral" />
            <p className="text-sm text-muted-foreground mt-3 italic">Fill series + assignment + attendance.</p>
          </GlassCard>
        )}
        <HistoryPanel type="INTERNAL_MARKS" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* PASS CALCULATOR                                                         */
/* ====================================================================== */

function PassCalculator() {
  const [internal, setInternal] = useState(22);
  const [passMark, setPassMark] = useState(40);
  const [totalMarks, setTotalMarks] = useState(100);
  const [result, setResult] = useState<ReturnType<typeof computePassMarks> | null>(null);
  const addHistory = useCalcHistoryStore((s) => s.add);

  const compute = () => {
    const r = computePassMarks({
      internalOutOf30: internal,
      passMark,
      totalMarks,
    });
    setResult(r);
    addHistory(
      "PASS_CALCULATOR",
      { internal, passMark, totalMarks },
      r,
      `Need ${r.value}/${r.meta?.externalTotal} in end-sem`,
    );
    getNotificationProvider().show({
      kind: "info",
      title: `Score ${r.value} in end-sem`,
      message: `Out of ${r.meta?.externalTotal} — to reach pass mark of ${passMark}.`,
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">Pass calculator inputs</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <LabeledInput label="Internal marks" sub="/30" value={internal} onChange={setInternal} max={30} />
            <LabeledInput label="Pass mark" sub="/100" value={passMark} onChange={setPassMark} max={100} />
            <LabeledInput label="Total marks" sub="" value={totalMarks} onChange={setTotalMarks} max={100} />
          </div>
          <Button onClick={compute} className="w-full mt-5 h-11 rounded-full shadow-soft">
            <Target className="size-4 mr-2" /> Calculate required marks
          </Button>
        </GlassCard>
        {result && (
          <GlassCard className="p-5">
            <h4 className="text-sm font-semibold mb-3">Breakdown</h4>
            <div className="space-y-2 text-sm">
              <Row label="Your internal" value={`${internal} / 30`} />
              <Row label="External is out of" value={`${String(result.meta?.externalTotal)}`} />
              <Row label="You need" value={`${result.value} marks in end-sem`} bold />
              <Row label="That's" value={`${result.percentage}% of end-sem`} />
            </div>
          </GlassCard>
        )}
      </div>
      <div className="space-y-4">
        {result ? (
          <GradientCard gradient="warm" className="p-6 text-center">
            <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">
              Required in End-Sem
            </p>
            <div className="mt-3 flex items-baseline justify-center gap-2">
              <span className="text-6xl font-bold tabular-nums">
                <AnimatedCounter key={result.value} value={result.value} decimals={0} />
              </span>
              <span className="text-xl opacity-80">/ {result.meta?.externalTotal}</span>
            </div>
            <p className="text-sm opacity-90 mt-3">
              Aim higher — this is the bare minimum.
            </p>
          </GradientCard>
        ) : (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="flex items-end gap-1">
              <SketchNotebook size={64} color="plum" />
              <div className="-ml-2 -mb-1">
                <SketchPencil size={36} color="amber" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 italic">Enter internal + pass mark.</p>
          </GlassCard>
        )}
        <HistoryPanel type="PASS_CALCULATOR" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* SHARED                                                                  */
/* ====================================================================== */

function LabeledInput({
  label,
  sub,
  value,
  onChange,
  max,
}: {
  label: string;
  sub?: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
        {label} {sub && <span className="text-muted-foreground/70 normal-case">({sub})</span>}
      </Label>
      <Input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="mt-1 h-12 text-lg bg-background"
      />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-semibold text-primary" : "font-medium"}>{value}</span>
    </div>
  );
}

function HistoryPanel({ type }: { type: string }) {
  const allEntries = useCalcHistoryStore((s) => s.entries);
  const entries = useMemo(
    () => allEntries.filter((e) => e.type === type),
    [allEntries, type],
  );
  if (entries.length === 0) {
    return (
      <GlassCard className="p-4 text-center">
        <History className="size-5 mx-auto text-muted-foreground/60 mb-1" />
        <p className="text-xs text-muted-foreground">No history yet</p>
      </GlassCard>
    );
  }
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <History className="size-4 text-muted-foreground" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          History
        </h4>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {entries.slice(0, 8).map((e) => (
          <div key={e.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-secondary/40">
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{e.label ?? e.type}</p>
              <p className="text-[10px] text-muted-foreground">{formatDate(e.createdAt)}</p>
            </div>
            <span className="text-sm font-bold tabular-nums">{e.output.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
```

---

## Calculator History Server Actions

**File:** `/home/z/my-project/src/features/calculators/history-actions.ts`

```tsx
"use server";

import { db } from "@/lib/db";
import type { CalculatorHistoryEntry, CalculatorType, CalculatorResult } from "@/lib/types";

export async function addCalcHistoryDB(
  studentId: string,
  type: CalculatorType,
  input: Record<string, unknown>,
  output: CalculatorResult,
  label?: string,
): Promise<CalculatorHistoryEntry> {
  const row = await db.calculatorHistoryEntry.create({
    data: {
      studentId,
      type,
      input: JSON.stringify(input),
      output: JSON.stringify(output),
      label,
    },
  });
  return {
    id: row.id,
    type: row.type as CalculatorType,
    input: JSON.parse(row.input) as Record<string, unknown>,
    output: JSON.parse(row.output) as CalculatorResult,
    label: row.label ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listCalcHistoryDB(
  studentId: string,
  type?: CalculatorType,
): Promise<CalculatorHistoryEntry[]> {
  const where: Record<string, unknown> = { studentId };
  if (type) where.type = type;
  const rows = await db.calculatorHistoryEntry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return rows.map((r) => ({
    id: r.id,
    type: r.type as CalculatorType,
    input: JSON.parse(r.input) as Record<string, unknown>,
    output: JSON.parse(r.output) as CalculatorResult,
    label: r.label ?? undefined,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function removeCalcHistoryDB(
  studentId: string,
  entryId: string,
): Promise<void> {
  await db.calculatorHistoryEntry.deleteMany({
    where: { id: entryId, studentId },
  });
}

export async function clearCalcHistoryDB(studentId: string): Promise<void> {
  await db.calculatorHistoryEntry.deleteMany({
    where: { studentId },
  });
}
```

---

## Question Papers

**File:** `/home/z/my-project/src/features/papers/papers.tsx`

```tsx
"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FileText,
  Search,
  Download,
  Bookmark,
  BookmarkCheck,
  Eye,
  Filter,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { SketchBooks } from "@/components/ui-custom/sketch-elements";
import { BannerAd } from "@/components/ui-custom/banner-ad";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_PAPERS } from "@/data/mock-data";
import { BRANCHES, SEMESTERS } from "@/lib/constants";
import { formatBytes, formatNumber, formatRelativeTime } from "@/lib/utils/calc";
import { useBookmarkStore } from "@/store/bookmark-store";
import { getNotificationProvider } from "@/lib/providers/notification";
import { getAnalyticsProvider } from "@/lib/providers/analytics";
import type { BranchCode, SemesterNumber } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Papers() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState<BranchCode | "ALL">("ALL");
  const [semester, setSemester] = useState<SemesterNumber | "ALL">("ALL");
  const [year, setYear] = useState<number | "ALL">("ALL");
  const prefersReduced = useReducedMotion();
  const toggleBookmark = useBookmarkStore((s) => s.toggle);
  const hasBookmark = useBookmarkStore((s) => s.has);

  const years = useMemo(
    () => Array.from(new Set(MOCK_PAPERS.map((p) => p.year))).sort((a, b) => b - a),
    [],
  );

  const filtered = useMemo(() => {
    return MOCK_PAPERS.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          p.title.toLowerCase().includes(q) ||
          p.subjectName.toLowerCase().includes(q) ||
          p.subjectCode.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (branch !== "ALL" && p.branchCode !== branch) return false;
      if (semester !== "ALL" && p.semester !== semester) return false;
      if (year !== "ALL" && p.year !== year) return false;
      return true;
    });
  }, [search, branch, semester, year]);

  const hasFilters = search || branch !== "ALL" || semester !== "ALL" || year !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setBranch("ALL");
    setSemester("ALL");
    setYear("ALL");
  };

  const onDownload = (paperId: string, title: string) => {
    getAnalyticsProvider().track({ name: "paper_downloaded", props: { paperId } });
    getNotificationProvider().show({
      kind: "success",
      title: "Download started",
      message: title,
    });
  };

  const onBookmark = (paperId: string, title: string) => {
    const added = toggleBookmark({
      id: `bm_paper_${paperId}`,
      kind: "paper",
      refId: paperId,
      title,
    });
    getAnalyticsProvider().track({
      name: "paper_bookmarked",
      props: { paperId, bookmarked: added },
    });
    getNotificationProvider().show({
      kind: added ? "success" : "info",
      title: added ? "Bookmarked" : "Removed bookmark",
      message: title,
    });
  };

  return (
    <div>
      <PageHeader
        title="Question Papers"
        description="Browse, search and download KTU question papers across all branches and years."
        icon={<FileText className="size-5" />}
      />

      {/* Filter bar */}
      <GlassCard className="p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject, code or title..."
              className="pl-10 h-11 bg-background"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 lg:flex">
            <Select value={branch} onValueChange={(v) => setBranch(v as BranchCode | "ALL")}>
              <SelectTrigger className="h-11 bg-background lg:w-[140px]">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All branches</SelectItem>
                {BRANCHES.map((b) => (
                  <SelectItem key={b.code} value={b.code}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(semester)} onValueChange={(v) => setSemester(v === "ALL" ? "ALL" : (Number(v) as SemesterNumber))}>
              <SelectTrigger className="h-11 bg-background lg:w-[110px]">
                <SelectValue placeholder="Sem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All sems</SelectItem>
                {SEMESTERS.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    S{s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(year)} onValueChange={(v) => setYear(v === "ALL" ? "ALL" : Number(v))}>
              <SelectTrigger className="h-11 bg-background lg:w-[110px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-11 px-3">
              <X className="size-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </GlassCard>

      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{filtered.length}</span> paper{filtered.length !== 1 ? "s" : ""} found
        </p>
        <Badge variant="secondary" className="gap-1">
          <Filter className="size-3" /> Filtered
        </Badge>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No papers found"
          description="Try changing your filters or searching for a different subject."
          illustration={<SketchBooks size={120} color="lavender" />}
          primaryAction={{ label: "Clear filters", onClick: clearFilters }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((p, i) => {
            const bookmarked = hasBookmark("paper", p.id);
            return (
              <motion.div
                key={p.id}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4), duration: 0.4 }}
              >
                <GlassCard hover className="p-4 h-full flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="size-11 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <FileText className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-snug line-clamp-2">
                        {p.subjectName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {p.subjectCode} · {p.branchCode} · S{p.semester}
                      </p>
                    </div>
                    <button
                      onClick={() => onBookmark(p.id, p.subjectName)}
                      className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center transition shrink-0"
                      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      {bookmarked ? (
                        <BookmarkCheck className="size-4 text-primary" fill="currentColor" />
                      ) : (
                        <Bookmark className="size-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">
                      {p.examType.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {p.month === 5 ? "May" : "Nov"} {p.year}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {p.pageCount}p · {formatBytes(p.fileSizeBytes)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" /> {formatNumber(p.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="size-3" /> {formatNumber(p.downloads)}
                    </span>
                    <span className="ml-auto">{formatRelativeTime(p.uploadedAt)}</span>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button
                      size="sm"
                      className="h-9 flex-1 rounded-full"
                      onClick={() => onDownload(p.id, p.title)}
                    >
                      <Download className="size-3.5 mr-1.5" /> Download
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-9 rounded-full"
                      onClick={() => onDownload(p.id, p.title)}
                    >
                      <Eye className="size-3.5" />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Ad after papers list */}
      <div className="mt-6">
        <BannerAd slot="papers-list" />
      </div>
    </div>
  );
}
```

---

## Papers Server Actions

**File:** `/home/z/my-project/src/features/papers/actions.ts`

```tsx
"use server";

import { db } from "@/lib/db";
import type { QuestionPaper, ExamType } from "@/lib/types";

export interface PaperFilters {
  search?: string;
  branch?: string | "ALL";
  semester?: number | "ALL";
  year?: number | "ALL";
}

export async function getPapers(filters: PaperFilters = {}): Promise<QuestionPaper[]> {
  const where: Record<string, unknown> = {
    deletedAt: null,
  };

  if (filters.search) {
    const q = filters.search.toLowerCase();
    // SQLite doesn't support mode: 'insensitive' — use contains with raw lower
    where.OR = [
      { title: { contains: q } },
      { subjectName: { contains: q } },
      { subjectCode: { contains: q } },
    ];
  }
  if (filters.branch && filters.branch !== "ALL") {
    where.branchCode = filters.branch;
  }
  if (filters.semester && filters.semester !== "ALL") {
    where.semester = filters.semester;
  }
  if (filters.year && filters.year !== "ALL") {
    where.year = filters.year;
  }

  const rows = await db.questionPaper.findMany({
    where,
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 100,
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    subjectCode: r.subjectCode,
    subjectName: r.subjectName,
    semester: r.semester as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    branchCode: r.branchCode as QuestionPaper["branchCode"],
    year: r.year,
    month: r.month,
    examType: r.examType as ExamType,
    fileUrl: r.fileUrl,
    fileSizeBytes: r.fileSizeBytes,
    pageCount: r.pageCount,
    downloads: r.downloads,
    views: r.views,
    uploadedAt: r.uploadedAt.toISOString(),
  }));
}

export async function getPaperYears(): Promise<number[]> {
  const rows = await db.questionPaper.findMany({
    where: { deletedAt: null },
    distinct: ["year"],
    orderBy: { year: "desc" },
    select: { year: true },
  });
  return rows.map((r) => r.year);
}

export async function incrementPaperView(paperId: string): Promise<void> {
  await db.questionPaper.update({
    where: { id: paperId },
    data: { views: { increment: 1 } },
  });
}

export async function incrementPaperDownload(paperId: string): Promise<void> {
  await db.questionPaper.update({
    where: { id: paperId },
    data: { downloads: { increment: 1 } },
  });
}
```

---

## Syllabus

**File:** `/home/z/my-project/src/features/syllabus/syllabus.tsx`

```tsx
"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Search, Download, Bookmark, BookmarkCheck, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { SketchNotebook } from "@/components/ui-custom/sketch-elements";
import { BannerAd } from "@/components/ui-custom/banner-ad";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_SYLLABUS } from "@/data/mock-data";
import { BRANCHES, SEMESTERS } from "@/lib/constants";
import { formatDate } from "@/lib/utils/calc";
import { useBookmarkStore } from "@/store/bookmark-store";
import { getNotificationProvider } from "@/lib/providers/notification";
import type { BranchCode, SemesterNumber } from "@/lib/types";

export function Syllabus() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState<BranchCode | "ALL">("ALL");
  const [semester, setSemester] = useState<SemesterNumber | "ALL">("ALL");
  const prefersReduced = useReducedMotion();
  const toggleBookmark = useBookmarkStore((s) => s.toggle);
  const hasBookmark = useBookmarkStore((s) => s.has);

  const filtered = useMemo(() => {
    return MOCK_SYLLABUS.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (!s.subjectName.toLowerCase().includes(q) && !s.subjectCode.toLowerCase().includes(q))
          return false;
      }
      if (branch !== "ALL" && s.branchCode !== branch) return false;
      if (semester !== "ALL" && s.semester !== semester) return false;
      return true;
    });
  }, [search, branch, semester]);

  return (
    <div>
      <PageHeader
        title="Syllabus"
        description="Official KTU syllabus documents for every subject, branch and semester."
        icon={<BookOpen className="size-5" />}
      />

      <GlassCard className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject name or code..."
              className="pl-10 h-11 bg-background"
            />
          </div>
          <Select value={branch} onValueChange={(v) => setBranch(v as BranchCode | "ALL")}>
            <SelectTrigger className="h-11 bg-background sm:w-[140px]">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All branches</SelectItem>
              {BRANCHES.map((b) => (
                <SelectItem key={b.code} value={b.code}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(semester)}
            onValueChange={(v) =>
              setSemester(v === "ALL" ? "ALL" : (Number(v) as SemesterNumber))
            }
          >
            <SelectTrigger className="h-11 bg-background sm:w-[110px]">
              <SelectValue placeholder="Sem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All sems</SelectItem>
              {SEMESTERS.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  S{s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      <p className="text-sm text-muted-foreground mb-3 px-1">
        <span className="font-medium text-foreground">{filtered.length}</span> syllabus documents
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No syllabus found"
          description="Try a different search or branch."
          illustration={<SketchNotebook size={120} color="plum" />}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((s, i) => {
            const bookmarked = hasBookmark("syllabus", s.id);
            return (
              <motion.div
                key={s.id}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.4 }}
              >
                <GlassCard hover className="p-4 flex items-start gap-3">
                  <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug line-clamp-2">
                      {s.subjectName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {s.subjectCode} · {s.branchCode} · S{s.semester}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        {s.modules} modules
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {s.version}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        Updated {formatDate(s.lastUpdated)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="h-8 flex-1 rounded-full"
                        onClick={() =>
                          getNotificationProvider().show({
                            kind: "success",
                            title: "Download started",
                            message: s.title,
                          })
                        }
                      >
                        <Download className="size-3.5 mr-1" /> Download
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 rounded-full"
                        onClick={() => {
                          toggleBookmark({
                            id: `bm_syl_${s.id}`,
                            kind: "syllabus",
                            refId: s.id,
                            title: s.subjectName,
                          });
                          getNotificationProvider().show({
                            kind: bookmarked ? "info" : "success",
                            title: bookmarked ? "Removed bookmark" : "Bookmarked",
                            message: s.subjectName,
                          });
                        }}
                      >
                        {bookmarked ? (
                          <BookmarkCheck className="size-3.5 text-primary" fill="currentColor" />
                        ) : (
                          <Bookmark className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <BannerAd slot="syllabus-list" />
      </div>
    </div>
  );
}
```

---

## Syllabus Server Actions

**File:** `/home/z/my-project/src/features/syllabus/actions.ts`

```tsx
"use server";

import { db } from "@/lib/db";
import type { Syllabus } from "@/lib/types";

export interface SyllabusFilters {
  search?: string;
  branch?: string | "ALL";
  semester?: number | "ALL";
}

export async function getSyllabus(filters: SyllabusFilters = {}): Promise<Syllabus[]> {
  const where: Record<string, unknown> = {
    deletedAt: null,
  };

  if (filters.search) {
    const q = filters.search.toLowerCase();
    where.OR = [
      { subjectName: { contains: q } },
      { subjectCode: { contains: q } },
    ];
  }
  if (filters.branch && filters.branch !== "ALL") {
    where.branchCode = filters.branch;
  }
  if (filters.semester && filters.semester !== "ALL") {
    where.semester = filters.semester;
  }

  const rows = await db.syllabus.findMany({
    where,
    orderBy: [{ semester: "asc" }, { subjectCode: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    semester: r.semester as Syllabus["semester"],
    branchCode: r.branchCode as Syllabus["branchCode"],
    subjectCode: r.subjectCode,
    subjectName: r.subjectName,
    version: r.version,
    fileUrl: r.fileUrl,
    lastUpdated: r.lastUpdated.toISOString(),
    modules: r.modules,
  }));
}
```

---

## Calendar

**File:** `/home/z/my-project/src/features/calendar/calendar.tsx`

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Clock, Bell } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { Badge } from "@/components/ui/badge";
import { MOCK_CALENDAR } from "@/data/mock-data";
import { formatDate } from "@/lib/utils/calc";
import type { CalendarEventType } from "@/lib/types";
import { cn } from "@/lib/utils";

const eventTypeMeta: Record<CalendarEventType, { label: string; bg: string }> = {
  EXAM: { label: "Exam", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  HOLIDAY: { label: "Holiday", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  RESULT: { label: "Result", bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  REGISTRATION: { label: "Registration", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  WORKSHOP: { label: "Workshop", bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  DEADLINE: { label: "Deadline", bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  EVENT: { label: "Event", bg: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
};

export function Calendar() {
  const prefersReduced = useReducedMotion();
  const events = [...MOCK_CALENDAR].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  return (
    <div>
      <PageHeader
        title="Academic Calendar"
        description="Stay on top of exams, deadlines, holidays and key academic events."
        icon={<CalendarDays className="size-5" />}
      />

      {/* Month blocks */}
      <div className="space-y-6">
        {events.map((e, i) => {
          const meta = eventTypeMeta[e.type];
          const startDate = new Date(e.startDate);
          const endDate = new Date(e.endDate);
          const isMultiDay = startDate.toDateString() !== endDate.toDateString();
          const daysUntil = Math.ceil(
            (startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          );
          return (
            <motion.div
              key={e.id}
              initial={prefersReduced ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <GlassCard className="p-4 sm:p-5 relative overflow-hidden" hover>
                {/* Color stripe */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ background: e.color }}
                />
                <div className="flex items-start gap-4 pl-2">
                  <div className="text-center shrink-0 min-w-[64px]">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      {startDate.toLocaleString("en-IN", { month: "short" })}
                    </p>
                    <p className="text-3xl font-bold leading-none mt-0.5">
                      {startDate.getDate()}
                    </p>
                    {isMultiDay && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        → {endDate.getDate()}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-semibold">{e.title}</h3>
                      <Badge className={cn("text-[10px]", meta.bg)} variant="secondary">
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{e.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {isMultiDay
                          ? `${formatDate(e.startDate)} → ${formatDate(e.endDate)}`
                          : formatDate(e.startDate)}
                      </span>
                      {e.reminderEnabled && (
                        <span className="flex items-center gap-1 text-primary">
                          <Bell className="size-3" /> Reminder on
                        </span>
                      )}
                      {daysUntil > 0 && (
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          in {daysUntil} day{daysUntil !== 1 ? "s" : ""}
                        </span>
                      )}
                      {daysUntil === 0 && (
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
                          Today
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## Calendar Server Actions

**File:** `/home/z/my-project/src/features/calendar/actions.ts`

```tsx
"use server";

import { db } from "@/lib/db";
import type { CalendarEvent, CalendarEventType } from "@/lib/types";

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const rows = await db.calendarEvent.findMany({
    orderBy: { startDate: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    type: r.type as CalendarEventType,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString(),
    allDay: r.allDay,
    color: r.color,
    reminderEnabled: r.reminderEnabled,
  }));
}
```

---

## Notices

**File:** `/home/z/my-project/src/features/notices/notices.tsx`

```tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Bell, Pin, ExternalLink, FileText, ChevronLeft, X } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { EmptyState } from "@/components/ui-custom/empty-state";
import { SketchBooks } from "@/components/ui-custom/sketch-elements";
import { BannerAd } from "@/components/ui-custom/banner-ad";
import { Badge } from "@/components/ui/badge";
import { MOCK_NOTICES } from "@/data/mock-data";
import { formatRelativeTime, formatDate } from "@/lib/utils/calc";
import type { KTUNotice, NoticeCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryColor: Record<NoticeCategory, string> = {
  Academic: "bg-primary/10 text-primary",
  Examination: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  Scholarship: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Placement: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Cultural: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  General: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

const categories: (NoticeCategory | "All")[] = [
  "All",
  "Academic",
  "Examination",
  "Scholarship",
  "Placement",
  "Cultural",
  "General",
];

export function Notices() {
  const [filter, setFilter] = useState<NoticeCategory | "All">("All");
  const [selected, setSelected] = useState<KTUNotice | null>(null);
  const prefersReduced = useReducedMotion();

  const filtered = useMemo(() => {
    const list = filter === "All" ? MOCK_NOTICES : MOCK_NOTICES.filter((n) => n.category === filter);
    return [...list].sort((a, b) => {
      // Pinned first, then by date desc
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [filter]);

  return (
    <div>
      <PageHeader
        title="Notices"
        description="Stay updated with the latest from APJ Abdul Kalam Technological University."
        icon={<Bell className="size-5" />}
      />

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition",
              filter === c
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No notices in this category"
          description="Try a different category filter."
          illustration={<SketchBooks size={120} color="amber" />}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((n, i) => (
            <motion.button
              key={n.id}
              initial={prefersReduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              onClick={() => setSelected(n)}
              className="w-full text-left"
            >
              <GlassCard hover className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Badge className={cn("text-[10px]", categoryColor[n.category])} variant="secondary">
                        {n.category}
                      </Badge>
                      {n.pinned && (
                        <Badge className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400" variant="secondary">
                          <Pin className="size-2.5 mr-1" /> Pinned
                        </Badge>
                      )}
                      {!n.read && (
                        <Badge className="text-[10px] bg-primary/15 text-primary" variant="secondary">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold leading-snug line-clamp-2">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {n.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatRelativeTime(n.publishedAt)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <BannerAd slot="notices-list" />
      </div>

      {/* Detail bottom sheet */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="relative w-full sm:max-w-2xl glass-strong rounded-t-3xl sm:rounded-3xl shadow-floating max-h-[90vh] overflow-y-auto"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="sticky top-0 glass-strong border-b border-border/40 px-6 py-4 flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelected(null)}
                  className="size-9 rounded-xl hover:bg-secondary flex items-center justify-center"
                  aria-label="Back"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <Badge className={cn("text-[10px]", categoryColor[selected.category])} variant="secondary">
                  {selected.category}
                </Badge>
                <button
                  onClick={() => setSelected(null)}
                  className="size-9 rounded-xl hover:bg-secondary flex items-center justify-center ml-auto"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold tracking-tight">{selected.title}</h2>
                <p className="text-xs text-muted-foreground mt-2">
                  Published {formatDate(selected.publishedAt)} · {formatRelativeTime(selected.publishedAt)}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                  {selected.description}
                </p>
                {selected.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {selected.tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">#{t}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-6">
                  {selected.pdfUrl && (
                    <a
                      href={selected.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
                    >
                      <FileText className="size-4" /> View PDF
                    </a>
                  )}
                  {selected.externalUrl && (
                    <a
                      href={selected.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 rounded-full bg-secondary text-secondary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition"
                    >
                      <ExternalLink className="size-4" /> Open link
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## Notices Server Actions

**File:** `/home/z/my-project/src/features/notices/actions.ts`

```tsx
"use server";

import { db } from "@/lib/db";
import type { KTUNotice, NoticeCategory, NoticePriority } from "@/lib/types";

export async function getNotices(category: NoticeCategory | "All" = "All"): Promise<KTUNotice[]> {
  const where: Record<string, unknown> = {
    active: true,
    deletedAt: null,
  };
  if (category !== "All") {
    where.category = category;
  }

  const rows = await db.kTUNotice.findMany({
    where,
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category as NoticeCategory,
    publishedAt: r.publishedAt.toISOString(),
    priority: r.priority as NoticePriority,
    pdfUrl: r.pdfUrl ?? undefined,
    externalUrl: r.externalUrl ?? undefined,
    tags: JSON.parse(r.tags) as string[],
    pinned: r.pinned,
    active: r.active,
  }));
}

export async function getNoticeByKey(key: string): Promise<KTUNotice | null> {
  const row = await db.kTUNotice.findUnique({ where: { key } });
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as NoticeCategory,
    publishedAt: row.publishedAt.toISOString(),
    priority: row.priority as NoticePriority,
    pdfUrl: row.pdfUrl ?? undefined,
    externalUrl: row.externalUrl ?? undefined,
    tags: JSON.parse(row.tags) as string[],
    pinned: row.pinned,
    active: row.active,
  };
}

/**
 * Upsert notices received from the scraper backend's /api/v1/notifications endpoint.
 * Called by the cron sync route.
 */
export async function upsertScraperNotifications(
  notices: Array<{
    date: string;
    heading: string;
    key: string;
    data: string;
  }>,
): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const n of notices) {
    const parsed = new Date(n.date);
    const publishedAt = isNaN(parsed.getTime()) ? new Date() : parsed;

    const result = await db.kTUNotice.upsert({
      where: { key: n.key },
      update: {
        title: n.heading,
        description: n.data,
        publishedAt,
      },
      create: {
        key: n.key,
        title: n.heading,
        description: n.data,
        category: "General",
        publishedAt,
        priority: "Normal",
        tags: JSON.stringify([]),
        pinned: false,
        active: true,
      },
    });

    // If createdAt is same as publishedAt, it was just created
    if (Math.abs(result.createdAt.getTime() - result.updatedAt.getTime()) < 1000) {
      created++;
    } else {
      updated++;
    }
  }

  return { created, updated };
}
```

---

## Bookmarks Server Actions

**File:** `/home/z/my-project/src/features/bookmarks/actions.ts`

```tsx
"use server";

import { db } from "@/lib/db";
import { getAuthenticatedStudent } from "@/lib/auth";
import type { Bookmark } from "@/lib/types";

/**
 * Get all bookmarks for the authenticated student.
 * Returns empty array if not logged in.
 */
export async function getBookmarks(): Promise<Bookmark[]> {
  // Server Action — but we need to read cookies from next/headers, not req.
  // For now, use a non-action fetch path via /api/v1/bookmarks route.
  // This file is for the action helpers; actual auth uses the route.
  return [];
}

/**
 * Toggle a bookmark. If authenticated, persists to DB.
 * If not, returns the would-be state (caller falls back to localStorage).
 */
export async function toggleBookmarkDB(
  studentId: string,
  entry: { kind: Bookmark["kind"]; refId: string; title: string; subtitle?: string },
): Promise<boolean> {
  const existing = await db.bookmark.findUnique({
    where: {
      studentId_kind_refId: {
        studentId,
        kind: entry.kind,
        refId: entry.refId,
      },
    },
  });

  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
    return false;
  }

  await db.bookmark.create({
    data: {
      studentId,
      kind: entry.kind,
      refId: entry.refId,
      title: entry.title,
      subtitle: entry.subtitle,
    },
  });
  return true;
}

export async function hasBookmarkDB(
  studentId: string,
  kind: string,
  refId: string,
): Promise<boolean> {
  const existing = await db.bookmark.findUnique({
    where: {
      studentId_kind_refId: {
        studentId,
        kind,
        refId,
      },
    },
  });
  return !!existing;
}

export async function listBookmarksDB(studentId: string): Promise<Bookmark[]> {
  const rows = await db.bookmark.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    kind: r.kind as Bookmark["kind"],
    refId: r.refId,
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    createdAt: r.createdAt.toISOString(),
  }));
}
```

---

## Settings

**File:** `/home/z/my-project/src/features/settings/settings.tsx`

```tsx
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Heart,
  Info,
  MessageSquare,
  Shield,
  FileText,
  ChevronRight,
  Github,
  Sparkles,
  Languages,
  Vibrate,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { SketchHeart, SketchNotebook, SketchPencil } from "@/components/ui-custom/sketch-elements";
import { BannerAd } from "@/components/ui-custom/banner-ad";
import { useThemeStore } from "@/store/theme-store";
import { useSupporterStore } from "@/store/supporter-store";
import { useNavStore } from "@/store/nav-store";
import { getAnalyticsProvider } from "@/lib/providers/analytics";
import { getNotificationProvider } from "@/lib/providers/notification";
import { APP_VERSION, UNIVERSITY_NAME, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Settings() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const resolved = useThemeStore((s) => s.resolved);
  const isSupporter = useSupporterStore((s) => s.isSupporter);
  const setSupportOpen = useNavStore((s) => s.setSupportOpen);
  const prefersReduced = useReducedMotion();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Personalise KTU One, manage your account and find help."
        icon={<SettingsIcon className="size-5" />}
      />

      <div className="space-y-5">
        {/* Supporter status */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isSupporter ? (
            <GlassCard className="p-5">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-gradient-plum flex items-center justify-center">
                  <Sparkles className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">You're a Lifetime Supporter</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ads are removed forever. Thank you 💜
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  Active
                </span>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-5">
              <div className="flex items-center gap-4">
                <SketchHeart size={48} color="coral" />
                <div className="flex-1">
                  <p className="font-serif-display text-base">Support KTU One</p>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    Remove ads · ₹99 lifetime · support development
                  </p>
                </div>
                <button
                  onClick={() => setSupportOpen(true)}
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition shadow-soft flex items-center gap-1.5"
                >
                  <Heart className="size-3.5" fill="currentColor" />
                  Support
                </button>
              </div>
            </GlassCard>
          )}
        </motion.div>

        {/* Appearance */}
        <SettingsGroup title="Appearance" icon={<Sparkles className="size-4" />}>
          <SettingsRow label="Theme" description="Switch between light, dark, or system.">
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-secondary/60">
              {(["light", "dark", "system"] as const).map((m) => {
                const Icon = m === "light" ? Sun : m === "dark" ? Moon : Monitor;
                const isActive = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      getAnalyticsProvider().track({
                        name: "theme_changed",
                        props: { theme: m },
                      });
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 capitalize transition",
                      isActive
                        ? "bg-background shadow-soft text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {m}
                  </button>
                );
              })}
            </div>
          </SettingsRow>
          <SettingsRow label="Current" description={`Currently rendering as ${resolved}.`}>
            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
              {resolved === "dark" ? "Dark" : "Light"}
            </span>
          </SettingsRow>
        </SettingsGroup>

        {/* Preferences */}
        <SettingsGroup title="Preferences" icon={<Vibrate className="size-4" />}>
          <SettingsRow label="Language" description="Currently English. Malayalam coming soon.">
            <Languages className="size-4 text-muted-foreground" />
          </SettingsRow>
          <SettingsRow label="Haptics" description="Vibrate on interactions (mobile only).">
            <ToggleSwitch defaultChecked />
          </SettingsRow>
          <SettingsRow label="Reduced motion" description="Respect system reduced-motion.">
            <ToggleSwitch defaultChecked />
          </SettingsRow>
        </SettingsGroup>

        {/* About */}
        <SettingsGroup title="About" icon={<Info className="size-4" />}>
          <SettingsRow label="App version" description={`KTU One v${APP_VERSION}`}>
            <span className="text-xs text-muted-foreground">{APP_VERSION}</span>
          </SettingsRow>
          <SettingsRow label="University" description={UNIVERSITY_NAME}>
            <span className="text-xs text-muted-foreground">KTU</span>
          </SettingsRow>
          <button
            onClick={() =>
              getNotificationProvider().show({
                kind: "info",
                title: "KTU One",
                message: "An independent project. Not affiliated with KTU.",
              })
            }
            className="w-full"
          >
            <SettingsRow label="Disclaimer" description="KTU One is an independent student companion." chevron />
          </button>
        </SettingsGroup>

        {/* Help & feedback */}
        <SettingsGroup title="Help & feedback" icon={<MessageSquare className="size-4" />}>
          <button
            onClick={() =>
              getNotificationProvider().show({
                kind: "info",
                title: "Feedback form",
                message: "Coming soon — for now, ping us at hello@ktuone.in",
              })
            }
            className="w-full"
          >
            <SettingsRow label="Send feedback" description="Suggest features or report issues." chevron />
          </button>
          <button className="w-full">
            <SettingsRow label="Rate KTU One" description="Help others discover the app." chevron />
          </button>
          <button className="w-full">
            <SettingsRow label="Share with friends" description="Spread the word." chevron />
          </button>
        </SettingsGroup>

        {/* Legal */}
        <SettingsGroup title="Legal" icon={<Shield className="size-4" />}>
          <button className="w-full">
            <SettingsRow label="Privacy policy" description="How we handle your data." chevron icon={<FileText className="size-4" />} />
          </button>
          <button className="w-full">
            <SettingsRow label="Terms of service" description="The rules of using KTU One." chevron icon={<FileText className="size-4" />} />
          </button>
          <a
            href="#"
            className="w-full"
            onClick={(e) => e.preventDefault()}
          >
            <SettingsRow label="Open source" description="Built with open-source tools." chevron icon={<Github className="size-4" />} />
          </a>
        </SettingsGroup>

        {!isSupporter && (
          <BannerAd slot="settings-top" />
        )}

        {/* Footer — editorial colophon */}
        <div className="text-center py-6">
          <div className="flex items-end justify-center gap-1 mb-3">
            <SketchNotebook size={48} color="plum" />
            <div className="-ml-1 -mb-0.5">
              <SketchPencil size={26} color="amber" />
            </div>
          </div>
          <p className="font-handwritten text-base text-muted-foreground">
            made with 💜 for KTU students
          </p>
          <p className="text-[11px] text-muted-foreground/70 mt-1 tracking-wide">
            {APP_NAME}
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingsGroup({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className="p-2">
      <div className="px-3 pt-3 pb-2 flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-border/40">{children}</div>
    </GlassCard>
  );
}

function SettingsRow({
  label,
  description,
  children,
  chevron,
  icon,
}: {
  label: string;
  description?: string;
  children?: React.ReactNode;
  chevron?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-3 hover:bg-secondary/40 transition rounded-xl">
      <div className="flex items-start gap-3 min-w-0">
        {icon && <span className="text-muted-foreground mt-0.5">{icon}</span>}
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {children}
        {chevron && <ChevronRight className="size-4 text-muted-foreground" />}
      </div>
    </div>
  );
}

function ToggleSwitch({ defaultChecked }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <button
      onClick={() => setOn(!on)}
      className={cn(
        "w-11 h-6 rounded-full transition relative",
        on ? "bg-primary" : "bg-secondary",
      )}
      role="switch"
      aria-checked={on}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-white shadow-soft transition-all",
          on ? "left-[22px]" : "left-0.5",
        )}
      />
    </button>
  );
}
```

---
# 13. Signature Experiences

## Support Curtain

**File:** `/home/z/my-project/src/components/support/support-curtain.tsx`

```tsx
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Sparkles, X, Check } from "lucide-react";
import { useNavStore } from "@/store/nav-store";
import { useSupporterStore } from "@/store/supporter-store";
import { getPaymentProvider } from "@/lib/providers/payment";
import { getNotificationProvider } from "@/lib/providers/notification";
import { getAnalyticsProvider } from "@/lib/providers/analytics";
import { SUPPORTER_PRICE_INR } from "@/lib/constants";

const benefits = [
  { title: "Remove ads forever", subtitle: "Banner ads gone, on every device." },
  { title: "Lifetime Supporter Badge", subtitle: "A small purple mark next to your name." },
  { title: "Help future development", subtitle: "Fund faster PDFs, search & AI Tutor." },
  { title: "Priority feature requests", subtitle: "Vote on what we build next." },
];

export function SupportCurtain() {
  const open = useNavStore((s) => s.supportOpen);
  const setOpen = useNavStore((s) => s.setSupportOpen);
  const markSupporter = useSupporterStore((s) => s.markSupporter);
  const prefersReduced = useReducedMotion();
  const [purchasing, setPurchasing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Reset state when reopened
  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError(null);
      setPurchasing(false);
    }
  }, [open]);

  // Esc key closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !purchasing) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen, purchasing]);

  const handlePurchase = async () => {
    setPurchasing(true);
    setError(null);
    getAnalyticsProvider().track({ name: "supporter_purchase_started", props: {} });
    try {
      const result = await getPaymentProvider().initiatePurchase({
        amount: SUPPORTER_PRICE_INR,
        currency: "INR",
      });
      if (result.status === "Success") {
        markSupporter(result.transactionId, new Date().toISOString());
        setSuccess(true);
        getAnalyticsProvider().track({
          name: "supporter_purchase_succeeded",
          props: { transactionId: result.transactionId },
        });
        getNotificationProvider().show({
          kind: "success",
          title: "Welcome to KTU One Supporters 💜",
          message: "Ads are gone. Thanks for keeping this alive.",
        });
        // Auto-close after celebration
        setTimeout(() => setOpen(false), 2200);
      } else {
        throw new Error("Payment did not succeed.");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Payment failed. Try again.";
      setError(message);
      getAnalyticsProvider().track({
        name: "supporter_purchase_failed",
        props: { reason: message },
      });
    } finally {
      setPurchasing(false);
    }
  };

  const curtainVariants = {
    hidden: prefersReduced
      ? { y: "-100%", opacity: 0 }
      : { y: "-100%", opacity: 0 },
    visible: prefersReduced
      ? { y: "0%", opacity: 1 }
      : {
          y: "0%",
          opacity: 1,
          transition: {
            type: "spring" as const,
            stiffness: 220,
            damping: 28,
            mass: 0.9,
          },
        },
    exit: prefersReduced
      ? { y: "-100%", opacity: 0 }
      : {
          y: "-100%",
          opacity: 0,
          transition: {
            type: "spring" as const,
            stiffness: 260,
            damping: 30,
          },
        },
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Dimmed / blurred backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => !purchasing && setOpen(false)}
          />

          {/* The curtain panel — slides from top, stops at ~85% height */}
          <motion.div
            className="absolute left-0 right-0 top-0 h-[85vh] mx-auto"
            variants={curtainVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="h-full glass-strong rounded-b-3xl overflow-hidden flex flex-col shadow-floating">
              {/* Top handle */}
              <div className="pt-3 pb-1 flex justify-center">
                <div className="w-10 h-1.5 rounded-full bg-foreground/15" />
              </div>

              <div className="flex-1 overflow-y-auto px-6 sm:px-10 pb-6 pt-2 max-w-2xl w-full mx-auto">
                {!success ? (
                  <>
                    <div className="text-center mt-2">
                      <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 mb-4">
                        <Heart className="size-8 text-primary" fill="currentColor" />
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight">
                        Support KTU One
                      </h2>
                      <p className="mt-3 text-muted-foreground leading-relaxed">
                        KTU One is free for every student.
                        <br />
                        Your support helps keep the app alive and updated.
                      </p>
                    </div>

                    <div className="mt-8 space-y-3">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold px-1">
                        Benefits
                      </p>
                      {benefits.map((b) => (
                        <div
                          key={b.title}
                          className="flex items-start gap-3 p-4 rounded-2xl glass"
                        >
                          <div className="size-8 rounded-full bg-success/15 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="size-4 text-success" strokeWidth={3} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{b.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{b.subtitle}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 p-5 rounded-2xl bg-gradient-plum text-white text-center">
                      <p className="text-xs uppercase tracking-widest font-semibold opacity-80">
                        One-time price
                      </p>
                      <p className="text-4xl font-bold mt-1">
                        ₹{SUPPORTER_PRICE_INR}
                        <span className="text-base font-medium opacity-80 ml-2">Lifetime</span>
                      </p>
                      <p className="text-xs opacity-80 mt-1">
                        Not a subscription. Pay once, keep forever.
                      </p>
                    </div>

                    {error && (
                      <div className="mt-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center">
                        {error}
                      </div>
                    )}

                    <div className="mt-6 space-y-3">
                      <button
                        onClick={handlePurchase}
                        disabled={purchasing}
                        className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {purchasing ? (
                          <>
                            <span className="size-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Heart className="size-4" fill="currentColor" />
                            Become a Supporter
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setOpen(false)}
                        disabled={purchasing}
                        className="w-full py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition disabled:opacity-50"
                      >
                        Maybe later
                      </button>
                    </div>

                    <p className="mt-5 text-center text-[11px] text-muted-foreground leading-relaxed">
                      Payments are securely processed. Your support is non-refundable
                      unless required by law. KTU One is an independent project,
                      not affiliated with APJ Abdul Kalam Technological University.
                    </p>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <motion.div
                      initial={prefersReduced ? {} : { scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                      className="size-24 rounded-full bg-gradient-plum flex items-center justify-center mb-6"
                    >
                      <Sparkles className="size-12 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      You&apos;re a Supporter 💜
                    </h2>
                    <p className="mt-3 text-muted-foreground max-w-sm">
                      Welcome aboard. Ads are gone forever — and you just helped
                      every KTU student get a better app.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Floating circular X — sits just below the curtain, slight overlap */}
          <motion.button
            onClick={() => !purchasing && setOpen(false)}
            aria-label="Close support curtain"
            className="absolute left-1/2 -translate-x-1/2 z-[101] size-14 rounded-full glass-strong shadow-floating flex items-center justify-center hover:scale-105 active:scale-95 transition-transform no-tap-highlight"
            style={{ top: "calc(85vh - 28px)" }}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            disabled={purchasing}
          >
            <X className="size-6" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
```

---

## Login Dialog

**File:** `/home/z/my-project/src/features/login/login-dialog.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, User, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SketchNotebook, SketchPencil } from "@/components/ui-custom/sketch-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavStore } from "@/store/nav-store";
import { useAuthStore } from "@/store/auth-store";
import { getStudentService } from "@/lib/providers/student";
import { getAnalyticsProvider } from "@/lib/providers/analytics";
import { getNotificationProvider } from "@/lib/providers/notification";
import { APP_NAME, UNIVERSITY_NAME } from "@/lib/constants";
import type { StudentProfile } from "@/lib/types";

export function LoginDialog() {
  const open = useNavStore((s) => s.loginOpen);
  const setOpen = useNavStore((s) => s.setLoginOpen);
  const setSession = useAuthStore((s) => s.setSession);
  const setProfile = useAuthStore((s) => s.setProfile);
  const prefersReduced = useReducedMotion();

  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await getStudentService().login({
        registerNumber,
        password,
      });
      const session = {
        studentId: res.student.id,
        registerNumber: res.student.registerNumber,
        name: res.student.name,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        expiresAt: Date.now() + res.expiresIn * 1000,
        issuedAt: Date.now(),
      };
      setSession(session);
      // Fetch full profile via StudentService (mock returns MOCK_STUDENT)
      const profile = await getStudentService().getProfile();
      setProfile(profile satisfies StudentProfile);
      getAnalyticsProvider().track({
        name: "login_succeeded",
        props: { registerNumber },
      });
      getNotificationProvider().show({
        kind: "success",
        title: `Welcome, ${res.student.name.split(" ")[0]}!`,
        message: "You're signed in.",
      });
      setOpen(false);
      setPassword("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Try again.";
      setError(message);
      getAnalyticsProvider().track({
        name: "login_failed",
        props: { reason: message },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && setOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-md glass-strong rounded-3xl shadow-floating overflow-hidden"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <button
              onClick={() => !loading && setOpen(false)}
              className="absolute top-4 right-4 size-9 rounded-xl hover:bg-secondary flex items-center justify-center z-10"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            <div className="p-8 pt-10">
              {/* Hero — editorial illustration */}
              <div className="flex flex-col items-center text-center mb-6">
                <Logo size={48} />
                <div className="flex items-end gap-1 mt-5">
                  <SketchNotebook size={72} color="plum" />
                  <div className="-ml-2 -mb-1">
                    <SketchPencil size={32} color="amber" />
                  </div>
                </div>
                <h2 className="font-serif-display text-2xl tracking-tight mt-4">
                  Welcome to {APP_NAME}
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xs italic">
                  Sign in with your KTU credentials to sync your CGPA, results and attendance.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="reg-no" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Register Number
                  </Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="reg-no"
                      value={registerNumber}
                      onChange={(e) => setRegisterNumber(e.target.value)}
                      placeholder="e.g. TVE21CS001"
                      autoCapitalize="characters"
                      autoCorrect="off"
                      required
                      className="pl-10 h-12 bg-background"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pwd" className="text-xs uppercase tracking-wider text-muted-foreground">
                    KTU Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="pwd"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your KTU portal password"
                      required
                      className="pl-10 pr-10 h-12 bg-background"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"
                  >
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !registerNumber || password.length < 3}
                  className="w-full h-12 rounded-full shadow-soft text-base font-semibold"
                >
                  {loading ? (
                    <>
                      <span className="size-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="size-4 mr-2" />
                      Sign in
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-5 p-3 rounded-xl bg-secondary/40 text-[11px] text-muted-foreground text-center leading-relaxed">
                We never store your KTU password. Credentials are sent securely to our
                backend, exchanged for a session token, then discarded.
              </div>

              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                Not affiliated with {UNIVERSITY_NAME}.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

---

## Universal Search Overlay

**File:** `/home/z/my-project/src/features/search/search-overlay.tsx`

```tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, X, Clock, FileText, BookOpen, Bell, CalendarDays, TrendingUp } from "lucide-react";
import { useNavStore } from "@/store/nav-store";
import { MOCK_PAPERS, MOCK_SYLLABUS, MOCK_NOTICES, MOCK_CALENDAR, SUBJECTS } from "@/data/mock-data";
import { getAnalyticsProvider } from "@/lib/providers/analytics";
import type { NavKey } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils/calc";

type ResultKind = "paper" | "syllabus" | "notice" | "calendar" | "subject";
interface Result {
  id: string;
  kind: ResultKind;
  title: string;
  subtitle?: string;
  meta?: string;
}

const kindMeta: Record<ResultKind, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  paper: { label: "Paper", icon: FileText, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  syllabus: { label: "Syllabus", icon: BookOpen, color: "bg-primary/10 text-primary" },
  notice: { label: "Notice", icon: Bell, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  calendar: { label: "Event", icon: CalendarDays, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  subject: { label: "Subject", icon: TrendingUp, color: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
};

const RECENT_KEY = "ktu_one:search:recent";

export function SearchOverlay() {
  const open = useNavStore((s) => s.searchOpen);
  const setOpen = useNavStore((s) => s.setSearchOpen);
  const setNav = useNavStore((s) => s.set);
  const prefersReduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        Promise.resolve().then(() => setRecent(parsed));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      Promise.resolve().then(() => setQuery(""));
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const results = useMemo<Result[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const out: Result[] = [];

    for (const s of SUBJECTS.slice(0, 10)) {
      if (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
      ) {
        out.push({
          id: s.id,
          kind: "subject",
          title: s.name,
          subtitle: s.code,
          meta: `${s.branchCode} · S${s.semester} · ${s.credits} credits`,
        });
      }
    }
    for (const p of MOCK_PAPERS) {
      if (out.length > 20) break;
      if (
        p.subjectName.toLowerCase().includes(q) ||
        p.subjectCode.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
      ) {
        out.push({
          id: p.id,
          kind: "paper",
          title: p.subjectName,
          subtitle: p.subjectCode,
          meta: `${p.branchCode} · S${p.semester} · ${p.month === 5 ? "May" : "Nov"} ${p.year}`,
        });
      }
    }
    for (const s of MOCK_SYLLABUS) {
      if (out.length > 30) break;
      if (
        s.subjectName.toLowerCase().includes(q) ||
        s.subjectCode.toLowerCase().includes(q)
      ) {
        out.push({
          id: s.id,
          kind: "syllabus",
          title: s.subjectName,
          subtitle: s.subjectCode,
          meta: `${s.branchCode} · S${s.semester}`,
        });
      }
    }
    for (const n of MOCK_NOTICES) {
      if (out.length > 40) break;
      if (n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)) {
        out.push({
          id: n.id,
          kind: "notice",
          title: n.title,
          subtitle: n.category,
          meta: formatRelativeTime(n.publishedAt),
        });
      }
    }
    for (const c of MOCK_CALENDAR) {
      if (out.length > 50) break;
      if (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
        out.push({
          id: c.id,
          kind: "calendar",
          title: c.title,
          subtitle: c.type,
          meta: formatRelativeTime(c.startDate),
        });
      }
    }
    return out;
  }, [query]);

  const saveRecent = (q: string) => {
    const next = [q, ...recent.filter((r) => r !== q)].slice(0, 6);
    setRecent(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const handleResultClick = (r: Result) => {
    saveRecent(query);
    getAnalyticsProvider().track({
      name: "search_performed",
      props: { query, resultCount: results.length },
    });
    const navMap: Record<ResultKind, NavKey> = {
      paper: "papers",
      syllabus: "syllabus",
      notice: "notices",
      calendar: "calendar",
      subject: "papers",
    };
    setNav(navMap[r.kind]);
    setOpen(false);
  };

  const grouped = useMemo(() => {
    const map = new Map<ResultKind, Result[]>();
    for (const r of results) {
      const arr = map.get(r.kind) ?? [];
      arr.push(r);
      map.set(r.kind, arr);
    }
    return Array.from(map.entries());
  }, [results]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95]">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-[8vh] w-full max-w-2xl px-4"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="glass-strong rounded-3xl shadow-floating overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
                <Search className="size-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subjects, papers, syllabus, notices..."
                  className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:block text-[10px] px-2 py-1 rounded bg-secondary text-muted-foreground font-mono">
                  ESC
                </kbd>
                <button
                  onClick={() => setOpen(false)}
                  className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center"
                  aria-label="Close search"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Results / recent */}
              <div className="max-h-[60vh] overflow-y-auto">
                {!query.trim() ? (
                  <div className="p-4">
                    {recent.length > 0 ? (
                      <>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold px-2 mb-2">
                          Recent searches
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {recent.map((r) => (
                            <button
                              key={r}
                              onClick={() => setQuery(r)}
                              className="px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 text-sm flex items-center gap-1.5"
                            >
                              <Clock className="size-3" /> {r}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-sm text-muted-foreground">
                        Search across papers, syllabus, notices, calendar and more.
                      </div>
                    )}
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No results for &quot;{query}&quot;
                    </p>
                  </div>
                ) : (
                  grouped.map(([kind, items]) => {
                    const meta = kindMeta[kind];
                    const Icon = meta.icon;
                    return (
                      <div key={kind} className="py-2">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold px-5 py-1.5 flex items-center gap-1.5">
                          <Icon className="size-3" /> {meta.label}
                        </p>
                        {items.map((r) => {
                          const RIcon = kindMeta[r.kind].icon;
                          return (
                            <button
                              key={`${r.kind}_${r.id}`}
                              onClick={() => handleResultClick(r)}
                              className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-secondary/60 transition text-left"
                            >
                              <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", kindMeta[r.kind].color)}>
                                <RIcon className="size-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{r.title}</p>
                                {r.subtitle && (
                                  <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                                )}
                              </div>
                              {r.meta && (
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {r.meta}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border/40 px-5 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{results.length} result{results.length !== 1 ? "s" : ""}</span>
                <span>Press <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono">↵</kbd> to open</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

---
# 14. Configuration

## .env.local (server-side only)

**File:** `/home/z/my-project/.env.local`

```env
DATABASE_URL=file:/home/z/my-project/db/custom.db

# Scraper backend (your existing Express API)
SCRAPER_API_URL=https://ktugatewayapi-production.up.railway.app
SCRAPER_API_KEY=b4361ae2903028b23e6a8e7ab88c656a41257d0be26db750e138d4da2b244399

# JWT signing (auto-generated)
JWT_SECRET=ffac8a9f8ae2a79bd44fbf36a0bd9ed4216dd7ebf2204497568e8957a748913fcf44d2daa96b2424e7d40e6d490de786a9bc5abb180ef2d1e2fc91fffe316b79
JWT_ACCESS_TTL=3600
JWT_REFRESH_TTL=2592000

# Cached student data TTL (24h - KTU data barely changes during the day)
CACHE_TTL_SECONDS=86400

# Cron protection
CRON_SECRET=169d951a74c44376883d20fd901dd93ecac973b567566e9b1ddbf98712d2902f
```

---

---

# Phase 2 — BFF + Database Implementation Summary

## Architecture Overview

The frontend now talks to a **Next.js BFF** (Backend-for-Frontend) layer that lives in `src/app/api/v1/*`. The BFF handles JWT auth, rate limiting (future), and caching. The BFF calls the existing Express scraper backend (frozen — only `request`→`axios` migration needed there) for live academic data.

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────┐
│  Frontend   │────▶│  Next.js BFF     │────▶│  Scraper API    │────▶│  KTU     │
│ (React)     │ JWT │  /api/v1/*       │     │  (Express)      │     │  Portal  │
│ cookies     │     │  + Prisma (SQLite)│     │  + Redis cache  │     └──────────┘
└─────────────┘     └──────────────────┘     └─────────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  SQLite DB   │
                     │  (Phase 2)   │
                     │  → Postgres  │
                     │  (Phase 3)   │
                     └──────────────┘
```

## What was built in Phase 2

### Database Layer
- **Prisma schema** with 14 models: Branch, Semester, Subject, QuestionPaper, Syllabus, KTUNotice, CalendarEvent, Student, CachedStudentData, RefreshToken, Bookmark, CalculatorHistoryEntry, SupporterPurchase, AppSettings
- **SQLite** for dev (zero-config, lives in `db/custom.db`)
- **Seed script** ports all mock-data.ts → DB rows
- Soft deletes on QuestionPaper, Syllabus, KTUNotice (`deletedAt` field)

### BFF Auth Layer
- `POST /api/v1/login` — validates credentials via scraper, issues JWT access (1h) + refresh (30d) tokens as httpOnly cookies, caches scraper response in Prisma (24h TTL per user request)
- `POST /api/v1/refresh` — exchanges refresh token for new access token
- `POST /api/v1/logout` — revokes all refresh tokens, clears cookies
- JWT signed with `jose` (HS256), refresh tokens hashed with `bcryptjs`
- Password NEVER persisted, NEVER logged — only used in single scraper call

### BFF Data Routes (JWT-protected)
- `GET /api/v1/profile` — student profile from cached scraper data
- `GET /api/v1/results` — semester-by-semester results
- `GET /api/v1/cgpa` — computed CGPA
- `GET /api/v1/bookmarks` — list bookmarks
- `POST /api/v1/bookmarks` — toggle bookmark
- `DELETE /api/v1/bookmarks?id=X` — remove bookmark
- `GET /api/v1/calc-history` — list calculator history
- `POST /api/v1/calc-history` — add entry
- `DELETE /api/v1/calc-history?id=X` — remove entry
- `DELETE /api/v1/calc-history?all=1` — clear all

### Scraper Mapper
Pure functions that convert the scraper's response shape → our domain types:
- `normalizeBranchCode()` — "COMPUTER SCIENCE & ENGINEERING" → "CSE"
- `parseSemester()` — "S8" → 8
- `parseAdmissionYear()` — "0/2020" → 2020 (handles scraper's month=0 bug)
- `buildAvatarInitials()` — "JOHN DOE" → "JD"
- `mapScraperToProfile()` — full scraper response → StudentProfile
- `mapScraperToResults()` — S1..S8 arrays → SemesterResult[]
- `mapScraperToCGPA()` — computes CGPA from per-semester SGPA × credits

Handles known scraper quirks:
- `MinorStaus` typo (preserved exactly)
- `Board/University` and `EntranceRank/Percentile` slash keys (bracket notation)
- `grade: "No"` field (uses `earned` for actual grade)
- IST date strings in notifications

### Notification Sync
- `GET /api/cron/sync-notifications` — Vercel Cron route, runs every 15 min
- Protected by `CRON_SECRET` header
- Polls scraper's `/api/v1/notifications`, upserts by `key` field (slug) for dedup
- Configured in `vercel.json`

### Frontend Provider Swap
- New `HttpStudentService` implements the same interface as `MockStudentService`
- Calls BFF routes via `fetch` with `credentials: "include"`
- Auto-retries once on 401 (calls `/refresh`, then retries original request)
- Wired in `Providers` composition root via `__setStudentService(new HttpStudentService())`
- UI code unchanged — only the provider implementation swapped

### Server Actions (DB-backed content)
- `features/papers/actions.ts` — `getPapers()`, `getPaperYears()`, `incrementPaperView()`, `incrementPaperDownload()`
- `features/syllabus/actions.ts` — `getSyllabus()`
- `features/notices/actions.ts` — `getNotices()`, `getNoticeByKey()`, `upsertScraperNotifications()`
- `features/calendar/actions.ts` — `getCalendarEvents()`
- `features/dashboard/actions.ts` — `getDashboardStats()`, `getRecentNotices()`, `getUpcomingEvent()`, `getRecentPapers()`
- `features/bookmarks/actions.ts` — `toggleBookmarkDB()`, `hasBookmarkDB()`, `listBookmarksDB()`
- `features/calculators/history-actions.ts` — `addCalcHistoryDB()`, `listCalcHistoryDB()`, `removeCalcHistoryDB()`, `clearCalcHistoryDB()`

## Environment Variables

```env
DATABASE_URL=file:/home/z/my-project/db/custom.db

# Scraper backend
SCRAPER_API_URL=https://ktugatewayapi-production.up.railway.app
SCRAPER_API_KEY=<your-scraper-api-key>

# JWT
JWT_SECRET=<64-byte-hex>
JWT_ACCESS_TTL=3600
JWT_REFRESH_TTL=2592000

# Cache (24h per user request)
CACHE_TTL_SECONDS=86400

# Cron
CRON_SECRET=<random-32-byte-hex>
```

## What's NOT yet done (Phase 3+)

- **Features not yet wired to Server Actions** — Dashboard, Papers, Syllabus, Calendar, Notices still import from `mock-data.ts`. The Server Actions exist but features haven't been refactored to use them. This is intentional — features keep working with mock data, and swapping to Server Actions is a mechanical change once we verify the BFF layer is solid.
- **Bookmarks/calc-history in features** — still use Zustand localStorage. Server Actions + BFF routes exist, but features haven't been refactored to call them when authenticated.
- **Rate limiting** — Upstash Ratelimit not yet installed. Add before production.
- **Cloudflare R2** — for PDF + image storage. Not yet wired.
- **Admin panel** — for content operations.
- **Capacitor** — Android wrapper.
- **PWA service worker** — offline support.

## Verified

- ✅ Lint clean (0 errors, 0 warnings)
- ✅ App loads without errors
- ✅ Database seeded (8 branches, 64 semesters, 12 subjects, 32 papers, 10 syllabus, 6 notices, 6 calendar events)
- ✅ Scraper backend reachable (`https://ktugatewayapi-production.up.railway.app` returns `{"status":"working","version":"2.0.0"}`)
- ✅ BFF login rejects invalid credentials (`AUTH_FAILED`)
- ✅ All protected routes reject unauthenticated requests (`UNAUTHORIZED`)
- ✅ Refresh endpoint correctly reports missing cookie
- ✅ Cron route protected by secret, syncs successfully (0 notifications because scraper's Redis list is currently empty)
- ✅ HttpStudentService wired in Providers composition root

## How to test the full auth flow

1. Open the app, click Login
2. Enter a real KTU register number + password
3. The login dialog calls `StudentService.login()` → `HttpStudentService.login()` → `POST /api/v1/login`
4. BFF calls scraper's `POST /api/v1/data` with `{ key, userid, password }`
5. If scraper returns success: BFF creates/updates Student row, caches scraper response (24h), issues JWT + refresh token cookies, returns student profile
6. Frontend stores profile in `auth-store`, shows avatar initials in navbar
7. Subsequent visits: `HttpStudentService.initialize()` calls `POST /api/v1/refresh` — if 200, session is restored

## Scraper backend changes still needed (your side)

Per our discussion — only 2 things:
1. **Drop deprecated `request`/`request-promise`** → migrate to `axios` + `axios-cookiejar-support`
2. **Add structured error responses** → `{ error: { code, message } }` shape

Everything else (JWT, rate limiting, endpoint splitting) is handled by the BFF.

---

**Phase 2 complete.** Total new code: ~2,400 lines across 24 new files.

End of codebase reference.
