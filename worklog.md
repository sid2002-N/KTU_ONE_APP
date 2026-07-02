# KTU One — Worklog

## Task ID: admin-ui
**Agent:** admin-ui (UI builder)
**Date:** 2025

### Scope
Recreated the lost KTU One admin panel UI (client side only — API routes are created separately). All admin components live under `src/features/admin/` and are surfaced via the new `src/app/admin/page.tsx` route.

### Files Created
1. `src/app/admin/page.tsx` — Client component holding the admin key in React state. Renders `AdminLogin` until a key is provided, then `AdminDashboard`. Logout clears the key.
2. `src/features/admin/admin-login.tsx` — Password-style login form. Verifies the key by issuing `GET /api/v1/admin/notices` with `Authorization: Bearer <key>`. On HTTP 200, calls `onLogin(key)`; on 401/403 shows "Invalid admin key."
3. `src/features/admin/admin-dashboard.tsx` — Sticky header ("KTU One Admin" + Logout). A `Tabs` (Radix) component with 4 triggers (Notices, Calendar, Papers, Syllabus). Each tab renders the corresponding admin component. Responsive: 2-col on mobile, 4-col on `sm+`.
4. `src/features/admin/notices-admin.tsx` — CRUD for notices:
   - Lists via `GET /api/v1/admin/notices` (Bearer auth).
   - Create form: title, description, category (`Select`), priority (`Select`), pinned (`Checkbox`), externalUrl, tags (comma-separated). POSTs JSON to `/api/v1/admin/notices`.
   - Delete via `DELETE /api/v1/admin/notices?id=…` with `confirm()` prompt.
   - Loading / error / empty states; scrollable list (`max-h-96 overflow-y-auto`).
5. `src/features/admin/calendar-admin.tsx` — CRUD for calendar events:
   - Lists via `GET /api/v1/admin/calendar`.
   - Create form: title, description, type (`Select`), startDate, endDate (date inputs). Color is auto-assigned from a `TYPE_COLORS` map based on the selected type and shown in the form preview + list badge.
   - Delete via `DELETE /api/v1/admin/calendar?id=…` with `confirm()`.
6. `src/features/admin/papers-admin.tsx` — Upload + list + delete for question papers:
   - Lists via `GET /api/v1/admin/papers`.
   - Upload form (multipart): file input (`application/pdf`), title, subjectCode, subjectName, semester (Select from `SEMESTERS`), branchCode (Select from `BRANCHES`), year, month (1–12), examType (Select). POSTs `FormData` to `/api/v1/admin/papers/upload` (no `Content-Type` header — browser sets the multipart boundary).
   - Delete via `DELETE /api/v1/admin/papers?id=…`.
   - Each row has a download test link to `/api/v1/papers/${p.id}/download`.
7. `src/features/admin/syllabus-admin.tsx` — Same pattern as papers but for syllabus:
   - Lists via `GET /api/v1/admin/syllabus`.
   - Upload to `/api/v1/admin/syllabus/upload` (multipart).
   - Fields: file, title, subjectCode, subjectName, semester, branchCode, version, modules.
   - Delete via `DELETE /api/v1/admin/syllabus?id=…`.
   - Each row has a download test link to `/api/v1/syllabus/${s.id}/download`.

### Conventions Followed
- All admin components receive `adminKey: string` as a prop.
- Auth headers used consistently:
  - GET/DELETE: `{ headers: { Authorization: \`Bearer ${adminKey}\` } }`
  - POST/PUT with JSON: `{ headers: { Authorization: \`Bearer ${adminKey}\`, "Content-Type": "application/json" } }`
  - File uploads: `FormData` body with only the `Authorization` header.
- Tailwind classes: `bg-background`, `bg-card`, `border-border`, `text-muted-foreground`, etc. No indigo/blue.
- Forms use responsive `grid grid-cols-1 sm:grid-cols-2 gap-3`.
- Delete actions confirmed with `confirm()`.
- Loading states use `<Loader2 className="animate-spin" />`. Errors render in a destructive-tinted alert box.
- Lists are capped with `max-h-96 overflow-y-auto`.

### Lint Status
See "Lint result" section at the end of this log entry (filled in after running `bun run lint`).

