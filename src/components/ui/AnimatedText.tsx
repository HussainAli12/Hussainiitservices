"use client";

import { useHydrated } from "@/lib/use-hydrated";

import { m, useReducedMotion } from "framer-motion";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canAnimate, canUseHeavyEffects } from "@/lib/motion-budget";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  highlight?: string;
  /** Paint immediately so LCP text is not hidden behind the entrance animation. */
  immediate?: boolean;
}

export function AnimatedText({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
  highlight,
  immediate = false,
}: AnimatedTextProps) {
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const use3d = canUseHeavyEffects(budget);
  const words = text.split(" ").filter(Boolean);

  // SSR/crawlers must see readable spaced text (never opacity:0-only H1).
  const hydrated = useHydrated();
  const skipEntrance =
    immediate || !hydrated || Boolean(reduceMotion) || !canAnimate(budget);

  return (
    <Tag className={cn("overflow-hidden", className)}>
      {words.map((word, i) => {
        const isHighlight = Boolean(highlight && word.includes(highlight));
        return (
          <span key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden align-bottom">
              <m.span
                className={cn("inline-block", isHighlight && "gradient-text")}
                initial={
                  skipEntrance
                    ? false
                    : { y: "110%", opacity: 0, ...(use3d ? { rotateX: 40 } : {}) }
                }
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{
                  duration: 0.75,
                  delay: delay + i * 0.07,
                  ease,
                }}
                style={use3d ? { transformOrigin: "50% 100%" } : undefined}
              >
                {word}
              </m.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}

export function AnimatedLine({
  children,
  className,
  delay = 0,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const hydrated = useHydrated();
  const skipEntrance =
    immediate || !hydrated || Boolean(reduceMotion) || !canAnimate(budget);

  return (
    <m.div
      initial={skipEntrance ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay, ease }}
      className={className}
    >
      {children}
    </m.div>
  );
}
