# Task ID: ui-overhaul-2 — UI/UX builder (Part 2)

## Scope
Five-part UI/UX refinement building on `ui-overhaul-1`:
1. Calculator mobile layout overhaul (SGPA + CGPA) with AnimatePresence row animations.
2. Further color saturation reduction in `globals.css` (≈20% more desaturation pass).
3. Calmer hero — verify removal of decorative clutter (FloatingParticles / SketchPaperPlane / SketchStar were already absent).
4. Entrance animations for all six dashboard sections (staggered cascade).
5. New typography utility classes (`.text-display`, `.text-heading`, `.text-body-italic`).

## Files Modified
1. `src/features/calculators/calculators.tsx` — SGPA + CGPA mobile grid overhaul and AnimatePresence row animations.
2. `src/app/globals.css` — color saturation pass (light + dark) and new typography utilities.
3. `src/features/dashboard/dashboard.tsx` — six section-level motion wrappers + one stale chroma literal refresh.

## Implementation Notes

### 1. Calculator Mobile Layout Overhaul (calculators.tsx)

**SGPA Calculator (course row):**
- Grid container: `grid grid-cols-12` → `grid grid-cols-1 sm:grid-cols-12`.
- Subject field: `col-span-12 sm:col-span-5` → `col-span-1 sm:col-span-5`.
- Credits field: `col-span-5 sm:col-span-3` → `col-span-1 sm:col-span-3 sm:col-start-6` (explicit desktop start keeps the 6-column offset between subject and credits predictable; on mobile it auto-places into row 2).
- Grade field: `col-span-5 sm:col-span-3` → `col-span-1 sm:col-span-3`.
- Remove button: `col-span-2 sm:col-span-1` → `col-span-1 sm:col-span-1`.
- Added `mt-2 sm:mt-0` to every field wrapper so mobile rows have breathing room (the desktop `sm:mt-0` reset prevents double spacing on top of the existing `gap-2`).

**CGPA Calculator (semester row):**
- Same pattern: `grid grid-cols-12` → `grid grid-cols-1 sm:grid-cols-12`, each cell switched to `col-span-1 sm:col-span-N` with `mt-2 sm:mt-0`.
- Used `key={"sem-${i}"}` instead of bare `i` because AnimatePresence requires stable, non-index keys to correctly track enter/exit. (The original code keyed by index `i`, which breaks the exit animation when a middle item is removed — switching to a string-keyed identifier prevents that.)

**AnimatePresence + motion.row:**
- Wrapped both `courses.map(...)` and `sems.map(...)` in `<AnimatePresence initial={false}>`.
- Each row is now a `motion.div` with:
  - `layout={!prefersReduced}` (so sibling rows slide smoothly when one is removed)
  - `initial={prefersReduced ? false : { opacity: 0, height: 0 }}`
  - `animate={prefersReduced ? { opacity: 1 } : { opacity: 1, height: "auto" }}`
  - `exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}`
  - `transition={{ duration: 0.25, ease: "easeOut" }}`
