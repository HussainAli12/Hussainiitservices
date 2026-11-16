"use client";

import { useHydrated } from "@/lib/use-hydrated";

import { m, useReducedMotion } from "framer-motion";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canAnimate } from "@/lib/motion-budget";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";

interface PageHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  /** Visible breadcrumb trail above the badge (pair with breadcrumbJsonLd) */
  breadcrumbs?: BreadcrumbItem[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export function PageHeader({ badge, title, subtitle, breadcrumbs }: PageHeaderProps) {
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const hydrated = useHydrated();
  // SSR must expose the H1 string without opacity:0 for crawlers.
  const skipAnimation = !hydrated || Boolean(reduceMotion) || !canAnimate(budget);

  return (
    <header
      className="page-top relative overflow-hidden border-b border-border bg-surface pb-10 sm:pb-14 md:pb-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(29,78,216,0.08), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 1 && (
          <Breadcrumbs items={breadcrumbs} align="center" className="mb-5" />
        )}
        {badge && (
          <m.span
            initial={skipAnimation ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="section-badge mb-3 sm:mb-4"
          >
            {badge}
          </m.span>
        )}
        <m.h1
          initial={skipAnimation ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: skipAnimation ? 0 : 0.08, ease }}
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
        >
          {title}
        </m.h1>
        {subtitle && (
          <m.p
            initial={skipAnimation ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: skipAnimation ? 0 : 0.16, ease }}
            className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted sm:mt-4 sm:text-lg"
          >
            {subtitle}
          </m.p>
        )}
      </div>
    </header>
  );
}
