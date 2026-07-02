"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  illustration?: React.ReactNode;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  compact?: boolean;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      title,
      description,
      illustration,
      primaryAction,
      secondaryAction,
      compact = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          compact ? "py-8 px-4" : "py-16 px-6",
          className,
        )}
        {...props}
      >
        {illustration && (
          <div className={cn(compact ? "mb-3" : "mb-6")}>{illustration}</div>
        )}
        <h3 className={cn("font-semibold tracking-tight", compact ? "text-base" : "text-xl")}>
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">{description}</p>
        )}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center gap-3 mt-6">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition shadow-soft"
              >
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);
EmptyState.displayName = "EmptyState";
