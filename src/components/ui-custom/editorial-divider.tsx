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
