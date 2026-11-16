"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canAnimate } from "@/lib/motion-budget";

export interface CaseStudySection {
  title: "Challenge" | "Solution" | "Results";
  body: string;
}

interface PortfolioCaseStudyProps {
  sections: CaseStudySection[];
}

const ease = [0.16, 1, 0.3, 1] as const;

function caseStudyMeta(title: CaseStudySection["title"]): {
  number: string;
  eyebrow: string;
} {
  switch (title) {
    case "Challenge":
      return { number: "01", eyebrow: "The brief" };
    case "Solution":
      return { number: "02", eyebrow: "What we built" };
    case "Results":
      return { number: "03", eyebrow: "What changed" };
    default: {
      const _exhaustive: never = title;
      return _exhaustive;
    }
  }
}

function TimelineMarker({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-white font-display text-sm font-bold text-navy shadow-[0_8px_20px_rgba(15,39,68,0.06)]">
      {children}
    </div>
  );
}

export function PortfolioCaseStudy({ sections }: PortfolioCaseStudyProps) {
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const animate = canAnimate(budget) && !reduceMotion;

  if (sections.length === 0) return null;

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Case study</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How the work unfolded
          </h2>
        </RevealOnScroll>

        <ol className="relative mt-12">
          <m.div
            aria-hidden
            initial={animate ? { scaleY: 0 } : false}
            whileInView={animate ? { scaleY: 1 } : undefined}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.1, ease }}
            className="absolute top-6 bottom-6 left-6 hidden w-px origin-top bg-gradient-to-b from-accent/40 via-border-strong to-transparent sm:block"
          />

          {sections.map((section, index) => {
            const meta = caseStudyMeta(section.title);
            const isLast = index === sections.length - 1;

            return (
              <m.li
                key={section.title}
                initial={animate ? { y: 22 } : false}
                whileInView={animate ? { y: 0 } : undefined}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.65, delay: index * 0.08, ease }}
                className={isLast ? "relative sm:pb-0" : "relative pb-12 sm:pb-16"}
              >
                <div className="grid gap-5 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-8">
                  <m.div
                    initial={animate ? { scale: 0.86 } : false}
                    whileInView={animate ? { scale: 1 } : undefined}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease }}
                  >
                    <TimelineMarker>{meta.number}</TimelineMarker>
                  </m.div>
                  <m.div
                    whileHover={animate ? { y: -3 } : undefined}
                    transition={{ duration: 0.35, ease }}
                    className="min-w-0 rounded-3xl border border-border bg-surface/70 px-5 py-6 sm:px-8 sm:py-8"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                      {meta.eyebrow}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy">
                      {section.title}
                    </h3>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{section.body}</p>
                  </m.div>
                </div>
              </m.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
