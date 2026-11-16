"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DbTestimonial } from "@/lib/types/database";

export type TestimonialBentoVariant = "default" | "feature-a" | "feature-b" | "wide";

interface TestimonialBentoCardProps {
  testimonial: DbTestimonial;
  variant?: TestimonialBentoVariant;
  className?: string;
  style?: React.CSSProperties;
}

export function TestimonialBentoCard({
  testimonial,
  variant = "default",
  className,
  style,
}: TestimonialBentoCardProps) {
  const isLarge = variant === "feature-a" || variant === "feature-b";

  return (
    <article
      className={cn("testimonials-bento-card magic-bento-card h-full", className)}
      style={style}
    >
      <div className="relative z-[1] flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex gap-0.5" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star
                key={i}
                size={isLarge ? 16 : 14}
                className="fill-[#EAB308] text-[#EAB308]"
                aria-hidden
              />
            ))}
          </div>
          {testimonial.logo_url && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface p-1.5">
              <Image
                src={testimonial.logo_url}
                alt={`${testimonial.company} logo`}
                width={28}
                height={28}
                className="max-h-full max-w-full object-contain"
                unoptimized={testimonial.logo_url.endsWith(".svg")}
              />
            </div>
          )}
        </div>

        <blockquote
          className={cn(
            "flex-1 text-sm leading-relaxed text-foreground",
            isLarge ? "text-base sm:text-lg sm:leading-8" : "line-clamp-4",
            variant === "wide" && "line-clamp-3 sm:line-clamp-none sm:text-base",
          )}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </div>

      <footer className="relative z-[1] mt-5 border-t border-border/80 pt-4">
        <p className="truncate text-sm font-semibold text-foreground">{testimonial.company}</p>
        <p className="mt-0.5 truncate text-xs text-muted">
          {testimonial.name}
          {testimonial.role ? ` · ${testimonial.role}` : ""}
        </p>
        {testimonial.location && (
          <p className="mt-1 truncate text-[11px] uppercase tracking-wide text-muted/80">
            {testimonial.location}
          </p>
        )}
      </footer>
    </article>
  );
}

function getVariant(index: number): TestimonialBentoVariant {
  const pattern: TestimonialBentoVariant[] = [
    "default",
    "default",
    "feature-a",
    "feature-b",
    "wide",
    "default",
  ];
  return pattern[index % pattern.length] ?? "default";
}

export { getVariant as getTestimonialBentoVariant };
