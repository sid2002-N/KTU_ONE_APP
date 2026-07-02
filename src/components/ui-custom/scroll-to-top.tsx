"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTop — a floating circular button that fades in after the user
 * scrolls past 500px. Smooth-scrolls to the top on click.
 *
 * Positioned above the mobile bottom nav (`bottom-20`) and hugged into
 * the corner on desktop (`lg:bottom-6`).
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    // Sync on mount in case the page loaded already scrolled.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          onClick={handleClick}
          className="fixed bottom-20 lg:bottom-6 right-4 z-40 size-11 rounded-full navbar-glass border border-border/40 shadow-floating flex items-center justify-center"
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <ArrowUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