### Notes for the API Agent
The UI expects these endpoints to exist (relative URLs only — Caddy will forward):
- `GET /api/v1/admin/notices` → `KTUNotice[]`
- `POST /api/v1/admin/notices` → JSON body
- `DELETE /api/v1/admin/notices?id=…`
- `GET /api/v1/admin/calendar` → `CalendarEvent[]`
- `POST /api/v1/admin/calendar` → JSON body
- `DELETE /api/v1/admin/calendar?id=…`
- `GET /api/v1/admin/papers` → `QuestionPaper[]`
- `POST /api/v1/admin/papers/upload` → multipart form
- `DELETE /api/v1/admin/papers?id=…`
- `GET /api/v1/admin/syllabus` → `Syllabus[]`
- `POST /api/v1/admin/syllabus/upload` → multipart form
- `DELETE /api/v1/admin/syllabus?id=…`
- `GET /api/v1/papers/:id/download` (public, for download-test link)
- `GET /api/v1/syllabus/:id/download` (public, for download-test link)

All admin endpoints must validate the `Authorization: Bearer <ADMIN_API_KEY>` header. CORS helpers already exist at `src/lib/auth/admin-cors.ts`.

### Lint result
`bun run lint` ran clean — **no errors, no warnings**. All seven new files pass ESLint + TypeScript rules.

---

## Task ID: ui-enhancements
**Agent:** ui-enhancements (UI/UX builder)
**Date:** 2025

