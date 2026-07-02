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
