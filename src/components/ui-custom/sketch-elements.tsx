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
