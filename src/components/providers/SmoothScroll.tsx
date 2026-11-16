"use client";

import { useEffect } from "react";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { isFullBudget } from "@/lib/motion-budget";
import { setLenisInstance } from "@/lib/scroll/scroll-to-top";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const budget = useMotionBudget();

  useEffect(() => {
    if (!isFullBudget(budget)) return;

    // Lenis only runs on full-budget devices, so load it on demand instead of shipping it to everyone.
    let cancelled = false;
    let rafId = 0;
    let lenis: import("lenis").default | null = null;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.45,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.2,
      });
      setLenisInstance(lenis);

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      setLenisInstance(null);
      lenis?.destroy();
    };
  }, [budget]);

  return <>{children}</>;
}
