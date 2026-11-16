"use client";

import { useChrome } from "@/components/providers/ChromeProvider";

import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles, X } from "lucide-react";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canUseHeavyEffects } from "@/lib/motion-budget";
import { dismissPromoBanner } from "@/lib/promo-banner";
import { promoBannerShellClass } from "@/lib/site-header";

const ease = [0.16, 1, 0.3, 1] as const;

interface TopOfferBannerProps {
  visible: boolean;
  onDismiss?: () => void;
}

export function TopOfferBanner({ visible, onDismiss }: TopOfferBannerProps) {
  const chrome = useChrome();
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const heavyEffects = canUseHeavyEffects(budget);
  const breathe = heavyEffects && !reduceMotion;

  const handleDismiss = () => {
    dismissPromoBanner();
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          role="region"
          aria-label="Promotional offer"
          initial={reduceMotion ? false : { y: "-100%", opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            ...(breathe
              ? {
                  boxShadow: [
                    "0 4px 20px rgba(15,39,68,0.18)",
                    "0 4px 32px rgba(29,78,216,0.28)",
                    "0 4px 20px rgba(15,39,68,0.18)",
                  ],
                }
              : {}),
          }}
          exit={reduceMotion ? undefined : { y: "-100%", opacity: 0 }}
          transition={{
            y: { duration: reduceMotion ? 0 : 0.35, ease },
            opacity: { duration: reduceMotion ? 0 : 0.35, ease },
            boxShadow: breathe
              ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
              : undefined,
          }}
          className={`fixed inset-x-0 top-0 z-[55] ${promoBannerShellClass} overflow-hidden border-b border-white/10 bg-gradient-to-r from-navy via-[#163a63] to-accent text-white`}
        >
          {breathe ? (
            <>
              <m.div
                aria-hidden
                className="pointer-events-none absolute -inset-x-8 inset-y-0 bg-[radial-gradient(circle_at_18%_50%,rgba(255,255,255,0.22),transparent_52%)]"
                animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.06, 1] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <m.div
                aria-hidden
                className="pointer-events-none absolute -inset-x-8 inset-y-0 bg-[radial-gradient(circle_at_82%_50%,rgba(147,197,253,0.2),transparent_48%)]"
                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.04, 1, 1.04] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
            </>
          ) : (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 45%)",
              }}
            />
          )}

          <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-2 px-10 py-2 sm:flex-row sm:gap-3 sm:px-12 sm:py-0 lg:px-14">
            <div className="flex w-full min-w-0 items-center justify-center gap-2 sm:w-auto sm:flex-1">
              <m.span
                aria-hidden
                animate={breathe ? { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] } : undefined}
                transition={breathe ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" } : undefined}
                className="hidden shrink-0 sm:inline-flex"
              >
                <Sparkles size={14} className="text-white/90" />
              </m.span>

              <span className="hidden shrink-0 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/95 sm:inline-flex">
                {chrome.banner.newClients}
              </span>

              <p className="min-w-0 text-center text-[11px] font-medium leading-snug sm:text-left sm:text-sm">
                <span className="hidden text-white/95 sm:inline">
                  {chrome.banner.desktopLead}{" "}
                  <span className="font-semibold text-white">{chrome.banner.desktopPlaces}</span>.
                </span>
                <span className="text-white/95 sm:hidden">
                  {chrome.banner.mobile}
                </span>
              </p>
            </div>

            <m.div
              className="w-full shrink-0 sm:w-auto"
              animate={breathe ? { scale: [1, 1.04, 1] } : undefined}
              transition={breathe ? { duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 } : undefined}
            >
              <Link
                href="/free-website-audit"
                className="inline-flex w-full items-center justify-center gap-1 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/25 sm:w-auto sm:px-3 sm:py-1 sm:text-xs"
              >
                {chrome.banner.cta}
                <ArrowUpRight size={12} aria-hidden />
              </Link>
            </m.div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss promotional banner"
            className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white sm:right-3"
          >
            <X size={16} aria-hidden />
          </button>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
