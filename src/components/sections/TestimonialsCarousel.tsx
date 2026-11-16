"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";
import type { DbTestimonial } from "@/lib/types/database";

interface TestimonialsCarouselProps {
  items: DbTestimonial[];
}

const SWIPE_THRESHOLD = 72;
const AUTOPLAY_MS = 7000;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 72 : -72,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -72 : 72,
    opacity: 0,
  }),
};

export function TestimonialsCarousel({ items }: TestimonialsCarouselProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number, slideDirection: number) => {
      setDirection(slideDirection);
      setActive(index);
    },
    [],
  );

  const next = useCallback(() => {
    goTo((active + 1) % items.length, 1);
  }, [active, goTo, items.length]);

  const prev = useCallback(() => {
    goTo((active - 1 + items.length) % items.length, -1);
  }, [active, goTo, items.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev]);

  useEffect(() => {
    if (reduceMotion || isPaused || items.length <= 1) return;
    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [reduceMotion, isPaused, items.length, next, active]);

  if (!items.length) {
    return (
      <p className="py-20 text-center text-muted">No testimonials yet. Check back soon.</p>
    );
  }

  const current = items[active];
  const progress = ((active + 1) / items.length) * 100;

  return (
    <RevealOnScroll>
      <div
        ref={containerRef}
        className="relative mx-auto max-w-4xl"
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <div className="relative px-11 sm:px-14 lg:px-16">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-0 top-[44%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition-all hover:border-accent/30 hover:text-accent hover:shadow-md sm:h-11 sm:w-11"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-0 top-[44%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition-all hover:border-accent/30 hover:text-accent hover:shadow-md sm:h-11 sm:w-11"
          >
            <ChevronRight size={20} />
          </button>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <m.div
                key={current.id}
                custom={direction}
                variants={reduceMotion ? undefined : slideVariants}
                initial={reduceMotion ? { opacity: 0 } : "enter"}
                animate={reduceMotion ? { opacity: 1 } : "center"}
                exit={reduceMotion ? { opacity: 0 } : "exit"}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                drag={reduceMotion ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_THRESHOLD) next();
                  else if (info.offset.x > SWIPE_THRESHOLD) prev();
                }}
                className="cursor-grab touch-pan-y active:cursor-grabbing"
              >
                <TestimonialCard testimonial={current} />
              </m.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 space-y-5 sm:mt-10">
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs font-semibold tabular-nums text-muted">
              {String(active + 1).padStart(2, "0")}
            </span>
            <div className="relative h-1 w-full max-w-xs overflow-hidden rounded-full bg-border sm:max-w-sm">
              <m.div
                className="absolute inset-y-0 left-0 rounded-full bg-accent"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="text-xs font-semibold tabular-nums text-muted">
              {String(items.length).padStart(2, "0")}
            </span>
            {!reduceMotion && items.length > 1 && (
              <button
                type="button"
                onClick={() => setIsPaused((paused) => !paused)}
                aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/30 hover:text-accent"
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(i, i > active ? 1 : i < active ? -1 : 0)}
                aria-label={`Show testimonial from ${item.company}`}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "flex min-w-[9.5rem] max-w-[11rem] shrink-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                  i === active
                    ? "border-accent/40 bg-accent/[0.06] shadow-sm"
                    : "border-border bg-white hover:border-accent/25 hover:bg-surface",
                )}
              >
                {item.logo_url ? (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white p-1">
                    <Image
                      src={item.logo_url}
                      alt={`${item.company} logo`}
                      width={28}
                      height={28}
                      className="max-h-full max-w-full object-contain"
                      unoptimized={item.logo_url.endsWith(".svg")}
                    />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-bold text-accent">
                    {item.company.charAt(0)}
                  </div>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-foreground">
                    {item.company}
                  </span>
                  <span className="block truncate text-[11px] text-[#5b6b82]">{item.name}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
