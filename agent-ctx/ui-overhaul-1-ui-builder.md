# Task ID: ui-overhaul-1 — Work Record

**Agent:** ui-overhaul-1 (UI/UX builder)
**Date:** 2025

## Scope
Major UI/UX overhaul of KTU One's "premium notebook/sketchbook" aesthetic. Six changes:
1. Unified GlassCard variants down to 3 core types (default / kraft / lined) with legacy names remapped.
2. Mobile bottom-nav pill animation now matches desktop (shared-element `layoutId` pill).
3. Settings page redesigned to match the notebook aesthetic (paper cards, SectionHeader pattern, pill toggles, kraft support card, SketchNotebook footer).
4. Not-logged-in dashboard now has friendly empty states for Recent activity / Upcoming / Continue reading.
5. Loading skeletons added across the dashboard (stats grid, recent notices, upcoming event, recent papers). Verified notices + calendar skeletons.
6. Spacing rhythm tightened — hero `p-5 sm:p-10`, quick actions `p-4`, section cards `p-5`, all other GlassCards `p-5 sm:p-6`.

## Files Modified
1. `src/components/ui-custom/glass-card.tsx` — variant union reduced to `CoreVariant = "default" | "kraft" | "lined"`. Old names (`strong`, `tinted`, `warm`, `paper`, `sketch`, `sketch-pencil`, `notebook`, `index`, `magazine`) are still accepted by the type alias and routed through `resolveVariant()` to the nearest surviving sibling. Public API is unchanged for callers; CSS classes still exist in `globals.css` for legacy call sites that bypass GlassCard.
2. `src/components/layout/app-shell.tsx` — bottom-nav now uses `motion.span` with `layoutId="bottom-nav-pill"` for an `absolute inset-0 rounded-full bg-primary/10 -z-10` background that slides between tabs (matching desktop's `nav-pill`). The old `bottom-nav-dot` was removed. Active tab text now uses `text-primary`, inactive uses `text-muted-foreground hover:text-foreground`. Tab min-width bumped 58px→64px, padding `px-3`→`px-4`, `rounded-xl`→`rounded-full`, `btn-tactile` added.
3. `src/features/settings/settings.tsx` — full redesign:
   - All `GlassCard` calls use `variant="default"` (paper-card) or `variant="kraft"` (support card).
   - `SettingsGroup` now opens with a `SectionHeader`-style header (vertical margin-line gradient bar + serif display title + handwritten accent word like "make it yours", "tune it!", "the details", "say hi!", "the fine print").
   - `ToggleSwitch` (sliding knob) replaced with new `PillToggle` segmented control — pill-shaped `bg-secondary/60` track with `bg-background shadow-soft` active pill that slides via Framer Motion `layoutId={pill-...}` (matches desktop nav pill animation for cohesion).
   - "Support KTU One" card uses `variant="kraft"` for the warm brown paper feel.
   - Supporter-status card also uses `variant="kraft"`.
   - Footer's SketchNotebook illustration enlarged (48px → 56px), SketchPencil kept, plus a handwritten "made with 💜 for KTU students" line.
   - All `GlassCard` padding normalized to `p-5 sm:p-6`.
4. `src/features/dashboard/dashboard.tsx` — many changes:
   - Added `Skeleton` import from `@/components/ui/skeleton` and `LogIn` icon.
   - Added `setLoginOpen` from `useNavStore` + `isAuthenticated` moved next to `profile`.
   - All four TanStack Query hooks now destructure `isLoading` (`statsLoading`, `noticesLoading`, `upcomingLoading`, `papersLoading`).
   - **Empty states (when `!profile`):**
     - Recent activity: SketchNotebook (plum, 64px) + "No history yet" + "Log in to see your calculation history synced across devices." + `Sign in` button → `setLoginOpen(true)`.
     - Upcoming: SketchNotebook (plum, 56px) + "Sign in to see your schedule" + "Log in to see your exam schedule and academic calendar." + `Sign in` button.
     - Continue reading: SketchNotebook (amber, 56px) + "Browse papers to get started" + "Explore previous question papers and save them for later." + `Browse papers` button → `set("papers")`.
     - Recent activity also has an authenticated empty state (no calc history yet).
     - Continue reading also has an authenticated empty state (no papers yet).
   - **Loading skeletons:**
     - Stats grid: 4× `Skeleton h-32 rounded-2xl` (wrapped in conditional `statsLoading ? … : <StatCard/>`).
     - Latest notices: 3× `Skeleton h-36 rounded-2xl` in matching `grid sm:grid-cols-2 lg:grid-cols-3 gap-3`.
     - Upcoming event: 1× `Skeleton h-24 rounded-2xl`.
     - Continue reading: 3× `Skeleton h-14 rounded-lg` (mimics list rows).
   - **Spacing rhythm:**
     - Hero `notebook-cover`: `p-5 sm:p-12` → `p-5 sm:p-10` (less padding on mobile, per spec).
     - Quick action buttons (`notebook-tab`): `p-4 pt-5` → `p-4`.
     - Recent activity (lined): kept `p-5 pl-12`.
     - Attendance (kraft): `p-5 pt-7` → `p-5`.
     - Upcoming (kraft): kept `p-5`.
     - Continue reading (lined): kept `p-5 pl-12`.
     - Latest notices grid cards (paper): `p-4` → `p-5 sm:p-6`.
     - Top-level wrapper `space-y-6` confirmed.
5. `src/features/calendar/calendar.tsx` — verified existing timetable-tab skeleton. `ExamTimetableView` already returns `Array.from({length:3}).map(<Skeleton h-20 rounded-2xl>)` when `loading` is true. No edits required.
6. `src/features/notices/notices.tsx` — verified no skeleton needed: data is synchronous `MOCK_NOTICES` with `useMemo` filtering, no loading state exists by design.

## Implementation Notes

### GlassCard unification strategy
Rather than breaking every existing call site, kept the `CardVariant` type accepting both new core names and legacy names, then route through `resolveVariant()`. This is type-safe (TypeScript narrows `variant in variantClass` to a core variant) and visually unified — every surface now resolves to one of `paper-card` / `kraft-card` / `lined-page`.

### Pill animation cohesion
Three pill layouts now share the same spring (`stiffness: 380, damping: 30`) so the whole app feels like one design system:
- Desktop nav: `layoutId="nav-pill"` (bg-primary, full background)
- Mobile bottom nav: `layoutId="bottom-nav-pill"` (bg-primary/10, soft tint)
- Settings PillToggle: `layoutId={pill-${values.join("-")}}` (bg-background shadow-soft, segmented control)

### Empty states use SketchNotebook
Every not-authenticated empty state uses a SketchNotebook illustration (varying color: plum for primary actions, amber for browse-papers). The "Sign in" buttons all wire to `setLoginOpen(true)` from `useNavStore`, which opens the login modal that already exists.

## Lint result
`bun run lint` — **exit code 0, no errors, no warnings**. All four touched files pass ESLint + TypeScript rules.

## Dev Server
`dev.log` shows clean `✓ Compiled in XXXms` lines after every edit, with no compile errors. The pre-existing `Invalid Server Actions request` 500s are an unrelated gateway/Caddy issue (also noted in the `ui-enhancements` worklog) and not caused by these changes.
