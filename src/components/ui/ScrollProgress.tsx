"use client";

import { m, useScroll, useSpring } from "framer-motion";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canUseHeavyEffects } from "@/lib/motion-budget";

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <m.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
      aria-hidden
    />
  );
}

/** Apple-style top reading progress bar */
export function ScrollProgress() {
  const budget = useMotionBudget();

  if (!canUseHeavyEffects(budget)) {
    return null;
  }

  return <ScrollProgressBar />;
}
