"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canAnimate } from "@/lib/motion-budget";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
}

const directionOffset = {
  up: { y: 48, x: 0 },
  down: { y: -48, x: 0 },
  left: { x: 48, y: 0 },
  right: { x: -48, y: 0 },
  none: { x: 0, y: 0 },
};

/** Apple-inspired ease-out for cinematic reveals */
const appleEase = [0.16, 1, 0.3, 1] as const;

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.75,
  once = true,
}: RevealOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-12% 0px" });
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const skipAnimation = Boolean(reduceMotion) || !canAnimate(budget);
  const offset = directionOffset[direction];

  if (skipAnimation) {
    return <div className={className}>{children}</div>;
  }

  // Transform-only motion — never opacity:0 so SSR/crawlers always read H1s and copy.
  return (
    <m.div
      ref={ref}
      initial={{ y: offset.y, x: offset.x }}
      animate={isInView ? { x: 0, y: 0 } : { y: offset.y, x: offset.x }}
      transition={{ duration, delay, ease: appleEase }}
      className={className}
    >
      {children}
    </m.div>
  );
}
