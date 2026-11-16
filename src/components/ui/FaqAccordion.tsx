"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, m, useInView, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canAnimate } from "@/lib/motion-budget";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
  allowMultiple?: boolean;
  defaultOpenIndex?: number | null;
}

const ease = [0.16, 1, 0.3, 1] as const;

function FaqAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
  reduceMotion,
  skipExpandAnimation,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reduceMotion: boolean | null;
  skipExpandAnimation: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8% 0px" });
  const contentId = useId();
  const buttonId = useId();

  return (
    <m.div
      ref={ref}
      initial={reduceMotion || skipExpandAnimation ? false : { opacity: 0, y: 28, scale: 0.97 }}
      animate={
        isInView || reduceMotion || skipExpandAnimation
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 28, scale: 0.97 }
      }
      transition={{ duration: 0.55, delay: Math.min(index * 0.07, 0.35), ease }}
      className={cn(
        "premium-card group relative overflow-hidden rounded-xl transition-[border-color,box-shadow,background-color] duration-300",
        isOpen && "border-accent/25 bg-white shadow-[0_12px_40px_rgba(29,78,216,0.08)]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300",
          isOpen && "scale-x-100",
        )}
      />

      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-start justify-between gap-4 p-4 text-left sm:items-center sm:p-5"
      >
        <span className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
          <span
            aria-hidden
            className={cn(
              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[11px] font-bold tabular-nums transition-colors duration-300 sm:mt-0",
              isOpen
                ? "border-accent/20 bg-accent/10 text-accent"
                : "border-border bg-surface text-muted",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold text-foreground sm:text-base">{item.question}</span>
        </span>

        <m.span
          aria-hidden
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease }}
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 sm:mt-0",
            isOpen ? "border-accent/25 bg-accent/10 text-accent" : "border-border bg-surface text-muted",
          )}
        >
          {isOpen ? <Minus size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
        </m.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          skipExpandAnimation ? (
            <div
              id={contentId}
              role="region"
              aria-labelledby={buttonId}
              className="px-4 pb-4 text-sm leading-relaxed text-muted sm:px-5 sm:pb-5 sm:pl-[4.25rem]"
            >
              {item.answer}
            </div>
          ) : (
          <m.div
            id={contentId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.38, ease }}
            className="overflow-hidden"
          >
            <m.p
              initial={reduceMotion ? false : { y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { y: -4, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.32, delay: reduceMotion ? 0 : 0.06, ease }}
              className="px-4 pb-4 text-sm leading-relaxed text-muted sm:px-5 sm:pb-5 sm:pl-[4.25rem]"
            >
              {item.answer}
            </m.p>
          </m.div>
          )
        ) : null}
      </AnimatePresence>
      {/* Keep closed answers in the DOM (hidden) so crawlers see the text that FAQPage schema describes */}
      {!isOpen && (
        <div hidden className="px-4 pb-4 text-sm leading-relaxed text-muted">
          {item.answer}
        </div>
      )}
    </m.div>
  );
}

export function FaqAccordion({
  items,
  className,
  allowMultiple = false,
  defaultOpenIndex = 0,
}: FaqAccordionProps) {
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const skipExpandAnimation = Boolean(reduceMotion) || !canAnimate(budget);
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(() => {
    if (defaultOpenIndex === null) return new Set();
    return new Set([defaultOpenIndex]);
  });

  const toggle = (index: number) => {
    setOpenIndexes((previous) => {
      const next = new Set(previous);

      if (next.has(index)) {
        next.delete(index);
        return next;
      }

      if (allowMultiple) {
        next.add(index);
        return next;
      }

      return new Set([index]);
    });
  };

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {items.map((item, index) => (
        <FaqAccordionItem
          key={item.question}
          item={item}
          index={index}
          isOpen={openIndexes.has(index)}
          onToggle={() => toggle(index)}
          reduceMotion={reduceMotion}
          skipExpandAnimation={skipExpandAnimation}
        />
      ))}
    </div>
  );
}
