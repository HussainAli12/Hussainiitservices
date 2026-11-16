"use client";

import { useHydrated } from "@/lib/use-hydrated";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canAnimate } from "@/lib/motion-budget";
import { cn } from "@/lib/utils";
import type { PortfolioGalleryImage } from "@/lib/types/database";

interface PortfolioGalleryProps {
  images: PortfolioGalleryImage[];
}

const AUTOPLAY_MS = 4000;
const SWIPE_THRESHOLD = 72;
const ease = [0.22, 1, 0.36, 1] as const;

function GalleryImage({
  image,
  sizes,
  className,
  priority = false,
}: {
  image: PortfolioGalleryImage;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      unoptimized={image.url.endsWith(".svg")}
    />
  );
}

function SlideLayer({
  image,
  active,
  offset,
  sizes,
  objectClass,
  priority,
  draggable,
  onNext,
  onPrev,
}: {
  image: PortfolioGalleryImage;
  active: boolean;
  offset: number;
  sizes: string;
  objectClass: string;
  priority?: boolean;
  draggable?: boolean;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <m.div
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        x: active ? 0 : offset,
      }}
      transition={{ duration: 0.32, ease }}
      drag={draggable && active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      onDragEnd={(_, info) => {
        if (!active) return;
        if (info.offset.x < -SWIPE_THRESHOLD) onNext();
        else if (info.offset.x > SWIPE_THRESHOLD) onPrev();
      }}
      className={cn(
        "absolute inset-0",
        active ? "z-[1] cursor-grab active:cursor-grabbing" : "z-0 pointer-events-none",
      )}
    >
      <GalleryImage image={image} sizes={sizes} priority={priority} className={objectClass} />
    </m.div>
  );
}

export function PortfolioGallery({ images }: PortfolioGalleryProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mounted = useHydrated();
  const reduceMotion = useReducedMotion();
  const budget = useMotionBudget();
  const animate = canAnimate(budget) && !reduceMotion;

  const goTo = useCallback((index: number) => {
    setActive(index);
  }, []);

  const next = useCallback(() => {
    goTo((active + 1) % images.length);
  }, [active, goTo, images.length]);

  const prev = useCallback(() => {
    goTo((active - 1 + images.length) % images.length);
  }, [active, goTo, images.length]);

  useEffect(() => {
    if (reduceMotion || paused || lightboxOpen || images.length <= 1) return;
    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [reduceMotion, paused, lightboxOpen, images.length, next, active]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          setLightboxOpen(false);
          break;
        case "ArrowRight":
          next();
          break;
        case "ArrowLeft":
          prev();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, next, prev]);

  if (images.length === 0) return null;

  const current = images[active];
  const progress = ((active + 1) / images.length) * 100;

  const lightbox =
    mounted && lightboxOpen
      ? createPortal(
          <m.div
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease }}
            className="fixed inset-0 z-[80] flex flex-col bg-navy/96 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-lightbox-title"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Gallery
                </p>
                <p id="gallery-lightbox-title" className="mt-1 truncate text-sm text-white/80">
                  {current.alt}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold tabular-nums text-white/55">
                  {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </p>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  aria-label="Close fullscreen gallery"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white hover:text-navy"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-16">
              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-3 z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-navy sm:inline-flex"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-3 z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-navy sm:inline-flex"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              ) : null}

              <div className="relative h-[min(78vh,820px)] w-full max-w-6xl">
                {images.map((image, index) => (
                  <SlideLayer
                    key={`lightbox-${image.url}-${index}`}
                    image={image}
                    active={index === active}
                    offset={reduceMotion ? 0 : index === active ? 0 : index < active ? -28 : 28}
                    sizes="100vw"
                    objectClass="object-contain"
                    priority={Math.abs(index - active) <= 1}
                    onNext={next}
                    onPrev={prev}
                  />
                ))}
              </div>
            </div>

            {images.length > 1 ? (
              <div className="flex items-center justify-center gap-3 px-4 pb-5 sm:hidden">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            ) : null}
          </m.div>,
          document.body,
        )
      : null;

  return (
    <section
      aria-labelledby="project-gallery-heading"
      className="border-t border-border bg-surface py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                Visuals
              </p>
              <h2
                id="project-gallery-heading"
                className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Project gallery
              </h2>
            </div>
            <p className="text-sm text-muted">
              {String(images.length).padStart(2, "0")} images from this project
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08} className="relative mt-10">
        <div
          className="relative"
          role="region"
          aria-roledescription="carousel"
          aria-label="Project gallery"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-navy shadow-[0_24px_64px_rgba(15,39,68,0.16)]">
            <div className="relative aspect-[16/10] sm:aspect-video">
              {images.map((image, index) => (
                <SlideLayer
                  key={`${image.url}-${index}`}
                  image={image}
                  active={index === active}
                  offset={reduceMotion ? 0 : index === active ? 0 : index < active ? -28 : 28}
                  sizes="(max-width: 1024px) 100vw, 1152px"
                  objectClass="object-cover"
                  priority={index === 0 || Math.abs(index - active) <= 1}
                  draggable={!reduceMotion}
                  onNext={next}
                  onPrev={prev}
                />
              ))}

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 sm:p-6">
                <p className="max-w-xl text-sm text-white/85">{current.alt}</p>
                <p className="shrink-0 text-xs font-semibold tabular-nums text-white/60">
                  {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </p>
              </div>

              <m.button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Open fullscreen gallery"
                whileHover={animate ? { scale: 1.06 } : undefined}
                whileTap={animate ? { scale: 0.96 } : undefined}
                className="absolute top-4 right-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-navy/40 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-navy"
              >
                <Maximize2 size={16} />
              </m.button>

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute top-1/2 left-3 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-navy/35 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-navy sm:inline-flex"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next image"
                    className="absolute top-1/2 right-3 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-navy/35 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-navy sm:inline-flex"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              ) : null}
            </div>

            {images.length > 1 ? (
              <div className="relative h-1 bg-white/10">
                <m.div
                  className="absolute inset-y-0 left-0 bg-white/25"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease }}
                />
                {animate && !paused && !lightboxOpen ? (
                  <m.div
                    key={active}
                    className="absolute inset-y-0 left-0 origin-left bg-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                  />
                ) : null}
              </div>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="mt-5 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {images.map((image, index) => (
                <m.button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show gallery image ${index + 1}`}
                  aria-current={index === active ? "true" : undefined}
                  whileHover={animate ? { y: -3 } : undefined}
                  transition={{ duration: 0.25, ease }}
                  className={cn(
                    "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition-all sm:h-20 sm:w-28",
                    index === active
                      ? "border-accent shadow-[0_8px_24px_rgba(29,78,216,0.18)]"
                      : "border-border opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                    unoptimized={image.url.endsWith(".svg")}
                  />
                </m.button>
              ))}
            </div>
          ) : null}
        </div>
        </RevealOnScroll>
      </div>

      {lightbox}
    </section>
  );
}
