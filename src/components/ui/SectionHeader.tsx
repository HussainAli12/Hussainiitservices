"use client";

import { m, useReducedMotion } from "framer-motion";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canAnimate } from "@/lib/motion-budget";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  headingId?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

export function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
  className,
  headingId,
}: SectionHeaderProps) {
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const skipAnimation = Boolean(reduceMotion) || !canAnimate(budget);

  return (
    <div
      className={cn(
        "mb-16",
        align === "center" && "text-center mx-auto max-w-3xl",
        className,
      )}
    >
      {badge && (
        <m.span
          initial={skipAnimation ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.65, ease }}
          className="mb-4 inline-flex items-center gap-2 section-badge"
        >
          {badge}
        </m.span>
      )}

      <m.h2
        id={headingId}
        initial={skipAnimation ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.75, delay: skipAnimation ? 0 : 0.08, ease }}
        className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
      >
        {title}
      </m.h2>

      {subtitle && (
        <m.p
          initial={skipAnimation ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, delay: skipAnimation ? 0 : 0.14, ease }}
          className="mt-3 text-base leading-relaxed text-muted sm:mt-4 sm:text-lg md:text-xl"
        >
          {subtitle}
        </m.p>
      )}
    </div>
  );
}
