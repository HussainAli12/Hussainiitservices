"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canUseHeavyEffects } from "@/lib/motion-budget";
import { scrollToTopSmooth } from "@/lib/scroll/scroll-to-top";

const SCROLL_THRESHOLD = 320;

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const heavyEffects = canUseHeavyEffects(budget);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <m.button
          type="button"
          aria-label="Scroll to top"
          onClick={() => scrollToTopSmooth()}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          whileHover={heavyEffects ? { scale: 1.08 } : undefined}
          whileTap={heavyEffects ? { scale: 0.95 } : undefined}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border/80 bg-white/95 text-navy shadow-[0_8px_24px_rgba(15,39,68,0.12)] backdrop-blur-sm transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ArrowUp size={20} aria-hidden />
        </m.button>
      ) : null}
    </AnimatePresence>
  );
}
