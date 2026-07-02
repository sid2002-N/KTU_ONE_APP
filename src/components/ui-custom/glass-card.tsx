"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * GlassCard — primary surface across KTU One (v3.1).
 *
 * The DEFAULT variant is `paper-card`: a warm cream paper background with
 * a hand-drawn double-stroke border (offset shadow) and subtle paper grain.
 * This is the notebook/sketchbook aesthetic — not a SaaS card.
 *
 * THREE CORE VARIANTS (v3.1 — consolidated):
 *   - default:  warm paper card with drawn border (USE THIS FOR MOST CARDS)
 *   - kraft:    brown kraft paper (for warm/editorial blocks)
 *   - lined:    notebook ruled paper with red margin line
 *
 * Legacy variant names are accepted for backwards compatibility and silently
 * remap to the nearest remaining type, so existing call sites keep working:
 *   - strong, tinted, paper, sketch, sketch-pencil, index, magazine → default
 *   - warm                                                          → kraft
 *   - notebook                                                      → lined
 */
type CoreVariant = "default" | "kraft" | "lined";

// Accept the legacy names too — they all funnel into one of the three core
// variants via `resolveVariant`. This keeps the public API stable while we
// tighten the visual language to just three card surfaces.
type LegacyVariant =
  | "strong"
  | "tinted"
  | "warm"
  | "paper"
  | "sketch"
  | "sketch-pencil"
  | "notebook"
  | "index"
  | "magazine";

type CardVariant = CoreVariant | LegacyVariant;

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  float?: boolean;
  as?: "div" | "section" | "article" | "aside";
}

const variantClass: Record<CoreVariant, string> = {
  default: "paper-card",
  kraft: "kraft-card",
  lined: "lined-page",
};

// Map every legacy variant name to its nearest surviving sibling.
const legacyToCore: Record<LegacyVariant, CoreVariant> = {
  strong: "default",
  tinted: "default",
  warm: "kraft",
  paper: "default",
  sketch: "default",
  "sketch-pencil": "default",
  notebook: "lined",
  index: "default",
  magazine: "default",
};

function resolveVariant(variant: CardVariant): CoreVariant {
  if (variant in variantClass) return variant as CoreVariant;
  return legacyToCore[variant as LegacyVariant];
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, float = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantClass[resolveVariant(variant)],
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
