"use client";

import { m, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canAnimate } from "@/lib/motion-budget";
import { DecorativeText } from "@/components/ui/DecorativeText";

interface PortfolioDeliverablesProps {
  items: string[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export function PortfolioDeliverables({ items }: PortfolioDeliverablesProps) {
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const animate = canAnimate(budget) && !reduceMotion;

  if (items.length === 0) return null;

  return (
    <section className="border-y border-border bg-navy py-14 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Scope shipped
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Key deliverables
              </h2>
            </div>
            <p className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70">
              {String(items.length).padStart(2, "0")} items
            </p>
          </div>
        </RevealOnScroll>

        <ol className="mt-10 grid gap-x-10 sm:grid-cols-2">
          {items.map((item, index) => (
            <m.li
              key={`${item}-${index}`}
              initial={animate ? { y: 14 } : false}
              whileInView={animate ? { y: 0 } : undefined}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.28), ease }}
              whileHover={animate ? { x: 4 } : undefined}
              className="flex items-start gap-3 border-b border-white/10 py-4"
            >
              <m.span
                initial={animate ? { scale: 0.7 } : false}
                whileInView={animate ? { scale: 1 } : undefined}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.28), ease }}
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white"
              >
                <Check size={13} strokeWidth={2.6} aria-hidden />
              </m.span>
              <span className="min-w-0 pt-0.5">
                <DecorativeText
                  text={String(index + 1).padStart(2, "0")}
                  className="mr-2 font-display text-[11px] font-semibold tracking-[0.16em] text-white/35"
                />
                <span className="text-sm leading-6 text-white/85 sm:text-[15px]">{item}</span>
              </span>
            </m.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