- Added `overflow-hidden` to the row so the height: 0 → auto animation clips the contents cleanly during enter/exit.
- Added a local `const prefersReduced = useReducedMotion()` hook to both `SgpaCalculator` and `CgpaCalculator` (the parent `Calculators` component already had it but it wasn't plumbed down).

**Result card / history placement:** Already correct — `HistoryPanel` already lives inside the right-column `<div className="space-y-4">` block alongside `ResultDisplay`. No change required.

**Floating result bar on mobile:** Skipped per the task's "skip if too complex" fallback — the Calculate button is already in the left column immediately below the courses list, easily reachable on mobile.

### 2. Reduce color saturation (globals.css)

`:root` reductions (chroma only — lightness and hue untouched):
- `--primary`: `0.12` → `0.10`
- `--accent`: `0.055` → `0.045`
- `--destructive`: `0.13` → `0.10`
- `--rose`: `0.09` → `0.07`
- `--coral`: `0.10` → `0.08`
- `--lavender`: `0.055` → `0.045`

`.dark` proportional reductions (× 0.8 of the existing dark chroma):
- `--primary`: `0.11` → `0.09`
- `--accent`: `0.05` → `0.04`
- `--destructive`: `0.13` → `0.10`
- `--rose`: `0.09` → `0.07`
- `--coral`: `0.10` → `0.08`
- `--lavender`: `0.06` → `0.05`

Updated inline code comments on each line so the chroma history is visible at a glance. Left `--amber`, `--mint`, `--olive`, `--peach` unchanged as instructed (already subtle).

### 3. Calmer hero — verification only

The dashboard hero (lines 136–238 of `dashboard.tsx`) does NOT currently contain `FloatingParticles`, `SketchPaperPlane`, or `SketchStar`. A repo-wide `rg` confirms:
- `FloatingParticles` and `SketchPaperPlane` exist as exported components in `sketch-elements.tsx` but are not imported by `dashboard.tsx`.
- `SketchStar` exists and is only used by `card-decoration.tsx` (the `cornerStar` decoration) — not by the hero.

The hero currently keeps (as the task requires):
- `SketchBooks` + `SketchCoffeeCup` + `SketchPencil` cluster top-right (hidden on mobile)
- `SketchNotebook` + `SketchPencil` cluster on the right side
- `SketchArrow` near the illustration
- Handwritten greeting + embossed serif title

No edits were required for this step.

### 4. Entrance animations for dashboard sections

Wrapped six top-level blocks in `motion.div` / `motion.section` with `{ opacity: 0, y: 12 }` → `{ opacity: 1, y: 0 }`, duration 0.4, staggered delays:

| # | Section | Wrapper | Delay |
|---|---------|---------|-------|
| 1 | Quick stats (skeleton or cards) | `motion.div` | 0.10 |
| 2 | Quick actions | `motion.section` | 0.15 |
| 3 | Recent activity + Attendance (two-col) | `motion.div` (kept `grid lg:grid-cols-3 gap-4` on the motion element) | 0.20 |
| 4 | Latest notices | `motion.section` | 0.25 |
| 5 | Upcoming + Continue reading (two-col) | `motion.div` (kept `grid lg:grid-cols-2 gap-4` on the motion element) | 0.30 |
| 6 | Support banner (conditional) | `motion.div` (kept `kraft-card` classes) | 0.35 |

All six respect `prefersReduced` — `initial={prefersReduced ? false : ...}` disables the animation entirely when reduced motion is requested. The hero (`<motion.div>` at the top) was already wrapped before this task and remains unchanged.

Semantic HTML preserved: `motion.section` is used for the two `<section>` blocks (Quick actions, Latest notices) instead of adding a wrapper div, keeping the document outline intact.

Also refreshed one stale inline chroma literal in the Quick actions calculator-tab color map (`oklch(0.50 0.12 340)` → `oklch(0.50 0.10 340)`) so the tab strip matches the newly-desaturated `--primary`.

### 5. Typography hierarchy utilities (globals.css)

Added three new utility classes at the end of the `@layer utilities` block (after `.pushpin`):

```css
.text-display {
  font-family: var(--font-lora), Georgia, "Times New Roman", serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.text-heading {
  font-family: var(--font-lora), Georgia, "Times New Roman", serif;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.text-body-italic {
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  font-style: italic;
  color: var(--muted-foreground);
}
```

Added explicit font fallbacks (Georgia, "Times New Roman", serif / system-ui, sans-serif) on top of the variable references so the utilities still render reasonably if the Next.js font loader hasn't injected the CSS variable yet during SSR / first paint.

These utilities are intentionally NOT applied yet — they're a new system that downstream work (or a future ui-overhaul-3) can opt into. Existing `font-serif-display`, `.italic`, and `text-muted-foreground` usages remain untouched.

## Lint result
`bun run lint` — **exit code 0, no errors, no warnings**. All three touched files pass ESLint + TypeScript rules.

## Dev Server
`dev.log` shows continuous `✓ Compiled in XXXms` lines after every edit; the latest compile was clean. No runtime errors surfaced.

## Notes for future agents
- The new `.text-display`, `.text-heading`, `.text-body-italic` utilities are ready but unused — applying them is a safe, no-op-for-now change for a future pass.
- The two-column wrappers in the dashboard are now `motion.div` themselves (rather than a `motion.div` wrapping a `div`); if you need to add a non-animated parent, add it outside the motion element so the `grid` class stays on the motion element.
- AnimatePresence in the calculators uses `initial={false}` so the default courses/semesters don't animate in on first mount — only added/removed rows animate. If you want first-mount animation, remove that prop.
