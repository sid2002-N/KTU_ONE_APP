"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: "plum" | "warm" | "tri" | "lavender";
  hover?: boolean;
  float?: boolean;
}

/**
 * GradientCard — premium gradient surface for hero, support banner, results.
 * v3: paper-textured overlay, embossed title feel, hand-drawn corner accents.
 * Always paired with white text. Now feels like an illustrated notebook cover.
 */
export const GradientCard = forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient = "plum", hover = false, float = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl text-white shadow-floating relative overflow-hidden border-2 border-white/15",
          gradient === "plum" && "bg-gradient-plum",
          gradient === "warm" && "bg-gradient-warm",
          gradient === "tri" && "bg-gradient-tri",
          gradient === "lavender" && "bg-gradient-lavender",
          hover && "transition-all duration-300 hover:shadow-floating hover:-translate-y-0.5",
          float && "float-subtle",
          className,
        )}
        {...props}
      >
        {/* Paper grain texture — makes the gradient feel like illustrated paper */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>\")",
          }}
          aria-hidden="true"
        />
        {/* Soft warm underglow — lower left */}
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-white/8 blur-3xl pointer-events-none" aria-hidden="true" />
        {/* Hairline top highlight — gives "embossed cover" feel */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" aria-hidden="true" />
        {/* Sketchy hand-drawn inner border — like ink illustration */}
        <div
          className="absolute inset-3 rounded-xl pointer-events-none opacity-25"
          style={{
            border: "1.5px solid white",
            borderStyle: "solid",
            maskImage: "linear-gradient(180deg, white, transparent 80%)",
            WebkitMaskImage: "linear-gradient(180deg, white, transparent 80%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);
GradientCard.displayName = "GradientCard";