### Scope
Implemented 6 UI/UX enhancements: profile dropdown (#20), scroll-to-top (#15), ⌘K hint (#16), 404 page (#4), mobile full-screen search (#9), and Arc-style page transitions (#6).

### Files Modified
1. `src/components/layout/app-shell.tsx` — Added profile dropdown, ⌘K kbd hint, ScrollToTop mount, logout wiring.
2. `src/features/search/search-overlay.tsx` — Full-screen mobile positioning + flexible results height.
3. `src/app/page.tsx` — Slide-from-right page transition.

### Files Created
1. `src/components/ui-custom/scroll-to-top.tsx` — Floating glass scroll-to-top button (Framer Motion opacity+scale, `bottom-20 lg:bottom-6 right-4`, `navbar-glass` background, `ArrowUp` icon, appears past 500px scroll).
2. `src/app/not-found/page.tsx` — Notebook-themed 404 with `SketchNotebook`, `HandwrittenText`, `font-serif-display`, warm paper background.

### Implementation Notes
- **Profile dropdown**: `useRef` + `useEffect` pointerdown/Escape listeners for click-outside. Shows name + registerNumber, "Settings" (navigates to settings tab), "Logout" (calls `getStudentService().logout()` → `useAuthStore.getState().clear()` → success toast → navigate to dashboard).
- **Search overlay mobile**: outer `top-0 sm:top-[8vh] w-full max-w-none sm:max-w-2xl px-0 sm:px-4`; inner `rounded-none sm:rounded-3xl flex flex-col min-h-screen sm:min-h-0`; results `flex-1 overflow-y-auto sm:max-h-[60vh]`.
- **Page transitions**: `{ opacity:0, x:20 }` → `{ opacity:1, x:0 }` → `{ opacity:0, x:-20 }` with `duration: 0.25, ease: "easeOut"`. Kept `mounted && !prefersReduced` SSR guard.

### Lint result
`bun run lint` ran clean — **exit code 0, no errors, no warnings**. All 5 touched/created files pass ESLint + TypeScript rules.

### Dev Server
`dev.log` shows continuous `GET / 200` responses (12–58ms render) with no compile errors after edits. The `/not-found` route compiles cleanly.

---

## Task ID: ui-overhaul-1
**Agent:** ui-overhaul-1 (UI/UX builder)
**Date:** 2025

### Scope
Major UI/UX overhaul of KTU One's "premium notebook/sketchbook" aesthetic. Six changes: (1) unified GlassCard variants down to 3 core types, (2) mobile bottom-nav pill animation matching desktop, (3) settings page redesigned to notebook aesthetic, (4) not-logged-in dashboard empty states, (5) loading skeletons across the dashboard, (6) tightened spacing rhythm.

### Files Modified
1. `src/components/ui-custom/glass-card.tsx` — variant union reduced to `CoreVariant = "default" | "kraft" | "lined"`. Old names (`strong`, `tinted`, `warm`, `paper`, `sketch`, `sketch-pencil`, `notebook`, `index`, `magazine`) still accepted by the type alias and routed through `resolveVariant()` to nearest surviving sibling. Public API unchanged for callers.
2. `src/components/layout/app-shell.tsx` — bottom-nav now uses `motion.span` with `layoutId="bottom-nav-pill"` for `absolute inset-0 rounded-full bg-primary/10 -z-10` background that slides between tabs. Old `bottom-nav-dot` removed. Tab min-width 58px→64px, padding `px-3`→`px-4`, `rounded-xl`→`rounded-full`, `btn-tactile` added.
3. `src/features/settings/settings.tsx` — full redesign:
   - All `GlassCard` calls use `variant="default"` (paper-card) or `variant="kraft"` (support card).
   - `SettingsGroup` opens with SectionHeader-style header (vertical margin-line gradient bar + serif title + handwritten accent word — "make it yours", "tune it!", "the details", "say hi!", "the fine print").
   - `ToggleSwitch` (sliding knob) replaced with new `PillToggle` segmented control — pill-shaped `bg-secondary/60` track with `bg-background shadow-soft` active pill sliding via Framer Motion `layoutId`.
   - "Support KTU One" card uses `variant="kraft"`.
   - Footer SketchNotebook enlarged (48→56px), plus handwritten "made with 💜 for KTU students".
   - All GlassCard padding normalized to `p-5 sm:p-6`.
4. `src/features/dashboard/dashboard.tsx` — many changes:
   - Added `Skeleton` import + `LogIn` icon; added `setLoginOpen` from nav store + moved `isAuthenticated` next to `profile`.
   - All four TanStack Query hooks now destructure `isLoading` (`statsLoading`, `noticesLoading`, `upcomingLoading`, `papersLoading`).
   - **Empty states (when `!profile`):** Recent activity → SketchNotebook (plum) + "Log in to see your calculation history…" + Sign-in button. Upcoming → SketchNotebook (plum) + "Log in to see your exam schedule…" + Sign-in button. Continue reading → SketchNotebook (amber) + "Browse papers to get started" + Browse papers button → `set("papers")`.
   - **Loading skeletons:** Stats grid (4× `h-32`), latest notices (3× `h-36`), upcoming event (1× `h-24`), recent papers (3× `h-14`).
   - **Spacing rhythm:** Hero `p-5 sm:p-12` → `p-5 sm:p-10`. Quick actions `p-4 pt-5` → `p-4`. Attendance `p-5 pt-7` → `p-5`. Notice grid cards `p-4` → `p-5 sm:p-6`. Top-level `space-y-6` confirmed.
5. `src/features/calendar/calendar.tsx` — verified existing timetable-tab skeleton (`ExamTimetableView` already returns 3× `Skeleton h-20 rounded-2xl` when `loading`). No edits required.
6. `src/features/notices/notices.tsx` — verified no skeleton needed: data is synchronous `MOCK_NOTICES` with `useMemo` filtering.

### Implementation Notes
- **GlassCard unification strategy:** kept `CardVariant` type accepting both new core names and legacy names, then route through `resolveVariant()`. Type-safe (TS narrows `variant in variantClass` to a core variant) and visually unified.
- **Pill animation cohesion:** three pill layouts share the same spring (`stiffness: 380, damping: 30`) — desktop nav (`nav-pill`), mobile bottom nav (`bottom-nav-pill`), and Settings `PillToggle` (`pill-${values.join("-")}`).
- **Empty states:** all use SketchNotebook illustrations (plum for primary sign-in actions, amber for browse-papers). All "Sign in" buttons wire to `setLoginOpen(true)`.

### Lint result
`bun run lint` — **exit code 0, no errors, no warnings**. All four touched files pass ESLint + TypeScript rules.

### Dev Server
`dev.log` shows clean `✓ Compiled in XXXms` lines after every edit. Pre-existing `Invalid Server Actions request` 500s are an unrelated gateway/Caddy issue (also noted in `ui-enhancements` worklog) and not caused by these changes.

---

## Task ID: ui-overhaul-2
**Agent:** ui-overhaul-2 (UI/UX builder)
**Date:** 2025

### Scope
Five-part UI/UX refinement building on `ui-overhaul-1`: (1) Calculator mobile layout overhaul for SGPA + CGPA with AnimatePresence row animations, (2) further ~20% color saturation reduction in `globals.css`, (3) calmer hero — verified FloatingParticles / SketchPaperPlane / SketchStar were already absent, (4) entrance animations for all six dashboard sections in a staggered cascade, (5) new typography utility classes for a consistent type system.

### Files Modified
1. `src/features/calculators/calculators.tsx` — SGPA + CGPA mobile grid overhaul and AnimatePresence row animations.
2. `src/app/globals.css` — saturation pass on 6 chroma variables (light + dark) + 3 new typography utilities.
3. `src/features/dashboard/dashboard.tsx` — six section-level motion wrappers + one stale inline chroma literal refresh.

### Implementation Notes

**1. Calculator mobile layout (calculators.tsx):**
- SGPA course row: `grid grid-cols-12` → `grid grid-cols-1 sm:grid-cols-12`. Subject → `col-span-1 sm:col-span-5`, Credits → `col-span-1 sm:col-span-3 sm:col-start-6`, Grade → `col-span-1 sm:col-span-3`, Remove → `col-span-1 sm:col-span-1`. Each cell got `mt-2 sm:mt-0` for mobile breathing room.
- CGPA semester row: same pattern — every cell switched to `col-span-1 sm:col-span-N` with `mt-2 sm:mt-0`. `S{i+1}` badge cell → `col-span-1 sm:col-span-2`.
- Both maps wrapped in `<AnimatePresence initial={false}>`; each row is now a `motion.div` with `layout`, `{ opacity: 0, height: 0 }` → `{ opacity: 1, height: "auto" }`, exit `{ opacity: 0, height: 0 }`, `transition={{ duration: 0.25, ease: "easeOut" }}`. Added `overflow-hidden` to clip during height animation. Added `useReducedMotion()` hook to both components so animations are skipped when the user prefers reduced motion.
- CGPA row keys switched from bare `i` to `"sem-${i}"` so AnimatePresence can correctly track exit on middle-item removal.
- History panel was already inside the result column (`<div className="space-y-4">` next to `ResultDisplay`); no change required. Floating result bar skipped per the task's "skip if too complex" fallback — Calculate button is already in the left column below the courses list, easily reachable on mobile.

**2. Color saturation (globals.css):**
- `:root` chroma reductions: `--primary` 0.12→0.10, `--accent` 0.055→0.045, `--destructive` 0.13→0.10, `--rose` 0.09→0.07, `--coral` 0.10→0.08, `--lavender` 0.055→0.045.
- `.dark` proportional reductions (×0.8 of existing dark chroma): `--primary` 0.11→0.09, `--accent` 0.05→0.04, `--destructive` 0.13→0.10, `--rose` 0.09→0.07, `--coral` 0.10→0.08, `--lavender` 0.06→0.05.
- Updated inline comments to reflect the chroma history. Left amber/mint/olive/peach unchanged per instructions.

**3. Calmer hero (dashboard.tsx):**
- Verification only — `FloatingParticles`, `SketchPaperPlane`, and `SketchStar` were never imported into `dashboard.tsx`. The hero already keeps the SketchBooks + SketchCoffeeCup + SketchPencil cluster (top-right), the SketchNotebook + SketchPencil cluster (right side), the SketchArrow accent, and the handwritten greeting + embossed serif title. No edits required.

**4. Entrance animations (dashboard.tsx):**
- Wrapped six top-level blocks in `motion.div` / `motion.section` with `{ opacity: 0, y: 12 }` → `{ opacity: 1, y: 0 }`, duration 0.4, staggered delays 0.10 / 0.15 / 0.20 / 0.25 / 0.30 / 0.35 for: Quick stats, Quick actions, Recent activity + Attendance, Latest notices, Upcoming + Continue reading, Support banner.
- Used `motion.section` (not `motion.div`) for the two `<section>` blocks (Quick actions, Latest notices) to preserve semantic HTML.
- For the two-column grids, moved the `grid lg:grid-cols-N gap-4` class onto the motion element itself (no extra wrapper div).
- All six respect `prefersReduced` via `initial={prefersReduced ? false : ...}`.
- Also refreshed one stale inline chroma literal in the Quick actions calculator-tab color map (`oklch(0.50 0.12 340)` → `oklch(0.50 0.10 340)`) so the tab strip matches the newly-desaturated `--primary`.

**5. Typography utilities (globals.css):**
- Added `.text-display` (Lora serif, weight 700, letter-spacing -0.02em, line-height 1.05), `.text-heading` (Lora serif, weight 600, letter-spacing -0.015em), `.text-body-italic` (Geist sans, italic, muted-foreground color) at the end of `@layer utilities`.
- Added explicit font fallbacks (`Georgia, "Times New Roman", serif` / `system-ui, sans-serif`) for resilience during SSR/first paint before the Next.js font loader injects the CSS variables.
- These utilities are intentionally NOT applied yet — they form a new system that downstream work can opt into. Existing `font-serif-display`, `.italic`, and `text-muted-foreground` usages remain untouched.

### Lint result
`bun run lint` — **exit code 0, no errors, no warnings**. All three touched files pass ESLint + TypeScript rules.

### Dev Server
`dev.log` shows continuous `✓ Compiled in XXXms` lines after every edit; the latest compile was clean. No runtime errors surfaced.


