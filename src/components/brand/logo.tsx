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
