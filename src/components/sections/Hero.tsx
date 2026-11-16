"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { m, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { heroFeatures } from "@/lib/constants";
import { AnimatedText, AnimatedLine } from "@/components/ui/AnimatedText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CountUp } from "@/components/ui/CountUp";
import { Logo } from "@/components/ui/Logo";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canUseHeavyEffects } from "@/lib/motion-budget";
import { useFirstInteraction } from "@/lib/use-first-interaction";
import { cn } from "@/lib/utils";

const Threads = dynamic(
  () => import("@/components/ui/Threads").then((mod) => mod.Threads),
  { ssr: false },
);

/** Brand accent (#1D4ED8) as normalized RGB for the Threads shader */
const THREADS_ACCENT: [number, number, number] = [29 / 255, 78 / 255, 216 / 255];

const ease = [0.16, 1, 0.3, 1] as const;

export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
}

interface HeroProps {
  stats: HeroStat[];
}

function HeroFeatureCard({
  feature,
  index,
  compact = false,
  enableHover = true,
}: {
  feature: (typeof heroFeatures)[0];
  index: number;
  compact?: boolean;
  enableHover?: boolean;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.7 + index * 0.1, ease }}
      whileHover={enableHover ? { y: -4 } : undefined}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm transition-shadow duration-300 hover:border-accent/20 hover:shadow-md sm:p-5",
        compact && "rounded-xl p-3.5 sm:p-4",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/[0.05] transition-transform duration-500 group-hover:scale-125"
      />
      <div className={cn("icon-box mb-3 h-10 w-10", compact && "mb-2.5 h-9 w-9")}>
        <feature.icon size={compact ? 16 : 18} />
      </div>
      <p className={cn("mb-1 font-display text-sm font-semibold", compact && "text-[13px]")}>
        {feature.label}
      </p>
      <p className={cn("text-xs leading-relaxed text-muted", compact && "text-[11px]")}>
        {feature.desc}
      </p>
    </m.div>
  );
}

function HeroStatsBar({ stats }: { stats: HeroStat[] }) {
  return (
    <AnimatedLine delay={1.15} className="mt-10 sm:mt-12 lg:mt-14">
      <div className="overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm backdrop-blur-md">
        <div className="grid grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "px-4 py-5 text-center sm:px-6 sm:py-6 sm:text-left",
                i % 2 === 0 && "border-r border-border sm:border-r-0",
                i < 2 && "border-b border-border sm:border-b-0",
              )}
            >
              <div className="font-display text-2xl font-bold accent-text sm:text-3xl">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedLine>
  );
}

function canCreateWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero({ stats }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const heavyEffects = canUseHeavyEffects(budget);
  const [showThreads, setShowThreads] = useState(false);
  const interacted = useFirstInteraction();

  useEffect(() => {
    if (reduceMotion || !heavyEffects || !interacted) return;

    const enable = () => {
      if (!canCreateWebGL()) return;
      setShowThreads(true);
    };
    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(enable, { timeout: 1800 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(enable, 400);
    return () => window.clearTimeout(timeoutId);
  }, [reduceMotion, heavyEffects, interacted]);

  return (
    <section
      className={cn(
        "page-top relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-background pb-14 sm:pb-16 md:pb-20",
      )}
    >
      {showThreads && heavyEffects && !reduceMotion && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-45 sm:opacity-55">
            <Threads
              color={THREADS_ACCENT}
              amplitude={0.85}
              distance={0.14}
              enableMouseInteraction={false}
              className="h-full w-full"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/40"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(29,78,216,0.1),transparent_50%)]"
          />
        </>
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <div className="lg:col-span-7 xl:col-span-6">
            <AnimatedLine delay={0.15}>
              <span className="section-badge mb-6 inline-flex items-center gap-2 sm:mb-8">
                <Sparkles size={13} className="text-accent" aria-hidden />
                Premium IT Solutions
                <span className="relative flex h-2 w-2">
                  {heavyEffects ? (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40" />
                  ) : null}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
              </span>
            </AnimatedLine>

            <AnimatedText
              text="Grow Your Business with Digital Excellence"
              highlight="Excellence"
              immediate
              className="mb-5 max-w-2xl font-display text-[1.9rem] font-bold leading-[1.1] tracking-tight sm:mb-6 sm:text-4xl md:text-5xl lg:text-[3.35rem] lg:leading-[1.08]"
              delay={0.35}
            />

            <AnimatedLine delay={0.55} className="max-w-xl">
              <p className="border-l-2 border-accent/30 pl-5 text-base leading-relaxed text-muted sm:text-lg md:text-xl">
                We build your digital identity, custom business software, paid ad campaigns, and AI voice agents —
                technology that drives measurable growth.
              </p>
            </AnimatedLine>

            <AnimatedLine
              delay={0.95}
              className="mt-8 flex flex-row flex-wrap items-center gap-3 sm:mt-10 sm:gap-4"
            >
              <MagneticButton href="/contact" variant="primary">
                Start Your Project
                <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton href="/portfolio" variant="secondary">
                View Our Work
              </MagneticButton>
            </AnimatedLine>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
              {heroFeatures.map((feature, i) => (
                <HeroFeatureCard key={feature.label} feature={feature} index={i} compact enableHover={heavyEffects} />
              ))}
            </div>
          </div>

          <div className="relative hidden lg:col-span-5 lg:block xl:col-span-6">
            <m.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.4, ease }}
              className="relative mx-auto w-full max-w-lg"
            >
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-3xl"
              />

              <div className="relative grid grid-cols-2 gap-4">
                {heroFeatures.map((feature, i) => (
                  <HeroFeatureCard key={feature.label} feature={feature} index={i} enableHover={heavyEffects} />
                ))}
              </div>

              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.05, ease }}
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="rounded-full border border-border/80 bg-card/95 p-5 shadow-lg shadow-accent/10 ring-4 ring-accent/[0.08] backdrop-blur-md">
                  <Logo size="lg" showText={false} />
                </div>
              </m.div>
            </m.div>
          </div>
        </div>

        <HeroStatsBar stats={stats} />
      </div>

      {heavyEffects ? (
        <m.button
          type="button"
          aria-label="Scroll down"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted sm:bottom-8 sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="relative h-9 w-5 overflow-hidden rounded-full border-2 border-border/60">
            <m.div
              className="absolute left-1/2 top-2 h-1.5 w-1 -translate-x-1/2 rounded-full bg-accent"
              animate={{ y: [0, 14, 0], opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <m.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} strokeWidth={2} />
          </m.div>
        </m.button>
      ) : null}
    </section>
  );
}
