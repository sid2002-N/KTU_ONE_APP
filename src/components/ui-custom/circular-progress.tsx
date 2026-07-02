"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0..100
  size?: number;
  strokeWidth?: number;
  color?: string; // CSS color (defaults to primary)
  trackColor?: string;
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  color = "var(--primary)",
  trackColor = "var(--muted)",
  label,
  sublabel,
  className,
  children,
}: CircularProgressProps) {
  const prefersReduced = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: prefersReduced ? offset : offset }}
          transition={prefersReduced ? { duration: 0 } : { duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children ?? (
          <>
            {label && (
              <span className="text-2xl font-bold tracking-tight">{label}</span>
            )}
            {sublabel && (
              <span className="text-xs text-muted-foreground">{sublabel}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
