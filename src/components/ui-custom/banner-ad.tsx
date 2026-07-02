"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getAdsProvider } from "@/lib/providers/ads";
import type { AdSlot } from "@/lib/providers/ads";
import { useSupporterStore } from "@/store/supporter-store";
import { useNavStore } from "@/store/nav-store";
import { cn } from "@/lib/utils";

interface BannerAdProps {
  slot: AdSlot;
  className?: string;
}

/**
 * <BannerAd /> — the only ad component pages may render.
 * It pulls the descriptor from AdsProvider and renders the appropriate UI.
 * Pages never import ad SDKs.
 */
export function BannerAd({ slot, className }: BannerAdProps) {
  const isSupporter = useSupporterStore((s) => s.isSupporter);
  const setSupportOpen = useNavStore((s) => s.setSupportOpen);
  const prefersReduced = useReducedMotion();

  const ad = useMemo(() => getAdsProvider().getAd(slot), [slot]);
  const showAd = !isSupporter && getAdsProvider().isEnabled();

  if (!showAd) {
    // Supporters see a tiny "supporter" ribbon instead of an ad.
    return (
      <div
        className={cn(
          "glass rounded-2xl px-5 py-3 flex items-center justify-between gap-3",
          className,
        )}
      >
        <div className="flex items-center gap-2.5 text-sm">
          <Sparkles className="size-4 text-primary" />
          <span className="font-medium text-foreground">
            Ad-free experience
          </span>
          <span className="text-muted-foreground text-xs">
            — Thanks for being a Supporter 💜
          </span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
          Lifetime
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "glass rounded-2xl overflow-hidden relative",
        className,
      )}
      style={{ minHeight: ad.height }}
      role="complementary"
      aria-label="Sponsored content"
    >
      <div className="absolute top-2 right-3 text-[10px] uppercase tracking-widest text-muted-foreground/70 font-medium">
        Ad
      </div>
      <div className="h-full flex flex-col items-center justify-center text-center px-6 py-4">
        <div className="text-xs text-muted-foreground mb-1">{ad.label}</div>
        <div className="text-sm font-medium text-foreground">
          Your banner could be here
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Respectful, non-intrusive advertising · Free users only
        </div>
        <button
          onClick={() => setSupportOpen(true)}
          className="mt-2 text-xs text-primary hover:underline font-medium"
        >
          Go ad-free for ₹99 →
        </button>
      </div>
    </motion.div>
  );
}
