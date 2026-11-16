"use client";

import { cn } from "@/lib/utils";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canAnimate } from "@/lib/motion-budget";
import type { Technology } from "@/lib/constants";

interface MarqueeProps {
  items: Technology[];
  speed?: number;
  className?: string;
}

export function Marquee({ items, speed = 30, className }: MarqueeProps) {
  const budget = useMotionBudget();
  const animateMarquee = canAnimate(budget);

  return (
    <div className={cn("relative overflow-hidden", className)} aria-label="Technologies we use">
      <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-surface to-transparent sm:w-24" aria-hidden="true" />
      <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-surface to-transparent sm:w-24" aria-hidden="true" />

      <div
        className={cn("flex w-max gap-4 sm:gap-5", animateMarquee && "animate-marquee")}
        style={animateMarquee ? { animationDuration: `${speed}s` } : undefined}
        aria-hidden="true"
      >
        {[...items, ...(animateMarquee ? items : [])].map((item, i) => (
          <span
            key={`${item.name}-${i}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(15,39,68,0.04)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- small local SVG logos with fixed size */}
            <img
              src={item.logo}
              alt={`${item.name} logo`}
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
              className="h-8 w-8 shrink-0 object-contain"
            />
            <span className="whitespace-nowrap text-sm font-semibold text-foreground sm:text-base">
              {item.name}
            </span>
          </span>
        ))}
      </div>

      <p className="sr-only">{items.map((item) => item.name).join(", ")}</p>
    </div>
  );
}
