"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canAnimate } from "@/lib/motion-budget";
import { useHydrated } from "@/lib/use-hydrated";
import { useChrome } from "@/components/providers/ChromeProvider";
import { clientLogoAspectClass } from "@/lib/portfolio/cover";
import type { TrustedClient } from "@/lib/portfolio/clients";
import { cn } from "@/lib/utils";

interface TrustedByProps {
  clients: TrustedClient[];
  className?: string;
  /** Small caps label above the marquee */
  title?: string;
  /** Seconds for one full loop — scales with the number of logos when omitted */
  speed?: number;
}

interface LogoAnchor {
  client: TrustedClient;
  rect: DOMRect;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function TrustedBy({ clients, className, title = "Trusted by", speed }: TrustedByProps) {
  const router = useRouter();
  const budget = useMotionBudget();
  const reduceMotion = useReducedMotion();
  const [anchor, setAnchor] = useState<LogoAnchor | null>(null);
  const mounted = useHydrated();
  const hideTimer = useRef<number | null>(null);
  const activeEl = useRef<HTMLElement | null>(null);
  const openId = anchor?.client.id ?? null;

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!openId) return;

    const sync = () => {
      const el = activeEl.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setAnchor((current) => (current ? { ...current, rect } : current));
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        activeEl.current = null;
        setAnchor(null);
      }
    };

    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
      window.removeEventListener("keydown", onKey);
    };
  }, [openId]);

  const marqueeClients = clients.slice(0, 24);

  if (marqueeClients.length === 0) return null;

  // Animate only after hydration so SSR shows a calm, readable row of logos.
  const animate = mounted && !reduceMotion && canAnimate(budget);
  const duration = speed ?? Math.max(24, marqueeClients.length * 4);
  // Repeat short lists so one copy is always wider than the viewport.
  const copies = Math.max(1, Math.ceil(8 / marqueeClients.length));
  const track = Array.from({ length: copies }, () => marqueeClients).flat();

  function showCard(client: TrustedClient, el: HTMLElement) {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    activeEl.current = el;
    setAnchor({ client, rect: el.getBoundingClientRect() });
  }

  function scheduleHide() {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      activeEl.current = null;
      setAnchor(null);
    }, 160);
  }

  function cancelHide() {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
  }

  function renderLogos(copy: "primary" | "clone") {
    return track.map((client, index) => {
      // Only the first occurrence of each client is focusable / announced.
      const isPrimary = copy === "primary" && index < marqueeClients.length;
      return (
        <li key={`${copy}-${client.id}-${index}`} className="flex shrink-0 items-center px-5 sm:px-8 lg:px-10">
          <button
            type="button"
            aria-label={isPrimary ? `${client.name} — view project details` : undefined}
            aria-hidden={isPrimary ? undefined : true}
            tabIndex={isPrimary ? 0 : -1}
            className={cn(
              "relative block w-28 cursor-pointer rounded-md opacity-85 transition-[opacity,transform] duration-300 outline-none hover:scale-105 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent/30 sm:w-36",
              clientLogoAspectClass,
              openId === client.id && "scale-105 opacity-100",
            )}
            onMouseEnter={(event) => showCard(client, event.currentTarget)}
            onMouseLeave={scheduleHide}
            onFocus={(event) => showCard(client, event.currentTarget)}
            onBlur={scheduleHide}
            onKeyDown={(event) => {
              if (event.key === "Enter") router.push(client.href);
            }}
          >
            <Image
              src={client.logoUrl}
              alt={isPrimary ? `${client.name} logo` : ""}
              fill
              sizes="(min-width: 640px) 144px, 112px"
              draggable={false}
              className="object-contain"
            />
          </button>
        </li>
      );
    });
  }

  return (
    <section aria-label={title} className={cn("bg-white py-12 sm:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-center gap-4 sm:mb-10">
          <span className="h-px w-10 bg-border sm:w-16" aria-hidden />
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">{title}</p>
          <span className="h-px w-10 bg-border sm:w-16" aria-hidden />
        </div>
      </div>

      <div
        className={cn(
          "relative",
          animate ? "overflow-hidden" : "overflow-x-auto [scrollbar-width:none]",
        )}
        data-marquee=""
        dir="ltr"
        data-paused={openId ? "true" : undefined}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-24"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-24"
        />
        <div
          className={cn(
            "flex w-max",
            animate && "animate-marquee",
            !animate && "mx-auto",
          )}
          style={animate ? { animationDuration: `${duration}s` } : undefined}
        >
          <ul className="flex items-center">{renderLogos("primary")}</ul>
          {animate && (
            <ul className="flex items-center" aria-hidden>
              {renderLogos("clone")}
            </ul>
          )}
        </div>
      </div>

      <nav className="sr-only" aria-label="Client projects">
        {marqueeClients.map((client) => (
          <Link key={client.id} href={client.href}>
            {client.name}
          </Link>
        ))}
      </nav>

      {mounted &&
        createPortal(
          <ClientPreview anchor={anchor} onEnter={cancelHide} onLeave={scheduleHide} />,
          document.body,
        )}
    </section>
  );
}

function ClientPreview({
  anchor,
  onEnter,
  onLeave,
}: {
  anchor: LogoAnchor | null;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const labels = useChrome().clientCard;
  const reduceMotion = useReducedMotion();
  const cardWidth = anchor ? Math.min(328, window.innerWidth - 32) : 328;
  const center = anchor ? anchor.rect.left + anchor.rect.width / 2 : 0;
  const spaceAbove = anchor ? anchor.rect.top : 0;
  const spaceBelow = anchor ? window.innerHeight - anchor.rect.bottom : 0;
  const placeAbove = spaceAbove >= 280 || spaceAbove > spaceBelow;
  const left = anchor
    ? clamp(center, cardWidth / 2 + 16, window.innerWidth - cardWidth / 2 - 16)
    : 0;
  // Keep the caret on the logo when the card is shifted to stay inside the viewport.
  const arrowLeft = clamp(center - left + cardWidth / 2, 28, cardWidth - 28);
  const hidden = reduceMotion
    ? { opacity: 1, x: "-50%", y: 0, scale: 1 }
    : { opacity: 0, x: "-50%", y: placeAbove ? 10 : -10, scale: 0.96 };

  return (
    <AnimatePresence>
      {anchor && (
        <m.div
          key={anchor.client.id}
          initial={hidden}
          animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0, x: "-50%" } : { opacity: 0, x: "-50%", y: placeAbove ? 8 : -8, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.32, ease: [0.16, 1, 0.3, 1] }}
          className={cn("fixed z-40", placeAbove ? "pb-4" : "pt-4")}
          style={{
            left,
            width: cardWidth,
            top: placeAbove ? undefined : anchor.rect.bottom,
            bottom: placeAbove ? window.innerHeight - anchor.rect.top : undefined,
            transformOrigin: placeAbove ? "center bottom" : "center top",
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute z-10 -translate-x-1/2 border-x-[12px] border-x-transparent",
              placeAbove
                ? "bottom-1 border-t-[12px] border-t-black/10"
                : "top-1 border-b-[12px] border-b-black/10",
            )}
            style={{ left: arrowLeft }}
          />
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute z-10 -translate-x-1/2 border-x-[11px] border-x-transparent",
              placeAbove
                ? "bottom-[5px] border-t-[11px] border-t-white"
                : "top-[5px] border-b-[11px] border-b-white",
            )}
            style={{ left: arrowLeft }}
          />
          <Link
            href={anchor.client.href}
            className="block rounded-2xl bg-white p-4 shadow-[0_18px_50px_rgba(15,39,68,0.16)] ring-1 ring-black/5"
          >
            <span className="flex items-start justify-between gap-3">
              <span className="pt-1 text-sm font-semibold text-navy">{labels.about}</span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white">
                {labels.viewProject}
                <ArrowUpRight size={13} strokeWidth={2.4} />
              </span>
            </span>

            {anchor.client.summary && (
              <span className="mt-2.5 line-clamp-3 block text-[13px] leading-relaxed text-foreground/75">
                {anchor.client.summary}
              </span>
            )}

            {anchor.client.highlight && (
              <span className="mt-3 line-clamp-2 block text-[13px] font-semibold leading-snug text-navy">
                {anchor.client.highlight}
              </span>
            )}

            {anchor.client.services.length > 0 && (
              <span className="mt-3 block border-t border-border pt-3">
                <span className="block text-sm font-semibold text-navy">{labels.servicesProvided}</span>
                <span className="mt-2.5 flex flex-wrap gap-x-4 gap-y-2">
                  {anchor.client.services.map((service) => (
                    <span key={service} className="inline-flex items-center gap-1.5 text-[13px] text-foreground">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-[3px] bg-accent" aria-hidden />
                      {service}
                    </span>
                  ))}
                </span>
              </span>
            )}
          </Link>
        </m.div>
      )}
    </AnimatePresence>
  );
}
