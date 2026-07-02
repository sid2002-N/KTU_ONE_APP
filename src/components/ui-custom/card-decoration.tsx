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
