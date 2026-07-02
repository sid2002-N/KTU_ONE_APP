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
