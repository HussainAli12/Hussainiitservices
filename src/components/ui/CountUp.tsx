"use client";

import { useEffect, useRef, useState } from "react";
import { m, useInView } from "framer-motion";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canUseHeavyEffects } from "@/lib/motion-budget";

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({
  end,
  suffix = "",
  duration = 2,
  className,
}: CountUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const budget = useMotionBudget();
  const animateCount = canUseHeavyEffects(budget);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || !animateCount) return;

    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, end, duration, animateCount]);

  const displayValue = animateCount ? count : end;

  return (
    <m.span
      ref={ref}
      className={className}
      initial={animateCount ? { opacity: 0, scale: 0.5 } : false}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {displayValue}
      {suffix}
    </m.span>
  );
}
